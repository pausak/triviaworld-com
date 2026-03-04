"use client";

import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { DifficultySelector } from "@/components/DifficultySelector";
import { QuestionCard } from "@/components/QuestionCard";
import { GameResults } from "@/components/GameResults";
import type { Difficulty } from "@/types/trivia";

export default function SurvivalPage() {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const lives = useGameStore((s) => s.lives);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setError(null);
    try {
      await startGame({
        mode: "survival",
        difficulty: difficulty || undefined,
        questionCount: 50, // max batch, game ends on 3 wrong
        timePerQuestion: 20,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start");
    }
  };

  if (status === "playing" || status === "reviewing") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
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
        <h1 className="text-2xl font-bold mb-1">Survival Mode</h1>
        <p className="text-[var(--muted)] text-sm">
          3 lives. Mixed categories. 20 seconds per question. How far can you go?
        </p>
      </div>

      <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--card-border)]">
        <div className="flex justify-center gap-4 text-center">
          <div>
            <p className="text-3xl">❤️❤️❤️</p>
            <p className="text-xs text-[var(--muted)] mt-1">3 Lives</p>
          </div>
        </div>
      </div>

      <DifficultySelector selected={difficulty} onSelect={setDifficulty} />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-lg bg-red-600 text-white font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Loading..." : "Enter Survival"}
      </button>
    </div>
  );
}
