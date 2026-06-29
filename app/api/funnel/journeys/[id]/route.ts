import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/funnel/auth';
import { deleteJourney, getJourney, saveJourney, setShare } from '@/lib/funnel/db';
import type { Journey } from '@/lib/funnel/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  const journey = await getJourney(id);
  if (!journey) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ journey });
}

// Full save of the journey structure.
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  const existing = await getJourney(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = (await req.json().catch(() => null)) as Partial<Journey> | null;
  if (!body || !Array.isArray(body.sections)) {
    return NextResponse.json({ error: 'Invalid journey' }, { status: 400 });
  }
  const journey: Journey = {
    ...existing,
    name: body.name ? String(body.name) : existing.name,
    sections: body.sections,
  };
  await saveJourney(journey);
  return NextResponse.json({ journey });
}

// Rename and share toggles.
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  const journey = await getJourney(id);
  if (!journey) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json().catch(() => ({}));

  if (typeof body.name === 'string' && body.name.trim()) {
    journey.name = body.name.trim();
    await saveJourney(journey);
  }
  if (typeof body.share === 'boolean') {
    const shareId = await setShare(id, body.share);
    return NextResponse.json({ journey: await getJourney(id), shareId });
  }
  return NextResponse.json({ journey: await getJourney(id) });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { id } = await params;
  await deleteJourney(id);
  return NextResponse.json({ ok: true });
}
