import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/funnel/auth';
import { listJourneys, saveJourney } from '@/lib/funnel/db';
import { newStepSection, uid, type Journey } from '@/lib/funnel/types';

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  return NextResponse.json({ journeys: await listJourneys() });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const name = (body.name && String(body.name).trim()) || 'Untitled journey';
  const journey: Journey = {
    id: uid('journey'),
    name,
    updatedAt: Date.now(),
    sections: [newStepSection('Landing')],
    shareId: null,
  };
  await saveJourney(journey);
  return NextResponse.json({ journey });
}
