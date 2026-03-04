"use client";

import { useState, useEffect } from "react";
import type { LeaderboardEntry, GameMode } from "@/types/trivia";

const modes: { value: GameMode; label: string }[] = [
  { value: "quick", label: "Quick Play" },
  { value: "daily", label: "Daily" },
  { value: "marathon", label: "Marathon" },
  { value: "survival", label: "Survival" },
];

const timeframes = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<GameMode>("quick");
  const [timeframe, setTimeframe] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?mode=${mode}&timeframe=${timeframe}`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mode, timeframe]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Leaderboard</h1>

      {/* Mode tabs */}
      <div className="flex gap-1 bg-[var(--secondary)] p-1 rounded-lg">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === m.value
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timeframe filter */}
      <div className="flex gap-2">
        {timeframes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTimeframe(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              timeframe === t.value
                ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Leaderboard table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-[var(--secondary)] animate-pulse"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">
          <p className="text-lg">No entries yet</p>
          <p className="text-sm mt-1">Be the first to play and set a record!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                i < 3
                  ? "bg-[var(--card)] border-[var(--primary)]/30"
                  : "bg-[var(--card)] border-[var(--card-border)]"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0
                    ? "bg-yellow-500/20 text-yellow-500"
                    : i === 1
                    ? "bg-gray-400/20 text-gray-400"
                    : i === 2
                    ? "bg-amber-700/20 text-amber-700"
                    : "bg-[var(--secondary)] text-[var(--muted)]"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{entry.nickname}</p>
                <p className="text-xs text-[var(--muted)]">
                  {Math.round(entry.accuracy * 100)}% accuracy
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{entry.score}</p>
                <p className="text-xs text-[var(--muted)]">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
