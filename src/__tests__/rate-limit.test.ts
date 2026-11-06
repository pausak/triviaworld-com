import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

process.chdir(mkdtempSync(path.join(tmpdir(), "triviaworld-rate-")));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined, set: () => {}, delete: () => {} }),
}));

let db: typeof import("@/lib/db").db;
let schema: typeof import("@/lib/db/schema");
let limits: typeof import("@/lib/rateLimit");
let login: typeof import("@/app/api/auth/login/route").POST;
let register: typeof import("@/app/api/auth/register/route").POST;
let contact: typeof import("@/app/api/contact/route").POST;

const req = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new NextRequest(`http://test${url}`, { method: "POST", body: JSON.stringify(body), headers });
const EMAIL = "real@example.com";
const PASSWORD = "the-right-password";
const attempt = (password: string, ip = "1.1.1.1", email = EMAIL, headers = {}) =>
  login(req("/api/auth/login", { email, password }, { "fly-client-ip": ip, ...headers }));

beforeAll(async () => {
  ({ db } = await import("@/lib/db"));
  schema = await import("@/lib/db/schema");
  limits = await import("@/lib/rateLimit");
  ({ POST: login } = await import("@/app/api/auth/login/route"));
  ({ POST: register } = await import("@/app/api/auth/register/route"));
  ({ POST: contact } = await import("@/app/api/contact/route"));
  await register(req("/api/auth/register", { email: EMAIL, password: PASSWORD, nickname: "R" }));
}, 20000);

beforeEach(async () => {
  await db.delete(schema.rateLimits);
});

describe("consumeRateLimits", () => {
  const rule = { name: "t", max: 2, windowMs: 1000 };
  const check = [{ rule, subject: "a" }];

  it("allows up to the limit, then says how long to wait", () => {
    expect(limits.consumeRateLimits(check, 0)).toBeNull();
    expect(limits.consumeRateLimits(check, 0)).toBeNull();
    expect(limits.consumeRateLimits(check, 400)).toBe(1);
  });

  it("starts again once the window has passed, and a blocked attempt does not extend it", () => {
    limits.consumeRateLimits(check, 0);
    limits.consumeRateLimits(check, 0);
    limits.consumeRateLimits(check, 900);
    expect(limits.consumeRateLimits(check, 1001)).toBeNull();
  });

  it("keeps subjects and rules apart", () => {
    limits.consumeRateLimits(check, 0);
    limits.consumeRateLimits(check, 0);
    expect(limits.consumeRateLimits([{ rule, subject: "b" }], 0)).toBeNull();
    expect(limits.consumeRateLimits([{ rule: { ...rule, name: "u" }, subject: "a" }], 0)).toBeNull();
  });

  it("counts against nothing if any check is used up", () => {
    const other = { rule: { name: "v", max: 1, windowMs: 1000 }, subject: "a" };
    limits.consumeRateLimits([other], 0);
    expect(limits.consumeRateLimits([{ rule, subject: "c" }, other], 0)).toBe(1);
    expect(limits.consumeRateLimits([{ rule, subject: "c" }], 0)).toBeNull();
    expect(limits.consumeRateLimits([{ rule, subject: "c" }], 0)).toBeNull();
  });

  it("stores neither the email nor the address", () => {
    limits.consumeRateLimits([{ rule, subject: "person@example.com|1.2.3.4" }], 0);
    const stored = JSON.stringify(db.select().from(schema.rateLimits).all());
    expect(stored).not.toContain("person@example.com");
    expect(stored).not.toContain("1.2.3.4");
  });
});

describe("clientIp", () => {
  it("cannot be chosen by the caller through X-Forwarded-For", () => {
    const request = new NextRequest("http://test/", {
      headers: { "fly-client-ip": "9.9.9.9", "x-forwarded-for": "6.6.6.6" },
    });
    expect(limits.clientIp(request)).toBe("9.9.9.9");
    expect(limits.clientIp(new NextRequest("http://test/", { headers: { "x-forwarded-for": "6.6.6.6" } }))).toBe("unknown");
  });
});

describe("signing in", () => {
  it("blocks a sixth guess, even a correct one, and says when to come back", async () => {
    for (let i = 0; i < 5; i++) expect((await attempt("wrong")).status).toBe(401);
    const blocked = await attempt(PASSWORD);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect((await blocked.json()).error).toMatch(/Try again in \d+ minutes?/);
  }, 20000);

  it("a parallel burst cannot get more than the limit checked", async () => {
    const results = await Promise.all(Array.from({ length: 12 }, () => attempt("wrong")));
    expect(results.filter((r) => r.status === 401)).toHaveLength(5);
    expect(results.filter((r) => r.status === 429)).toHaveLength(7);
  }, 20000);

  it("a correct password gives the attempt back, so the real person is not counted", async () => {
    for (let i = 0; i < 8; i++) expect((await attempt(PASSWORD)).status).toBe(200);
  }, 20000);

  it("spoofing X-Forwarded-For does not buy more guesses", async () => {
    for (let i = 0; i < 5; i++) await attempt("wrong", "1.1.1.1", EMAIL, { "x-forwarded-for": `7.7.7.${i}` });
    expect((await attempt("wrong", "1.1.1.1", EMAIL, { "x-forwarded-for": "8.8.8.8" })).status).toBe(429);
  }, 20000);

  it("the email's case does not buy more guesses", async () => {
    for (let i = 0; i < 5; i++) await attempt("wrong", "1.1.1.1", i % 2 ? EMAIL.toUpperCase() : EMAIL);
    expect((await attempt("wrong")).status).toBe(429);
  }, 20000);

  it("another person elsewhere is not blocked by someone guessing from one address", async () => {
    for (let i = 0; i < 5; i++) await attempt("wrong");
    expect((await attempt(PASSWORD, "2.2.2.2")).status).toBe(200);
  }, 20000);

  it("one account cannot be guessed from many addresses", async () => {
    for (let i = 0; i < 20; i++) await attempt("wrong", `3.3.3.${i}`);
    expect((await attempt("wrong", "4.4.4.4")).status).toBe(429);
  }, 30000);

  it("one address cannot try many accounts", async () => {
    for (let i = 0; i < 30; i++) await attempt("wrong", "5.5.5.5", `user${i}@example.com`);
    expect((await attempt("wrong", "5.5.5.5", "another@example.com")).status).toBe(429);
  }, 30000);

  it("treats an unknown email exactly as a wrong password", async () => {
    const unknown = await attempt("wrong", "6.6.6.6", "nobody@example.com");
    const wrong = await attempt("wrong", "6.6.6.7");
    expect(unknown.status).toBe(wrong.status);
    expect(await unknown.json()).toEqual(await wrong.json());
  }, 20000);

  it("takes as long for an unknown email as for a wrong password", async () => {
    const timed = async (email: string, ip: string) => {
      const start = performance.now();
      await attempt("wrong", ip, email);
      return performance.now() - start;
    };
    await timed(EMAIL, "6.6.6.8");
    const known = await timed(EMAIL, "6.6.6.9");
    const unknown = await timed("nobody@example.com", "6.6.6.10");
    expect(unknown).toBeGreaterThan(known / 3);
  }, 20000);
});

describe("registering and the contact form", () => {
  const signUp = (i: number, ip = "1.1.1.1") =>
    register(req("/api/auth/register", { email: `new${i}${ip}@example.com`, password: "long-enough" }, { "fly-client-ip": ip }));

  it("limits sign-ups per address", async () => {
    for (let i = 0; i < 10; i++) expect((await signUp(i)).status).toBeLessThan(300);
    expect((await signUp(11)).status).toBe(429);
    expect((await signUp(12, "2.2.2.2")).status).toBeLessThan(300);
  }, 30000);

  it("the contact form cannot be spammed by changing X-Forwarded-For", async () => {
    const send = (i: number) =>
      contact(req("/api/contact", { name: "A Person", email: "a@example.com", category: "feature", message: "A message that is plainly long enough to pass validation." }, { "fly-client-ip": "1.1.1.1", "x-forwarded-for": `7.7.7.${i}` }));
    for (let i = 0; i < 3; i++) expect((await send(i)).status).not.toBe(429);
    expect((await send(4)).status).toBe(429);
  }, 20000);
});
