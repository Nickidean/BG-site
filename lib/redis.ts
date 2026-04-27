import { Redis } from "@upstash/redis";

export interface RequestLog {
  id: string;
  timestamp: string;
  contentType: string;
  audience: string;
  inputLength: number;
  overallScore: number;
  warmScore: number;
  workingScore: number;
  verdict: string;
  copied: boolean;
}

// Returns null when env vars aren't set so the main app never breaks
function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export const redis = getRedis();

export async function logRequest(entry: Omit<RequestLog, "copied">): Promise<void> {
  if (!redis) return;
  const record: RequestLog = { ...entry, copied: false };
  await Promise.all([
    redis.set(`request:${entry.id}`, JSON.stringify(record), { ex: 60 * 60 * 24 * 90 }), // 90 day TTL
    redis.lpush("requests:ids", entry.id),
    redis.ltrim("requests:ids", 0, 999), // cap at 1000 entries
    redis.incr("requests:total"),
  ]);
}

export async function markCopied(requestId: string): Promise<void> {
  if (!redis) return;
  const raw = await redis.get<string>(`request:${requestId}`);
  if (!raw) return;
  const record: RequestLog = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!record.copied) {
    record.copied = true;
    await Promise.all([
      redis.set(`request:${requestId}`, JSON.stringify(record), { ex: 60 * 60 * 24 * 90 }),
      redis.incr("copies:total"),
    ]);
  }
}
