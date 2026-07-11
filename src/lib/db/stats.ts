import { db } from "./index";
import { users, gameSessions, questions, leaderboardEntries } from "./schema";
import { sql, eq } from "drizzle-orm";

export interface PlatformStats {
  users: { total: number; registered: number; anonymous: number };
  games: { total: number; byMode: Record<string, number> };
  questionsBanked: number;
  // Distinct players who have a leaderboard entry — the CORRECT way to count
  // "players on the board", vs the raw per-game row count for comparison.
  leaderboard: { distinctPlayers: number; totalRows: number };
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const totalUsers =
    (await db.select({ n: sql<number>`count(*)` }).from(users).get())?.n ?? 0;
  const registered =
    (await db
      .select({ n: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isAnonymous, false))
      .get())?.n ?? 0;

  const totalGames =
    (await db
      .select({ n: sql<number>`count(*)` })
      .from(gameSessions)
      .where(eq(gameSessions.status, "completed"))
      .get())?.n ?? 0;
  const byModeRows = await db
    .select({ mode: gameSessions.mode, n: sql<number>`count(*)` })
    .from(gameSessions)
    .where(eq(gameSessions.status, "completed"))
    .groupBy(gameSessions.mode)
    .all();

  const questionsBanked =
    (await db.select({ n: sql<number>`count(*)` }).from(questions).get())?.n ?? 0;

  const distinctPlayers =
    (await db
      .select({ n: sql<number>`count(distinct ${leaderboardEntries.userId})` })
      .from(leaderboardEntries)
      .get())?.n ?? 0;
  const leaderboardRows =
    (await db
      .select({ n: sql<number>`count(*)` })
      .from(leaderboardEntries)
      .get())?.n ?? 0;

  return {
    users: {
      total: totalUsers,
      registered,
      anonymous: totalUsers - registered,
    },
    games: {
      total: totalGames,
      byMode: Object.fromEntries(byModeRows.map((r) => [r.mode, r.n])),
    },
    questionsBanked,
    leaderboard: { distinctPlayers, totalRows: leaderboardRows },
  };
}
