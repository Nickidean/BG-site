import { redis } from '@/lib/redis';
import { randomUUID } from 'crypto';

export type LogType =
  | 'login'
  | 'login_failed'
  | 'kudos_sent'
  | 'email_sent'
  | 'email_failed'
  | 'boost'
  | 'monthly_thanks'
  | 'pin_changed'
  | 'coach_added'
  | 'coach_removed'
  | 'recognition_deleted'
  | 'error';

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  meta?: Record<string, unknown>;
  createdAt: number;
}

const LOG_SET = 'kudos:activity-log';
const logKey = (id: string) => `kudos:log:${id}`;
const MAX_LOGS = 2000;
const LOG_TTL = 60 * 60 * 24 * 90; // 90 days

export async function writeLog(type: LogType, message: string, meta?: Record<string, unknown>): Promise<void> {
  if (!redis) return;
  try {
    const entry: LogEntry = { id: randomUUID(), type, message, meta, createdAt: Date.now() };
    await redis.set(logKey(entry.id), JSON.stringify(entry), { ex: LOG_TTL });
    await redis.zadd(LOG_SET, { score: entry.createdAt, member: entry.id });
    // Trim to MAX_LOGS — remove oldest beyond limit
    const count = await redis.zcard(LOG_SET);
    if (count > MAX_LOGS) {
      const toRemove = await redis.zrange(LOG_SET, 0, count - MAX_LOGS - 1) as string[];
      if (toRemove.length) {
        await Promise.all(toRemove.map(id => redis!.del(logKey(id))));
        await redis.zremrangebyrank(LOG_SET, 0, count - MAX_LOGS - 1);
      }
    }
  } catch {
    // Never let logging break the main flow
  }
}

export async function getLogs(limit = 200): Promise<LogEntry[]> {
  if (!redis) return [];
  const ids = (await redis.zrange(LOG_SET, 0, -1)) as string[];
  const recent = ids.slice(-limit).reverse();
  const items = await Promise.all(recent.map(id => redis!.get(logKey(id))));
  return items
    .filter(Boolean)
    .map(v => (typeof v === 'string' ? JSON.parse(v) : v) as LogEntry);
}
