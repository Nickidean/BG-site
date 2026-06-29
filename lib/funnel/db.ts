import { redis } from '@/lib/redis';
import { randomUUID } from 'crypto';
import type { Journey, JourneySummary } from './types';

// Journeys are stored whole as one JSON record (the brief's pragmatic
// single-record model). Screenshots are stored separately in their own
// keys — the equivalent of "file in the bucket, URL in the record" — so a
// single journey value stays small and well under request-size limits.

const INDEX_KEY = 'funnel:journeys'; // sorted set: member=id, score=updatedAt
const journeyKey = (id: string) => `funnel:journey:${id}`;
const shotKey = (id: string) => `funnel:shot:${id}`;
const shareKey = (token: string) => `funnel:share:${token}`;

export interface StoredScreenshot {
  mime: string;
  data: string; // base64 (no data: prefix)
}

function parse<T>(raw: unknown): T | null {
  if (raw == null) return null;
  return typeof raw === 'string' ? (JSON.parse(raw) as T) : (raw as T);
}

export async function listJourneys(): Promise<JourneySummary[]> {
  if (!redis) return [];
  const ids = (await redis.zrange(INDEX_KEY, 0, -1, { rev: true })) as string[];
  if (!ids.length) return [];
  const records = await Promise.all(ids.map((id) => redis!.get(journeyKey(id))));
  const out: JourneySummary[] = [];
  records.forEach((raw) => {
    const j = parse<Journey>(raw);
    if (j) out.push({ id: j.id, name: j.name, updatedAt: j.updatedAt, shareId: j.shareId ?? null });
  });
  return out;
}

export async function getJourney(id: string): Promise<Journey | null> {
  if (!redis) return null;
  return parse<Journey>(await redis.get(journeyKey(id)));
}

export async function saveJourney(journey: Journey): Promise<Journey> {
  if (!redis) throw new Error('Storage not configured');
  journey.updatedAt = Date.now();
  await redis.set(journeyKey(journey.id), JSON.stringify(journey));
  await redis.zadd(INDEX_KEY, { score: journey.updatedAt, member: journey.id });
  if (journey.shareId) await redis.set(shareKey(journey.shareId), journey.id);
  return journey;
}

export async function deleteJourney(id: string): Promise<void> {
  if (!redis) return;
  const journey = await getJourney(id);
  await redis.del(journeyKey(id));
  await redis.zrem(INDEX_KEY, id);
  if (journey?.shareId) await redis.del(shareKey(journey.shareId));
}

// ---- Sharing -----------------------------------------------------------

export async function getJourneyByShareToken(token: string): Promise<Journey | null> {
  if (!redis) return null;
  const id = (await redis.get(shareKey(token))) as string | null;
  if (!id) return null;
  return getJourney(id);
}

export async function setShare(id: string, enabled: boolean): Promise<string | null> {
  if (!redis) throw new Error('Storage not configured');
  const journey = await getJourney(id);
  if (!journey) throw new Error('Journey not found');
  if (enabled) {
    if (!journey.shareId) journey.shareId = randomUUID();
    await redis.set(shareKey(journey.shareId), id);
  } else {
    if (journey.shareId) await redis.del(shareKey(journey.shareId));
    journey.shareId = null;
  }
  await saveJourney(journey);
  return journey.shareId ?? null;
}

// ---- Screenshots -------------------------------------------------------

export async function saveScreenshot(mime: string, data: string): Promise<string> {
  if (!redis) throw new Error('Storage not configured');
  const id = randomUUID();
  await redis.set(shotKey(id), JSON.stringify({ mime, data } satisfies StoredScreenshot));
  return id;
}

export async function getScreenshot(id: string): Promise<StoredScreenshot | null> {
  if (!redis) return null;
  return parse<StoredScreenshot>(await redis.get(shotKey(id)));
}
