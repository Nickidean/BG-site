import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getLogs } from '@/lib/kudos/log';
import { getAllRecognitions, getCoaches } from '@/lib/kudos/db';

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const coachId = await getSession(token);
  if (coachId !== '__admin__') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [logs, recognitions, coaches] = await Promise.all([
    getLogs(200),
    getAllRecognitions(1000),
    getCoaches(),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const stats = {
    totalCoaches: coaches.filter(c => c.active).length,
    coachesWithEmail: coaches.filter(c => c.active && c.email).length,
    totalRecognitions: recognitions.length,
    recognitionsThisMonth: recognitions.filter(r => r.createdAt >= monthStart).length,
    recognitionsToday: recognitions.filter(r => r.createdAt >= todayStart).length,
    emailsSent: logs.filter(l => l.type === 'email_sent').length,
    emailsFailed: logs.filter(l => l.type === 'email_failed').length,
    loginsFailed: logs.filter(l => l.type === 'login_failed').length,
    loginsToday: logs.filter(l => l.type === 'login' && l.createdAt >= todayStart).length,
  };

  return NextResponse.json({ logs, stats });
}
