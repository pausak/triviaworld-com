import { NextRequest, NextResponse } from "next/server";
import { questionStore } from "@/app/api/trivia/questions/route";
import { calculateQuestionPoints } from "@/lib/scoring";
import { db } from "@/lib/db";
import { answers } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import type { GameMode, Difficulty } from "@/types/trivia";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, questionId, selectedAnswer, timeSpent, mode, streak, timeLimit, dbSessionId } = body;

  if (!sessionId || !questionId || !selectedAnswer) {
    return NextResponse.json(
      { error: "sessionId, questionId, and selectedAnswer are required" },
      { status: 400 }
    );
  }

  const stored = questionStore.get(sessionId);
  if (!stored) {
    return NextResponse.json(
      { error: "Session not found or expired" },
      { status: 404 }
    );
  }

  const question = stored.questions.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json(
      { error: "Question not found in session" },
      { status: 404 }
    );
  }

  const isCorrect = selectedAnswer === question.correctAnswer;
  const points = calculateQuestionPoints(
    (mode || "quick") as GameMode,
    question.difficulty as Difficulty,
    timeSpent || 0,
    timeLimit || 15,
    isCorrect,
    streak || 0
  );

  // Persist answer to database if we have a db session
  if (dbSessionId) {
    try {
      await db.insert(answers).values({
        id: nanoid(),
        sessionId: dbSessionId,
        questionId,
        questionText: question.question,
        category: question.category,
        difficulty: question.difficulty,
        selectedAnswer: selectedAnswer === "__TIMEOUT__" ? "" : selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent: timeSpent || 0,
        points,
      });
    } catch {
      // Don't fail the answer if DB write fails
    }
  }

  return NextResponse.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    points,
    questionId,
  });
}
