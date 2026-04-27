import { NextRequest, NextResponse } from "next/server";
import { redis, RequestLog } from "@/lib/redis";

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD env var not set on the server" }, { status: 503 });
  }
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!redis) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }

  const [totalRequests, totalCopies, ids] = await Promise.all([
    redis.get<number>("requests:total"),
    redis.get<number>("copies:total"),
    redis.lrange<string>("requests:ids", 0, 199), // last 200 request IDs
  ]);

  const records: RequestLog[] = [];
  if (ids.length > 0) {
    const pipeline = redis.pipeline();
    for (const id of ids) pipeline.get(`request:${id}`);
    const results = await pipeline.exec<(string | null)[]>();
    for (const r of results) {
      if (r) {
        try {
          records.push(typeof r === "string" ? JSON.parse(r) : r);
        } catch {
          // skip malformed entries
        }
      }
    }
  }

  // Sort by timestamp desc (newest first)
  records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Breakdown by content type
  const byContentType: Record<string, { count: number; copies: number; totalScore: number }> = {};
  for (const r of records) {
    if (!byContentType[r.contentType]) {
      byContentType[r.contentType] = { count: 0, copies: 0, totalScore: 0 };
    }
    byContentType[r.contentType].count++;
    byContentType[r.contentType].totalScore += r.overallScore;
    if (r.copied) byContentType[r.contentType].copies++;
  }

  // Requests today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const requestsToday = records.filter(
    (r) => new Date(r.timestamp) >= todayStart
  ).length;

  return NextResponse.json({
    totalRequests: totalRequests ?? 0,
    totalCopies: totalCopies ?? 0,
    requestsToday,
    copyRate: totalRequests ? Math.round(((totalCopies ?? 0) / totalRequests) * 100) : 0,
    byContentType,
    recent: records.slice(0, 50),
  });
}
