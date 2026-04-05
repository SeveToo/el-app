"use client";

import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

import { Word } from "@/types";
import { audioService } from "@/lib/audio";
import { getProgress, saveProgress, Stage, STAGES, WORDS_PER_LOOP, calcPercent } from "@/lib/progress";


const NEXT_STAGE: Record<Stage, Stage | "completed_round"> = {
  flashcards: "fast_review",
  fast_review: "matching",
  matching: "written",
  written: "sentence_fill",
  sentence_fill: "completed_round",
  completed: "completed",
};

interface UseStudyManagerProps {
  words: Word[];
  chapterId: string;
}

export function useStudyManager({ words, chapterId }: UseStudyManagerProps) {
  const [allWords] = useState<Word[]>(words);
  const [roundIndex, setRoundIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("flashcards");
  const [globalErrorIds, setGlobalErrorIds] = useState<string[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Word[]>([]);
  const [usedCount, setUsedCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [resumeProgress, setResumeProgress] = useState(0);

  const stageIndex = useMemo(() => STAGES.indexOf(stage), [stage]);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const shuffle = <T>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const persistProgress = (
    learned: number,
    currentGroupWords: Word[],
    stageOverride?: Stage,
    completed = false,
  ) => {
    const currentGroupIndices = currentGroupWords.map((w) =>
      allWords.findIndex((aw) => aw.id === w.id),
    );

    saveProgress(chapterId, {
      learnedCount: learned,
      totalWords: allWords.length,
      completedAt: completed ? new Date().toISOString() : undefined,
      roundIndex,
      stage: stageOverride || stage,
      usedCount: learned,
      globalErrorIds,
      currentGroupIndices,
    });
  };

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const saved = getProgress(chapterId);

    if (saved && !saved.completedAt && saved.usedCount !== undefined) {
      setHasSavedProgress(true);

      const pct = calcPercent(saved);
      setResumeProgress(pct);
    } else {
      setCurrentGroup(allWords.slice(0, WORDS_PER_LOOP));
      setIsInitializing(false);
    }
  }, [chapterId, allWords]);

  useEffect(() => {
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

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------
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
      totalWords: allWords.length,
    });
    setRoundIndex(0);
    setStage("flashcards");
    setUsedCount(0);
    setGlobalErrorIds([]);
    setCurrentGroup(allWords.slice(0, WORDS_PER_LOOP));
    setIsInitializing(false);
  };

  const handleStageComplete = (errorIds: string[]) => {
    const newErrors = errorIds.filter((id) => !globalErrorIds.includes(id));
    const updatedErrors = [...globalErrorIds, ...newErrors];
    setGlobalErrorIds(updatedErrors);

    const next = NEXT_STAGE[stage];

    if (next !== "completed_round" && next !== "completed") {
      setStage(next);
      persistProgress(usedCount, currentGroup, next);
    } else {
      const remaining = allWords.slice(usedCount + currentGroup.length);
      const newLearnedInThisRound = currentGroup.filter(
        (w) => !updatedErrors.includes(w.id),
      ).length;
      const totalLearnedSoFar = usedCount + newLearnedInThisRound;

      if (remaining.length > 0) {
        const nextWords = remaining.slice(0, WORDS_PER_LOOP);
        const errorWords = updatedErrors
          .map((id) => allWords.find((w) => w.id === id)!)
          .filter(Boolean);

        const slotsForNew = Math.min(nextWords.length, WORDS_PER_LOOP);
        const slotsForErrors = Math.max(0, WORDS_PER_LOOP - slotsForNew);

        const nextGroup = [
          ...errorWords.slice(0, slotsForErrors),
          ...nextWords.slice(0, slotsForNew),
        ];

        const shuffledGroup = shuffle(nextGroup);
        setCurrentGroup(shuffledGroup);
        setUsedCount(totalLearnedSoFar);
        setRoundIndex((prev) => prev + 1);
        setStage("flashcards");
        setGlobalErrorIds(updatedErrors);

        const currentGroupIndices = nextGroup.map((w) =>
          allWords.findIndex((aw) => aw.id === w.id),
        );

        saveProgress(chapterId, {
          learnedCount: totalLearnedSoFar,
          totalWords: allWords.length,
          roundIndex: roundIndex + 1,
          stage: "flashcards",
          usedCount: totalLearnedSoFar,
          globalErrorIds: updatedErrors,
          currentGroupIndices,
        });
      } else if (updatedErrors.length > 0) {
        const errorWords = updatedErrors
          .map((id) => allWords.find((w) => w.id === id)!)
          .filter(Boolean);

        const shuffledGroup = shuffle(errorWords);
        setCurrentGroup(shuffledGroup);
        setGlobalErrorIds([]);
        setRoundIndex((prev) => prev + 1);
        setStage("flashcards");
        setUsedCount(totalLearnedSoFar);

        persistProgress(totalLearnedSoFar, shuffledGroup, "flashcards");
      } else {
        persistProgress(allWords.length, currentGroup, undefined, true);
        setStage("completed");
      }
    }
  };

  const goToStage = (targetStage: Stage) => {
    setStage(targetStage);
    persistProgress(usedCount, currentGroup, targetStage);
  };

  // ---------------------------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------------------------
  const totalRounds = Math.ceil(allWords.length / WORDS_PER_LOOP);
  const currentRoundProgress = (stageIndex / STAGES.length) * currentGroup.length;
  const globalProgress = Math.round(
    (Math.min(usedCount + currentRoundProgress, allWords.length) / allWords.length) * 100,
  );


  return {
    state: {
      roundIndex,
      stage,
      globalErrorIds,
      currentGroup,
      usedCount,
      isInitializing,
      hasSavedProgress,
      resumeProgress,
      stageIndex,
      totalRounds,
      globalProgress,
    },
    actions: {
      handleResume,
      handleRestart,
      handleStageComplete,
      goToStage,
    },
  };
}
