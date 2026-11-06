import type { GameMode } from "@/types/trivia";

// One set of rules, used by the pages to set up a game and by the server to enforce it.
export const GAME_RULES: Record<
  GameMode,
  { questionCount: number; timePerQuestion: number; lives: number | null }
> = {
  quick: { questionCount: 10, timePerQuestion: 15, lives: null },
  daily: { questionCount: 10, timePerQuestion: 15, lives: null },
  marathon: { questionCount: 50, timePerQuestion: 30, lives: null },
  survival: { questionCount: 50, timePerQuestion: 20, lives: 3 },
};

export function isGameMode(mode: unknown): mode is GameMode {
  return typeof mode === "string" && Object.prototype.hasOwnProperty.call(GAME_RULES, mode);
}
