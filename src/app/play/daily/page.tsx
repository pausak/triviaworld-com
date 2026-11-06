"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { QuestionCard } from "@/components/QuestionCard";
import { GameResults } from "@/components/GameResults";
import { nanoid } from "nanoid";
import { GAME_RULES } from "@/lib/gameRules";

export default function DailyChallengePage() {
  const status = useGameStore((s) => s.status);
  const [error, setError] = useState<string | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  const startDaily = async () => {
    const store = useGameStore.getState();
    const browserUserId = localStorage.getItem("triviaworld_user_id") || nanoid();

    // Create DB session
    const sessionRes = await fetch("/api/game/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: browserUserId, mode: "daily" }),
    });
    const sessionData = await sessionRes.json();
    if (!sessionRes.ok) throw new Error(sessionData.error || "Failed to start game");
    const sessionId: string = sessionData.sessionId;
    const userId: string = sessionData.userId;
    localStorage.setItem("triviaworld_user_id", userId);

    // Fetch daily questions
    const res = await fetch(
      `/api/trivia/daily?sessionId=${sessionId}`
    );
    const data = await res.json();

    if (!res.ok) {
      if (data.alreadyPlayed) {
        setAlreadyPlayed(true);
        return;
      }
      throw new Error(data.error || "Failed to load daily challenge");
    }

    useGameStore.setState({
      config: {
        mode: "daily",
        questionCount: GAME_RULES.daily.questionCount,
        timePerQuestion: GAME_RULES.daily.timePerQuestion,
      },
      sessionId,
      dbSessionId: sessionId,
      userId,
      questions: data.questions,
      status: "playing",
      currentIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      lives: Infinity,
      timeRemaining: GAME_RULES.daily.timePerQuestion,
      questionStartTime: Date.now(),
      result: null,
    });
  };

  const handleStart = async () => {
    setError(null);
    try {
      await startDaily();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start");
    }
  };

  if (status === "playing" || status === "reviewing") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
        <QuestionCard />
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <GameResults />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Daily Challenge</h1>
        <p className="text-[var(--muted)] text-sm">
          Same 10 questions for everyone. One attempt per day. 15 seconds each.
        </p>
      </div>

      <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--card-border)] space-y-4">
        <div className="text-center">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-lg font-semibold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {alreadyPlayed ? (
          <div className="text-center space-y-2">
            <p className="text-[var(--warning)] font-medium">
              You&apos;ve already played today&apos;s challenge!
            </p>
            <p className="text-sm text-[var(--muted)]">
              Come back tomorrow for a new set of questions.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleStart}
              className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Start Daily Challenge
            </button>
          </>
        )}
      </div>
    </div>
  );
}
