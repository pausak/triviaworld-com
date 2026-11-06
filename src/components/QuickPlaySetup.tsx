"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryPicker } from "./CategoryPicker";
import { DifficultySelector } from "./DifficultySelector";
import { useGameStore } from "@/stores/gameStore";
import { categoryFromParam, difficultyFromParam } from "@/lib/deepLink";
import type { TriviaCategory, Difficulty, GameConfig } from "@/types/trivia";

export function QuickPlaySetup() {
  const searchParams = useSearchParams();
  // The link's choices apply until the person makes their own. A cleared category
  // falls back to the link; a cleared difficulty stays cleared ("any").
  const [pickedCategory, setCategory] = useState<TriviaCategory | null>(null);
  const [pickedDifficulty, setDifficulty] = useState<Difficulty | null | undefined>(undefined);
  const category = pickedCategory ?? categoryFromParam(searchParams.get("category"));
  const difficulty =
    pickedDifficulty !== undefined
      ? pickedDifficulty
      : difficultyFromParam(searchParams.get("difficulty")) ?? "easy";
  const [error, setError] = useState<string | null>(null);
  const startGame = useGameStore((s) => s.startGame);
  const status = useGameStore((s) => s.status);


  const handleStart = async () => {
    setError(null);
    const config: GameConfig = {
      mode: "quick",
      category: category?.id,
      categoryName: category?.name,
      difficulty: difficulty || undefined,
      questionCount: 10,
      timePerQuestion: 15,
    };

    try {
      await startGame(config);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start game");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Quick Play</h1>
        <p className="text-[var(--muted)] text-sm">
          10 questions, 15 seconds each. Pick your category and difficulty.
        </p>
      </div>

      <CategoryPicker
        selected={category?.id ?? null}
        onSelect={setCategory}
      />

      <DifficultySelector selected={difficulty} onSelect={setDifficulty} />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
            </svg>
            Loading Questions...
          </span>
        ) : (
          "Start Game"
        )}
      </button>
    </div>
  );
}
