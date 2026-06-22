import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoaches, getCoach, saveCoach, deleteCoach } from '@/lib/kudos/db';
import type { Coach } from '@/lib/kudos/types';
import { isAdminRole } from '@/lib/kudos/types';
import { randomUUID } from 'crypto';

async function getAuthedCoachId(req: NextRequest): Promise<string | null> {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return null;
  return getSession(token);
}

export async function GET(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const coaches = await getCoaches();
  const active = coaches.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name));

  // Non-admins only get the list (no PINs)
  if (coachId === '__admin__') {
    return NextResponse.json(active.map(c => ({ id: c.id, name: c.name, role: c.role, pin: c.pin, email: c.email, createdAt: c.createdAt })));
  }

  const coach = await getCoach(coachId);
  if (!coach) return NextResponse.json({ error: 'Not found' }, { status: 401 });

  if (isAdminRole(coach.role)) {
    return NextResponse.json(active.map(c => ({ id: c.id, name: c.name, role: c.role, pin: c.pin, email: c.email, createdAt: c.createdAt })));
  }

  // Regular coaches just get name+id for giving recognitions
  return NextResponse.json(active.filter(c => c.id !== coachId).map(c => ({ id: c.id, name: c.name })));
}

export async function POST(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const isAdmin = coachId === '__admin__' || (await isAdminCoach(coachId));
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { name, pin, role = 'coach', email } = await req.json();
  if (!name || !pin) return NextResponse.json({ error: 'name and pin required' }, { status: 400 });
  if (!/^\d{6}$/.test(pin)) return NextResponse.json({ error: 'PIN must be 6 digits' }, { status: 400 });

  const coach: Coach = {
    id: randomUUID(),
    name: name.trim(),
    pin,
    role,
    active: true,
    createdAt: Date.now(),
    ...(email ? { email: email.trim().toLowerCase() } : {}),
  };
  await saveCoach(coach);
  return NextResponse.json({ id: coach.id, name: coach.name, role: coach.role });
}

export async function PATCH(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const isAdmin = coachId === '__admin__' || (await isAdminCoach(coachId));
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, name, pin, role, active } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const coach = await getCoach(id);
  if (!coach) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (name !== undefined) coach.name = name.trim();
  if (pin !== undefined) {
    if (!/^\d{6}$/.test(pin)) return NextResponse.json({ error: 'PIN must be 6 digits' }, { status: 400 });
    coach.pin = pin;
  }
  if (role !== undefined) coach.role = role;
  if (active !== undefined) coach.active = active;

  await saveCoach(coach);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const isAdmin = coachId === '__admin__' || (await isAdminCoach(coachId));
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await deleteCoach(id);
  return NextResponse.json({ ok: true });
}

async function isAdminCoach(id: string): Promise<boolean> {
  const coach = await getCoach(id);
  return isAdminRole(coach?.role ?? '') && coach!.active;
}
