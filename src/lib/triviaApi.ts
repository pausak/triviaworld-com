import { nanoid } from "nanoid";
import type {
  TriviaCategory,
  TriviaQuestion,
  QuestionWithAnswer,
  Difficulty,
} from "@/types/trivia";

// The Trivia API (https://the-trivia-api.com) — replaces OpenTDB.
// Its "easy" tier is meaningfully better calibrated than OpenTDB's, which
// is why we switched: even OpenTDB's "easy" questions skewed obscure.
const TRIVIA_API_BASE = "https://the-trivia-api.com/v2";

// The Trivia API exposes 10 top-level categories (string slugs), while the app
// is built around OpenTDB's numeric category IDs (see src/lib/categories.ts).
// This maps each OpenTDB id the app still uses onto the closest Trivia API slug.
// Several app categories have no direct equivalent and collapse onto a shared
// pool — tune these mappings freely; they are the single source of truth.
const OPENTDB_TO_TRIVIA_API: Record<number, string> = {
  9: "general_knowledge", // General Knowledge
  10: "arts_and_literature", // Books
  11: "film_and_tv", // Film
  12: "music", // Music
  13: "arts_and_literature", // Musicals & Theatre
  14: "film_and_tv", // Television
  15: "general_knowledge", // Video Games (no gaming category on Trivia API)
  16: "sport_and_leisure", // Board Games (sport_and_leisure covers games)
  17: "science", // Science & Nature
  18: "science", // Computers
  19: "science", // Mathematics
  20: "society_and_culture", // Mythology
  21: "sport_and_leisure", // Sports
  22: "geography", // Geography
  23: "history", // History
  24: "society_and_culture", // Politics
  25: "arts_and_literature", // Art
  26: "film_and_tv", // Celebrities
  27: "science", // Animals
  28: "general_knowledge", // Vehicles
  29: "arts_and_literature", // Comics
  30: "science", // Gadgets
  31: "film_and_tv", // Anime & Manga
  32: "film_and_tv", // Cartoons & Animations
  33: "food_and_drink", // Food & Drink (native to The Trivia API; no OpenTDB equivalent)
};

// The 10 categories The Trivia API actually backs, shown in the in-game picker.
// `id` reuses a representative OpenTDB id so existing /trivia SEO deep links and
// the OPENTDB_TO_TRIVIA_API map keep resolving; 33 is a synthetic id for the
// Food & Drink topic, which has no OpenTDB counterpart.
const PLAYABLE_CATEGORIES: TriviaCategory[] = [
  { id: 9, name: "General Knowledge" },
  { id: 23, name: "History" },
  { id: 17, name: "Science & Nature" },
  { id: 22, name: "Geography" },
  { id: 11, name: "Film & TV" },
  { id: 12, name: "Music" },
  { id: 21, name: "Sport & Leisure" },
  { id: 10, name: "Arts & Literature" },
  { id: 24, name: "Society & Culture" },
  { id: 33, name: "Food & Drink" },
];

interface TriviaApiQuestion {
  id: string;
  category: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: { text: string };
  tags: string[];
  type: string;
  difficulty: string;
  regions: string[];
  isNiche: boolean;
}

function prettifyCategory(slug: string): string {
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function transformQuestion(raw: TriviaApiQuestion): QuestionWithAnswer {
  const correctAnswer = raw.correctAnswer;
  const incorrectAnswers = raw.incorrectAnswers;
  const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);

  return {
    id: nanoid(),
    category: prettifyCategory(raw.category),
    difficulty: raw.difficulty as Difficulty,
    type: "multiple",
    question: raw.question.text,
    correctAnswer,
    incorrectAnswers,
    answers: allAnswers,
  };
}

export async function fetchQuestions(options: {
  amount: number;
  category?: number;
  difficulty?: Difficulty;
  type?: "multiple" | "boolean";
}): Promise<QuestionWithAnswer[]> {
  const params = new URLSearchParams({
    limit: options.amount.toString(),
    types: "text_choice",
  });

  if (options.category) {
    const slug = OPENTDB_TO_TRIVIA_API[options.category];
    if (slug) params.set("categories", slug);
  }
  if (options.difficulty) params.set("difficulties", options.difficulty);

  const url = `${TRIVIA_API_BASE}/questions?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "Rate limited — please wait a moment and try again"
        : `Failed to fetch questions (${response.status})`
    );
  }

  const data: TriviaApiQuestion[] = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Not enough questions available for this criteria");
  }

  return data.map(transformQuestion);
}

// The in-game category picker only offers the 10 topics The Trivia API actually
// backs, so every pick returns on-topic questions. The richer 24-category set in
// src/lib/categories.ts still powers the /trivia SEO pages; their deep links map
// down to one of these 10 via OPENTDB_TO_TRIVIA_API.
export async function fetchCategories(): Promise<TriviaCategory[]> {
  return PLAYABLE_CATEGORIES;
}

// Strip the correct answer from questions before sending to client
export function sanitizeForClient(
  questions: QuestionWithAnswer[]
): TriviaQuestion[] {
  return questions.map(({ correctAnswer, incorrectAnswers, ...rest }) => rest);
}
