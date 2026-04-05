"use client";

import React from "react";
import { motion } from "framer-motion";

import { StudyHeader } from "./StudyHeader";
import { WordImage } from "@/components/ui/WordImage";
import { Word } from "@/types";
import { useMatchingGame } from "@/hooks/useMatchingGame";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
  onWordAction: (wordId: string, customPoints?: number) => void;
}

export default function MatchingGame({ words, onComplete, onWordAction }: Props) {
  const {
    state: {
      selectedWord,
      selectedImage,
      matchedIds,
      shuffledWords,
      shuffledImages,
      flashId,
    },
    actions: { setSelectedWord, setSelectedImage },
  } = useMatchingGame({ words, onComplete });

  React.useEffect(() => {
    // Only report matched items as 3 points
    matchedIds.forEach((id) => onWordAction(id, 3));
  }, [matchedIds, onWordAction]);

  const getWordStyle = (id: string) => {
    if (matchedIds.includes(id))
      return "opacity-0 pointer-events-none scale-90";
    if (flashId?.id === id)
      return flashId.ok
        ? "border-success bg-success/10 text-success scale-105"
        : "border-danger bg-danger/10 text-danger shake";
    if (selectedWord === id)
      return "border-primary bg-primary/10 text-primary scale-105";

    return "border-default-200 hover:border-primary/40 hover:bg-primary/5";
  };

  const getImageStyle = (id: string) => {
    if (matchedIds.includes(id))
      return "opacity-0 pointer-events-none scale-90";
    if (selectedImage === id)
      return "border-primary ring-2 ring-primary scale-105";

    return "border-default-200 hover:border-primary/40";
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6">
      <StudyHeader
        color="secondary"
        current={matchedIds.length}
        title="Etap 3: Dopasowanie"
        total={words.length}
      />

      <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-2 gap-3 sm:gap-8 text-xs text-default-400 font-semibold uppercase tracking-widest w-full px-2">
        <span className="text-center border-b-2 border-default-200 pb-1 min-w-[70px] sm:min-w-0">
          📖 Słowa
        </span>
        <span className="col-span-2 sm:col-span-1 text-center border-b-2 border-default-200 pb-1">
          🖼️ Obrazki
        </span>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-2 gap-3 sm:gap-8 w-full px-2">
        <div className="flex flex-col gap-2 sm:gap-3 min-w-[70px] sm:min-w-0">
          {shuffledWords.map((word) => (
            <motion.button
              key={word.id}
              layout
              className={`h-12 sm:h-16 px-2 sm:px-4 cursor-pointer rounded-2xl border-2 flex items-center justify-center font-black text-[0.7rem] sm:text-sm uppercase tracking-wider shadow-sm transition-all duration-200 whitespace-nowrap ${getWordStyle(word.id)}`}
              onClick={() => !matchedIds.includes(word.id) && setSelectedWord(word.id)}
            >
              {word.en}
            </motion.button>
          ))}
        </div>

        <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2 sm:gap-3 h-fit">
          {shuffledImages.map((word) => (
            <motion.button
              key={word.id}
              layout
              className={`aspect-square sm:aspect-auto sm:h-[140px] cursor-pointer rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-200 bg-white ${getImageStyle(word.id)}`}
              onClick={() => !matchedIds.includes(word.id) && setSelectedImage(word.id)}
            >
              <WordImage
                alt="match"
                className={word.image.includes(",") ? "p-1" : ""}
                fit={word.image.includes(",") ? "contain" : "cover"}
                image={word.image}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}
