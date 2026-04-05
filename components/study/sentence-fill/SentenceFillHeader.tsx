"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { WordImage } from "@/components/ui/WordImage";
import { Word } from "@/types";

interface Props {
  vOffset: number;
  activeIndex: number;
  wordsCount: number;
  progress: number;
  onExit: () => void;
  onShowHint: () => void;
  currentWord: Word;
  activeGapIndex: number;
  isPlRevealed: boolean;
  onRevealPl: () => void;
  renderPlExample: (word: Word) => React.ReactNode;
}

export const SentenceFillHeader = ({
  vOffset,
  activeIndex,
  wordsCount,
  progress,
  onExit,
  onShowHint,
  currentWord,
  activeGapIndex,
  isPlRevealed,
  onRevealPl,
  renderPlExample,
}: Props) => {
  return (
    <div
      className="fixed left-0 right-0 z-[100] bg-background/80 backdrop-blur-xl pt-4 pb-4 border-divider border-b px-4 shadow-xl transition-all duration-75"
      style={{ top: `${vOffset}px` }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {/* TOP BAR */}
        <div className="w-full flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-default-500">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              className="w-8 h-8 min-w-0 font-bold bg-content1 shadow-sm"
              size="sm"
              variant="flat"
              onClick={onExit}
            >
              ✕
            </Button>
            <div className="flex flex-col">
              <span className="text-primary/70 leading-none">ETAP 5</span>
              <span className="text-foreground leading-none mt-1">
                {activeIndex + 1} z {wordsCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="opacity-50 leading-none">POSTĘP</span>
              <span className="text-primary leading-none mt-1">{progress}%</span>
            </div>
            <Button
              isIconOnly
              className="w-10 h-10 min-w-0 text-lg rounded-xl ml-1"
              color="warning"
              size="sm"
              variant="shadow"
              onClick={onShowHint}
            >
              💡
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-default-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="absolute left-0 top-0 h-full bg-primary"
            initial={{ width: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* MAIN BAR */}
        <div className="flex items-center gap-4 mt-1">
          <div className="shrink-0 h-24 w-24 sm:h-28 sm:w-28 relative">
            <WordImage
              alt={currentWord.en}
              className="rounded-xl"
              containerClassName="rounded-2xl border-2 border-primary/10 shadow-lg bg-white p-1"
              forceImageIndex={activeGapIndex}
              image={currentWord.image}
              maxImages={1}
              zoom={true}
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-background shadow-lg">
              <span className="text-[10px] font-black">{activeIndex + 1}</span>
            </div>
          </div>

          {/* PL Hint Box */}
          <div className="flex-grow min-w-0">
            <button
              className={`relative cursor-pointer group flex items-center justify-center min-h-[70px] px-4 sm:px-6 bg-primary/5 rounded-[1.5rem] border-2 transition-all overflow-hidden ${
                isPlRevealed
                  ? "border-primary/20 bg-primary/10"
                  : "border-dashed border-primary/30"
              }`}
              type="button"
              onClick={onRevealPl}
            >
              <div
                className={`text-base sm:text-lg font-bold text-primary tracking-tight leading-tight text-center w-full transition-all duration-700 ${
                  !isPlRevealed
                    ? "blur-2xl opacity-0 select-none scale-125"
                    : "blur-0 opacity-100 scale-100"
                }`}
              >
                {renderPlExample(currentWord)}
              </div>

              {!isPlRevealed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border-2 border-white/20">
                      👁️ Podpowiedź
                    </div>
                    <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-1">
                      Kliknij, aby odkryć sens
                    </p>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
