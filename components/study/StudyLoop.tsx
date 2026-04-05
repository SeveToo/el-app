"use client";

import React from "react";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";
import Link from "next/link";

import Flashcards from "./Flashcards";
import FastReview from "./FastReview";
import MatchingGame from "./MatchingGame";
import WrittenTest from "./WrittenTest";
import SentenceFill from "./SentenceFill";

import { Word } from "@/types";
import { useStudyManager, STAGES, Stage } from "@/hooks/useStudyManager";

export default function StudyLoop({
  words,
  chapterId,
}: {
  words: Word[];
  chapterId: string;
}): React.JSX.Element | null {
  const {
    state: {
      roundIndex,
      stage,
      globalErrorIds,
      currentGroup,
      isInitializing,
      hasSavedProgress,
      resumeProgress,
      stageIndex,
      totalRounds,
      globalProgress,
    },
    actions: { handleResume, handleRestart, handleStageComplete, goToStage },
  } = useStudyManager({ words, chapterId });

  if (isInitializing && hasSavedProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8 text-center px-4 max-w-md mx-auto">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">
            Witaj ponownie! 👋
          </h2>
          <p className="text-default-500 font-medium">
            Masz niedokończoną lekcję w tej sekcji. Co chcesz zrobić?
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button
            className="w-full h-16 text-xl font-black uppercase tracking-widest rounded-2xl shadow-xl"
            color="primary"
            size="lg"
            onClick={handleResume}
          >
            Kontynuuj 🚀 {resumeProgress}%
          </Button>
          <Button
            className="w-full h-14 font-bold uppercase tracking-widest rounded-2xl"
            size="lg"
            variant="ghost"
            onClick={handleRestart}
          >
            Zacznij od nowa 🔄
          </Button>
        </div>
      </div>
    );
  }

  if (isInitializing) return null;

  if (stage === "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-success to-primary uppercase tracking-tighter mb-2 animate-bounce">
          SUPER! 🚀
        </h1>
        <h2 className="text-3xl font-bold text-default-700">🏆 Gratulacje!</h2>
        <p className="text-xl font-medium text-default-500 max-w-md mt-2">
          Rozwaliłeś ten układ! Wszystkie luki wypełnione prawidłowo. Oby tak
          dalej! 💎
        </p>

        <Link href="/">
          <Button
            className="px-10 font-bold text-lg uppercase tracking-widest h-14 rounded-2xl shadow-xl"
            color="primary"
            size="lg"
          >
            Powrót do menu 🏠
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      {/* Nagłówek z postępem */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-default-400">
          <span>
            Runda {roundIndex + 1} / {totalRounds}
          </span>
          <span>Postęp: {globalProgress}%</span>
        </div>

        <Progress color="primary" size="sm" value={globalProgress} />

        {/* Pasek etapów (wybór etapu) */}
        <div className="flex gap-1.5 w-full mt-2">
          {STAGES.map((s, idx) => {
            const stageNames = ["Fiszki", "Oceń", "Gra", "Pisanie", "Zdania"];
            const isActive = stage === s;
            const isCompleted = (stageIndex as number) > idx;

            return (
              <Button
                key={s}
                className={`flex-1 min-w-0 h-10 px-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  isActive
                    ? "shadow-md scale-105 z-10 bg-primary text-primary-foreground"
                    : "bg-default-100 hover:bg-default-200"
                }`}
                color={
                  isActive ? "primary" : isCompleted ? "success" : "default"
                }
                size="sm"
                variant={isActive ? "solid" : isCompleted ? "flat" : "light"}
                onClick={() => goToStage(s as Stage)}
              >
                {stageNames[idx]}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Błędy do powtórki (info) */}
      {globalErrorIds.length > 0 && (
        <div className="mb-4 px-4 py-2 bg-warning/10 border border-warning/20 rounded-xl text-xs text-warning font-semibold text-center">
          ⚠️ {globalErrorIds.length} słówek trafi do powtórki w następnej
          rundzie
        </div>
      )}

      {/* Aktywny komponent etapu */}
      <div>
        {stage === "flashcards" && (
          <Flashcards words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === "fast_review" && (
          <FastReview words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === "matching" && (
          <MatchingGame words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === "written" && (
          <WrittenTest words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === "sentence_fill" && (
          <SentenceFill words={currentGroup} onComplete={handleStageComplete} />
        )}
      </div>
    </div>
  );
}
