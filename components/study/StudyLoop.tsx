"use client";

import React from "react";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";
import Link from "next/link";
import { motion } from "framer-motion";

import Flashcards from "./Flashcards";
import FastReview from "./FastReview";
import MatchingGame from "./MatchingGame";
import WrittenTest from "./WrittenTest";
import SentenceFill from "./SentenceFill";
import { GameButton } from "@/components/ui/GameButton";

import { Word } from "@/types";
import { useStudyManager } from "@/hooks/useStudyManager";
import { STAGES, Stage } from "@/lib/progress";

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
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-12 text-center px-4 max-w-lg mx-auto"
      >
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter leading-tight">
            Wznów <span className="text-primary italic">naukę</span>
          </h2>
        </div>

        <div className="flex flex-col items-center gap-10 w-full">
          {/* Progress Indicator */}
          <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80" cy="80" r="74"
                fill="none"
                className="stroke-default-100"
                strokeWidth="12"
              />
              <motion.circle
                cx="80" cy="80" r="74"
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: resumeProgress / 100 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-foreground">{resumeProgress}%</span>
              <span className="text-[10px] font-black uppercase text-default-400 tracking-widest">ukończono</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <GameButton
              color="primary"
              onClick={handleResume}
            >
              KONTYNUUJ
            </GameButton>
            
            <GameButton
              color="primary"
              variant="bordered"
              className="h-14 text-sm opacity-60 hover:opacity-100 border-none border-b-0 shadow-none hover:bg-default-100"
              onClick={handleRestart}
            >
              ZACZNIJ OD NOWA
            </GameButton>
          </div>
        </div>
      </motion.div>
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
          {STAGES.map((s: Stage, idx: number) => {
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
        <div className="mb-4 px-4 py-2 bg-warning/10 border border-warning/20 rounded-xl text-xs text-amber-700 dark:text-warning font-semibold text-center">
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
