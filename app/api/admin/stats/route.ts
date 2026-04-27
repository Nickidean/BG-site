import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const checkStore = getStore("tov-checks");
  const copyStore = getStore("tov-copies");

  const { blobs: allChecks } = await checkStore.list();
  const { blobs: allCopies } = await copyStore.list();

  const copiedIds = new Set(allCopies.map((b) => b.key));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Keys are prefixed with unix timestamp so string sort = chronological
  const sorted = [...allChecks].sort((a, b) => b.key.localeCompare(a.key));

  const todayCount = allChecks.filter((b) => {
    const ts = parseInt(b.key.split("_")[0]);
    return ts >= todayStart.getTime();
  }).length;

  const recent = await Promise.all(
    sorted.slice(0, 50).map(async (b) => {
      const data = await checkStore.get(b.key, { type: "json" });
      return { ...(data as object), copied: copiedIds.has(b.key) };
    })
  );

  return NextResponse.json({
    total: allChecks.length,
    today: todayCount,
    copyRate: allChecks.length > 0
      ? Math.round((allCopies.length / allChecks.length) * 100)
      : 0,
    recent,
  });
}
