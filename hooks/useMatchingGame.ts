"use client";

import { useState, useEffect } from "react";
import { Word } from "@/types";
import { audioService } from "@/lib/audio";

interface UseMatchingGameProps {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export function useMatchingGame({ words, onComplete }: UseMatchingGameProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [shuffledImages, setShuffledImages] = useState<Word[]>([]);
  const [flashId, setFlashId] = useState<{ id: string; ok: boolean } | null>(null);

  useEffect(() => {
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
    setShuffledImages([...words].sort(() => Math.random() - 0.5));
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
  }, [selectedWord, selectedImage, words, errorIds, onComplete]);

  return {
    state: {
      selectedWord,
      selectedImage,
      matchedIds,
      shuffledWords,
      shuffledImages,
      flashId,
    },
    actions: {
      setSelectedWord,
      setSelectedImage,
    },
  };
}
