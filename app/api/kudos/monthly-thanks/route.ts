import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoach, getCoaches, getMonthlyThanksSent, setMonthlyThanksSent } from '@/lib/kudos/db';
import { sendMonthlyThanksEmail } from '@/lib/kudos/email';
import { writeLog } from '@/lib/kudos/log';
import { isAdminRole } from '@/lib/kudos/types';

async function requireChairman(req: NextRequest): Promise<{ id: string; name: string } | null> {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return null;
  const coachId = await getSession(token);
  if (!coachId) return null;
  if (coachId === '__admin__') return { id: '__admin__', name: 'The Chairman' };
  const coach = await getCoach(coachId);
  if (!coach || !coach.active) return null;
  if (coach.role !== 'chairman') return null;
  return { id: coach.id, name: coach.name };
}

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const coachId = await getSession(token);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const coach = coachId !== '__admin__' ? await getCoach(coachId) : null;
  if (coachId !== '__admin__' && !isAdminRole(coach?.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const sent = await getMonthlyThanksSent();
  return NextResponse.json({ sent });
}

export async function POST(req: NextRequest) {
  const chairman = await requireChairman(req);
  if (!chairman) return NextResponse.json({ error: 'Forbidden — chairman role required' }, { status: 403 });

  const alreadySent = await getMonthlyThanksSent();
  if (alreadySent) return NextResponse.json({ error: 'Monthly thanks already sent this month' }, { status: 409 });

  const coaches = await getCoaches();
  const recipients = coaches.filter(c => c.active && c.email && c.role !== 'chairman');
  const emails = recipients.map(c => c.email as string);

  await sendMonthlyThanksEmail(emails, chairman.name);
  await setMonthlyThanksSent();
  await writeLog('monthly_thanks', `Monthly thank-you sent to ${recipients.length} coaches by ${chairman.name}`, { sentTo: recipients.length, emails });

  return NextResponse.json({ ok: true, sentTo: recipients.length });
}
