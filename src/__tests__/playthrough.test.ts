import { describe, expect, it } from "vitest";
import { GAME_RULES } from "@/lib/gameRules";
import { recordAnswer, startNextQuestion, startPlaythrough } from "@/lib/playthrough";
import type { GameMode, QuestionWithAnswer } from "@/types/trivia";

const question = (id: string) =>
  ({ id, question: "?", category: "Maths", difficulty: "easy", correctAnswer: "right", incorrectAnswers: [] }) as unknown as QuestionWithAnswer;

let n = 0;
const T0 = 1_000_000;
const game = (mode: GameMode = "quick", count = 5) =>
  startPlaythrough(`game-${++n}`, mode, Array.from({ length: count }, (_, i) => question(`q${i}`)), T0);

describe("recordAnswer", () => {
  it("scores by the server's clock", () => {
    const p = game();
    expect(recordAnswer(p, "q0", "right", T0)).toMatchObject({ ok: true, isCorrect: true, points: 150 });
    startNextQuestion(p, T0 + 5000);
    expect(recordAnswer(p, "q1", "right", T0 + 20000)).toMatchObject({ ok: true, isCorrect: true, points: 100 });
  });

  it("will not take the same question twice, so a revealed answer cannot be used", () => {
    const p = game();
    expect(recordAnswer(p, "q0", "wrong", T0)).toMatchObject({ ok: true, isCorrect: false });
    expect(recordAnswer(p, "q0", "right", T0)).toEqual({
      ok: false,
      status: 409,
      error: "That is not the current question",
    });
  });

  it("will not take a question out of turn", () => {
    expect(recordAnswer(game(), "q3", "right", T0)).toMatchObject({ ok: false, status: 409 });
  });

  it("gives no speed bonus when the clock was never started", () => {
    const p = game();
    recordAnswer(p, "q0", "right", T0);
    expect(recordAnswer(p, "q1", "right", T0)).toMatchObject({ points: 100 });
  });

  it("the clock cannot be restarted to look fast", () => {
    const p = game();
    recordAnswer(p, "q0", "right", T0);
    startNextQuestion(p, T0 + 1000);
    startNextQuestion(p, T0 + 15000);
    // 14 seconds in, from the first start. A restarted clock would give 150.
    expect(recordAnswer(p, "q1", "right", T0 + 15000)).toMatchObject({ points: 103 });
  });

  it("a right answer after the time limit is wrong, allowing for the network", () => {
    const limit = GAME_RULES.quick.timePerQuestion * 1000;
    expect(recordAnswer(game(), "q0", "right", T0 + limit + 2000)).toMatchObject({ isCorrect: true, points: 100 });
    expect(recordAnswer(game(), "q0", "right", T0 + limit + 4000)).toMatchObject({ isCorrect: false, points: 0 });
  });

  it("a timeout is never right", () => {
    expect(recordAnswer(game(), "q0", "__TIMEOUT__", T0)).toMatchObject({ isCorrect: false, points: 0 });
  });

  it("builds the survival streak itself", () => {
    const p = game("survival");
    const limit = GAME_RULES.survival.timePerQuestion * 1000;
    const late = () => {
      const started = T0;
      startNextQuestion(p, started);
      return started + limit;
    };
    expect(recordAnswer(p, "q0", "right", late())).toMatchObject({ points: 100 });
    expect(recordAnswer(p, "q1", "right", late())).toMatchObject({ points: 110 });
    expect(recordAnswer(p, "q2", "wrong", late())).toMatchObject({ points: 0 });
    expect(recordAnswer(p, "q3", "right", late())).toMatchObject({ points: 100 });
  });

  it("ends survival at three lives, whatever the page thinks", () => {
    const p = game("survival", 10);
    for (const id of ["q0", "q1", "q2"]) expect(recordAnswer(p, id, "wrong", T0)).toMatchObject({ ok: true });
    expect(recordAnswer(p, "q3", "right", T0)).toEqual({ ok: false, status: 409, error: "This game is over" });
  });

  it("other modes are not ended by wrong answers, but do end after the last question", () => {
    const p = game("quick", 4);
    for (const id of ["q0", "q1", "q2", "q3"]) expect(recordAnswer(p, id, "wrong", T0)).toMatchObject({ ok: true });
    expect(recordAnswer(p, "q4", "right", T0)).toMatchObject({ ok: false, error: "This game is over" });
  });
});
