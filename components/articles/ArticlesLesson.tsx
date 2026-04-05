"use client";

import React, { useState } from "react";

import ArticlesIntro from "./ArticlesIntro";
import ArticlesPractice from "./ArticlesPractice";
import ArticlesSummary from "./ArticlesSummary";

import { Question } from "@/types";
import { STORAGE_KEYS } from "@/config/storage-keys";

interface Props {
  questions: Question[];
}

export default function ArticlesLesson({ questions }: Props) {
  const [view, setView] = useState<"intro" | "practice" | "summary">("intro");
  const [results, setResults] = useState<{
    wrongAnswers: string[];
    totalTasks: number;
  } | null>(null);

  const handlePracticeComplete = (
    wrongAnswers: string[],
    totalTasks: number,
  ) => {
    setResults({ wrongAnswers, totalTasks });
    setView("summary");
  };

  if (view === "intro") {
    return (
      <ArticlesIntro
        questions={questions}
        onStart={() => setView("practice")}
      />
    );
  }

  if (view === "practice") {
    return (
      <ArticlesPractice
        questions={questions}
        onComplete={handlePracticeComplete}
      />
    );
  }

  if (view === "summary" && results) {
    const accuracy = Math.round(
      ((results.totalTasks - new Set(results.wrongAnswers).size) /
        results.totalTasks) *
        100,
    );

    // Save to localStorage for intro screen
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ARTICLE_ACCURACY, accuracy.toString());
    }

    return (
      <ArticlesSummary accuracy={accuracy} totalTasks={results.totalTasks} />
    );
  }

  return null;
}
