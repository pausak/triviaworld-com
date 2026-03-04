import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // nanoid
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  nickname: text("nickname").notNull(),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }).notNull().default(true),
  gamesPlayed: integer("games_played").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastPlayedAt: text("last_played_at"),
  preferences: text("preferences", { mode: "json" }).$type<{
    soundEnabled?: boolean;
    theme?: string;
  }>(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const gameSessions = sqliteTable("game_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  mode: text("mode").notNull(), // quick | daily | marathon | survival
  category: text("category"),
  difficulty: text("difficulty"),
  score: integer("score").notNull().default(0),
  maxScore: integer("max_score").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  accuracy: real("accuracy").notNull().default(0),
  avgTime: real("avg_time").notNull().default(0), // ms
  streak: integer("streak").notNull().default(0), // max streak in session
  status: text("status").notNull().default("active"), // active | completed | abandoned
  startedAt: text("started_at").notNull().$defaultFn(() => new Date().toISOString()),
  completedAt: text("completed_at"),
});

export const answers = sqliteTable("answers", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => gameSessions.id),
  questionId: text("question_id").notNull(),
  questionText: text("question_text").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  selectedAnswer: text("selected_answer").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  timeSpent: integer("time_spent").notNull(), // ms
  points: integer("points").notNull().default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const dailyChallenges = sqliteTable("daily_challenges", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  questionsJson: text("questions_json", { mode: "json" }).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const leaderboardEntries = sqliteTable("leaderboard_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull().references(() => gameSessions.id),
  nickname: text("nickname").notNull(),
  mode: text("mode").notNull(),
  score: integer("score").notNull(),
  accuracy: real("accuracy").notNull(),
  correctCount: integer("correct_count").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  category: text("category"),
  difficulty: text("difficulty"),
  date: text("date").notNull(), // YYYY-MM-DD for daily filtering
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // gameplay | mastery | social | streak
  requirement: text("requirement", { mode: "json" }).notNull().$type<{
    type: string;
    value: number;
    mode?: string;
    category?: string;
  }>(),
  points: integer("points").notNull().default(10),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  achievementId: text("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: text("unlocked_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const categoryStats = sqliteTable("category_stats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  totalQuestions: integer("total_questions").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  accuracy: real("accuracy").notNull().default(0),
  bestScore: integer("best_score").notNull().default(0),
  gamesPlayed: integer("games_played").notNull().default(0),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});
