import Link from "next/link";
import { categories } from "@/lib/categories";

const gameModes = [
  {
    title: "Quick Play",
    description: "10 questions, 15 seconds each. Pick your category and difficulty.",
    href: "/play",
    icon: "⚡",
  },
  {
    title: "Daily Challenge",
    description: "Same questions for everyone. One attempt per day. Compete daily.",
    href: "/play/daily",
    icon: "📅",
  },
  {
    title: "Category Marathon",
    description: "Answer every question in a category. 30 seconds each. Endurance test.",
    href: "/play/marathon",
    icon: "🏃",
  },
  {
    title: "Survival",
    description: "3 lives. Mixed categories. Escalating difficulty. How far can you go?",
    href: "/play/survival",
    icon: "💀",
  },
];

const features = [
  {
    title: "Server-validated scoring",
    body: "The correct answer never leaves our server until you've submitted. Your scores are legit.",
    icon: "🔒",
  },
  {
    title: "Global leaderboards",
    body: "Compete on daily, weekly, and all-time boards across every game mode.",
    icon: "🏆",
  },
  {
    title: "18 achievements",
    body: "Perfect games, speed runs, long streaks, category mastery &mdash; we track it all.",
    icon: "🎖️",
  },
  {
    title: "No signup required",
    body: "Play instantly as a guest. Register later to keep your stats across devices.",
    icon: "🚀",
  },
];

const homepageFaqs = [
  {
    q: "Is TriviaWorld free to play?",
    a: "Yes, completely free. No ads, no paywalls, no subscriptions.",
  },
  {
    q: "How many trivia categories are there?",
    a: `${categories.length} categories ranging from history and science to anime, video games, and music.`,
  },
  {
    q: "Do I need to sign up to play?",
    a: "No. You can play anonymously and your stats are saved locally. Create a free account if you want to keep progress across devices and join the global leaderboards.",
  },
  {
    q: "What's the Daily Challenge?",
    a: "Every player gets the same 10 questions each day. You have one attempt. Compete with everyone else on the daily leaderboard.",
  },
];

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homepageFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TriviaWorld",
    url: "https://triviaworld.com",
    description:
      "Free online trivia games across 24 categories with leaderboards, achievements, and daily challenges.",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="text-center mb-14 space-y-4">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          <span className="text-[var(--primary)]">Trivia</span>World
        </h1>
        <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto">
          Free online trivia games across {categories.length} categories.
          Compete on leaderboards, earn achievements, and see how you stack up
          against players around the world.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/play"
            className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary-hover)] transition-colors"
          >
            Start playing
          </Link>
          <Link
            href="/play/daily"
            className="px-6 py-3 rounded-lg border border-[var(--card-border)] bg-[var(--card)] font-semibold hover:border-[var(--primary)] transition-colors"
          >
            Try today&rsquo;s challenge
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-5">Game modes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {gameModes.map((mode) => (
            <Link
              key={mode.title}
              href={mode.href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)] hover:shadow-lg"
            >
              <div className="text-3xl mb-3">{mode.icon}</div>
              <h3 className="text-xl font-bold mb-1">{mode.title}</h3>
              <p className="text-sm text-[var(--muted)]">{mode.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold">Popular categories</h2>
          <Link
            href="/trivia"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/trivia/${cat.slug}`}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 hover:border-[var(--primary)] transition-all"
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="font-semibold text-sm">{cat.shortName}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">
                {cat.tagline}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-5">Why TriviaWorld</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-[var(--muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 grid sm:grid-cols-3 gap-4 text-center">
        <Stat value={`${categories.length}`} label="Categories" />
        <Stat value="4" label="Game modes" />
        <Stat value="18" label="Achievements" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-5">Frequently asked</h2>
        <div className="space-y-3">
          {homepageFaqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 open:border-[var(--primary)] transition-colors"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] transition-transform group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/faq" className="text-sm text-[var(--primary)] hover:underline">
            See all FAQs &rarr;
          </Link>
        </div>
      </section>

      <section className="text-center mb-4">
        <p className="text-sm text-[var(--muted)]">
          Powered by the{" "}
          <a
            href="https://opentdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline"
          >
            Open Trivia Database
          </a>
        </p>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <div className="text-4xl font-bold text-[var(--primary)]">{value}</div>
      <div className="text-sm text-[var(--muted)] mt-1">{label}</div>
    </div>
  );
}
