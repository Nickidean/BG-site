import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const password = req.nextUrl.searchParams.get("password");
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    if (!redis) {
      return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, todayCount, recentRaw, totalCopied, copiedIds] = await Promise.all([
      redis.zcard("tov:checks"),
      redis.zcount("tov:checks", todayStart.getTime(), "+inf"),
      redis.zrange("tov:checks", -50, -1),
      redis.scard("tov:copies"),
      redis.smembers("tov:copies"),
    ]);

    const copiedSet = new Set(copiedIds as string[]);

    const recent = [...(recentRaw as unknown[])].reverse().flatMap((raw) => {
      try {
        const entry = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!entry || typeof entry !== "object") return [];
        return [{ ...entry, copied: copiedSet.has((entry as { id: string }).id) }];
      } catch {
        return [];
      }
    });

    return NextResponse.json({
      total,
      today: todayCount,
      copyRate: total > 0 ? Math.round(((totalCopied as number) / (total as number)) * 100) : 0,
      recent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
