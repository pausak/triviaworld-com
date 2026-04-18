import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about TriviaWorld: accounts, scoring, daily challenges, achievements, privacy, and more.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "Is TriviaWorld free?",
    a: "Yes, completely free. No ads, no subscriptions, no paywalls.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can play anonymously and your progress is saved locally to your browser. Creating a free account lets you keep your stats across devices and appear on global leaderboards with a nickname.",
  },
  {
    q: "How is my score calculated?",
    a: "Each correct answer earns base points (higher for harder questions), plus a speed bonus for answering quickly and a streak multiplier for consecutive correct answers. See the How to Play page for details.",
  },
  {
    q: "Why am I seeing the same question twice?",
    a: "Questions come from the Open Trivia Database and are served randomly. If you play enough you'll eventually see repeats &mdash; we don't filter them globally across sessions.",
  },
  {
    q: "How does the Daily Challenge work?",
    a: "Every player sees the same 10 questions each calendar day. You get one attempt. Your score is posted to the daily leaderboard and resets at midnight UTC.",
  },
  {
    q: "Can I change my nickname?",
    a: "Yes, from your Profile page. Your nickname is shown on leaderboards and in your achievements.",
  },
  {
    q: "What happens if I lose my connection mid-game?",
    a: "Your current question is preserved if you reconnect quickly. If the timer runs out while you're offline, that question is scored as wrong. Completed games are saved.",
  },
  {
    q: "How are achievements earned?",
    a: "By hitting specific milestones: a perfect game, answering questions below a time threshold, long streaks, category mastery, and more. They unlock automatically at the end of any eligible game.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Email us from your account address and we'll delete your personal data within 30 days. See the Privacy Policy for details.",
  },
  {
    q: "Why are some categories harder than others?",
    a: "Question difficulty is set by the Open Trivia Database contributors. Some topics simply attract harder questions on average. Pick 'Easy' if you want a softer on-ramp.",
  },
  {
    q: "Do you have an API?",
    a: "Not yet. Our backend uses the Open Trivia Database API &mdash; you can query it directly at opentdb.com.",
  },
  {
    q: "Who runs TriviaWorld?",
    a: "A small independent team. Get in touch via the Contact page if you'd like to say hi, report a bug, or suggest a feature.",
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-[var(--muted)]">
          Quick answers to the things people ask most.
        </p>
      </header>

      <div className="space-y-3">
        {faqs.map((f) => (
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

      <div className="mt-10 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] text-center">
        <p className="text-sm text-[var(--muted)]">
          Still stuck?{" "}
          <Link href="/contact" className="text-[var(--primary)] hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
