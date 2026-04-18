import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the TriviaWorld team. Report bugs, request features, or ask about privacy and account issues.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Contact</h1>
        <p className="text-[var(--muted)]">
          Pick a category, tell us what&rsquo;s up, and we&rsquo;ll get back
          to you within a few business days.
        </p>
      </header>

      <ContactForm />

      <div className="mt-10 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <h2 className="font-semibold mb-2">Before writing in</h2>
        <p className="text-sm text-[var(--muted)]">
          The answer may already be on our{" "}
          <Link href="/faq" className="text-[var(--primary)] hover:underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link
            href="/how-to-play"
            className="text-[var(--primary)] hover:underline"
          >
            How to Play
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
