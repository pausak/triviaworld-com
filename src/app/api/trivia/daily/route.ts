import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyChallenges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchQuestions, sanitizeForClient } from "@/lib/opentdb";
import { nanoid } from "nanoid";
import type { QuestionWithAnswer } from "@/types/trivia";

// Store daily questions server-side for validation
const dailyQuestionStore = new Map<
  string,
  { questions: QuestionWithAnswer[]; date: string }
>();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const sessionId = params.get("sessionId");
  const userId = params.get("userId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if user already played today
  if (userId) {
    const { gameSessions } = await import("@/lib/db/schema");
    const { and } = await import("drizzle-orm");
    const existing = await db
      .select()
      .from(gameSessions)
      .where(
        and(
          eq(gameSessions.userId, userId),
          eq(gameSessions.mode, "daily"),
          eq(gameSessions.status, "completed")
        )
      )
      .all();

    const playedToday = existing.some((s) => s.startedAt.startsWith(today));
    if (playedToday) {
      return NextResponse.json(
        { error: "Already played today's challenge", alreadyPlayed: true },
        { status: 409 }
      );
    }
  }

  // Check DB cache for today's questions
  let dailyEntry = await db
    .select()
    .from(dailyChallenges)
    .where(eq(dailyChallenges.date, today))
    .get();

  let questions: QuestionWithAnswer[];

  if (dailyEntry) {
    questions = dailyEntry.questionsJson as unknown as QuestionWithAnswer[];
  } else {
    // Fetch new daily questions (mixed categories, medium difficulty)
    questions = await fetchQuestions({
      amount: 10,
      difficulty: "medium",
    });

    // Cache in DB
    await db.insert(dailyChallenges).values({
      id: nanoid(),
      date: today,
      questionsJson: questions as unknown as Record<string, unknown>,
    });
  }

  // Store for answer validation (reuse question store mechanism)
  const { questionStore } = await import("@/app/api/trivia/questions/route");
  questionStore.set(sessionId, {
    questions,
    expiresAt: Date.now() + 30 * 60 * 1000,
  });

  // Also store in daily store for reference
  dailyQuestionStore.set(today, { questions, date: today });

  return NextResponse.json({
    questions: sanitizeForClient(questions),
    sessionId,
    date: today,
  });
}

export { dailyQuestionStore };
