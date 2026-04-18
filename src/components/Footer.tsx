import Link from "next/link";

const columns = [
  {
    heading: "Play",
    links: [
      { href: "/play", label: "Quick Play" },
      { href: "/play/daily", label: "Daily Challenge" },
      { href: "/play/marathon", label: "Marathon" },
      { href: "/play/survival", label: "Survival" },
      { href: "/trivia", label: "All categories" },
    ],
  },
  {
    heading: "Compete",
    links: [
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/achievements", label: "Achievements" },
      { href: "/profile", label: "Profile" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-to-play", label: "How to Play" },
      { href: "/faq", label: "FAQ" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--card-border)] bg-[var(--card)]/30">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-semibold text-sm mb-3">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm">
            <Link href="/" className="font-semibold">
              <span className="text-[var(--primary)]">Trivia</span>World
            </Link>
            <span className="text-[var(--muted)] ml-2">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Questions from the{" "}
            <a
              href="https://opentdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--primary)]"
            >
              Open Trivia Database
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
