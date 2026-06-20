import { redis } from '@/lib/redis';
import type { Coach, Recognition } from './types';

const COACHES_KEY = 'kudos:coaches';
const RECOGNITIONS_KEY = 'kudos:recognitions';

const recKey = (id: string) => `kudos:recognition:${id}`;

export async function getCoaches(): Promise<Coach[]> {
  if (!redis) return [];
  const data = await redis.hgetall(COACHES_KEY);
  if (!data) return [];
  return Object.values(data).map(v => (typeof v === 'string' ? JSON.parse(v) : (v as Coach)));
}

export async function getCoach(id: string): Promise<Coach | null> {
  if (!redis) return null;
  const data = await redis.hget(COACHES_KEY, id);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : (data as Coach);
}

export async function saveCoach(coach: Coach): Promise<void> {
  if (!redis) return;
  await redis.hset(COACHES_KEY, { [coach.id]: JSON.stringify(coach) });
}

export async function deleteCoach(id: string): Promise<void> {
  if (!redis) return;
  await redis.hdel(COACHES_KEY, id);
}

export async function saveRecognition(recognition: Recognition): Promise<void> {
  if (!redis) return;
  await redis.set(recKey(recognition.id), JSON.stringify(recognition));
  await redis.zadd(RECOGNITIONS_KEY, { score: recognition.createdAt, member: recognition.id });
}

async function fetchRecognitionsByIds(ids: string[]): Promise<Recognition[]> {
  if (!redis || ids.length === 0) return [];
  const items = await Promise.all(ids.map(id => redis!.get(recKey(id))));
  return items
    .filter(Boolean)
    .map(v => (typeof v === 'string' ? JSON.parse(v) : (v as Recognition)));
}

export async function deleteRecognition(id: string): Promise<void> {
  if (!redis) return;
  await redis.del(recKey(id));
  await redis.zrem(RECOGNITIONS_KEY, id);
}

export async function getAllRecognitions(limit = 500): Promise<Recognition[]> {
  if (!redis) return [];
  const ids = (await redis.zrange(RECOGNITIONS_KEY, 0, -1)) as string[];
  const all = await fetchRecognitionsByIds(ids.slice(-limit));
  return all.reverse();
}

export async function countGivenThisMonth(coachId: string): Promise<number> {
  if (!redis) return 0;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const ids = (await redis.zrange(RECOGNITIONS_KEY, monthStart, '+inf', { byScore: true })) as string[];
  const items = await fetchRecognitionsByIds(ids);
  return items.filter(r => r.giverId === coachId).length;
}
