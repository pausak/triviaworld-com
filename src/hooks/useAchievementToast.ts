"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

interface Achievement {
  name: string;
  description: string;
  icon: string;
  points: number;
}

export function useAchievementToast() {
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const status = useGameStore((s) => s.status);
  const dbSessionId = useGameStore((s) => s.dbSessionId);
  const userId = useGameStore((s) => s.userId);

  useEffect(() => {
    if (status !== "finished" || !dbSessionId || !userId) return;

    // The game/complete API returns achievements; poll once
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/profile/achievements?userId=${userId}`
        );
        const data = await res.json();

        // Show recently unlocked (within last 30 seconds)
        const now = Date.now();
        const recent = (data.achievements || []).filter(
          (a: { unlocked: boolean; unlockedAt?: string }) =>
            a.unlocked &&
            a.unlockedAt &&
            now - new Date(a.unlockedAt).getTime() < 30000
        );
        setNewAchievements(recent);
      } catch {
        // ignore
      }
    }, 1500); // Give the complete API time to finish

    return () => clearTimeout(timer);
  }, [status, dbSessionId, userId]);

  return { newAchievements };
}
