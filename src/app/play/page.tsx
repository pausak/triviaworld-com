"use client";

import { useGameStore } from "@/stores/gameStore";
import { QuickPlaySetup } from "@/components/QuickPlaySetup";
import { QuestionCard } from "@/components/QuestionCard";
import { GameResults } from "@/components/GameResults";

export default function PlayPage() {
  const status = useGameStore((s) => s.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {(status === "idle" || status === "loading") && <QuickPlaySetup />}
      {(status === "playing" || status === "reviewing") && <QuestionCard />}
      {status === "finished" && <GameResults />}
    </div>
  );
}
