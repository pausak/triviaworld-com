"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useGameStore } from "@/stores/gameStore";
import { useAuth } from "./AuthContext";

export function Navbar() {
  const score = useGameStore((s) => s.score);
  const status = useGameStore((s) => s.status);
  const streak = useGameStore((s) => s.streak);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--card-border)]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-[var(--primary)]">Trivia</span>World
        </Link>

        <div className="flex items-center gap-4">
          {(status === "playing" || status === "reviewing") && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-mono font-semibold">{score} pts</span>
              {streak > 1 && (
                <span className="text-[var(--warning)] font-semibold">
                  {streak}x streak
                </span>
              )}
            </div>
          )}
          <Link
            href="/leaderboard"
            className="text-sm hover:text-[var(--primary)] transition-colors hidden sm:block"
          >
            Leaderboard
          </Link>
          <Link
            href="/achievements"
            className="text-sm hover:text-[var(--primary)] transition-colors hidden sm:block"
          >
            Achievements
          </Link>
          <Link
            href="/profile"
            className="text-sm hover:text-[var(--primary)] transition-colors hidden sm:block"
          >
            {user && !user.isAnonymous ? user.nickname : "Profile"}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
