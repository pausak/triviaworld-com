import type { GameResult } from "@/types/trivia";

export function generateShareText(result: GameResult): string {
  const accuracyPercent = Math.round(result.accuracy * 100);
  const modeLabel = {
    quick: "Quick Play",
    daily: "Daily Challenge",
    marathon: "Marathon",
    survival: "Survival",
  }[result.mode];

  // Generate emoji grid for answers
  const grid = result.answers
    .map((a) => (a.isCorrect ? "🟩" : "🟥"))
    .join("");

  // Split into rows of 5
  const rows: string[] = [];
  for (let i = 0; i < grid.length; i += 10) {
    // 5 emojis = 10 chars
    rows.push(grid.slice(i, i + 10));
  }

  return [
    `🧠 TriviaWorld — ${modeLabel}`,
    "",
    rows.join("\n"),
    "",
    `Score: ${result.score} | ${accuracyPercent}% | ${result.correctCount}/${result.totalQuestions}`,
    "",
    "Play at triviaworld.com",
  ].join("\n");
}

export async function shareResults(result: GameResult) {
  const text = generateShareText(result);

  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // Fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
