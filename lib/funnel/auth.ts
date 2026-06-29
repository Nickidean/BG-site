import { redis } from '@/lib/redis';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

// Lightweight shared-password gate. The brief assumes a small number of
// trusted internal users, so a single password (FUNNEL_PASSWORD) plus a
// Redis-backed session cookie is enough. If no password is configured the
// tool is open — convenient for local development.

const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const COOKIE = 'funnel_session';
const sessionKey = (token: string) => `funnel:session:${token}`;

export function authConfigured(): boolean {
  return !!process.env.FUNNEL_PASSWORD;
}

export function checkPassword(password: string): boolean {
  if (!authConfigured()) return true;
  return password === process.env.FUNNEL_PASSWORD;
}

export async function createSession(): Promise<string> {
  const token = randomUUID();
  if (redis) await redis.set(sessionKey(token), '1', { ex: SESSION_TTL });
  return token;
}

export async function destroySession(token: string): Promise<void> {
  if (redis) await redis.del(sessionKey(token));
}

export const SESSION_COOKIE = COOKIE;

/** Whether the current request is authenticated to use the editor. */
export async function isAuthed(): Promise<boolean> {
  if (!authConfigured()) return true;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  if (!redis) return false;
  return !!(await redis.get(sessionKey(token)));
}
