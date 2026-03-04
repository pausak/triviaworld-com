import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gameSessions, leaderboardEntries, categoryStats, answers as answersTable } from "@/lib/db/schema";
import { incrementGamesPlayed } from "@/lib/db/users";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, userId } = body;

  if (!sessionId || !userId) {
    return NextResponse.json(
      { error: "sessionId and userId required" },
      { status: 400 }
    );
  }

  const session = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.id, sessionId))
    .get();

  if (!session) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  if (session.status === "completed") {
    return NextResponse.json(
      { error: "Session already completed" },
      { status: 400 }
    );
  }

  // Get all answers for this session
  const sessionAnswers = await db
    .select()
    .from(answersTable)
    .where(eq(answersTable.sessionId, sessionId))
    .all();

  const correctCount = sessionAnswers.filter((a) => a.isCorrect).length;
  const totalQuestions = sessionAnswers.length;
  const totalScore = sessionAnswers.reduce((sum, a) => sum + a.points, 0);
  const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const avgTime =
    totalQuestions > 0
      ? sessionAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / totalQuestions
      : 0;

  // Find max streak
  let maxStreak = 0;
  let currentStreak = 0;
  for (const a of sessionAnswers) {
    if (a.isCorrect) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  // Update session
  await db
    .update(gameSessions)
    .set({
      score: totalScore,
      correctCount,
      totalQuestions,
      accuracy,
      avgTime,
      streak: maxStreak,
      status: "completed",
      completedAt: new Date().toISOString(),
    })
    .where(eq(gameSessions.id, sessionId));

  // Add leaderboard entry
  const today = new Date().toISOString().split("T")[0];

  // Get user nickname
  const { users } = await import("@/lib/db/schema");
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  await db.insert(leaderboardEntries).values({
    id: nanoid(),
    userId,
    sessionId,
    nickname: user?.nickname || "Anonymous",
    mode: session.mode,
    score: totalScore,
    accuracy,
    correctCount,
    totalQuestions,
    category: session.category,
    difficulty: session.difficulty,
    date: today,
  });

  // Update category stats
  const categoryBreakdown = new Map<string, { correct: number; total: number }>();
  for (const a of sessionAnswers) {
    const existing = categoryBreakdown.get(a.category) || { correct: 0, total: 0 };
    existing.total++;
    if (a.isCorrect) existing.correct++;
    categoryBreakdown.set(a.category, existing);
  }

  for (const [category, stats] of categoryBreakdown) {
    const existing = await db
      .select()
      .from(categoryStats)
      .where(and(eq(categoryStats.userId, userId), eq(categoryStats.category, category)))
      .get();

    if (existing) {
      const newTotal = existing.totalQuestions + stats.total;
      const newCorrect = existing.correctAnswers + stats.correct;
      await db
        .update(categoryStats)
        .set({
          totalQuestions: newTotal,
          correctAnswers: newCorrect,
          accuracy: newTotal > 0 ? newCorrect / newTotal : 0,
          bestScore: Math.max(existing.bestScore, totalScore),
          gamesPlayed: existing.gamesPlayed + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(categoryStats.id, existing.id));
    } else {
      await db.insert(categoryStats).values({
        id: nanoid(),
        userId,
        category,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
        bestScore: totalScore,
        gamesPlayed: 1,
      });
    }
  }

  // Update user stats
  await incrementGamesPlayed(userId);

  // Check achievements
  const { checkAchievements, seedAchievements } = await import("@/lib/achievements");
  await seedAchievements(); // ensure achievement definitions exist
  const newAchievements = await checkAchievements(userId, {
    mode: session.mode,
    score: totalScore,
    accuracy,
    streak: maxStreak,
    avgTime,
    difficulty: session.difficulty,
  });

  return NextResponse.json({
    score: totalScore,
    correctCount,
    totalQuestions,
    accuracy,
    avgTime,
    maxStreak,
    newAchievements: newAchievements.map((a) => ({
      name: a.name,
      description: a.description,
      icon: a.icon,
      points: a.points,
    })),
  });
}
