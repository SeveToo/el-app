"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { motion, AnimatePresence } from "framer-motion";

import { GameButton } from "@/components/ui/GameButton";
import { audioService } from "@/lib/audio";
import { Question } from "@/types";

interface Props {
  questions: Question[];
  onComplete: (wrongAnswers: string[], localQuestionsSize: number) => void;
}

const OPTIONS = ["a", "an", "the", "at", "–"];

export default function ArticlesPractice({ questions, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load scores and pick 10 questions
  useEffect(() => {
    if (localQuestions.length === 0) {
      const savedScores = JSON.parse(
        localStorage.getItem("article_scores") || "{}",
      );
      const available = questions.filter((q) => (savedScores[q.id] || 0) < 5);
      const pool = available.length > 0 ? available : questions;
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);

      setLocalQuestions(shuffled);
    }
  }, [questions, localQuestions.length]);

  const updateScore = (qId: string, delta: number) => {
    const savedScores = JSON.parse(
      localStorage.getItem("article_scores") || "{}",
    );
    const currentScore = savedScores[qId] || 0;
    const newScore = Math.max(0, Math.min(5, currentScore + delta));

    savedScores[qId] = newScore;
    localStorage.setItem("article_scores", JSON.stringify(savedScores));
  };

  const currentQ = localQuestions[currentIndex];

  // Auto-scroll
  useEffect(() => {
    if (cardRefs.current[currentIndex]) {
      cardRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  const nextQuestion = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setCooldown(0);

    if (currentIndex < localQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(wrongAnswers, localQuestions.length);
    }
  };

  const speakExplanation = (text: string) => {
    const parts = text.split(/('[\w\s-]+')/g);

    parts.forEach((part, index) => {
      if (!part.trim()) return;
      const isEnglish = part.startsWith("'") && part.endsWith("'");
      const cleanText = isEnglish ? part.slice(1, -1) : part;

      audioService.speak(cleanText, {
        lang: isEnglish ? "en-US" : "pl-PL",
        cancel: index === 0,
      });
    });
  };

  const handleChoice = (choice: string) => {
    if (!currentQ || showExplanation || isCorrect === true) return;

    setSelectedOption(choice);
    const correct = choice.toLowerCase() === currentQ.correct.toLowerCase();

    if (correct) {
      setIsCorrect(true);
      audioService.playSuccess();
      audioService.speak(currentQ.sentence.replace("___", choice));
      updateScore(currentQ.id, 1);
      setTimeout(() => nextQuestion(), 1200);
    } else {
      setIsCorrect(false);
      audioService.playError();
      setWrongAnswers((prev) => [...prev, currentQ.id]);
      setShowExplanation(true);
      speakExplanation(currentQ.explanation);
      updateScore(currentQ.id, -3);

      setCooldown(0);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev >= 100) {
            clearInterval(timer);

            return 100;
          }

          return prev + 1.1;
        });
      }, 30);

      const qCopy = {
        ...currentQ,
        id: `${currentQ.id}-retry-${Date.now()}`,
      };

      setLocalQuestions((prev) => [...prev, qCopy]);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExplanation) {
        if (e.key === "Enter" && cooldown >= 100) nextQuestion();

        return;
      }
      const keyMap: Record<string, string> = {
        "1": "a",
        "2": "an",
        "3": "the",
        "4": "at",
        "5": "–",
      };

      if (keyMap[e.key]) handleChoice(keyMap[e.key]);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentIndex,
    isCorrect,
    showExplanation,
    cooldown,
    localQuestions.length,
  ]);

  if (localQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center p-20 text-primary font-black animate-pulse uppercase tracking-widest w-full text-center">
        Przygotowuję zadania... ⚙️
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-6 sm:py-10 px-4 min-h-[600px] pb-40">
      <div className="w-full space-y-2">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-primary">
          <span>ETAP: PRZEDIMKI</span>
          <span>
            {currentIndex + 1} / {localQuestions.length}
          </span>
        </div>
        <Progress
          className="h-1.5"
          color="primary"
          size="sm"
          value={
            (localQuestions.filter(
              (q, i) =>
                i < currentIndex || (i === currentIndex && isCorrect === true),
            ).length /
              localQuestions.length) *
            100
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        {localQuestions.map((q, index) => {
          const isActive = currentIndex === index;
          const isDone =
            index < currentIndex ||
            (index === currentIndex && isCorrect === true);

          return (
            <Card
              key={q.id}
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[index] = el;
              }}
              className={`transition-all duration-500 border-2 active:scale-[0.98] ${
                isActive
                  ? "border-primary ring-8 ring-primary/5 bg-primary/5 shadow-2xl z-10 translate-y-[-2px]"
                  : "border-transparent bg-content1 shadow-sm opacity-50 grayscale-[0.2]"
              } ${isDone && !isActive ? "opacity-90 grayscale-0 !bg-success/5 !border-success/20 pointer-events-none" : ""}`}
              onClick={() => {
                if (!isDone) setCurrentIndex(index);
              }}
            >
              <CardBody className="p-6 sm:p-8">
                <div className="space-y-3">
                  <div className="text-lg sm:text-xl font-black text-foreground !leading-relaxed">
                    {q.sentence.split("___").map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <div className="relative inline-flex flex-col items-center mx-2 min-w-[60px] align-bottom h-10 sm:h-12 justify-end">
                            <AnimatePresence>
                              {isActive && isCorrect === false && (
                                <motion.span
                                  animate={{ opacity: 1, y: -20, rotate: -5 }}
                                  className="absolute -top-1 left-1/2 -translate-x-1/2 text-success font-black text-lg sm:text-2xl whitespace-nowrap italic drop-shadow-sm select-none"
                                  exit={{ opacity: 0 }}
                                  initial={{ opacity: 0, y: 10, rotate: -5 }}
                                  style={{
                                    fontFamily: "var(--font-cursive, cursive)",
                                  }}
                                >
                                  {q.correct}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <span
                              className={`w-full border-b-4 text-center pb-0.5 transition-all duration-300 ${(isActive && isCorrect === true) || (isDone && !isActive) ? "text-success border-success" : isActive && isCorrect === false ? "text-default-300 border-default-200 line-through opacity-60 scale-95" : isActive ? "text-primary border-primary animate-pulse" : "text-default-200 border-default-200"}`}
                            >
                              {isActive
                                ? selectedOption || "___"
                                : isDone
                                  ? q.correct
                                  : "___"}
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-default-400 font-bold uppercase tracking-widest text-[10px] italic">
                    {q.pl}
                  </p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t z-[110] shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {OPTIONS.map((opt, i) => (
              <GameButton
                key={opt}
                className={`h-16 sm:h-24 text-xl sm:text-3xl rounded-3xl ${currentIndex < localQuestions.length && selectedOption === opt ? (isCorrect ? "" : "shake") : ""}`}
                color={
                  currentIndex < localQuestions.length && selectedOption === opt
                    ? isCorrect
                      ? "success"
                      : "danger"
                    : "primary"
                }
                isDisabled={isCorrect === true || showExplanation}
                variant={
                  currentIndex < localQuestions.length && selectedOption === opt
                    ? "solid"
                    : "bordered"
                }
                onClick={() => handleChoice(opt)}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] opacity-40 mb-1">{i + 1}</span>
                  <span>{opt}</span>
                </div>
              </GameButton>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
                exit={{ opacity: 0, scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
              >
                <Card className="border-none bg-white border-2 border-danger/20 rounded-2xl shadow-xl">
                  <CardBody className="p-5 text-center flex flex-row items-center justify-between gap-4">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-danger uppercase tracking-widest mb-1">
                        ❌ WYJAŚNIENIE
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-danger/80 leading-tight italic">
                        {currentQ.explanation}
                      </p>
                    </div>
                    <GameButton
                      className="rounded-xl px-6 min-w-fit relative overflow-hidden h-12"
                      color="danger"
                      isDisabled={cooldown < 100}
                      onClick={nextQuestion}
                    >
                      <div
                        className="absolute left-0 bottom-0 top-0 bg-white/20 transition-all duration-75"
                        style={{ width: `${cooldown}%` }}
                      />
                      <span className="relative z-10">
                        {cooldown < 100 ? "Analiza..." : "Dalej ➔"}
                      </span>
                    </GameButton>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
        .shake {
          animation: shake 0.4s ease;
        }
      `}</style>
    </div>
  );
}
