"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useAchievementToast } from "@/hooks/useAchievementToast";
import { shareResults } from "@/lib/shareResults";
import Link from "next/link";

export function GameResults() {
  const result = useGameStore((s) => s.result);
  const resetGame = useGameStore((s) => s.resetGame);
  const { newAchievements } = useAchievementToast();
  const [shared, setShared] = useState(false);

  // Trigger confetti on high scores
  useEffect(() => {
    if (result && result.accuracy >= 0.8) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    }
  }, [result]);

  if (!result) return null;

  const accuracyPercent = Math.round(result.accuracy * 100);
  const avgTimeSec = (result.avgTime / 1000).toFixed(1);

  const grade =
    accuracyPercent >= 90
      ? { label: "Outstanding!", color: "text-[var(--success)]" }
      : accuracyPercent >= 70
      ? { label: "Great Job!", color: "text-[var(--primary)]" }
      : accuracyPercent >= 50
      ? { label: "Not Bad!", color: "text-[var(--warning)]" }
      : { label: "Keep Trying!", color: "text-[var(--danger)]" };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className={`text-3xl font-bold ${grade.color}`}>{grade.label}</h2>
        <p className="text-5xl font-bold">{result.score}</p>
        <p className="text-[var(--muted)]">points</p>
      </div>

      {/* New achievements */}
      {newAchievements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--primary)]">
            Achievements Unlocked!
          </h3>
          {newAchievements.map((a) => (
            <div
              key={a.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 animate-fade-in"
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="font-medium text-sm">{a.name}</p>
                <p className="text-xs text-[var(--muted)]">{a.description}</p>
              </div>
              <span className="ml-auto text-xs text-[var(--primary)]">
                +{a.points} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
          <p className="text-2xl font-bold">{accuracyPercent}%</p>
          <p className="text-xs text-[var(--muted)]">Accuracy</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
          <p className="text-2xl font-bold">
            {result.correctCount}/{result.totalQuestions}
          </p>
          <p className="text-xs text-[var(--muted)]">Correct</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
          <p className="text-2xl font-bold">{avgTimeSec}s</p>
          <p className="text-xs text-[var(--muted)]">Avg Time</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
          <p className="text-2xl font-bold capitalize">{result.mode}</p>
          <p className="text-xs text-[var(--muted)]">Mode</p>
        </div>
      </div>

      {/* Answer breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[var(--muted)]">
          Question Breakdown
        </h3>
        <div className="space-y-1">
          {result.answers.map((a, i) => (
            <div
              key={a.questionId}
              className="flex items-center gap-2 text-sm py-1"
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  a.isCorrect
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {a.isCorrect ? "✓" : "✗"}
              </span>
              <span className="text-[var(--muted)]">Q{i + 1}</span>
              <span className="flex-1 text-right font-mono text-xs">
                {a.points > 0 ? `+${a.points}` : "0"} pts
              </span>
              <span className="text-xs text-[var(--muted)] w-12 text-right">
                {(a.timeSpent / 1000).toFixed(1)}s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={resetGame}
          className="flex-1 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={async () => {
            const success = await shareResults(result);
            if (success) setShared(true);
            setTimeout(() => setShared(false), 2000);
          }}
          className="flex-1 py-3 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] font-medium hover:opacity-80 transition-opacity"
        >
          {shared ? "Copied!" : "Share Results"}
        </button>
      </div>
      <div className="text-center">
        <Link
          href="/leaderboard"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
