import { describe, expect, it } from "vitest";
import { calculateMaxScore, calculateQuestionPoints, calculateTotalScore } from "@/lib/scoring";
import type { AnswerResult } from "@/types/trivia";

describe("calculateQuestionPoints", () => {
  it("gives nothing for a wrong answer, however fast", () => {
    expect(calculateQuestionPoints("quick", "hard", 0, 15, false, 20)).toBe(0);
  });

  it("rewards speed: an instant answer earns 50% more than one at the limit", () => {
    expect(calculateQuestionPoints("quick", "easy", 0, 15, true, 0)).toBe(150);
    expect(calculateQuestionPoints("quick", "easy", 15000, 15, true, 0)).toBe(100);
  });

  it("does not go below base points when the answer is past the limit", () => {
    expect(calculateQuestionPoints("quick", "easy", 99000, 15, true, 0)).toBe(100);
  });

  it("scales with difficulty, except on the daily where everyone gets the same questions", () => {
    expect(calculateQuestionPoints("quick", "hard", 15000, 15, true, 0)).toBe(200);
    expect(calculateQuestionPoints("daily", "hard", 15000, 15, true, 0)).toBe(100);
  });

  it("caps the survival streak bonus at a streak of 20", () => {
    const at20 = calculateQuestionPoints("survival", "easy", 15000, 15, true, 20);
    expect(at20).toBe(300);
    expect(calculateQuestionPoints("survival", "easy", 15000, 15, true, 500)).toBe(at20);
  });
});

describe("totals", () => {
  it("adds up the points of each answer", () => {
    const answers = [{ points: 150 }, { points: 0 }, { points: 75 }] as AnswerResult[];
    expect(calculateTotalScore(answers)).toBe(225);
  });

  it("the max score is one no quick game can exceed", () => {
    const best = calculateQuestionPoints("quick", "medium", 0, 15, true, 0);
    expect(calculateMaxScore("quick", 10, "medium")).toBe(best * 10);
  });
});
