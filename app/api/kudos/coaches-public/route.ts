import { NextResponse } from 'next/server';
import { getCoaches } from '@/lib/kudos/db';

// Public endpoint — returns only name+id for the login dropdown (no PINs)
export async function GET() {
  const coaches = await getCoaches();
  const active = coaches
    .filter(c => c.active)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({ id: c.id, name: c.name }));
  return NextResponse.json(active);
}
