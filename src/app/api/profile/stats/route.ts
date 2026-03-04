import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, gameSessions, categoryStats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sessions = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.userId, userId))
    .orderBy(desc(gameSessions.startedAt))
    .all();

  const categories = await db
    .select()
    .from(categoryStats)
    .where(eq(categoryStats.userId, userId))
    .orderBy(desc(categoryStats.gamesPlayed))
    .all();

  const completed = sessions.filter((s) => s.status === "completed");
  const totalScore = completed.reduce((sum, s) => sum + s.score, 0);
  const avgAccuracy =
    completed.length > 0
      ? completed.reduce((sum, s) => sum + s.accuracy, 0) / completed.length
      : 0;

  const modeBreakdown = {
    quick: completed.filter((s) => s.mode === "quick").length,
    daily: completed.filter((s) => s.mode === "daily").length,
    marathon: completed.filter((s) => s.mode === "marathon").length,
    survival: completed.filter((s) => s.mode === "survival").length,
  };

  return NextResponse.json({
    user: {
      nickname: user.nickname,
      gamesPlayed: user.gamesPlayed,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      createdAt: user.createdAt,
    },
    stats: {
      totalGames: completed.length,
      totalScore,
      avgAccuracy,
      modeBreakdown,
      recentGames: completed.slice(0, 10).map((s) => ({
        mode: s.mode,
        score: s.score,
        accuracy: s.accuracy,
        category: s.category,
        date: s.completedAt,
      })),
    },
    categories,
  });
}
