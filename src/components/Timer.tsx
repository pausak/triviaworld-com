"use client";

import { useTimer } from "@/hooks/useTimer";
import { useGameStore } from "@/stores/gameStore";

export function Timer() {
  const { timeRemaining } = useTimer();
  const config = useGameStore((s) => s.config);

  if (!config) return null;

  const total = config.timePerQuestion;
  const fraction = timeRemaining / total;
  const isLow = timeRemaining <= 5;
  const isCritical = timeRemaining <= 3;

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference * (1 - fraction);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="var(--card-border)"
          strokeWidth="3"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke={isCritical ? "var(--danger)" : isLow ? "var(--warning)" : "var(--primary)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
      </svg>
      <span
        className={`absolute text-sm font-mono font-bold ${
          isCritical
            ? "text-[var(--danger)] animate-countdown-pulse"
            : isLow
            ? "text-[var(--warning)]"
            : ""
        }`}
      >
        {Math.ceil(timeRemaining)}
      </span>
    </div>
  );
}
