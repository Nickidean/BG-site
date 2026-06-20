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

  const { currentPin, newPin } = await req.json();
  if (!currentPin || !newPin) return NextResponse.json({ error: 'currentPin and newPin required' }, { status: 400 });
  if (coach.pin !== currentPin) return NextResponse.json({ error: 'Current PIN is incorrect' }, { status: 401 });
  if (!/^\d{4,6}$/.test(newPin)) return NextResponse.json({ error: 'New PIN must be 4–6 digits' }, { status: 400 });
  if (newPin === currentPin) return NextResponse.json({ error: 'New PIN must be different' }, { status: 400 });

  coach.pin = newPin;
  await saveCoach(coach);
  return NextResponse.json({ ok: true });
}
