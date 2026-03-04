"use client";

import { useState, useEffect } from "react";
import type { TriviaCategory } from "@/types/trivia";

interface CategoryPickerProps {
  selected: number | null;
  onSelect: (category: TriviaCategory | null) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trivia/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-[var(--secondary)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--muted)]">Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            selected === null
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
              : "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--primary)]/10"
          }`}
        >
          Any Category
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all truncate ${
              selected === cat.id
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
                : "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--primary)]/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
