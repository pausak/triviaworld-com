import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const DEV_SECRET = "triviaworld-dev-secret-change-in-production";

// Read when used, not on import: next build loads this file with no secret set.
// In production a missing secret stops sign-in rather than signing with a value
// anyone can read in this public repository.
function jwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret === DEV_SECRET)) {
    throw new Error("JWT_SECRET must be set in production");
  }
  return new TextEncoder().encode(secret || DEV_SECRET);
}

const COOKIE_NAME = "tw_session";

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(jwtSecret());
}

export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const result = await verifyToken(token);
  return result?.userId || null;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}
