import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyChallenges, gameSessions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getPlaythrough, startPlaythrough } from "@/lib/playthrough";
import { fetchQuestions, sanitizeForClient } from "@/lib/triviaApi";
import { nanoid } from "nanoid";
import type { QuestionWithAnswer } from "@/types/trivia";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const sessionId = params.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const session = await db.select().from(gameSessions).where(eq(gameSessions.id, sessionId)).get();
  if (!session || session.status !== "active") {
    return NextResponse.json({ error: "Session not found or finished" }, { status: 404 });
  }
  if (session.mode !== "daily") {
    return NextResponse.json({ error: "Wrong game mode for this session" }, { status: 400 });
  }
  const userId = session.userId;

  const today = new Date().toISOString().split("T")[0];

  // Check if user already played today
  const finishedDailies = await db
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

  if (finishedDailies.some((s) => s.startedAt.startsWith(today))) {
    return NextResponse.json(
      { error: "Already played today's challenge", alreadyPlayed: true },
      { status: 409 }
    );
  }

  const existingGame = getPlaythrough(sessionId);
  if (existingGame) {
    return NextResponse.json({
      questions: sanitizeForClient(existingGame.questions),
      sessionId,
      date: today,
    });
  }

  // Check DB cache for today's questions
  const dailyEntry = await db
    .select()
    .from(dailyChallenges)
    .where(eq(dailyChallenges.date, today))
    .get();

  let questions: QuestionWithAnswer[];

  if (dailyEntry) {
    questions = dailyEntry.questionsJson as unknown as QuestionWithAnswer[];
  } else {
    // Fetch new daily questions (mixed categories, easy difficulty)
    questions = await fetchQuestions({
      amount: 10,
      difficulty: "easy",
    });

    // Cache in DB
    await db.insert(dailyChallenges).values({
      id: nanoid(),
      date: today,
      questionsJson: questions as unknown as Record<string, unknown>,
    });
  }

  startPlaythrough(sessionId, "daily", questions);

  return NextResponse.json({
    questions: sanitizeForClient(questions),
    sessionId,
    date: today,
  });
}
