"use client";

import { useCallback, useRef } from "react";

// Simple sound effects using Web Audio API (no audio files needed)
export function useSound() {
  const contextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const getContext = useCallback(() => {
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return contextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) => {
      if (!enabledRef.current) return;
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available
      }
    },
    [getContext]
  );

  const playCorrect = useCallback(() => {
    playTone(523, 0.15, "sine", 0.2); // C5
    setTimeout(() => playTone(659, 0.15, "sine", 0.2), 100); // E5
    setTimeout(() => playTone(784, 0.2, "sine", 0.2), 200); // G5
  }, [playTone]);

  const playWrong = useCallback(() => {
    playTone(200, 0.3, "sawtooth", 0.15);
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(800, 0.05, "sine", 0.1);
  }, [playTone]);

  const playAchievement = useCallback(() => {
    playTone(523, 0.1, "sine", 0.2);
    setTimeout(() => playTone(659, 0.1, "sine", 0.2), 100);
    setTimeout(() => playTone(784, 0.1, "sine", 0.2), 200);
    setTimeout(() => playTone(1047, 0.3, "sine", 0.2), 300);
  }, [playTone]);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return { playCorrect, playWrong, playTick, playAchievement, setEnabled };
}
