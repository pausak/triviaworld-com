import { useSyncExternalStore } from "react";

// For values the server cannot know: it renders without them, and the browser
// fills them in straight after hydration without a mismatch.
const noSubscribe = () => () => {};

export function useHasMounted(): boolean {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

const listeners = new Set<() => void>();

function subscribeToStorage(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** A localStorage value: undefined on the server, null when nothing is stored. */
export function useStoredValue(key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribeToStorage,
    () => localStorage.getItem(key),
    () => undefined
  );
}

export function setStoredValue(key: string, value: string) {
  localStorage.setItem(key, value);
  listeners.forEach((listener) => listener());
}

/** The page's query string, or "" on the server. */
export function useLocationSearch(): string {
  return useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
}
