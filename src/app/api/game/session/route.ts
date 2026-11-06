import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gameSessions, users } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/db/users";
import { getSessionUser } from "@/lib/auth";
import { isGameMode } from "@/lib/gameRules";
import { difficultyFromParam } from "@/lib/deepLink";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const USER_ID_FORMAT = /^[\w-]{10,40}$/;

// Who is playing: a signed-in player is who their session says. Anyone else may use
// the anonymous id their browser holds, but never a registered account's id, so a
// score cannot be credited to someone by naming them.
async function resolvePlayer(claimedId: unknown) {
  const signedIn = await getSessionUser();
  if (signedIn) {
    const user = await db.select().from(users).where(eq(users.id, signedIn)).get();
    if (user) return user;
  }
  if (typeof claimedId !== "string" || !USER_ID_FORMAT.test(claimedId)) {
    return getOrCreateUser(nanoid());
  }
  const claimed = await getOrCreateUser(claimedId);
  return claimed.isAnonymous ? claimed : getOrCreateUser(nanoid());
}

export async function POST(request: NextRequest) {
  const { userId, mode, category, difficulty } = await request.json();

  if (!isGameMode(mode)) {
    return NextResponse.json({ error: "mode is required" }, { status: 400 });
  }

  const user = await resolvePlayer(userId);
  const sessionId = nanoid();

  await db.insert(gameSessions).values({
    id: sessionId,
    userId: user.id,
    mode,
    category: typeof category === "string" ? category.slice(0, 60) : null,
    difficulty: typeof difficulty === "string" ? difficultyFromParam(difficulty) : null,
    status: "active",
  });

  return NextResponse.json({
    sessionId,
    userId: user.id,
    nickname: user.nickname,
  });
}
