import { NextRequest, NextResponse } from 'next/server';
import { getSession, getTokenFromRequest } from '@/lib/kudos/auth';
import { getCoach, getAllRecognitions, saveRecognition, countGivenThisMonth, deleteRecognition, deleteAllRecognitions, boostRecognition } from '@/lib/kudos/db';
import { postToWhatsApp } from '@/lib/kudos/whatsapp';
import { sendKudosEmail, sendBoostEmail } from '@/lib/kudos/email';
import { MONTHLY_LIMIT } from '@/lib/kudos/types';
import type { Recognition } from '@/lib/kudos/types';
import { randomUUID } from 'crypto';

async function getAuthedCoachId(req: NextRequest): Promise<string | null> {
  const token = getTokenFromRequest(req.headers.get('cookie'));
  if (!token) return null;
  return getSession(token);
}

export async function GET(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const all = await getAllRecognitions();

  // Admin sees everything
  if (coachId === '__admin__') return NextResponse.json(all);
  const coach = await getCoach(coachId);
  if (!coach) return NextResponse.json({ error: 'Not found' }, { status: 401 });
  if (coach.role === 'admin') return NextResponse.json(all);

  // Regular coaches see only their own given + received
  const mine = all.filter(r => r.giverId === coachId || r.recipientIds.includes(coachId));
  return NextResponse.json(mine);
}

export async function POST(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  if (coachId === '__admin__') return NextResponse.json({ error: 'Admin account cannot give recognitions' }, { status: 403 });

  const coach = await getCoach(coachId);
  if (!coach || !coach.active) return NextResponse.json({ error: 'Not found' }, { status: 401 });

  const { recipientIds, category, note } = await req.json();
  if (!recipientIds?.length || !category || !note?.trim()) {
    return NextResponse.json({ error: 'recipientIds, category, and note are required' }, { status: 400 });
  }
  if (note.trim().length > 500) {
    return NextResponse.json({ error: 'Note must be 500 characters or fewer' }, { status: 400 });
  }

  const given = await countGivenThisMonth(coachId);
  if (given >= MONTHLY_LIMIT) {
    return NextResponse.json({ error: `You've used all ${MONTHLY_LIMIT} recognitions for this month` }, { status: 429 });
  }

  // Resolve recipient names
  const { getCoaches } = await import('@/lib/kudos/db');
  const coaches = await getCoaches();
  const coachMap = Object.fromEntries(coaches.map(c => [c.id, c.name]));
  const recipientNames = (recipientIds as string[]).map(id => coachMap[id]).filter(Boolean);
  if (recipientNames.length !== recipientIds.length) {
    return NextResponse.json({ error: 'One or more recipients not found' }, { status: 400 });
  }

  const recognition: Recognition = {
    id: randomUUID(),
    giverId: coachId,
    giverName: coach.name,
    recipientIds,
    recipientNames,
    category,
    note: note.trim(),
    createdAt: Date.now(),
  };

  await saveRecognition(recognition);
  await postToWhatsApp(recognition);

  // Send email notifications to recipients who have an email address
  const recipientEmails = coaches
    .filter(c => recognition.recipientIds.includes(c.id) && c.email)
    .map(c => c.email as string);

  console.log('[kudos/email] RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
  console.log('[kudos/email] Recipient emails found:', recipientEmails);
  await sendKudosEmail(recognition, recipientEmails);

  return NextResponse.json({ ok: true, id: recognition.id, debug: { recipientEmails, resendConfigured: !!process.env.RESEND_API_KEY } });
}

export async function PATCH(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const isAdmin = coachId === '__admin__' || (await (async () => {
    const c = await getCoach(coachId);
    return c?.role === 'admin' && c.active;
  })());
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, boostComment } = await req.json();
  if (!id || !boostComment?.trim()) return NextResponse.json({ error: 'id and boostComment required' }, { status: 400 });

  const updated = await boostRecognition(id, boostComment.trim());
  if (!updated) return NextResponse.json({ error: 'Recognition not found' }, { status: 404 });

  const boost = updated.boosts![updated.boosts!.length - 1];

  // Email recipients
  const { getCoaches } = await import('@/lib/kudos/db');
  const coaches = await getCoaches();
  const recipientEmails = coaches
    .filter(c => updated.recipientIds.includes(c.id) && c.email)
    .map(c => c.email as string);

  await sendBoostEmail(updated, boost, recipientEmails);

  return NextResponse.json({ ok: true, recognition: updated });
}

export async function DELETE(req: NextRequest) {
  const coachId = await getAuthedCoachId(req);
  if (!coachId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const isAdmin = coachId === '__admin__' || (await (async () => {
    const c = await getCoach(coachId);
    return c?.role === 'admin' && c.active;
  })());
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.id) {
    // Delete all recognitions
    await deleteAllRecognitions();
    return NextResponse.json({ ok: true, deleted: 'all' });
  }

  await deleteRecognition(body.id);
  return NextResponse.json({ ok: true });
}
