"use client";

import { useState, useEffect } from "react";

import { Word } from "@/types";
import { audioService } from "@/lib/audio";

interface UseFlashcardsProps {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export function useFlashcards({ words, onComplete }: UseFlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [direction, setDirection] = useState<number>(0);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (isFlipped && currentWord) {
      audioService.speak(currentWord.en);
      if (currentWord.en_example) {
        audioService.speak(currentWord.en_example, { cancel: false });
      }
    }
  }, [isFlipped, currentWord]);

  const handleNext = (isKnown: boolean) => {
    if (!currentWord) return;

    const wordId = currentWord.id;
    const newErrorIds =
      !isKnown && !errorIds.includes(wordId) ? [...errorIds, wordId] : errorIds;

    if (!isKnown) {
      setErrorIds(newErrorIds);
      audioService.playError();
    } else {
      audioService.playSuccess();
    }

    setDirection(isKnown ? 1 : -1);

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
        setDirection(0);
      } else {
        onComplete(newErrorIds);
      }
    }, 400);
  };

  return {
    state: {
      currentIndex,
      isFlipped,
      errorIds,
      direction,
      currentWord,
    },
    actions: {
      setIsFlipped,
      handleNext,
    },
  };
}
