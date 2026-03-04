export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple" | "boolean";
export type GameMode = "quick" | "daily" | "marathon" | "survival";
export type GameStatus = "idle" | "loading" | "playing" | "reviewing" | "finished";

export interface TriviaCategory {
  id: number;
  name: string;
}

export interface TriviaQuestion {
  id: string;
  category: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  answers: string[]; // shuffled, correct answer NOT indicated client-side
}

export interface QuestionWithAnswer extends TriviaQuestion {
  correctAnswer: string;
  incorrectAnswers: string[];
}

export interface AnswerResult {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // ms
  points: number;
}

export interface GameConfig {
  mode: GameMode;
  category?: number;
  categoryName?: string;
  difficulty?: Difficulty;
  questionCount: number;
  timePerQuestion: number; // seconds
}

export interface GameResult {
  sessionId?: string;
  mode: GameMode;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  avgTime: number;
  answers: AnswerResult[];
  startedAt: Date;
  finishedAt: Date;
}

export interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

export interface OpenTDBQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  nickname: string;
  mode: GameMode;
  score: number;
  accuracy: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  isAnonymous: boolean;
  gamesPlayed: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}
