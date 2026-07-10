import type { NextConfig } from "next";

// Old /trivia/<slug> pages that were consolidated into the 10 backed categories.
// 301 so existing links / indexed URLs land on the closest surviving category.
const CATEGORY_REDIRECTS: Record<string, string> = {
  film: "film-and-tv",
  television: "film-and-tv",
  "anime-manga": "film-and-tv",
  "cartoons-animations": "film-and-tv",
  "video-games": "general-knowledge",
  vehicles: "general-knowledge",
  computers: "science-nature",
  mathematics: "science-nature",
  animals: "science-nature",
  gadgets: "science-nature",
  books: "arts-and-literature",
  art: "arts-and-literature",
  comics: "arts-and-literature",
  "musicals-theatres": "arts-and-literature",
  mythology: "society-and-culture",
  politics: "society-and-culture",
  celebrities: "society-and-culture",
  sports: "sport-and-leisure",
  "board-games": "sport-and-leisure",
};

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return Object.entries(CATEGORY_REDIRECTS).map(([from, to]) => ({
      source: `/trivia/${from}`,
      destination: `/trivia/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
