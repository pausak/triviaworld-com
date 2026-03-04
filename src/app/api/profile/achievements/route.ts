import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { achievements, userAchievements } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const allAchievements = await db.select().from(achievements).all();

  const earned = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))
    .all();

  const earnedIds = new Set(earned.map((e) => e.achievementId));

  const result = allAchievements.map((a) => ({
    ...a,
    unlocked: earnedIds.has(a.id),
    unlockedAt: earned.find((e) => e.achievementId === a.id)?.unlockedAt,
  }));

  return NextResponse.json({ achievements: result });
}
