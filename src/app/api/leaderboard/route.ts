import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaderboardEntries } from "@/lib/db/schema";
import { desc, eq, gte, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("mode") || "quick";
  const timeframe = params.get("timeframe") || "all"; // all | today | week | month
  const limit = Math.min(parseInt(params.get("limit") || "50", 10), 100);

  const conditions = [eq(leaderboardEntries.mode, mode)];

  if (timeframe !== "all") {
    const now = new Date();
    let cutoff: Date;
    switch (timeframe) {
      case "today":
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoff = new Date(0);
    }
    conditions.push(gte(leaderboardEntries.createdAt, cutoff.toISOString()));
  }

  const entries = await db
    .select()
    .from(leaderboardEntries)
    .where(and(...conditions))
    .orderBy(desc(leaderboardEntries.score))
    .limit(limit)
    .all();

  return NextResponse.json({ entries });
}
