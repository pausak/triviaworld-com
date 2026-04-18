import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About TriviaWorld",
  description:
    "TriviaWorld is a free trivia game with 24 categories, four game modes, global leaderboards, and achievements. Learn what makes it different.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">About TriviaWorld</h1>
        <p className="text-lg text-[var(--muted)]">
          A fast, free trivia game with four modes, 24 categories, and
          server-validated scoring. No ads, no paywalls.
        </p>
      </header>

      <section className="space-y-4 mb-10 text-[var(--secondary-foreground)] leading-relaxed">
        <p>
          TriviaWorld started as a weekend project with a simple goal: a
          trivia site that respects your time and your knowledge. Most free
          trivia sites feel like ad delivery platforms &mdash; we wanted the
          opposite. Pick a category, answer well, climb the leaderboard.
        </p>
        <p>
          Every question is scored on the server, so times and correctness
          can&rsquo;t be manipulated from the browser. Speed is rewarded,
          streaks multiply your points, and daily challenges pit you against
          the world on an identical question set.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4 mb-10">
        <Fact n="24" label="Trivia categories" />
        <Fact n="4" label="Game modes" />
        <Fact n="18" label="Achievements to unlock" />
        <Fact n="∞" label="Questions, refreshed constantly" />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">What makes it different</h2>
        <ul className="space-y-3">
          <Feature
            title="Server-side answer validation"
            body="The correct answer never touches your browser until you&rsquo;ve submitted. Makes cheating much harder and scores more trustworthy."
          />
          <Feature
            title="Daily Challenge for everyone"
            body="Every player sees the same 10 questions each day. One attempt. It&rsquo;s a small, shared ritual &mdash; like Wordle, but trivia."
          />
          <Feature
            title="Real game modes"
            body="Quick Play for a focused session, Marathon for endurance, Survival for pressure, Daily for competition."
          />
          <Feature
            title="Achievements that matter"
            body="18 unlocks spanning accuracy, speed, streaks, and category mastery. Your progress is tracked whether you're signed in or playing anonymously."
          />
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Credits</h2>
        <p className="text-[var(--secondary-foreground)] leading-relaxed">
          Questions are sourced from the{" "}
          <a
            href="https://opentdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline"
          >
            Open Trivia Database
          </a>
          , a community-maintained trivia API. We&rsquo;re grateful for their
          work. Site built with Next.js, TypeScript, and Tailwind.
        </p>
      </section>

      <section className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to play?</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          No signup required &mdash; jump in as a guest and register later to
          keep your stats.
        </p>
        <Link
          href="/play"
          className="inline-block px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          Start a game
        </Link>
      </section>
    </div>
  );
}

function Fact({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
      <div className="text-3xl font-bold text-[var(--primary)]">{n}</div>
      <div className="text-sm text-[var(--muted)] mt-1">{label}</div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{body}</p>
    </li>
  );
}
