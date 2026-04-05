"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { motion, AnimatePresence } from "framer-motion";

import { StudyHeader } from "./StudyHeader";

import { GameButton } from "@/components/ui/GameButton";
import { Word } from "@/types";
import { WordImage } from "@/components/ui/WordImage";
import { useFastReview } from "@/hooks/useFastReview";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
  onWordAction: (wordId: string, customPoints?: number) => void;
}

export default function FastReview({ words, onComplete, onWordAction }: Props) {
  const {
    state: { currentIndex, currentWord },
    actions: { handleNext },
  } = useFastReview({ words, onComplete });

  React.useEffect(() => {
    if (currentWord) onWordAction(currentWord.id);
  }, [currentIndex, currentWord, onWordAction]);

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto py-6 sm:py-10">
      <StudyHeader
        color="warning"
        current={currentIndex + 1}
        title="Etap 2: Szybka powtórka"
        total={words.length}
      />

      <div className="w-full h-[480px] sm:h-[550px] relative px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full"
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-full h-full flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="w-full h-[65%] flex-shrink-0">
                <WordImage alt={currentWord.en} image={currentWord.image} />
              </div>

              <CardBody className="flex-grow flex flex-col items-center justify-center gap-2 p-6 bg-content1 border-t-2 border-default-100">
                <div className="text-center space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase tracking-tighter leading-none">
                    {currentWord.en}
                  </h2>
                  <p className="text-xl sm:text-2xl font-bold text-success uppercase tracking-widest leading-none">
                    {currentWord.pl}
                  </p>
                </div>

                {currentWord.en_example && (
                  <div className="pt-3 border-t border-default-50 w-full text-center">
                    <p className="text-base sm:text-lg font-bold text-primary italic leading-tight px-2 line-clamp-2">
                      &quot;{currentWord.en_example}&quot;
                    </p>
                    {currentWord.pl_example && (
                      <p className="text-xs sm:text-sm font-black text-default-400 mt-1 uppercase tracking-widest opacity-80 line-clamp-2 px-2">
                        {currentWord.pl_example}
                      </p>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 w-full mt-2 px-2">
        <GameButton color="primary" onClick={handleNext}>
          DALEJ
        </GameButton>
      </div>
    </div>
  );
}
