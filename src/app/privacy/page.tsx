import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TriviaWorld collects, stores, and uses your data. Learn about cookies, authentication, analytics, and your rights.",
  alternates: { canonical: "/privacy" },
};

const lastUpdated = "April 18, 2026";

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 prose-like">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--muted)]">Last updated: {lastUpdated}</p>
      </header>

      <section className="space-y-4 mb-8">
        <p>
          TriviaWorld (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates{" "}
          <Link href="/" className="text-[var(--primary)] hover:underline">
            triviaworld.com
          </Link>
          . This page explains what data we collect, why we collect it, and what
          you can do about it. We try to collect the least amount of personal
          data needed to run the site.
        </p>
      </section>

      <Section title="What we collect">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account data (registered users).</strong> Email address,
            a nickname, and a bcrypt-hashed password. We never store your
            password in plaintext.
          </li>
          <li>
            <strong>Anonymous identifiers.</strong> If you play without creating
            an account, we generate a random user ID that lives in your
            browser&rsquo;s localStorage so your progress persists on that device.
          </li>
          <li>
            <strong>Gameplay data.</strong> Game sessions, answers, scores,
            accuracy, streaks, achievements, and category stats.
          </li>
          <li>
            <strong>Session tokens.</strong> When you log in we set a JWT cookie
            so we can keep you signed in. The cookie is HTTP-only and expires.
          </li>
          <li>
            <strong>Basic request logs.</strong> Our host may log IP addresses
            and user agents for security and abuse prevention.
          </li>
        </ul>
      </Section>

      <Section title="What we do not collect">
        <ul className="list-disc pl-6 space-y-2">
          <li>Payment information &mdash; TriviaWorld is free.</li>
          <li>Location data beyond what is inferable from your IP address.</li>
          <li>Contacts, photos, or other device data.</li>
        </ul>
      </Section>

      <Section title="How we use your data">
        <ul className="list-disc pl-6 space-y-2">
          <li>To run the game: deliver questions, score answers, and save progress.</li>
          <li>To power leaderboards and achievements.</li>
          <li>To authenticate you across sessions.</li>
          <li>To prevent abuse, spam, and automated attacks.</li>
        </ul>
        <p className="mt-3">
          We do not sell your data. We do not run third-party ad trackers. If
          we add analytics in the future, we will update this policy and
          prefer privacy-respecting tools.
        </p>
      </Section>

      <Section title="Cookies & local storage">
        <p>We use:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Authentication cookie</strong> &mdash; set only after you
            log in, used to keep your session active.
          </li>
          <li>
            <strong>Theme preference</strong> &mdash; remembers your dark/light
            mode choice.
          </li>
          <li>
            <strong>Anonymous user ID</strong> &mdash; stored in localStorage
            for guest progress.
          </li>
        </ul>
      </Section>

      <Section title="Third-party services">
        <p>
          Trivia questions are fetched from the{" "}
          <a
            href="https://opentdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline"
          >
            Open Trivia Database
          </a>
          . Requests to their API go directly from our servers, not from your
          browser.
        </p>
      </Section>

      <Section title="Data retention">
        <p>
          Game history is stored as long as your account exists. If you delete
          your account, we remove associated personal data within 30 days.
          Aggregate, anonymized stats (for leaderboards) may be retained.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Depending on where you live (GDPR in the EU, CCPA in California, and
          similar laws elsewhere), you may have the right to access, correct,
          export, or delete your personal data. To exercise these rights,
          email us from the address associated with your account.
        </p>
      </Section>

      <Section title="Children">
        <p>
          TriviaWorld is not directed at children under 13. We do not knowingly
          collect personal data from children. If you believe a child has
          provided us with data, contact us and we will delete it.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this policy as the site evolves. The &ldquo;last
          updated&rdquo; date at the top of this page reflects the most recent
          change. Material changes will be announced in-app.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? Reach us via the{" "}
          <Link href="/contact" className="text-[var(--primary)] hover:underline">
            contact page
          </Link>
          .
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-[var(--secondary-foreground)] leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
