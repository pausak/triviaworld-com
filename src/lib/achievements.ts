import { db } from "./db";
import { achievements, userAchievements, gameSessions, users } from "./db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: { type: string; value: number; mode?: string };
  points: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Gameplay
  { id: "first_steps", name: "First Steps", description: "Complete your first game", icon: "🎮", category: "gameplay", requirement: { type: "games_played", value: 1 }, points: 10 },
  { id: "getting_started", name: "Getting Started", description: "Complete 5 games", icon: "🌟", category: "gameplay", requirement: { type: "games_played", value: 5 }, points: 20 },
  { id: "veteran", name: "Veteran Player", description: "Complete 25 games", icon: "🏅", category: "gameplay", requirement: { type: "games_played", value: 25 }, points: 50 },
  { id: "centurion", name: "Centurion", description: "Complete 100 games", icon: "💯", category: "gameplay", requirement: { type: "games_played", value: 100 }, points: 100 },

  // Mastery
  { id: "perfect_10", name: "Perfect 10", description: "Get 100% accuracy in a Quick Play game", icon: "🎯", category: "mastery", requirement: { type: "perfect_game", value: 1, mode: "quick" }, points: 30 },
  { id: "sharp_mind", name: "Sharp Mind", description: "Get 80%+ accuracy in 5 consecutive games", icon: "🧠", category: "mastery", requirement: { type: "consecutive_accuracy", value: 5 }, points: 40 },
  { id: "speed_demon", name: "Speed Demon", description: "Average under 5 seconds per question in a game", icon: "⚡", category: "mastery", requirement: { type: "avg_time_under", value: 5000 }, points: 25 },
  { id: "hard_mode", name: "Hard Mode Hero", description: "Complete a Hard difficulty game with 70%+ accuracy", icon: "💪", category: "mastery", requirement: { type: "hard_accuracy", value: 70 }, points: 35 },

  // Streak
  { id: "on_fire", name: "On Fire", description: "Get a 5-question answer streak", icon: "🔥", category: "streak", requirement: { type: "answer_streak", value: 5 }, points: 15 },
  { id: "unstoppable", name: "Unstoppable", description: "Get a 10-question answer streak", icon: "🌊", category: "streak", requirement: { type: "answer_streak", value: 10 }, points: 30 },
  { id: "streak_master", name: "Streak Master", description: "Maintain a 3-day play streak", icon: "📆", category: "streak", requirement: { type: "day_streak", value: 3 }, points: 20 },
  { id: "daily_devotee", name: "Daily Devotee", description: "Maintain a 7-day play streak", icon: "🗓️", category: "streak", requirement: { type: "day_streak", value: 7 }, points: 50 },

  // Mode-specific
  { id: "daily_first", name: "Daily Player", description: "Complete your first Daily Challenge", icon: "📅", category: "gameplay", requirement: { type: "mode_games", value: 1, mode: "daily" }, points: 10 },
  { id: "marathon_runner", name: "Marathon Runner", description: "Complete a Category Marathon", icon: "🏃", category: "gameplay", requirement: { type: "mode_games", value: 1, mode: "marathon" }, points: 15 },
  { id: "survivor", name: "Survivor", description: "Score 500+ points in Survival mode", icon: "💀", category: "gameplay", requirement: { type: "survival_score", value: 500 }, points: 20 },
  { id: "iron_will", name: "Iron Will", description: "Answer 20+ questions in Survival without losing a life", icon: "🛡️", category: "mastery", requirement: { type: "survival_streak", value: 20 }, points: 50 },

  // Score milestones
  { id: "score_1k", name: "Rising Star", description: "Reach 1,000 total score", icon: "⭐", category: "gameplay", requirement: { type: "total_score", value: 1000 }, points: 15 },
  { id: "score_10k", name: "Trivia Champion", description: "Reach 10,000 total score", icon: "🏆", category: "gameplay", requirement: { type: "total_score", value: 10000 }, points: 50 },
];

export async function seedAchievements() {
  for (const a of ACHIEVEMENTS) {
    const existing = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, a.id))
      .get();

    if (!existing) {
      await db.insert(achievements).values({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        requirement: a.requirement as { type: string; value: number; mode?: string; category?: string },
        points: a.points,
      });
    }
  }
}

export async function checkAchievements(
  userId: string,
  sessionData: {
    mode: string;
    score: number;
    accuracy: number;
    streak: number;
    avgTime: number;
    difficulty?: string | null;
  }
): Promise<AchievementDef[]> {
  // Get already earned
  const earned = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))
    .all();
  const earnedIds = new Set(earned.map((e) => e.achievementId));

  // Get user stats
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return [];

  const allSessions = await db
    .select()
    .from(gameSessions)
    .where(and(eq(gameSessions.userId, userId), eq(gameSessions.status, "completed")))
    .all();

  const totalScore = allSessions.reduce((sum, s) => sum + s.score, 0);
  const newlyEarned: AchievementDef[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (earnedIds.has(achievement.id)) continue;

    let unlocked = false;
    const req = achievement.requirement;

    switch (req.type) {
      case "games_played":
        unlocked = user.gamesPlayed >= req.value;
        break;
      case "perfect_game":
        unlocked = sessionData.accuracy === 1 && (!req.mode || sessionData.mode === req.mode);
        break;
      case "avg_time_under":
        unlocked = sessionData.avgTime > 0 && sessionData.avgTime < req.value;
        break;
      case "hard_accuracy":
        unlocked = sessionData.difficulty === "hard" && sessionData.accuracy * 100 >= req.value;
        break;
      case "answer_streak":
        unlocked = sessionData.streak >= req.value;
        break;
      case "day_streak":
        unlocked = user.currentStreak >= req.value;
        break;
      case "mode_games": {
        const modeCount = allSessions.filter((s) => s.mode === req.mode).length;
        unlocked = modeCount >= req.value;
        break;
      }
      case "survival_score":
        unlocked = sessionData.mode === "survival" && sessionData.score >= req.value;
        break;
      case "survival_streak":
        unlocked = sessionData.mode === "survival" && sessionData.streak >= req.value;
        break;
      case "total_score":
        unlocked = totalScore >= req.value;
        break;
      case "consecutive_accuracy": {
        const recent = allSessions.slice(-req.value);
        unlocked = recent.length >= req.value && recent.every((s) => s.accuracy >= 0.8);
        break;
      }
    }

    if (unlocked) {
      await db.insert(userAchievements).values({
        id: nanoid(),
        userId,
        achievementId: achievement.id,
      });
      newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
}
