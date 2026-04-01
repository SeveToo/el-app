"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { StudyHeader } from "./StudyHeader";

import { audioService } from "@/lib/audio";
import { Word } from "@/types";
import { WordImage } from "@/components/ui/WordImage";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export default function MatchingGame({ words, onComplete }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [shuffleWords, setShuffleWords] = useState<Word[]>([]);
  const [shuffleImages, setShuffleImages] = useState<Word[]>([]);
  const [flashId, setFlashId] = useState<{
    id: string;
    ok: boolean;
  } | null>(null);

  useEffect(() => {
    setShuffleWords([...words].sort(() => Math.random() - 0.5));
    setShuffleImages([...words].sort(() => Math.random() - 0.5));
  }, [words]);

  useEffect(() => {
    if (selectedWord && selectedImage) {
      if (selectedWord === selectedImage) {
        setFlashId({ id: selectedWord, ok: true });
        audioService.playSuccess();

        const wordObj = words.find((w) => w.id === selectedWord);

        if (wordObj) audioService.speak(wordObj.en);

        setTimeout(() => {
          setMatchedIds((prev) => {
            const next = [...prev, selectedWord!];

            if (next.length === words.length) {
              setTimeout(() => onComplete(errorIds), 600);
            }

            return next;
          });
          setFlashId(null);
        }, 500);
      } else {
        setFlashId({ id: selectedWord, ok: false });
        audioService.playError();
        if (!errorIds.includes(selectedWord)) {
          setErrorIds((prev) => [...prev, selectedWord!]);
        }
        setTimeout(() => setFlashId(null), 600);
      }
      setSelectedWord(null);
      setSelectedImage(null);
    }
  }, [selectedWord, selectedImage]);

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
      {/* Header */}
      <StudyHeader
        color="secondary"
        current={matchedIds.length}
        title="Etap 3: Dopasowanie"
        total={words.length}
      />

      {/* Legenda */}
      <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-2 gap-3 sm:gap-8 text-xs text-default-400 font-semibold uppercase tracking-widest w-full px-2">
        <span className="text-center border-b-2 border-default-200 pb-1 min-w-[70px] sm:min-w-0">
          📖 Słowa
        </span>
        <span className="col-span-2 sm:col-span-1 text-center border-b-2 border-default-200 pb-1">
          🖼️ Obrazki
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-2 gap-3 sm:gap-8 w-full px-2">
        <div className="flex flex-col gap-2 sm:gap-3 min-w-[70px] sm:min-w-0">
          {shuffleWords.map((word) => (
            <motion.button
              key={word.id}
              layout
              className={`h-12 sm:h-16 px-2 sm:px-4 cursor-pointer rounded-2xl border-2 flex items-center justify-center font-black text-[0.7rem] sm:text-sm uppercase tracking-wider shadow-sm transition-all duration-200 whitespace-nowrap ${getWordStyle(word.id)}`}
              onClick={() =>
                !matchedIds.includes(word.id) && setSelectedWord(word.id)
              }
            >
              {word.en}
            </motion.button>
          ))}
        </div>

        <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2 sm:gap-3 h-fit">
          {shuffleImages.map((word) => (
            <motion.button
              key={word.id}
              layout
              className={`aspect-square sm:aspect-auto sm:h-[140px] cursor-pointer rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-200 bg-white ${getImageStyle(word.id)}`}
              onClick={() =>
                !matchedIds.includes(word.id) && setSelectedImage(word.id)
              }
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

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
        .shake {
          animation: shake 0.4s ease;
        }
      `}</style>
    </div>
  );
}
