import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoaches, saveCoach } from '@/lib/kudos/db';

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const coachId = await getSession(token);
  if (coachId !== '__admin__') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const coaches = await getCoaches();
  await Promise.all(coaches.map(c => saveCoach({ ...c, pin: '123456' })));
  return NextResponse.json({ ok: true, updated: coaches.length });
}
