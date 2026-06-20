import { redis } from '@/lib/redis';
import { randomUUID } from 'crypto';

const SESSION_TTL = 60 * 60 * 24 * 7;
const sessionKey = (token: string) => `kudos:session:${token}`;

export async function createSession(coachId: string): Promise<string> {
  if (!redis) throw new Error('Redis not configured');
  const token = randomUUID();
  await redis.set(sessionKey(token), coachId, { ex: SESSION_TTL });
  return token;
}

export async function getSession(token: string): Promise<string | null> {
  if (!redis) return null;
  return (await redis.get(sessionKey(token))) as string | null;
}

export async function deleteSession(token: string): Promise<void> {
  if (!redis) return;
  await redis.del(sessionKey(token));
}

export function getTokenFromRequest(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/kudos_session=([^;]+)/);
  return match ? match[1] : null;
}
