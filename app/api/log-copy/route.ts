import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function POST(req: NextRequest) {
  try {
    const { checkId } = await req.json();
    if (!checkId) return NextResponse.json({ ok: false });
    const store = getStore("tov-copies");
    await store.set(checkId, "1");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
