import { NextRequest, NextResponse } from "next/server";
import { getPlaythrough, recordAnswer } from "@/lib/playthrough";
import { db } from "@/lib/db";
import { answers } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const { sessionId, questionId, selectedAnswer } = await request.json();

  if (!sessionId || !questionId || !selectedAnswer) {
    return NextResponse.json(
      { error: "sessionId, questionId, and selectedAnswer are required" },
      { status: 400 }
    );
  }

  const playthrough = getPlaythrough(String(sessionId));
  if (!playthrough) {
    return NextResponse.json({ error: "Session not found or expired" }, { status: 404 });
  }

  const outcome = recordAnswer(playthrough, String(questionId), String(selectedAnswer));
  if (!outcome.ok) {
    return NextResponse.json({ error: outcome.error }, { status: outcome.status });
  }

  const { question, isCorrect, points, timeSpent } = outcome;
  try {
    await db.insert(answers).values({
      id: nanoid(),
      sessionId: playthrough.sessionId,
      questionId: question.id,
      questionText: question.question,
      category: question.category,
      difficulty: question.difficulty,
      selectedAnswer: selectedAnswer === "__TIMEOUT__" ? "" : String(selectedAnswer),
      correctAnswer: question.correctAnswer,
      isCorrect,
      timeSpent,
      points,
    });
  } catch {
    // Don't fail the answer if DB write fails
  }

  return NextResponse.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    points,
    questionId: question.id,
  });
}
