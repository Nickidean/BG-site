import { NextRequest, NextResponse } from 'next/server';
import { getScreenshot } from '@/lib/funnel/db';

type Params = { params: Promise<{ id: string }> };

// Serves the raw image. Left unguarded so read-only share links can render
// screenshots; ids are unguessable UUIDs.
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const shot = await getScreenshot(id);
  if (!shot) return new NextResponse('Not found', { status: 404 });
  const bytes = Buffer.from(shot.data, 'base64');
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': shot.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
