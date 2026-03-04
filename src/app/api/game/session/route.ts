import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gameSessions } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/db/users";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, mode, category, difficulty } = body;

  if (!mode) {
    return NextResponse.json({ error: "mode is required" }, { status: 400 });
  }

  const user = await getOrCreateUser(userId);
  const sessionId = nanoid();

  await db.insert(gameSessions).values({
    id: sessionId,
    userId: user.id,
    mode,
    category: category || null,
    difficulty: difficulty || null,
    status: "active",
  });

  return NextResponse.json({
    sessionId,
    userId: user.id,
    nickname: user.nickname,
  });
}
