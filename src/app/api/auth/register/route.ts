import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createToken, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const { email, password, nickname, anonymousUserId } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // If upgrading from anonymous, update existing user
  if (anonymousUserId) {
    const anonUser = await db
      .select()
      .from(users)
      .where(eq(users.id, anonymousUserId))
      .get();

    if (anonUser && anonUser.isAnonymous) {
      await db
        .update(users)
        .set({
          email,
          passwordHash,
          nickname: nickname || anonUser.nickname,
          isAnonymous: false,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, anonymousUserId));

      const token = await createToken(anonymousUserId);
      await setSessionCookie(token);

      return NextResponse.json({
        user: {
          id: anonymousUserId,
          email,
          nickname: nickname || anonUser.nickname,
          isAnonymous: false,
        },
      });
    }
  }

  // Create new registered user
  const userId = nanoid();
  await db.insert(users).values({
    id: userId,
    email,
    passwordHash,
    nickname: nickname || `Player_${userId.slice(0, 6)}`,
    isAnonymous: false,
  });

  const token = await createToken(userId);
  await setSessionCookie(token);

  return NextResponse.json({
    user: {
      id: userId,
      email,
      nickname: nickname || `Player_${userId.slice(0, 6)}`,
      isAnonymous: false,
    },
  });
}
