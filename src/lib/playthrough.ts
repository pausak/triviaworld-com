import { GAME_RULES } from "@/lib/gameRules";
import { calculateQuestionPoints } from "@/lib/scoring";
import type { Difficulty, GameMode, QuestionWithAnswer } from "@/types/trivia";

// Everything that decides a score lives here, on the server. The browser only says
// which answer it chose: not how long it took, what its streak is or how many lives
// it has left. Questions go one at a time, in order, and each is answered once, so
// the correct answer in one response cannot be used to answer that question again.

const TTL_MS = 2 * 60 * 60 * 1000;
// Network time, and the gap between the answer leaving and the clock on the page.
const LATE_GRACE_MS = 3000;

export interface Playthrough {
  sessionId: string;
  mode: GameMode;
  questions: QuestionWithAnswer[];
  index: number;
  questionStartedAt: number | null;
  streak: number;
  lives: number | null;
  expiresAt: number;
}

export type AnswerOutcome =
  | {
      ok: true;
      question: QuestionWithAnswer;
      isCorrect: boolean;
      points: number;
      timeSpent: number;
    }
  | { ok: false; status: number; error: string };

// On globalThis so every route bundle shares one store.
const store: { playthroughs?: Map<string, Playthrough> } = globalThis as never;
const playthroughs = (store.playthroughs ??= new Map<string, Playthrough>());

function removeExpired(now: number) {
  for (const [key, value] of playthroughs) {
    if (value.expiresAt < now) playthroughs.delete(key);
  }
}

export function startPlaythrough(
  sessionId: string,
  mode: GameMode,
  questions: QuestionWithAnswer[],
  now = Date.now()
): Playthrough {
  removeExpired(now);
  const playthrough: Playthrough = {
    sessionId,
    mode,
    questions,
    index: 0,
    questionStartedAt: now,
    streak: 0,
    lives: GAME_RULES[mode].lives,
    expiresAt: now + TTL_MS,
  };
  playthroughs.set(sessionId, playthrough);
  return playthrough;
}

export function getPlaythrough(sessionId: string, now = Date.now()): Playthrough | undefined {
  const playthrough = playthroughs.get(sessionId);
  return playthrough && playthrough.expiresAt >= now ? playthrough : undefined;
}

export function endPlaythrough(sessionId: string) {
  playthroughs.delete(sessionId);
}

/** Starts the clock on the next question. Once started it cannot be started again. */
export function startNextQuestion(playthrough: Playthrough, now = Date.now()) {
  if (playthrough.index < playthrough.questions.length && playthrough.questionStartedAt === null) {
    playthrough.questionStartedAt = now;
  }
}

export function recordAnswer(
  playthrough: Playthrough,
  questionId: string,
  selectedAnswer: string,
  now = Date.now()
): AnswerOutcome {
  if (playthrough.lives === 0 || playthrough.index >= playthrough.questions.length) {
    return { ok: false, status: 409, error: "This game is over" };
  }
  const question = playthrough.questions[playthrough.index];
  if (question.id !== questionId) {
    return { ok: false, status: 409, error: "That is not the current question" };
  }

  const limitSeconds = GAME_RULES[playthrough.mode].timePerQuestion;
  const limitMs = limitSeconds * 1000;
  const startedAt = playthrough.questionStartedAt;
  // No clock started means no speed bonus, not a free instant answer.
  const elapsed = startedAt === null ? limitMs : now - startedAt;
  const late = elapsed > limitMs + LATE_GRACE_MS;
  const timeSpent = Math.min(elapsed, limitMs);
  const isCorrect = !late && selectedAnswer === question.correctAnswer;
  const points = calculateQuestionPoints(
    playthrough.mode,
    question.difficulty as Difficulty,
    timeSpent,
    limitSeconds,
    isCorrect,
    playthrough.streak
  );

  playthrough.index += 1;
  playthrough.questionStartedAt = null;
  playthrough.streak = isCorrect ? playthrough.streak + 1 : 0;
  if (!isCorrect && playthrough.lives !== null) playthrough.lives -= 1;

  return { ok: true, question, isCorrect, points, timeSpent };
}
