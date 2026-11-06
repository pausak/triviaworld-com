import { createHash } from "node:crypto";
import { eq, lt, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";

// Kept in SQLite on the volume, because the machine stops when idle: limits held in
// memory would reset whenever an attacker paused long enough for it to sleep.
// Keys are hashed, so no email address or IP address is stored here.

const MINUTE = 60 * 1000;

export interface RateRule {
  name: string;
  max: number;
  windowMs: number;
}

export const RATE_RULES = {
  // Guessing one account from one place.
  loginAccountFromIp: { name: "login-account-ip", max: 5, windowMs: 15 * MINUTE },
  // Guessing one account from many places. This one can lock the real owner out for
  // the rest of the window, which is the price of stopping distributed guessing.
  loginAccount: { name: "login-account", max: 20, windowMs: 15 * MINUTE },
  // Trying many accounts from one place.
  loginIp: { name: "login-ip", max: 30, windowMs: 15 * MINUTE },
  register: { name: "register-ip", max: 10, windowMs: 60 * MINUTE },
  contact: { name: "contact-ip", max: 3, windowMs: 10 * MINUTE },
} satisfies Record<string, RateRule>;

export type RateCheck = { rule: RateRule; subject: string };

/**
 * Who is calling. Fly sets Fly-Client-IP itself and overwrites what a client sends.
 * X-Forwarded-For is not used: a client can put anything at the front of it.
 */
export function clientIp(request: NextRequest): string {
  return request.headers.get("fly-client-ip") ?? "unknown";
}

function storageKey({ rule, subject }: RateCheck): string {
  return createHash("sha256").update(`${rule.name}:${subject}`).digest("hex");
}

/**
 * Counts one attempt against every check, or none if any is used up, and returns the
 * seconds to wait in that case. Deliberately not async: better-sqlite3 is synchronous,
 * so no other request can run between the read and the write, and a burst of parallel
 * attempts cannot all pass. Blocked attempts do not extend the window.
 */
export function consumeRateLimits(checks: RateCheck[], now = Date.now()): number | null {
  db.delete(rateLimits).where(lt(rateLimits.expiresAt, now)).run();

  let retryAfterMs = 0;
  for (const check of checks) {
    const row = db.select().from(rateLimits).where(eq(rateLimits.key, storageKey(check))).get();
    if (row && row.expiresAt >= now && row.count >= check.rule.max) {
      retryAfterMs = Math.max(retryAfterMs, row.expiresAt - now);
    }
  }
  if (retryAfterMs > 0) return Math.ceil(retryAfterMs / 1000);

  for (const check of checks) {
    db.insert(rateLimits)
      .values({ key: storageKey(check), count: 1, expiresAt: now + check.rule.windowMs })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: { count: sql`${rateLimits.count} + 1` },
      })
      .run();
  }
  return null;
}

/** Gives an attempt back, for one that turned out to be the real person. */
export function refundRateLimits(checks: RateCheck[]) {
  for (const check of checks) {
    db.update(rateLimits)
      .set({ count: sql`max(${rateLimits.count} - 1, 0)` })
      .where(eq(rateLimits.key, storageKey(check)))
      .run();
  }
}

export function tooManyAttempts(retryAfterSeconds: number) {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return NextResponse.json(
    { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
