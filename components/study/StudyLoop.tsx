"use client";

import React, { useState } from "react";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/button";
import Link from "next/link";
import confetti from "canvas-confetti";

import Flashcards from "./Flashcards";
import FastReview from "./FastReview";
import MatchingGame from "./MatchingGame";
import WrittenTest from "./WrittenTest";
import SentenceFill from "./SentenceFill";
import { saveProgress, getProgress } from "@/lib/progress";
import { Word } from "@/types";
import { audioService } from "@/lib/audio";

type Stage =
  | "flashcards"
  | "fast_review"
  | "matching"
  | "written"
  | "sentence_fill"
  | "completed";

const STAGES: Stage[] = [
  "flashcards",
  "fast_review",
  "matching",
  "written",
  "sentence_fill",
];

const WORDS_PER_LOOP = 10;

export default function StudyLoop({
  words,
  chapterId,
}: {
  words: Word[];
  chapterId: string;
}): React.JSX.Element | null {
  const [allWords] = useState<Word[]>(words);


  // Indeks bieżącej "rundy" (grupy 10 słówek)
  const [roundIndex, setRoundIndex] = useState(0);

  // Etap w ramach rundy
  const [stage, setStage] = useState<Stage>("flashcards");
  const [globalErrorIds, setGlobalErrorIds] = useState<string[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Word[]>(
    allWords.slice(0, WORDS_PER_LOOP),
  );
  const [usedCount, setUsedCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [resumeProgress, setResumeProgress] = useState(0);

  const stageIndex = STAGES.indexOf(stage);


  // ---------------------------------------------------------------------------
  // Inicjalizacja / Wznawianie
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    const saved = getProgress(chapterId);

    if (saved && !saved.completedAt && saved.usedCount !== undefined) {
      setHasSavedProgress(true);

      // Oblicz procent do wyświetlenia na ekranie "Wznów"
      const sIndex = STAGES.indexOf((saved.stage as Stage) || "flashcards");
      const groupSize = saved.currentGroupIndices?.length ?? WORDS_PER_LOOP;
      const added = (sIndex / STAGES.length) * groupSize;
      const pct = Math.round(
        (Math.min(saved.usedCount + added, allWords.length) / allWords.length) *
          100,
      );

      setResumeProgress(pct);
    } else {
      setIsInitializing(false);
    }
  }, [chapterId, allWords.length]);


  const handleResume = () => {
    const saved = getProgress(chapterId);

    if (saved) {
      if (saved.roundIndex !== undefined) setRoundIndex(saved.roundIndex);
      if (saved.stage !== undefined) setStage(saved.stage as Stage);
      if (saved.usedCount !== undefined) setUsedCount(saved.usedCount);
      if (saved.globalErrorIds !== undefined)
        setGlobalErrorIds(saved.globalErrorIds);

      if (saved.currentGroupIndices !== undefined) {
        const group = saved.currentGroupIndices
          .map((idx) => allWords[idx])
          .filter(Boolean);

        setCurrentGroup(group);
      } else if (saved.usedCount !== undefined) {
        // Fallback dla starych zapisów
        setCurrentGroup(
          allWords.slice(saved.usedCount, saved.usedCount + WORDS_PER_LOOP),
        );
      }
    }
    setIsInitializing(false);
  };

  const handleRestart = () => {
    saveProgress(chapterId, {
      learnedCount: 0,
      totalWords: words.length,
    });
    setIsInitializing(false);
  };

  // ---------------------------------------------------------------------------
  // Zapis postępu
  // ---------------------------------------------------------------------------
  const persistProgress = (
    learned: number,
    stageOverride?: Stage,
    completed = false,
  ) => {
    const currentGroupIndices = currentGroup.map((w) =>
      allWords.findIndex((aw) => aw.id === w.id),
    );

    saveProgress(chapterId, {
      learnedCount: learned,
      totalWords: words.length,
      completedAt: completed ? new Date().toISOString() : undefined,
      roundIndex,
      stage: stageOverride || stage,
      usedCount: learned,
      globalErrorIds,
      currentGroupIndices,
    });
  };

  const NEXT_STAGE: Record<Stage, Stage | "completed_round"> = {
    flashcards: "fast_review",
    fast_review: "matching",
    matching: "written",
    written: "sentence_fill",
    sentence_fill: "completed_round",
    completed: "completed",
  };

  // ---------------------------------------------------------------------------
  // Zebranie błędów z etapu + przejście do następnego
  // ---------------------------------------------------------------------------
  const handleStageComplete = (errorIds: string[]) => {
    // Dodaj nowe błędy do globalnej listy (bez duplikatów)
    const newErrors = errorIds.filter((id) => !globalErrorIds.includes(id));
    const updatedErrors = [...globalErrorIds, ...newErrors];

    setGlobalErrorIds(updatedErrors);

    const next = NEXT_STAGE[stage];

    if (next !== "completed_round" && next !== "completed") {
      // Kolejny etap w ramach tej samej rundy
      setStage(next);
      persistProgress(usedCount, next);
    } else {
      // Koniec wszystkich etapów dla tej rundy
      const remaining = allWords.slice(usedCount + currentGroup.length); // słowa jeszcze nigdy nie użyte
      const newLearnedInThisRound = currentGroup.filter(
        (w) => !updatedErrors.includes(w.id),
      ).length;
      const totalLearnedSoFar = usedCount + newLearnedInThisRound;

      if (remaining.length > 0) {
        // Są jeszcze nowe słówka
        const newWords = remaining.slice(0, WORDS_PER_LOOP);
        const errorWords = updatedErrors
          .map((id) => allWords.find((w) => w.id === id)!)
          .filter(Boolean);

        const slotsForNew = Math.min(newWords.length, WORDS_PER_LOOP);
        const slotsForErrors = Math.max(0, WORDS_PER_LOOP - slotsForNew);

        const nextGroup = [
          ...errorWords.slice(0, slotsForErrors),
          ...newWords.slice(0, slotsForNew),
        ];

        setCurrentGroup(shuffled(nextGroup));
        setUsedCount(totalLearnedSoFar);
        setRoundIndex(roundIndex + 1);
        setStage("flashcards");
        setGlobalErrorIds(updatedErrors); // Te błędy przechodzą do następnej rundy

        // Zapisujemy nowy stan
        const currentGroupIndices = nextGroup.map((w) =>
          allWords.findIndex((aw) => aw.id === w.id),
        );

        saveProgress(chapterId, {
          learnedCount: totalLearnedSoFar,
          totalWords: words.length,
          roundIndex: roundIndex + 1,
          stage: "flashcards",
          usedCount: totalLearnedSoFar,
          globalErrorIds: updatedErrors,
          currentGroupIndices,
        });
      } else if (updatedErrors.length > 0) {
        // Brak nowych słów, ale są błędy
        const errorWords = updatedErrors
          .map((id) => allWords.find((w) => w.id === id)!)
          .filter(Boolean);

        setCurrentGroup(shuffled(errorWords));
        setGlobalErrorIds([]); // Resetujemy - te błędy są "teraz obsługiwane"
        setRoundIndex(roundIndex + 1);
        setStage("flashcards");
        setUsedCount(totalLearnedSoFar);

        persistProgress(totalLearnedSoFar, "flashcards");
      } else {
        // Wszystko ukończone!
        persistProgress(allWords.length, undefined, true);
        setStage("completed");
      }
    }
  };

  const goToStage = (targetStage: Stage) => {
    setStage(targetStage);
    persistProgress(usedCount, targetStage);
  };

  const totalRounds = Math.ceil(allWords.length / WORDS_PER_LOOP);

  const currentRoundProgress =
    (stageIndex / STAGES.length) * currentGroup.length;
  const globalProgress = Math.round(
    (Math.min(usedCount + currentRoundProgress, allWords.length) /
      allWords.length) *
      100,
  );

  React.useEffect(() => {
    if (stage === "completed") {
      audioService.playSuccess();
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ffffff"],
      });
    }
  }, [stage]);

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
            const isCompleted = stageIndex > idx;

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
                onClick={() => goToStage(s)}
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

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
