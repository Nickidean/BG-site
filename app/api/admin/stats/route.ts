import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [total, todayCount, recentRaw, totalCopied, copiedIds] = await Promise.all([
    redis.zcard("tov:checks"),
    redis.zcount("tov:checks", todayStart.getTime(), "+inf"),
    redis.zrange("tov:checks", 0, 49, { rev: true }),
    redis.scard("tov:copies"),
    redis.smembers("tov:copies"),
  ]);

  const copiedSet = new Set(copiedIds as string[]);

  const recent = (recentRaw as string[]).map((raw) => {
    const entry = JSON.parse(raw);
    return { ...entry, copied: copiedSet.has(entry.id) };
  });

  return NextResponse.json({
    total,
    today: todayCount,
    copyRate: total > 0 ? Math.round(((totalCopied as number) / (total as number)) * 100) : 0,
    recent,
  });
}
