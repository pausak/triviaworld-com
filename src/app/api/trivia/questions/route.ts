import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { gameSessions } from "@/lib/db/schema";
import { GAME_RULES, isGameMode } from "@/lib/gameRules";
import { difficultyFromParam } from "@/lib/deepLink";
import { getPlaythrough, startPlaythrough } from "@/lib/playthrough";
import { fetchQuestions, sanitizeForClient } from "@/lib/triviaApi";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category") ? parseInt(params.get("category")!, 10) : undefined;
  const difficulty = difficultyFromParam(params.get("difficulty"));
  const sessionId = params.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const session = await db.select().from(gameSessions).where(eq(gameSessions.id, sessionId)).get();
  if (!session || session.status !== "active") {
    return NextResponse.json({ error: "Session not found or finished" }, { status: 404 });
  }
  if (!isGameMode(session.mode) || session.mode === "daily") {
    return NextResponse.json({ error: "Wrong game mode for this session" }, { status: 400 });
  }

  // Asking again gets the same questions: a game cannot be re-dealt after seeing answers.
  const existing = getPlaythrough(sessionId);
  if (existing) {
    return NextResponse.json({ questions: sanitizeForClient(existing.questions), sessionId });
  }

  try {
    const questions = await fetchQuestions({
      amount: GAME_RULES[session.mode].questionCount,
      category: Number.isNaN(category) ? undefined : category,
      difficulty: difficulty || undefined,
    });
    startPlaythrough(sessionId, session.mode, questions);

    // Send sanitized questions to client (no correct answer)
    return NextResponse.json({ questions: sanitizeForClient(questions), sessionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
