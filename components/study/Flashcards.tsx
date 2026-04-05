"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";

import { StudyHeader } from "./StudyHeader";
import { GameButton } from "@/components/ui/GameButton";
import { Word } from "@/types";
import { useFlashcards } from "@/hooks/useFlashcards";
import { FlashcardItem } from "./flashcards/FlashcardItem";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export default function Flashcards({ words, onComplete }: Props) {
  const {
    state: { currentIndex, isFlipped, direction, currentWord },
    actions: { setIsFlipped, handleNext },
  } = useFlashcards({ words, onComplete });

  if (!currentWord) return <div className="text-center py-10 font-bold">Brak słówek...</div>;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6 sm:py-10 relative overflow-hidden">
      <StudyHeader
        className="max-w-md px-2"
        color="primary"
        current={currentIndex + 1}
        title="Etap 1: Fiszki"
        total={words.length}
      />

      <div className="w-full h-[480px] sm:h-[550px] relative px-2 max-w-md">
        <AnimatePresence mode="wait">
          <FlashcardItem
            key={currentIndex}
            direction={direction}
            isFlipped={isFlipped}
            word={currentWord}
            onClick={() => setIsFlipped(!isFlipped)}
          />
        </AnimatePresence>
      </div>

      <div className="flex gap-4 w-full max-w-md px-2 mt-4">
        <GameButton
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl"
          color="danger"
          variant="flat"
          onClick={(e) => {
            e.stopPropagation();
            handleNext(false);
          }}
        >
          NIE ZNAM
        </GameButton>
        <GameButton
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl"
          color="success"
          variant="shadow"
          onClick={(e) => {
            e.stopPropagation();
            handleNext(true);
          }}
        >
          ZNAM
        </GameButton>
      </div>
    </div>
  );
}
