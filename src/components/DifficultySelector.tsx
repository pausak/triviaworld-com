"use client";

import type { Difficulty } from "@/types/trivia";

interface DifficultySelectorProps {
  selected: Difficulty | null;
  onSelect: (difficulty: Difficulty | null) => void;
}

const difficulties: { value: Difficulty | null; label: string; color: string }[] = [
  { value: null, label: "Any", color: "var(--primary)" },
  { value: "easy", label: "Easy", color: "var(--success)" },
  { value: "medium", label: "Medium", color: "var(--warning)" },
  { value: "hard", label: "Hard", color: "var(--danger)" },
];

export function DifficultySelector({
  selected,
  onSelect,
}: DifficultySelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--muted)]">Difficulty</h3>
      <div className="flex gap-2">
        {difficulties.map((d) => (
          <button
            key={d.label}
            onClick={() => onSelect(d.value)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selected === d.value
                ? "text-white shadow-md"
                : "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80"
            }`}
            style={
              selected === d.value
                ? { backgroundColor: d.color }
                : undefined
            }
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
