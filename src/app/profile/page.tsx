"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

interface ProfileStats {
  totalGames: number;
  totalScore: number;
  avgAccuracy: number;
  modeBreakdown: Record<string, number>;
  recentGames: Array<{
    mode: string;
    score: number;
    accuracy: number;
    category: string | null;
    date: string | null;
  }>;
}

interface CategoryStat {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  gamesPlayed: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  const userId =
    user?.id ||
    (typeof window !== "undefined"
      ? localStorage.getItem("triviaworld_user_id")
      : null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`/api/profile/stats?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--secondary)] rounded" />
          <div className="h-32 bg-[var(--secondary)] rounded-xl" />
          <div className="h-48 bg-[var(--secondary)] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-[var(--muted)]">Play a game to start tracking your stats!</p>
        <Link
          href="/play"
          className="inline-block px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
        >
          Play Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user?.nickname || "Player"}</h1>
          <p className="text-sm text-[var(--muted)]">
            {user?.isAnonymous === false ? user.email : "Anonymous Player"}
          </p>
        </div>
        {(!user || user.isAnonymous) && (
          <div className="flex gap-2 shrink-0">
            <Link
              href="/auth?mode=login"
              className="px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-sm font-medium hover:border-[var(--primary)] transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="px-3 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Stats overview */}
      {stats && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
              <p className="text-2xl font-bold">{stats.totalGames}</p>
              <p className="text-xs text-[var(--muted)]">Games Played</p>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
              <p className="text-2xl font-bold">{stats.totalScore.toLocaleString()}</p>
              <p className="text-xs text-[var(--muted)]">Total Score</p>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
              <p className="text-2xl font-bold">
                {Math.round(stats.avgAccuracy * 100)}%
              </p>
              <p className="text-xs text-[var(--muted)]">Avg Accuracy</p>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-4 text-center border border-[var(--card-border)]">
              <p className="text-2xl font-bold">{user?.currentStreak || 0}</p>
              <p className="text-xs text-[var(--muted)]">Day Streak</p>
            </div>
          </div>

          {/* Mode breakdown */}
          <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--card-border)]">
            <h3 className="font-medium mb-3">Games by Mode</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(stats.modeBreakdown).map(([mode, count]) => (
                <div key={mode} className="text-center">
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-xs text-[var(--muted)] capitalize">{mode}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category mastery */}
          {categories.length > 0 && (
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--card-border)]">
              <h3 className="font-medium mb-3">Category Mastery</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cat.category}</span>
                      <span className="text-[var(--muted)]">
                        {Math.round(cat.accuracy * 100)}% ({cat.correctAnswers}/
                        {cat.totalQuestions})
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all"
                        style={{ width: `${Math.round(cat.accuracy * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent games */}
          {stats.recentGames.length > 0 && (
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--card-border)]">
              <h3 className="font-medium mb-3">Recent Games</h3>
              <div className="space-y-2">
                {stats.recentGames.map((game, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0"
                  >
                    <div>
                      <span className="text-sm font-medium capitalize">
                        {game.mode}
                      </span>
                      {game.category && (
                        <span className="text-xs text-[var(--muted)] ml-2">
                          {game.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{game.score}</span>
                      <span className="text-xs text-[var(--muted)] ml-2">
                        {Math.round(game.accuracy * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
