import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUser();

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = await db
    .select({
      id: users.id,
      email: users.email,
      nickname: users.nickname,
      isAnonymous: users.isAnonymous,
      gamesPlayed: users.gamesPlayed,
      currentStreak: users.currentStreak,
      longestStreak: users.longestStreak,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  return NextResponse.json({ user: user || null });
}
