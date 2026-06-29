import { NextRequest, NextResponse } from 'next/server';
import {
  authConfigured,
  checkPassword,
  createSession,
  destroySession,
  isAuthed,
  SESSION_COOKIE,
} from '@/lib/funnel/auth';

export async function GET() {
  return NextResponse.json({ authed: await isAuthed(), required: authConfigured() });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!checkPassword(String(password ?? ''))) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }
  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) await destroySession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
