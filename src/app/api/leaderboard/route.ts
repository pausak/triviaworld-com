import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaderboardEntries } from "@/lib/db/schema";
import { desc, eq, gte, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("mode") || "quick";
  const timeframe = params.get("timeframe") || "all";
  const limit = Math.min(parseInt(params.get("limit") || "50", 10), 100);

  const conditions = [eq(leaderboardEntries.mode, mode)];

  if (timeframe !== "all") {
    const now = new Date();
    let cutoffDate: string;

    switch (timeframe) {
      case "today": {
        // Use the date field (YYYY-MM-DD) for exact day match
        cutoffDate = now.toISOString().split("T")[0];
        break;
      }
      case "week": {
        const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        cutoffDate = d.toISOString().split("T")[0];
        break;
      }
      case "month": {
        const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        cutoffDate = d.toISOString().split("T")[0];
        break;
      }
      default:
        cutoffDate = "1970-01-01";
    }

    // Compare against the date field (YYYY-MM-DD) which sorts correctly as strings
    conditions.push(gte(leaderboardEntries.date, cutoffDate));
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
