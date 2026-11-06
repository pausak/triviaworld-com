import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createToken, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { clientIp, consumeRateLimits, RATE_RULES, refundRateLimits, tooManyAttempts } from "@/lib/rateLimit";

// Compared against when the email is unknown, so that an unknown email takes as long
// as a wrong password and the time taken does not reveal who has an account.
const NO_SUCH_USER_HASH = bcrypt.hash(randomBytes(16).toString("hex"), 10);

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }
  if (email.length > 254) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Counted before the password is checked, so parallel guesses cannot all get through.
  const ip = clientIp(request);
  const account = email.trim().toLowerCase();
  const fromHere = { rule: RATE_RULES.loginAccountFromIp, subject: `${account}|${ip}` };
  const attempts = [
    fromHere,
    { rule: RATE_RULES.loginAccount, subject: account },
    { rule: RATE_RULES.loginIp, subject: ip },
  ];
  const retryAfter = consumeRateLimits(attempts);
  if (retryAfter !== null) return tooManyAttempts(retryAfter);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  const valid = await bcrypt.compare(password, user?.passwordHash ?? (await NO_SUCH_USER_HASH));
  if (!user || !user.passwordHash || !valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // The real person: this attempt was not a guess.
  refundRateLimits(attempts);

  const token = await createToken(user.id);
  await setSessionCookie(token);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      isAnonymous: false,
    },
  });
}
