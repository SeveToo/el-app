"use client";

import { useState, useEffect } from "react";

import { Word } from "@/types";
import { audioService } from "@/lib/audio";

interface UseFastReviewProps {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export function useFastReview({ words, onComplete }: UseFastReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorIds] = useState<string[]>([]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      audioService.speak(currentWord.en);
      if (currentWord.en_example) {
        audioService.speak(currentWord.en_example, { cancel: false });
      }
    }
  }, [currentIndex, currentWord]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(errorIds);
    }
  };

  return {
    state: {
      currentIndex,
      currentWord,
    },
    actions: {
      handleNext,
    },
  };
}
