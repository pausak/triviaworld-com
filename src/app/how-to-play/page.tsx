import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Play",
  description:
    "Learn how TriviaWorld works: scoring, streaks, time bonuses, and tips for each of our four game modes.",
  alternates: { canonical: "/how-to-play" },
};

export default function HowToPlayPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">How to Play</h1>
        <p className="text-lg text-[var(--muted)]">
          A quick guide to scoring, streaks, and picking the right mode.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">The basics</h2>
        <ol className="space-y-3 list-decimal pl-6 text-[var(--secondary-foreground)] leading-relaxed">
          <li>Pick a game mode on the home page.</li>
          <li>Choose a category and difficulty (if the mode allows it).</li>
          <li>
            Answer as quickly as you can &mdash; the faster you answer, the
            more points you earn.
          </li>
          <li>
            Keep your streak alive. Consecutive correct answers multiply your
            score.
          </li>
          <li>
            Review your results at the end: accuracy, average time, and a
            breakdown of every question.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Scoring</h2>
        <div className="space-y-3">
          <Card
            title="Base points"
            body="Easy questions are worth less, hard questions more. Getting a question right always earns the base amount."
          />
          <Card
            title="Speed bonus"
            body="The faster you answer, the larger the bonus. Answering in the first couple of seconds can double your base score."
          />
          <Card
            title="Streak multiplier"
            body="Consecutive correct answers build a streak. At 3+ in a row, a multiplier kicks in and grows as the streak continues."
          />
          <Card
            title="Time out"
            body="Running out of time counts as a wrong answer and breaks your streak."
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Game modes</h2>
        <div className="space-y-3">
          <Mode
            title="Quick Play"
            stats="10 questions · 15s each · pick category & difficulty"
            href="/play"
            body="The default mode. Great for a 2-minute session or warming up."
          />
          <Mode
            title="Daily Challenge"
            stats="10 questions · same for everyone · one attempt per day"
            href="/play/daily"
            body="The same 10 questions for every player. Come back every day to chase the top of the daily board."
          />
          <Mode
            title="Category Marathon"
            stats="50 questions · 30s each · single category"
            href="/play/marathon"
            body="Deep-dive one category. Pacing matters &mdash; streaks snowball quickly."
          />
          <Mode
            title="Survival"
            stats="3 lives · 20s each · escalating difficulty"
            href="/play/survival"
            body="Start easy, get harder. Three wrong answers and you&rsquo;re out. How far can you push?"
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Tips</h2>
        <ul className="list-disc pl-6 space-y-2 text-[var(--secondary-foreground)] leading-relaxed">
          <li>
            Don&rsquo;t second-guess. On most questions, your first instinct is
            right and the clock is your real enemy.
          </li>
          <li>
            Break ties with the process of elimination &mdash; incorrect options
            are often obviously wrong.
          </li>
          <li>
            Play categories you know before branching out. A long streak in
            Geography beats a short streak across five categories.
          </li>
          <li>
            Use the{" "}
            <Link href="/play/daily" className="text-[var(--primary)] hover:underline">
              Daily Challenge
            </Link>{" "}
            as your warm-up &mdash; it&rsquo;s the same questions as everyone else,
            so you can benchmark yourself.
          </li>
        </ul>
      </section>

      <section className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] text-center">
        <h2 className="text-xl font-semibold mb-2">Ready?</h2>
        <Link
          href="/play"
          className="inline-block mt-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          Start a game
        </Link>
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}

function Mode({
  title,
  stats,
  body,
  href,
}: {
  title: string;
  stats: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 hover:border-[var(--primary)] transition-all"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-[var(--primary)]">Play &rarr;</span>
      </div>
      <p className="text-xs text-[var(--muted)] font-mono mb-2">{stats}</p>
      <p className="text-sm text-[var(--muted)]">{body}</p>
    </Link>
  );
}
