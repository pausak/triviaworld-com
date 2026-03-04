"use client";

import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
}

const categoryLabels: Record<string, string> = {
  gameplay: "Gameplay",
  mastery: "Mastery",
  streak: "Streaks",
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const userId = localStorage.getItem("triviaworld_user_id");
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`/api/profile/achievements?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setAchievements(data.achievements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? achievements
      : filter === "unlocked"
      ? achievements.filter((a) => a.unlocked)
      : achievements.filter((a) => a.category === filter);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 bg-[var(--secondary)] rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--secondary)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <div className="text-right">
          <p className="text-sm text-[var(--muted)]">
            {unlockedCount}/{achievements.length} unlocked
          </p>
          <p className="text-xs text-[var(--primary)]">{totalPoints} points</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-[var(--secondary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--primary)] rounded-full transition-all"
          style={{
            width: `${
              achievements.length > 0
                ? (unlockedCount / achievements.length) * 100
                : 0
            }%`,
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "unlocked", "gameplay", "mastery", "streak"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === f
                ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {f === "all" ? "All" : categoryLabels[f] || f}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">
          <p>No achievements to show. Play some games to start earning!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-xl border transition-all ${
                a.unlocked
                  ? "bg-[var(--card)] border-[var(--primary)]/30"
                  : "bg-[var(--secondary)]/50 border-[var(--card-border)] opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-[var(--muted)]">{a.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--primary)]">
                      {a.points} pts
                    </span>
                    {a.unlocked && a.unlockedAt && (
                      <span className="text-xs text-[var(--success)]">
                        Unlocked{" "}
                        {new Date(a.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {a.unlocked && (
                  <span className="text-[var(--success)] text-lg">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
