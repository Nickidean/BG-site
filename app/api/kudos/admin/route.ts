import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoach, getAllRecognitions, getCoaches } from '@/lib/kudos/db';
import type { Recognition } from '@/lib/kudos/types';
import { isAdminRole } from '@/lib/kudos/types';

async function requireAdmin(req: NextRequest): Promise<string | null> {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return null;
  const coachId = await getSession(token);
  if (!coachId) return null;
  if (coachId === '__admin__') return coachId;
  const coach = await getCoach(coachId);
  if (isAdminRole(coach?.role ?? '') && coach!.active) return coachId;
  return null;
}

export async function GET(req: NextRequest) {
  const adminId = await requireAdmin(req);
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [recognitions, coaches] = await Promise.all([getAllRecognitions(), getCoaches()]);

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const coachFilter = url.searchParams.get('coach');

  let filtered = recognitions;
  if (from) filtered = filtered.filter(r => r.createdAt >= Number(from));
  if (to) filtered = filtered.filter(r => r.createdAt <= Number(to));
  if (coachFilter) filtered = filtered.filter(r => r.giverId === coachFilter || r.recipientIds.includes(coachFilter));

  // Build per-coach summary
  const activeCoaches = coaches.filter(c => c.active);
  const summary = activeCoaches.map(coach => {
    const given = recognitions.filter(r => r.giverId === coach.id);
    const received = recognitions.filter(r => r.recipientIds.includes(coach.id));
    const now = new Date();
    const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).getTime();
    return {
      id: coach.id,
      name: coach.name,
      role: coach.role,
      totalGiven: given.length,
      totalReceived: received.length,
      quarterReceived: received.filter(r => r.createdAt >= qStart).length,
    };
  }).sort((a, b) => b.totalReceived - a.totalReceived);

  return NextResponse.json({ recognitions: filtered, summary });
}
