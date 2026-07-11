import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaderboardEntries, users } from "@/lib/db/schema";
import { desc, eq, gte, and } from "drizzle-orm";

// Over-fetch before de-duping so the top `limit` distinct players are all found
// even when the most active player holds many of the highest-scoring rows.
const FETCH_CAP = 2000;

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

  // Pull the highest-scoring rows for this mode/timeframe, joined to the user's
  // CURRENT nickname (leaderboard rows snapshot the name at play time, so the
  // same player can otherwise appear under several names).
  const rows = await db
    .select({
      id: leaderboardEntries.id,
      userId: leaderboardEntries.userId,
      score: leaderboardEntries.score,
      accuracy: leaderboardEntries.accuracy,
      correctCount: leaderboardEntries.correctCount,
      totalQuestions: leaderboardEntries.totalQuestions,
      category: leaderboardEntries.category,
      difficulty: leaderboardEntries.difficulty,
      mode: leaderboardEntries.mode,
      date: leaderboardEntries.date,
      createdAt: leaderboardEntries.createdAt,
      snapshotNickname: leaderboardEntries.nickname,
      currentNickname: users.nickname,
    })
    .from(leaderboardEntries)
    .leftJoin(users, eq(users.id, leaderboardEntries.userId))
    .where(and(...conditions))
    .orderBy(desc(leaderboardEntries.score))
    .limit(FETCH_CAP)
    .all();

  // One entry per player: keep each user's best score (rows are score-ordered,
  // so the first time we see a userId is their best).
  const seen = new Set<string>();
  const entries: Array<Record<string, unknown>> = [];
  for (const r of rows) {
    if (seen.has(r.userId)) continue;
    seen.add(r.userId);
    const { snapshotNickname, currentNickname, ...rest } = r;
    entries.push({
      ...rest,
      nickname: currentNickname || snapshotNickname || "Anonymous",
    });
    if (entries.length >= limit) break;
  }

  return NextResponse.json({ entries });
}
