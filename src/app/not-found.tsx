import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <p className="text-6xl">🤔</p>
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="text-[var(--muted)]">
        This question doesn&apos;t exist in our database.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
