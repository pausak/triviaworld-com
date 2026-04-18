import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The rules for using TriviaWorld: accounts, acceptable use, intellectual property, liability, and how disputes are handled.",
  alternates: { canonical: "/terms" },
};

const lastUpdated = "April 18, 2026";

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Use</h1>
        <p className="text-sm text-[var(--muted)]">Last updated: {lastUpdated}</p>
      </header>

      <section className="mb-8 text-[var(--secondary-foreground)] leading-relaxed">
        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your use of
          TriviaWorld (the &ldquo;Service&rdquo;). By using the Service you
          agree to these Terms. If you do not agree, please do not use the
          Service.
        </p>
      </section>

      <Section title="1. Eligibility">
        <p>
          You must be at least 13 years old to use TriviaWorld. If you are
          under 18, you represent that your parent or legal guardian has
          reviewed and agreed to these Terms on your behalf.
        </p>
      </Section>

      <Section title="2. Accounts">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials and for activity under your account.
          </li>
          <li>
            Provide accurate information when registering. Do not impersonate
            others or use misleading nicknames.
          </li>
          <li>
            We may suspend or terminate accounts that violate these Terms.
          </li>
        </ul>
      </Section>

      <Section title="3. Acceptable use">
        <p>While using the Service you agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            Use automated tools, bots, or scripts to play games, inflate
            scores, or spam the API.
          </li>
          <li>Reverse engineer or attempt to bypass anti-cheat measures.</li>
          <li>
            Harass other users, submit offensive nicknames, or post unlawful
            content.
          </li>
          <li>
            Probe, scan, or test the vulnerability of the Service without our
            written permission.
          </li>
          <li>Interfere with or disrupt the Service or its infrastructure.</li>
        </ul>
      </Section>

      <Section title="4. Leaderboards & fair play">
        <p>
          Leaderboard entries obtained through cheating, exploits, or
          automation may be removed at our discretion. We may reset
          leaderboards to preserve competitive integrity.
        </p>
      </Section>

      <Section title="5. Intellectual property">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            The TriviaWorld name, branding, and site code are owned by us.
          </li>
          <li>
            Trivia questions are provided by the{" "}
            <a
              href="https://opentdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline"
            >
              Open Trivia Database
            </a>{" "}
            under its own license. We do not claim ownership of the question
            content.
          </li>
          <li>
            You retain ownership of any content you submit (such as a
            nickname) but grant us a limited license to display it as part of
            the Service.
          </li>
        </ul>
      </Section>

      <Section title="6. Service availability">
        <p>
          TriviaWorld is provided &ldquo;as is&rdquo; without warranties of
          any kind. We do not guarantee uninterrupted availability and may
          change, suspend, or discontinue any part of the Service at any time.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by law, TriviaWorld and its
          operators are not liable for any indirect, incidental, special, or
          consequential damages arising out of your use of the Service. Our
          total liability for direct damages is limited to the amount you have
          paid us in the past 12 months &mdash; which, because the Service is
          free, will typically be zero.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          You may stop using the Service or delete your account at any time.
          We may terminate or suspend access to the Service immediately,
          without prior notice, for any breach of these Terms.
        </p>
      </Section>

      <Section title="9. Governing law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which
          TriviaWorld is operated, without regard to conflict-of-law
          principles. Disputes will be resolved in the courts of that
          jurisdiction.
        </p>
      </Section>

      <Section title="10. Changes">
        <p>
          We may update these Terms from time to time. When we do, we will
          update the &ldquo;last updated&rdquo; date. Continued use of the
          Service after a change means you accept the new Terms.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Questions? Reach us via the{" "}
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
