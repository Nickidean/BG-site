import { NextRequest, NextResponse } from "next/server";
import { markCopied } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { requestId } = await req.json();
    if (!requestId || typeof requestId !== "string") {
      return NextResponse.json({ error: "requestId required" }, { status: 400 });
    }
    await markCopied(requestId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
