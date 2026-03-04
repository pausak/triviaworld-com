import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "triviaworld.db");

let sqlite: Database.Database | null = null;

function getDatabase() {
  if (!sqlite) {
    sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
  }
  return sqlite;
}

export const db = drizzle(getDatabase(), { schema });
export { schema };
