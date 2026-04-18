import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://triviaworld.com";
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/play`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/play/daily`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/play/marathon`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/play/survival`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/achievements`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/trivia`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/how-to-play`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/trivia/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...categoryRoutes, ...postRoutes];
}
