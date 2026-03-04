"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-6xl">😵</p>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-[var(--muted)] text-sm">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
      >
        Try Again
      </button>
    </div>
  );
}
