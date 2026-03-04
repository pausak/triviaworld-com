import { nanoid } from "nanoid";
import type {
  OpenTDBResponse,
  OpenTDBQuestion,
  TriviaCategory,
  TriviaQuestion,
  QuestionWithAnswer,
  Difficulty,
} from "@/types/trivia";

const OPENTDB_BASE = "https://opentdb.com";
const MIN_REQUEST_GAP_MS = 5000;

let lastRequestTime = 0;
let requestQueue: Array<() => void> = [];
let isProcessingQueue = false;

function decodeHTML(html: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&eacute;": "é",
    "&Eacute;": "É",
    "&ouml;": "ö",
    "&uuml;": "ü",
    "&auml;": "ä",
    "&szlig;": "ß",
    "&ntilde;": "ñ",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&hellip;": "\u2026",
    "&mdash;": "\u2014",
    "&ndash;": "\u2013",
    "&deg;": "°",
    "&pi;": "π",
    "&shy;": "",
    "&lrm;": "",
    "&rlm;": "",
  };

  let decoded = html;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }
  // Handle numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );
  return decoded;
}

async function rateLimitedFetch(url: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < MIN_REQUEST_GAP_MS) {
        await new Promise((r) =>
          setTimeout(r, MIN_REQUEST_GAP_MS - timeSinceLastRequest)
        );
      }
      lastRequestTime = Date.now();
      try {
        const response = await fetch(url);
        resolve(response);
      } catch (err) {
        reject(err);
      }
      processQueue();
    };

    requestQueue.push(execute);
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

function processQueue() {
  if (requestQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }
  isProcessingQueue = true;
  const next = requestQueue.shift();
  next?.();
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function transformQuestion(raw: OpenTDBQuestion): QuestionWithAnswer {
  const correctAnswer = decodeHTML(raw.correct_answer);
  const incorrectAnswers = raw.incorrect_answers.map(decodeHTML);
  const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);

  return {
    id: nanoid(),
    category: decodeHTML(raw.category),
    difficulty: raw.difficulty as Difficulty,
    type: raw.type as "multiple" | "boolean",
    question: decodeHTML(raw.question),
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
    amount: options.amount.toString(),
  });

  if (options.category) params.set("category", options.category.toString());
  if (options.difficulty) params.set("difficulty", options.difficulty);
  if (options.type) params.set("type", options.type);

  const url = `${OPENTDB_BASE}/api.php?${params}`;
  const response = await rateLimitedFetch(url);
  const data: OpenTDBResponse = await response.json();

  if (data.response_code !== 0) {
    const errors: Record<number, string> = {
      1: "Not enough questions available for this criteria",
      2: "Invalid parameter",
      3: "Token not found",
      4: "Token exhausted — all questions seen",
      5: "Rate limited — please wait",
    };
    throw new Error(errors[data.response_code] || "Unknown API error");
  }

  return data.results.map(transformQuestion);
}

let categoriesCache: TriviaCategory[] | null = null;
let categoriesCacheTime = 0;
const CATEGORIES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchCategories(): Promise<TriviaCategory[]> {
  if (
    categoriesCache &&
    Date.now() - categoriesCacheTime < CATEGORIES_CACHE_TTL
  ) {
    return categoriesCache;
  }

  const response = await rateLimitedFetch(
    `${OPENTDB_BASE}/api_category.php`
  );
  const data = await response.json();

  categoriesCache = data.trivia_categories.map(
    (c: { id: number; name: string }) => ({
      id: c.id,
      name: c.name.replace(/^Entertainment: |^Science: /, ""),
    })
  );
  categoriesCacheTime = Date.now();

  return categoriesCache!;
}

// Strip the correct answer from questions before sending to client
export function sanitizeForClient(
  questions: QuestionWithAnswer[]
): TriviaQuestion[] {
  return questions.map(({ correctAnswer, incorrectAnswers, ...rest }) => rest);
}
