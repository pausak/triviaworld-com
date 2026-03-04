import type { Difficulty, GameMode, AnswerResult } from "@/types/trivia";

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

const BASE_POINTS = 100;

export function calculateQuestionPoints(
  mode: GameMode,
  difficulty: Difficulty,
  timeSpent: number,
  timeLimit: number,
  isCorrect: boolean,
  streak: number
): number {
  if (!isCorrect) return 0;

  const diffMultiplier = DIFFICULTY_MULTIPLIER[difficulty];
  const timeLimitMs = timeLimit * 1000;
  const timeBonus = Math.max(0, 1 - timeSpent / timeLimitMs);

  switch (mode) {
    case "quick":
      // Base + time bonus (up to 50% extra)
      return Math.round(BASE_POINTS * diffMultiplier * (1 + timeBonus * 0.5));

    case "daily":
      // Same as quick but no difficulty variance (fixed questions)
      return Math.round(BASE_POINTS * (1 + timeBonus * 0.5));

    case "marathon":
      // Lower base, endurance rewarded
      return Math.round(BASE_POINTS * 0.8 * diffMultiplier * (1 + timeBonus * 0.3));

    case "survival":
      // Streak multiplier is the key scoring factor
      const streakMultiplier = 1 + Math.min(streak, 20) * 0.1;
      return Math.round(
        BASE_POINTS * diffMultiplier * streakMultiplier * (1 + timeBonus * 0.3)
      );

    default:
      return Math.round(BASE_POINTS * diffMultiplier);
  }
}

export function calculateTotalScore(answers: AnswerResult[]): number {
  return answers.reduce((sum, a) => sum + a.points, 0);
}

export function calculateMaxScore(
  mode: GameMode,
  questionCount: number,
  difficulty: Difficulty = "medium"
): number {
  // Theoretical max: all correct, instant answers, max streak
  return questionCount * Math.round(
    BASE_POINTS * DIFFICULTY_MULTIPLIER[difficulty] * (mode === "survival" ? 3 : 1.5)
  );
}
