import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoach } from '@/lib/kudos/db';
import { countGivenThisMonth } from '@/lib/kudos/db';
import { MONTHLY_LIMIT } from '@/lib/kudos/types';

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const coachId = await getSession(token);
  if (!coachId) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  // Env-var admin
  if (coachId === '__admin__') {
    return NextResponse.json({ id: '__admin__', name: 'Admin', role: 'admin', givenThisMonth: 0, remainingThisMonth: MONTHLY_LIMIT });
  }

  const coach = await getCoach(coachId);
  if (!coach || !coach.active) return NextResponse.json({ error: 'Coach not found' }, { status: 401 });

  const givenThisMonth = await countGivenThisMonth(coachId);
  return NextResponse.json({
    id: coach.id,
    name: coach.name,
    role: coach.role,
    givenThisMonth,
    remainingThisMonth: Math.max(0, MONTHLY_LIMIT - givenThisMonth),
    hasEmail: !!coach.email,
  });
}
