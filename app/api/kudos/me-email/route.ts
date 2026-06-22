import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoach, saveCoach } from '@/lib/kudos/db';

export async function PATCH(req: NextRequest) {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const coachId = await getSession(token);
  if (!coachId || coachId === '__admin__') return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const coach = await getCoach(coachId);
  if (!coach || !coach.active) return NextResponse.json({ error: 'Not found' }, { status: 401 });

  const { email } = await req.json();
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'Valid email required' }, { status: 400 });

  coach.email = email.trim().toLowerCase();
  await saveCoach(coach);
  return NextResponse.json({ ok: true });
}
