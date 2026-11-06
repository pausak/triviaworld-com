import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// A real SQLite file in a temporary folder: the database module opens the one in
// the working directory, so move there before it loads.
process.chdir(mkdtempSync(path.join(tmpdir(), "triviaworld-test-")));

const cookieJar = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieJar.has(name) ? { value: cookieJar.get(name) } : undefined),
    set: (name: string, value: string) => cookieJar.set(name, value),
    delete: (name: string) => cookieJar.delete(name),
  }),
}));

let db: typeof import("@/lib/db").db;
let schema: typeof import("@/lib/db/schema");
let complete: typeof import("@/app/api/game/complete/route").POST;
let answer: typeof import("@/app/api/game/answer/route").POST;
let store: typeof import("@/app/api/trivia/questions/route").questionStore;

const post = (url: string, body: unknown) =>
  new NextRequest(`http://test${url}`, { method: "POST", body: JSON.stringify(body) });

let n = 0;
async function newGame(mode = "quick") {
  n++;
  const userId = `user-${n}`;
  const sessionId = `session-${n}`;
  await db.insert(schema.users).values({ id: userId, nickname: `Player ${n}` });
  await db.insert(schema.gameSessions).values({ id: sessionId, userId, mode });
  return { userId, sessionId };
}

beforeAll(async () => {
  ({ db } = await import("@/lib/db"));
  schema = await import("@/lib/db/schema");
  ({ POST: complete } = await import("@/app/api/game/complete/route"));
  ({ POST: answer } = await import("@/app/api/game/answer/route"));
  ({ questionStore: store } = await import("@/app/api/trivia/questions/route"));
});

beforeEach(() => cookieJar.clear());

describe("answering", () => {
  async function played(selectedAnswer: string) {
    const { sessionId } = await newGame();
    store.set("client-session", {
      questions: [
        { id: "q1", question: "2+2?", category: "Maths", difficulty: "easy", correctAnswer: "4", incorrectAnswers: [] },
      ],
      createdAt: Date.now(),
    } as never);
    const res = await answer(
      post("/api/game/answer", {
        sessionId: "client-session",
        questionId: "q1",
        selectedAnswer,
        timeSpent: 15000,
        timeLimit: 15,
        dbSessionId: sessionId,
      })
    );
    return { sessionId, status: res.status, body: await res.json() };
  }

  it("the server decides what is right, and scores it", async () => {
    const right = await played("4");
    expect(right.body).toMatchObject({ isCorrect: true, points: 100 });
    const wrong = await played("5");
    expect(wrong.body).toMatchObject({ isCorrect: false, points: 0, correctAnswer: "4" });
  });

  it("a session the server does not know gets a 404", async () => {
    const res = await answer(
      post("/api/game/answer", { sessionId: "nope", questionId: "q1", selectedAnswer: "4" })
    );
    expect(res.status).toBe(404);
  });
});

describe("completing a game", () => {
  async function withAnswers(results: { isCorrect: boolean; points: number; timeSpent: number }[]) {
    const game = await newGame();
    for (const [i, r] of results.entries()) {
      await db.insert(schema.answers).values({
        id: `${game.sessionId}-a${i}`,
        sessionId: game.sessionId,
        questionId: `q${i}`,
        questionText: "?",
        category: "Maths",
        difficulty: "easy",
        selectedAnswer: "x",
        correctAnswer: "y",
        ...r,
      });
    }
    return game;
  }

  it("works the score out from the stored answers, not from anything the browser says", async () => {
    const game = await withAnswers([
      { isCorrect: true, points: 100, timeSpent: 2000 },
      { isCorrect: true, points: 150, timeSpent: 4000 },
      { isCorrect: false, points: 0, timeSpent: 6000 },
      { isCorrect: true, points: 50, timeSpent: 8000 },
    ]);
    const res = await complete(post("/api/game/complete", { ...game, score: 999999 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      score: 300,
      correctCount: 3,
      totalQuestions: 4,
      accuracy: 0.75,
      avgTime: 5000,
      maxStreak: 2,
    });
  });

  it("puts the game on the leaderboard once, and refuses to complete it twice", async () => {
    const game = await withAnswers([{ isCorrect: true, points: 100, timeSpent: 1000 }]);
    expect((await complete(post("/api/game/complete", game))).status).toBe(200);
    expect((await complete(post("/api/game/complete", game))).status).toBe(400);
    const { eq } = await import("drizzle-orm");
    const rows = db
      .select()
      .from(schema.leaderboardEntries)
      .where(eq(schema.leaderboardEntries.sessionId, game.sessionId))
      .all();
    expect(rows).toHaveLength(1);
    expect(rows[0].nickname).toMatch(/^Player/);
  });

  it("awards First Steps for a first game, and only once", async () => {
    const game = await withAnswers([{ isCorrect: false, points: 0, timeSpent: 1000 }]);
    const body = await (await complete(post("/api/game/complete", game))).json();
    expect(body.newAchievements.map((a: { name: string }) => a.name)).toContain("First Steps");

    const second = await newGame();
    await db.update(schema.gameSessions).set({ userId: game.userId }).where(
      (await import("drizzle-orm")).eq(schema.gameSessions.id, second.sessionId)
    );
    const again = await (
      await complete(post("/api/game/complete", { sessionId: second.sessionId, userId: game.userId }))
    ).json();
    expect(again.newAchievements.map((a: { name: string }) => a.name)).not.toContain("First Steps");
  });

  it("rejects missing fields and unknown sessions", async () => {
    expect((await complete(post("/api/game/complete", {}))).status).toBe(400);
    expect(
      (await complete(post("/api/game/complete", { sessionId: "nope", userId: "nope" }))).status
    ).toBe(404);
  });
});

describe("accounts", () => {
  const route = async () => ({
    register: (await import("@/app/api/auth/register/route")).POST,
    login: (await import("@/app/api/auth/login/route")).POST,
  });

  it("registers, signs in with the right password only, and never returns the hash", async () => {
    const { register, login } = await route();
    const credentials = { email: "a@example.com", password: "correct-horse" };
    const created = await register(post("/api/auth/register", { ...credentials, nickname: "A" }));
    expect(created.status).toBeLessThan(300);
    expect(JSON.stringify(await created.json())).not.toMatch(/hash/i);
    expect([...cookieJar.keys()]).toContain("tw_session");

    const signedIn = await login(post("/api/auth/login", credentials));
    expect(signedIn.status).toBe(200);
    expect(JSON.stringify(await signedIn.json())).not.toMatch(/hash/i);

    const wrong = await login(post("/api/auth/login", { ...credentials, password: "wrong-password" }));
    expect(wrong.status).toBe(401);
  });

  it("gives the same answer for an unknown email as for a wrong password", async () => {
    const { login } = await route();
    const res = await login(post("/api/auth/login", { email: "nobody@example.com", password: "whatever1" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Invalid email or password" });
  });

  it("refuses a short password and a taken email", async () => {
    const { register } = await route();
    expect((await register(post("/api/auth/register", { email: "b@example.com", password: "123" }))).status).toBe(400);
    const once = { email: "c@example.com", password: "long-enough", nickname: "C" };
    expect((await register(post("/api/auth/register", once))).status).toBeLessThan(300);
    expect((await register(post("/api/auth/register", once))).status).toBeGreaterThanOrEqual(400);
  });
});
