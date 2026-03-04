"use client";

type AnswerState = "default" | "correct" | "incorrect" | "dimmed";

interface AnswerButtonProps {
  answer: string;
  index: number;
  state: AnswerState;
  disabled: boolean;
  onClick: () => void;
}

const labels = ["A", "B", "C", "D"];

export function AnswerButton({
  answer,
  index,
  state,
  disabled,
  onClick,
}: AnswerButtonProps) {
  const stateClasses: Record<AnswerState, string> = {
    default:
      "bg-[var(--secondary)] border-[var(--card-border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 cursor-pointer",
    correct:
      "bg-green-500/20 border-green-500 text-green-400 animate-pulse-success",
    incorrect:
      "bg-red-500/20 border-red-500 text-red-400 animate-shake",
    dimmed: "bg-[var(--secondary)] border-[var(--card-border)] opacity-40",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${stateClasses[state]}`}
    >
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          state === "correct"
            ? "bg-green-500 text-white"
            : state === "incorrect"
            ? "bg-red-500 text-white"
            : "bg-[var(--card-border)] text-[var(--foreground)]"
        }`}
      >
        {state === "correct" ? "✓" : state === "incorrect" ? "✗" : labels[index]}
      </span>
      <span className="font-medium">{answer}</span>
    </button>
  );
}
