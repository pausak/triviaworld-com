import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://triviaworld.com/blog/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: "TriviaWorld" },
    datePublished: post.date,
    url: `https://triviaworld.com/blog/${post.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav className="text-sm text-[var(--muted)] mb-6">
        <Link href="/blog" className="hover:text-[var(--primary)]">
          &larr; All posts
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-3">
          <time>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
        <p className="text-lg text-[var(--muted)]">{post.description}</p>
      </header>

      <PostBody markdown={post.content} />

      <footer className="mt-12 pt-6 border-t border-[var(--card-border)]">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
        <Link
          href="/blog"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          &larr; Back to all posts
        </Link>
      </footer>
    </article>
  );
}

function PostBody({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n\n+/);

  return (
    <div className="space-y-4 text-[var(--secondary-foreground)] leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-2xl font-bold mt-8 mb-2 text-[var(--foreground)]">
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-xl font-semibold mt-6 mb-2 text-[var(--foreground)]">
              {block.replace(/^### /, "")}
            </h3>
          );
        }
        if (/^(\d+\. |- )/.test(block)) {
          const ordered = /^\d+\. /.test(block);
          const items = block.split(/\n/).map((l) => l.replace(/^(\d+\. |- )/, ""));
          const ListTag = ordered ? "ol" : "ul";
          return (
            <ListTag
              key={i}
              className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2`}
            >
              {items.map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
              ))}
            </ListTag>
          );
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(block) }} />
        );
      })}
    </div>
  );
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[var(--primary)] hover:underline">$1</a>'
  );
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&minus;/g, "\u2212")
    .replace(/&deg;/g, "\u00B0")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D");
}
