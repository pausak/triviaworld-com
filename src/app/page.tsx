import Link from "next/link";

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

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-[var(--primary)]">Trivia</span>World
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-md mx-auto">
          Test your knowledge across dozens of categories. Compete on
          leaderboards and earn achievements.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {gameModes.map((mode) => (
          <Link
            key={mode.title}
            href={mode.href}
            className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)] hover:shadow-lg"
          >
            <div className="text-3xl mb-3">{mode.icon}</div>
            <h2 className="text-xl font-bold mb-1">{mode.title}</h2>
            <p className="text-sm text-[var(--muted)]">{mode.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
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
      </div>
    </div>
  );
}
