import { categories } from "@/lib/categories";
import type { TriviaCategory, Difficulty } from "@/types/trivia";

// Deep links from the /trivia SEO pages, e.g. /play/marathon?category=33. Every
// curated category resolves, not just the ones in the picker, so a collapsed
// category still plays its mapped question pool with a sensible name.
export function categoryFromParam(param: string | null): TriviaCategory | null {
  if (!param) return null;
  const id = parseInt(param, 10);
  if (Number.isNaN(id)) return null;
  const match = categories.find((c) => c.openTdbId === id);
  return match ? { id: match.openTdbId, name: match.shortName } : null;
}

export function difficultyFromParam(param: string | null): Difficulty | null {
  return param === "easy" || param === "medium" || param === "hard" ? param : null;
}
