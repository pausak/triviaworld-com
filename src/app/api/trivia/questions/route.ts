import { NextRequest, NextResponse } from "next/server";
import { fetchQuestions, sanitizeForClient } from "@/lib/opentdb";
import type { Difficulty } from "@/types/trivia";

// In-memory question store keyed by session — server validates answers
const questionStore = new Map<
  string,
  { questions: Awaited<ReturnType<typeof fetchQuestions>>; expiresAt: number }
>();

// Clean up expired entries periodically
function cleanupStore() {
  const now = Date.now();
  for (const [key, value] of questionStore.entries()) {
    if (value.expiresAt < now) {
      questionStore.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const amount = parseInt(params.get("amount") || "10", 10);
  const category = params.get("category")
    ? parseInt(params.get("category")!, 10)
    : undefined;
  const difficulty = params.get("difficulty") as Difficulty | null;
  const sessionId = params.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }

  if (amount < 1 || amount > 50) {
    return NextResponse.json(
      { error: "amount must be between 1 and 50" },
      { status: 400 }
    );
  }

  try {
    cleanupStore();

    const questions = await fetchQuestions({
      amount,
      category,
      difficulty: difficulty || undefined,
    });

    // Store questions server-side for answer validation
    questionStore.set(sessionId, {
      questions,
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 min TTL
    });

    // Send sanitized questions to client (no correct answer)
    return NextResponse.json({
      questions: sanitizeForClient(questions),
      sessionId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Export for use by answer validation
export { questionStore };
