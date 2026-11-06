import { describe, expect, it } from "vitest";
import { generateShareText } from "@/lib/shareResults";
import { sanitizeForClient } from "@/lib/triviaApi";
import type { GameResult, QuestionWithAnswer } from "@/types/trivia";

describe("sanitizeForClient", () => {
  it("never sends the correct answer to the browser", () => {
    const question = {
      id: "q1",
      question: "Capital of France?",
      correctAnswer: "Paris",
      incorrectAnswers: ["Rome", "Oslo", "Lima"],
    } as unknown as QuestionWithAnswer;
    const [sent] = sanitizeForClient([question]);
    expect(sent).not.toHaveProperty("correctAnswer");
    expect(sent).not.toHaveProperty("incorrectAnswers");
    expect(sent).toHaveProperty("question", "Capital of France?");
  });
});

describe("generateShareText", () => {
  it("shows the score and a grid in rows of five", () => {
    const answers = Array.from({ length: 7 }, (_, i) => ({ isCorrect: i !== 2 }));
    const text = generateShareText({
      mode: "quick",
      score: 640,
      accuracy: 6 / 7,
      correctCount: 6,
      totalQuestions: 7,
      answers,
    } as unknown as GameResult);
    expect(text).toContain("Quick Play");
    expect(text).toContain("Score: 640 | 86% | 6/7");
    expect(text.split("\n")).toContain("🟩🟩🟥🟩🟩");
    expect(text.split("\n")).toContain("🟩🟩");
  });
});
