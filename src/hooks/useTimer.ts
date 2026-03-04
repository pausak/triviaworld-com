"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const status = useGameStore((s) => s.status);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const setTimeRemaining = useGameStore((s) => s.setTimeRemaining);
  const timeUp = useGameStore((s) => s.timeUp);
  const config = useGameStore((s) => s.config);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (status === "playing" && config) {
      clearTimer();
      intervalRef.current = setInterval(() => {
        const currentTime = useGameStore.getState().timeRemaining;
        if (currentTime <= 0) {
          clearTimer();
          timeUp();
        } else {
          setTimeRemaining(
            Math.max(0, +(currentTime - 0.1).toFixed(1))
          );
        }
      }, 100);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [status, config, clearTimer, setTimeRemaining, timeUp]);

  return { timeRemaining };
}
