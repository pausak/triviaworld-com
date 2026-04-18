import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Trivia Categories",
  description:
    "Browse all 24 trivia categories on TriviaWorld &mdash; from history and science to video games, music, and anime. Pick your favorite and start playing.",
  alternates: { canonical: "/trivia" },
};

export default function TriviaIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Trivia Categories
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
          {categories.length} categories, thousands of questions. Pick your
          favorite subject or try something new.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/trivia/${cat.slug}`}
            className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{cat.emoji}</span>
              <h2 className="font-semibold">{cat.shortName}</h2>
            </div>
            <p className="text-sm text-[var(--muted)]">{cat.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
