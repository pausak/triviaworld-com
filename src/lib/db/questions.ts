import { db } from "./index";
import { questions } from "./schema";
import { sql } from "drizzle-orm";

type NewQuestion = typeof questions.$inferInsert;

// Write-through cache: persist every question we legitimately fetched, deduped
// by The Trivia API's stable id. Best-effort — callers must not let this throw
// into the request path.
export async function cacheQuestions(rows: NewQuestion[]): Promise<void> {
  if (!rows.length) return;
  await db.insert(questions).values(rows).onConflictDoNothing();
}

export interface QuestionBankStats {
  total: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
}

// Counts only (no question content) — safe to expose for monitoring growth.
export async function getQuestionStats(): Promise<QuestionBankStats> {
  const totalRow = await db
    .select({ n: sql<number>`count(*)` })
    .from(questions)
    .get();

  const catRows = await db
    .select({ key: questions.category, n: sql<number>`count(*)` })
    .from(questions)
    .groupBy(questions.category)
    .all();

  const diffRows = await db
    .select({ key: questions.difficulty, n: sql<number>`count(*)` })
    .from(questions)
    .groupBy(questions.difficulty)
    .all();

  const toMap = (rows: { key: string; n: number }[]) =>
    Object.fromEntries(rows.map((r) => [r.key, r.n]));

  return {
    total: totalRow?.n ?? 0,
    byCategory: toMap(catRows),
    byDifficulty: toMap(diffRows),
  };
}
