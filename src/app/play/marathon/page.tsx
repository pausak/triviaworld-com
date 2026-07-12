"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { CategoryPicker } from "@/components/CategoryPicker";
import { QuestionCard } from "@/components/QuestionCard";
import { GameResults } from "@/components/GameResults";
import { categories as curatedCategories } from "@/lib/categories";
import type { TriviaCategory } from "@/types/trivia";

export default function MarathonPage() {
  const status = useGameStore((s) => s.status);
  const startGame = useGameStore((s) => s.startGame);
  const [category, setCategory] = useState<TriviaCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Honor deep links from the /trivia SEO pages, e.g. /play/marathon?category=33.
  // Without this the category is never preselected and Start stays disabled.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("category");
    if (!param) return;
    const id = parseInt(param, 10);
    if (Number.isNaN(id)) return;
    const match = curatedCategories.find((c) => c.openTdbId === id);
    if (match) setCategory({ id: match.openTdbId, name: match.shortName });
  }, []);

  const handleStart = async () => {
    if (!category) {
      setError("Please select a category for marathon mode");
      return;
    }
    setError(null);
    try {
      await startGame({
        mode: "marathon",
        category: category.id,
        categoryName: category.name,
        difficulty: "easy",
        questionCount: 50, // max from API
        timePerQuestion: 30,
      });
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
        <h1 className="text-2xl font-bold mb-1">Category Marathon</h1>
        <p className="text-[var(--muted)] text-sm">
          Answer every question in a category. 30 seconds each. Test your endurance.
        </p>
      </div>

      <CategoryPicker selected={category?.id ?? null} onSelect={setCategory} />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={status === "loading" || !category}
        className="w-full py-3.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Loading..." : "Start Marathon"}
      </button>
    </div>
  );
}
