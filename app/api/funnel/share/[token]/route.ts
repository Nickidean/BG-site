import { NextRequest, NextResponse } from 'next/server';
import { getJourneyByShareToken } from '@/lib/funnel/db';

type Params = { params: Promise<{ token: string }> };

// Public read-only access to a shared journey (for present mode).
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const journey = await getJourneyByShareToken(token);
  if (!journey) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ journey });
}
