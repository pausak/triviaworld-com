import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Trivia strategy, category deep-dives, and the cognitive science of daily quizzes. Writing from the TriviaWorld team.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Blog</h1>
        <p className="text-lg text-[var(--muted)]">
          Trivia strategy, category deep-dives, and the occasional essay on
          memory and learning.
        </p>
      </header>

      <div className="space-y-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition-all"
          >
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
              <time>
                {new Date(p.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>&middot;</span>
              <span>{p.readingTime}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <p className="text-sm text-[var(--muted)]">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
