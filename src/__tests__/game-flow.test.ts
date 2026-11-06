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
let session: typeof import("@/app/api/game/session/route").POST;
let questionsRoute: typeof import("@/app/api/trivia/questions/route").GET;
let leaderboard: typeof import("@/app/api/leaderboard/route").GET;
let startPlaythrough: typeof import("@/lib/playthrough").startPlaythrough;

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
  ({ POST: session } = await import("@/app/api/game/session/route"));
  ({ GET: questionsRoute } = await import("@/app/api/trivia/questions/route"));
  ({ GET: leaderboard } = await import("@/app/api/leaderboard/route"));
  ({ startPlaythrough } = await import("@/lib/playthrough"));
});

beforeEach(async () => {
  cookieJar.clear();
  await db.delete(schema.rateLimits);
});

const testQuestions = () =>
  [{ id: "q1", question: "2+2?", category: "Maths", difficulty: "easy", correctAnswer: "4", incorrectAnswers: [] }] as never;

describe("answering", () => {
  async function played(selectedAnswer: string, extras: object = {}) {
    const { sessionId } = await newGame();
    startPlaythrough(sessionId, "quick", testQuestions(), Date.now() - 15000);
    const res = await answer(
      post("/api/game/answer", { sessionId, questionId: "q1", selectedAnswer, ...extras })
    );
    return { sessionId, status: res.status, body: await res.json() };
  }

  it("the server decides what is right, and scores it", async () => {
    const right = await played("4");
    expect(right.body).toMatchObject({ isCorrect: true, points: 100 });
    const wrong = await played("5");
    expect(wrong.body).toMatchObject({ isCorrect: false, points: 0, correctAnswer: "4" });
  });

  it("ignores any speed, streak, mode or time limit the browser claims", async () => {
    const cheating = await played("4", { timeSpent: 0, streak: 500, mode: "survival", timeLimit: 99999 });
    expect(cheating.body).toMatchObject({ isCorrect: true, points: 100 });
  });

  it("a second answer to a question is refused and not stored", async () => {
    const first = await played("5");
    const again = await answer(
      post("/api/game/answer", { sessionId: first.sessionId, questionId: "q1", selectedAnswer: "4" })
    );
    expect(again.status).toBe(409);
    const body = await (await complete(post("/api/game/complete", { sessionId: first.sessionId }))).json();
    expect(body).toMatchObject({ score: 0, correctCount: 0, totalQuestions: 1 });
  });

  it("a session the server does not know gets a 404", async () => {
    const res = await answer(
      post("/api/game/answer", { sessionId: "nope", questionId: "q1", selectedAnswer: "4" })
    );
    expect(res.status).toBe(404);
  });
});

describe("starting a game", () => {
  const start = async (body: object) => (await session(post("/api/game/session", body))).json();

  it("refuses an unknown mode", async () => {
    expect((await session(post("/api/game/session", { mode: "easy-points" }))).status).toBe(400);
  });

  it("keeps an anonymous browser's id", async () => {
    const body = await start({ userId: "browser-id-123456", mode: "quick" });
    expect(body.userId).toBe("browser-id-123456");
  });

  it("will not play as a registered account by naming it", async () => {
    await db.insert(schema.users).values({ id: "registered-account", nickname: "Reg", email: "r@example.com", isAnonymous: false });
    const body = await start({ userId: "registered-account", mode: "quick" });
    expect(body.userId).not.toBe("registered-account");
  });

  it("a signed-in player is who their session says, whatever the request claims", async () => {
    const { createToken } = await import("@/lib/auth");
    await db.insert(schema.users).values({ id: "signed-in-account", nickname: "S", email: "s@example.com", isAnonymous: false });
    cookieJar.set("tw_session", await createToken("signed-in-account"));
    const body = await start({ userId: "browser-id-123456", mode: "quick" });
    expect(body.userId).toBe("signed-in-account");
  });

  it("deals the mode's own number of questions, and the same ones if asked again", async () => {
    const triviaApi = await import("@/lib/triviaApi");
    const spy = vi.spyOn(triviaApi, "fetchQuestions").mockResolvedValue(testQuestions());
    const { sessionId } = await start({ mode: "quick" });
    const url = `http://test/api/trivia/questions?sessionId=${sessionId}&amount=50`;
    const first = await questionsRoute(new NextRequest(url));
    expect(first.status).toBe(200);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ amount: 10 }));
    expect(JSON.stringify(await first.json())).not.toContain("correctAnswer");
    await questionsRoute(new NextRequest(url));
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("deals nothing for a session that does not exist", async () => {
    const res = await questionsRoute(new NextRequest("http://test/api/trivia/questions?sessionId=nope"));
    expect(res.status).toBe(404);
  });
});

describe("the leaderboard", () => {
  it("does not publish the ids that identify a player", async () => {
    const game = await newGame();
    await complete(post("/api/game/complete", game));
    const body = await (await leaderboard(new NextRequest("http://test/api/leaderboard?mode=quick"))).json();
    expect(body.entries.length).toBeGreaterThan(0);
    expect(JSON.stringify(body)).not.toContain(game.userId);
    expect(body.entries[0]).not.toHaveProperty("userId");
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
      await complete(post("/api/game/complete", { sessionId: second.sessionId }))
    ).json();
    expect(again.newAchievements.map((a: { name: string }) => a.name)).not.toContain("First Steps");
  });

  it("credits the session's owner, not whoever the request names", async () => {
    const game = await withAnswers([{ isCorrect: true, points: 100, timeSpent: 1000 }]);
    const victim = await newGame();
    await complete(post("/api/game/complete", { sessionId: game.sessionId, userId: victim.userId }));
    const { eq } = await import("drizzle-orm");
    const [row] = db
      .select()
      .from(schema.leaderboardEntries)
      .where(eq(schema.leaderboardEntries.sessionId, game.sessionId))
      .all();
    expect(row.userId).toBe(game.userId);
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
