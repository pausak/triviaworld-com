import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Use persistent volume in production (/data on Fly.io), fallback to cwd for local dev
const dataDir = process.env.NODE_ENV === "production" && fs.existsSync("/data")
  ? "/data"
  : process.cwd();
const dbPath = path.join(dataDir, "triviaworld.db");

let sqlite: Database.Database | null = null;

function getDatabase() {
  if (!sqlite) {
    sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    ensureSchema(sqlite);
  }
  return sqlite;
}

function ensureSchema(db: Database.Database) {
  // Check if tables exist; if not, create them
  const tableExists = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
  ).get();
  if (tableExists) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      nickname TEXT NOT NULL,
      is_anonymous INTEGER NOT NULL DEFAULT 1,
      games_played INTEGER NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_played_at TEXT,
      preferences TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      mode TEXT NOT NULL,
      category TEXT,
      difficulty TEXT,
      score INTEGER NOT NULL DEFAULT 0,
      max_score INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0,
      avg_time REAL NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      started_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES game_sessions(id),
      question_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      selected_answer TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      time_spent INTEGER NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_challenges (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      questions_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leaderboard_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      session_id TEXT NOT NULL REFERENCES game_sessions(id),
      nickname TEXT NOT NULL,
      mode TEXT NOT NULL,
      score INTEGER NOT NULL,
      accuracy REAL NOT NULL,
      correct_count INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      category TEXT,
      difficulty TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      category TEXT NOT NULL,
      requirement TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 10
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      achievement_id TEXT NOT NULL REFERENCES achievements(id),
      unlocked_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS category_stats (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      category TEXT NOT NULL,
      total_questions INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      games_played INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );
  `);
}

export const db = drizzle(getDatabase(), { schema });
export { schema };
