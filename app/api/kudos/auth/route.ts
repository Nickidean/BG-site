import { NextRequest, NextResponse } from 'next/server';
import { getCoaches } from '@/lib/kudos/db';
import { createSession, deleteSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { writeLog } from '@/lib/kudos/log';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  try {
    const { coachId, pin } = await req.json();
    if (!coachId || !pin) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    if (
      coachId === '__admin__' &&
      process.env.KUDOS_ADMIN_PIN &&
      pin === process.env.KUDOS_ADMIN_PIN
    ) {
      const token = await createSession('__admin__');
      await writeLog('login', 'Admin logged in', { ip });
      const res = NextResponse.json({ ok: true, role: 'admin', name: 'Admin' });
      res.cookies.set('kudos_session', token, { httpOnly: true, sameSite: 'lax', maxAge: SESSION_MAX_AGE, path: '/' });
      return res;
    }

    const coaches = await getCoaches();
    const coach = coaches.find(c => c.id === coachId && c.active);
    if (!coach || coach.pin !== pin) {
      const name = coaches.find(c => c.id === coachId)?.name ?? coachId;
      await writeLog('login_failed', `Failed login for ${name}`, { coachId, ip });
      return NextResponse.json({ error: 'Invalid name or PIN' }, { status: 401 });
    }

    const token = await createSession(coachId);
    await writeLog('login', `${coach.name} logged in`, { coachId, role: coach.role, ip });
    const res = NextResponse.json({ ok: true, role: coach.role, name: coach.name });
    res.cookies.set('kudos_session', token, { httpOnly: true, sameSite: 'lax', maxAge: SESSION_MAX_AGE, path: '/' });
    return res;
  } catch (err) {
    console.error('[kudos/auth POST]', err);
    await writeLog('error', 'Auth error', { error: String(err), ip });
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
