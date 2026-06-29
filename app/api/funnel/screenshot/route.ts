import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/funnel/auth';
import { saveScreenshot } from '@/lib/funnel/db';

const VALID = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Stores a screenshot and returns its id. The journey structure only keeps
// the id (the equivalent of keeping a storage URL in the record).
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { dataUrl } = body as { dataUrl?: string };
  if (!dataUrl || typeof dataUrl !== 'string') {
    return NextResponse.json({ error: 'dataUrl is required' }, { status: 400 });
  }
  const match = dataUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (!match) return NextResponse.json({ error: 'Invalid data URL' }, { status: 400 });
  const [, mime, data] = match;
  if (!VALID.includes(mime)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 });
  }
  try {
    const id = await saveScreenshot(mime, data);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }
}
