import { NextRequest, NextResponse } from 'next/server';
import { getCoaches } from '@/lib/kudos/db';
import { createSession, deleteSession, getTokenFromRequest } from '@/lib/kudos/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  try {
    const { coachId, pin } = await req.json();
    if (!coachId || !pin) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Allow env-var admin login even if no coaches are seeded yet
    if (
      coachId === '__admin__' &&
      process.env.KUDOS_ADMIN_PIN &&
      pin === process.env.KUDOS_ADMIN_PIN
    ) {
      const token = await createSession('__admin__');
      const res = NextResponse.json({ ok: true, role: 'admin', name: 'Admin' });
      res.cookies.set('kudos_session', token, { httpOnly: true, sameSite: 'lax', maxAge: SESSION_MAX_AGE, path: '/' });
      return res;
    }

    const coaches = await getCoaches();
    const coach = coaches.find(c => c.id === coachId && c.active);
    if (!coach || coach.pin !== pin) {
      return NextResponse.json({ error: 'Invalid name or PIN' }, { status: 401 });
    }

    const token = await createSession(coachId);
    const res = NextResponse.json({ ok: true, role: coach.role, name: coach.name });
    res.cookies.set('kudos_session', token, { httpOnly: true, sameSite: 'lax', maxAge: SESSION_MAX_AGE, path: '/' });
    return res;
  } catch (err) {
    console.error('[kudos/auth POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (token) await deleteSession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('kudos_session');
  return res;
}
