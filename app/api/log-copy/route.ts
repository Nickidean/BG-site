import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { checkId } = await req.json();
    if (!checkId || !redis) return NextResponse.json({ ok: false });
    await redis.sadd("tov:copies", checkId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
