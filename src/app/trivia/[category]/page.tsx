import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getRelatedCategories } from "@/lib/categories";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category not found" };

  return {
    title: cat.name,
    description: `${cat.intro.slice(0, 155)}...`,
    alternates: { canonical: `/trivia/${cat.slug}` },
    openGraph: {
      title: `${cat.name} | TriviaWorld`,
      description: cat.tagline,
      url: `https://triviaworld.com/trivia/${cat.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const related = getRelatedCategories(cat.slug);

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: cat.name,
    about: cat.shortName,
    description: cat.intro,
    educationalLevel: "general",
    url: `https://triviaworld.com/trivia/${cat.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cat.sampleQuestions.map((s) => ({
      "@type": "Question",
      name: s.q,
      acceptedAnswer: { "@type": "Answer", text: s.a },
    })),
  };

  const playHref = `/play?category=${cat.openTdbId}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
        {" / "}
        <Link href="/trivia" className="hover:text-[var(--primary)]">Categories</Link>
        {" / "}
        <span className="text-[var(--foreground)]">{cat.shortName}</span>
      </nav>

      <header className="mb-8">
        <div className="text-5xl mb-3">{cat.emoji}</div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{cat.name}</h1>
        <p className="text-lg text-[var(--muted)]">{cat.tagline}</p>
      </header>

      <section className="mb-8">
        <p className="text-[var(--secondary-foreground)] leading-relaxed">
          {cat.intro}
        </p>
      </section>

      <section className="mb-10 p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <h2 className="text-xl font-semibold mb-4">
          Play {cat.shortName} trivia
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href={playHref}
            className="px-4 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-center hover:bg-[var(--primary-hover)] transition-colors"
          >
            Quick Play (10 Qs)
          </Link>
          <Link
            href={`/play/marathon?category=${cat.openTdbId}`}
            className="px-4 py-3 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] font-semibold text-center hover:bg-[var(--primary)]/10 transition-colors"
          >
            Marathon (50 Qs)
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">Who it&rsquo;s good for</h2>
        <ul className="list-disc pl-6 space-y-2 text-[var(--secondary-foreground)]">
          {cat.goodFor.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Sample questions</h2>
        <div className="space-y-3">
          {cat.sampleQuestions.map((s) => (
            <details
              key={s.q}
              className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 open:border-[var(--primary)]"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
                <span className="font-medium">{s.q}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    s.difficulty === "easy"
                      ? "bg-green-500/10 text-green-500"
                      : s.difficulty === "medium"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {s.difficulty}
                </span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)]">
                <span className="font-semibold text-[var(--foreground)]">Answer:</span>{" "}
                {s.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Related categories</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/trivia/${r.slug}`}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 hover:border-[var(--primary)] transition-all"
              >
                <div className="text-2xl mb-1">{r.emoji}</div>
                <div className="font-semibold text-sm">{r.shortName}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5 truncate">
                  {r.tagline}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="p-6 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Ready to test yourself on {cat.shortName.toLowerCase()}?
        </h2>
        <Link
          href={playHref}
          className="inline-block mt-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          Start playing
        </Link>
      </section>
    </div>
  );
}
