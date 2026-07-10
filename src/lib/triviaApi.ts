import { nanoid } from "nanoid";
import { categories } from "@/lib/categories";
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

// src/lib/categories.ts is the single source of truth for the 10 categories.
// Derive the numeric-id -> Trivia API slug map and the picker list from it.
const CATEGORY_ID_TO_API_SLUG: Record<number, string> = Object.fromEntries(
  categories.map((c) => [c.openTdbId, c.triviaApiCategory])
);

// The categories shown in the in-game picker (all 10 are backed by the API).
const PLAYABLE_CATEGORIES: TriviaCategory[] = categories.map((c) => ({
  id: c.openTdbId,
  name: c.shortName,
}));

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
    const slug = CATEGORY_ID_TO_API_SLUG[options.category];
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
