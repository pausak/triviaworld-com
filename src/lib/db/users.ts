import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function getOrCreateUser(userId?: string) {
  if (userId) {
    const existing = await db.select().from(users).where(eq(users.id, userId)).get();
    if (existing) return existing;
  }

  const id = userId || nanoid();
  const nickname = `Player_${id.slice(0, 6)}`;

  await db.insert(users).values({
    id,
    nickname,
    isAnonymous: true,
  });

  return db.select().from(users).where(eq(users.id, id)).get()!;
}

export async function updateNickname(userId: string, nickname: string) {
  await db
    .update(users)
    .set({ nickname, updatedAt: new Date().toISOString() })
    .where(eq(users.id, userId));
}

export async function incrementGamesPlayed(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return;

  await db
    .update(users)
    .set({
      gamesPlayed: user.gamesPlayed + 1,
      lastPlayedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, userId));
}
