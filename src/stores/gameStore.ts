import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  GameConfig,
  GameStatus,
  TriviaQuestion,
  AnswerResult,
  GameResult,
} from "@/types/trivia";

const USER_ID_KEY = "triviaworld_user_id";

function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = nanoid();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

interface GameState {
  config: GameConfig | null;
  sessionId: string | null; // question-store session (for answer validation)
  dbSessionId: string | null; // database session (for persistence)
  userId: string | null;
  status: GameStatus;
  questions: TriviaQuestion[];
  currentIndex: number;
  answers: AnswerResult[];
  score: number;
  streak: number;
  lives: number;
  timeRemaining: number;
  questionStartTime: number;
  result: GameResult | null;

  startGame: (config: GameConfig) => Promise<void>;
  submitAnswer: (selectedAnswer: string) => Promise<AnswerResult>;
  nextQuestion: () => void;
  timeUp: () => Promise<void>;
  setTimeRemaining: (time: number) => void;
  finishGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  config: null,
  sessionId: null,
  dbSessionId: null,
  userId: null,
  status: "idle",
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  streak: 0,
  lives: 3,
  timeRemaining: 0,
  questionStartTime: 0,
  result: null,

  startGame: async (config: GameConfig) => {
    const sessionId = nanoid();
    const userId = getUserId();

    set({
      config,
      sessionId,
      userId,
      status: "loading",
      questions: [],
      currentIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      lives: config.mode === "survival" ? 3 : Infinity,
      timeRemaining: config.timePerQuestion,
      result: null,
    });

    try {
      // Create DB session
      const sessionRes = await fetch("/api/game/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          mode: config.mode,
          category: config.categoryName,
          difficulty: config.difficulty,
        }),
      });
      const sessionData = await sessionRes.json();
      const dbSessionId = sessionData.sessionId;

      // Fetch questions
      const params = new URLSearchParams({
        amount: config.questionCount.toString(),
        sessionId,
      });
      if (config.category) params.set("category", config.category.toString());
      if (config.difficulty) params.set("difficulty", config.difficulty);

      const response = await fetch(`/api/trivia/questions?${params}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch questions");
      }

      const data = await response.json();
      set({
        questions: data.questions,
        dbSessionId,
        status: "playing",
        timeRemaining: config.timePerQuestion,
        questionStartTime: Date.now(),
      });
    } catch (error) {
      set({ status: "idle" });
      throw error;
    }
  },

  submitAnswer: async (selectedAnswer: string) => {
    const state = get();
    if (state.status !== "playing" || !state.config || !state.sessionId) {
      throw new Error("No active game");
    }

    const question = state.questions[state.currentIndex];
    const timeSpent = Date.now() - state.questionStartTime;

    const response = await fetch("/api/game/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: state.sessionId,
        dbSessionId: state.dbSessionId,
        questionId: question.id,
        selectedAnswer,
        timeSpent,
        mode: state.config.mode,
        streak: state.streak,
        timeLimit: state.config.timePerQuestion,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    const answerResult: AnswerResult = {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: result.correctAnswer,
      isCorrect: result.isCorrect,
      timeSpent,
      points: result.points,
    };

    const newStreak = result.isCorrect ? state.streak + 1 : 0;
    const newLives =
      !result.isCorrect && state.config.mode === "survival"
        ? state.lives - 1
        : state.lives;

    set({
      answers: [...state.answers, answerResult],
      score: state.score + result.points,
      streak: newStreak,
      lives: newLives,
      status: "reviewing",
    });

    return answerResult;
  },

  nextQuestion: () => {
    const state = get();
    if (!state.config) return;

    const nextIndex = state.currentIndex + 1;

    if (
      nextIndex >= state.questions.length ||
      (state.config.mode === "survival" && state.lives <= 0)
    ) {
      get().finishGame();
      return;
    }

    set({
      currentIndex: nextIndex,
      status: "playing",
      timeRemaining: state.config.timePerQuestion,
      questionStartTime: Date.now(),
    });
  },

  timeUp: async () => {
    const state = get();
    if (state.status !== "playing") return;

    const question = state.questions[state.currentIndex];
    const timeSpent = state.config!.timePerQuestion * 1000;

    const answerResult: AnswerResult = {
      questionId: question.id,
      selectedAnswer: "",
      correctAnswer: "",
      isCorrect: false,
      timeSpent,
      points: 0,
    };

    try {
      const response = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          dbSessionId: state.dbSessionId,
          questionId: question.id,
          selectedAnswer: "__TIMEOUT__",
          timeSpent,
          mode: state.config!.mode,
          streak: 0,
          timeLimit: state.config!.timePerQuestion,
        }),
      });
      const result = await response.json();
      answerResult.correctAnswer = result.correctAnswer;
    } catch {
      // continue anyway
    }

    const newLives =
      state.config!.mode === "survival" ? state.lives - 1 : state.lives;

    set({
      answers: [...state.answers, answerResult],
      streak: 0,
      lives: newLives,
      status: "reviewing",
    });
  },

  setTimeRemaining: (time: number) => {
    set({ timeRemaining: time });
  },

  finishGame: () => {
    const state = get();
    if (!state.config) return;

    const correctCount = state.answers.filter((a) => a.isCorrect).length;
    const totalTime = state.answers.reduce((sum, a) => sum + a.timeSpent, 0);

    const result: GameResult = {
      sessionId: state.dbSessionId || undefined,
      mode: state.config.mode,
      score: state.score,
      maxScore: state.questions.length * 200,
      correctCount,
      totalQuestions: state.answers.length,
      accuracy:
        state.answers.length > 0 ? correctCount / state.answers.length : 0,
      avgTime:
        state.answers.length > 0 ? totalTime / state.answers.length : 0,
      answers: state.answers,
      startedAt: new Date(Date.now() - totalTime),
      finishedAt: new Date(),
    };

    set({ status: "finished", result });

    // Complete session in background
    if (state.dbSessionId && state.userId) {
      fetch("/api/game/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.dbSessionId,
          userId: state.userId,
        }),
      }).catch(() => {});
    }
  },

  resetGame: () => {
    set({
      config: null,
      sessionId: null,
      dbSessionId: null,
      userId: null,
      status: "idle",
      questions: [],
      currentIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      lives: 3,
      timeRemaining: 0,
      questionStartTime: 0,
      result: null,
    });
  },
}));
