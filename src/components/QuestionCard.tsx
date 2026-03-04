"use client";

import { useGameStore } from "@/stores/gameStore";
import { useSound } from "@/hooks/useSound";
import { Timer } from "./Timer";
import { AnswerButton } from "./AnswerButton";
import { useState } from "react";

export function QuestionCard() {
  const questions = useGameStore((s) => s.questions);
  const currentIndex = useGameStore((s) => s.currentIndex);
  const status = useGameStore((s) => s.status);
  const submitAnswer = useGameStore((s) => s.submitAnswer);
  const nextQuestion = useGameStore((s) => s.nextQuestion);
  const config = useGameStore((s) => s.config);
  const lives = useGameStore((s) => s.lives);
  const answers = useGameStore((s) => s.answers);

  const { playCorrect, playWrong } = useSound();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentIndex];
  if (!question || !config) return null;

  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;
  const isReviewing = status === "reviewing";

  const handleSelect = async (answer: string) => {
    if (isReviewing || submitting) return;
    setSubmitting(true);
    setSelectedAnswer(answer);

    try {
      const result = await submitAnswer(answer);
      setAnswerResult({
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
      });
      if (result.isCorrect) playCorrect();
      else playWrong();
    } catch {
      setSubmitting(false);
      setSelectedAnswer(null);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswerResult(null);
    setSubmitting(false);
    nextQuestion();
  };

  const getAnswerState = (answer: string) => {
    if (!isReviewing || !answerResult) return "default";
    if (answer === answerResult.correctAnswer) return "correct";
    if (answer === selectedAnswer && !answerResult.isCorrect) return "incorrect";
    return "dimmed";
  };

  // Also handle timeout review
  const timeoutResult =
    isReviewing && !answerResult && lastAnswer
      ? { isCorrect: false, correctAnswer: lastAnswer.correctAnswer }
      : null;

  const effectiveResult = answerResult || timeoutResult;

  const getTimeoutState = (answer: string) => {
    if (!isReviewing || !timeoutResult) return "default";
    if (answer === timeoutResult.correctAnswer) return "correct";
    return "dimmed";
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--muted)]">
            {currentIndex + 1} / {questions.length}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              question.difficulty === "easy"
                ? "bg-green-500/20 text-green-500"
                : question.difficulty === "medium"
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {question.difficulty}
          </span>
          {config.mode === "survival" && (
            <span className="text-sm">
              {"❤️".repeat(Math.max(0, lives))}
            </span>
          )}
        </div>
        {status === "playing" && <Timer />}
      </div>

      {/* Category */}
      <p className="text-xs text-[var(--muted)] mb-2">{question.category}</p>

      {/* Question */}
      <h2 className="text-xl font-semibold mb-6 leading-relaxed">
        {question.question}
      </h2>

      {/* Answers */}
      <div className="grid gap-3">
        {question.answers.map((answer, i) => (
          <AnswerButton
            key={`${question.id}-${i}`}
            answer={answer}
            index={i}
            state={answerResult ? getAnswerState(answer) : getTimeoutState(answer)}
            disabled={submitting || isReviewing}
            onClick={() => handleSelect(answer)}
          />
        ))}
      </div>

      {/* Review feedback */}
      {isReviewing && effectiveResult && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div
            className={`text-center text-lg font-semibold ${
              effectiveResult.isCorrect
                ? "text-[var(--success)]"
                : "text-[var(--danger)]"
            }`}
          >
            {effectiveResult.isCorrect
              ? "Correct!"
              : selectedAnswer
              ? "Incorrect!"
              : "Time's up!"}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            {currentIndex + 1 >= questions.length ||
            (config.mode === "survival" && lives <= 0)
              ? "See Results"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}
