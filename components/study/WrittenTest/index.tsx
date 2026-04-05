"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { motion, AnimatePresence } from "framer-motion";

import { StudyHeader } from "../StudyHeader";

import { RepeatMode } from "./RepeatMode";

import { GameButton } from "@/components/ui/GameButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { audioService } from "@/lib/audio";
import { Word } from "@/types";
import { WordImage } from "@/components/ui/WordImage";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
  onWordAction: (wordId: string, customPoints?: number) => void;
}

const REPEAT_COUNT = 3;
const INPUT_TEXT_CLASS = "text-xl font-black uppercase tracking-widest";

export default function WrittenTest({ words, onComplete, onWordAction }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "wrong">("idle");
  const [errorIds, setErrorIds] = useState<string[]>([]);

  // Punishment Mode State
  const [repeatMode, setRepeatMode] = useState(false);
  const [repeatLeft, setRepeatLeft] = useState(0);
  const [repeatInput, setRepeatInput] = useState("");
  const [repeatStatus, setRepeatStatus] = useState<"idle" | "ok" | "bad">(
    "idle",
  );

  const currentWord = words[currentIndex];

  // Auto-focus Input
  useEffect(() => {
    // We use a small timeout to ensure focus happens *after* the animation transition
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [currentIndex, repeatMode, repeatLeft, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toLowerCase();

    // Split correct answer by '/' and check if any part matches
    const correctOptions = currentWord.en
      .split("/")
      .map((opt) => opt.trim().toLowerCase());
    const isCorrect = correctOptions.includes(cleanInput);

    if (isCorrect) {
      setStatus("success");
      onWordAction(currentWord.id, 4);
      audioService.playSuccess();
      audioService.speak(currentWord.en);
      setTimeout(() => moveNext(true), 700);
    } else {
      setStatus("wrong");
      audioService.playError();

      if (!errorIds.includes(currentWord.id)) {
        setErrorIds((prev) => [...prev, currentWord.id]);
      }

      setTimeout(() => {
        setStatus("idle");
        setInputValue("");
        setRepeatMode(true);
        setRepeatLeft(REPEAT_COUNT);
        setRepeatInput("");
        setRepeatStatus("idle");
      }, 900);
    }
  };

  const handleRepeatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = repeatInput.trim().toLowerCase();
    const cleanWord = currentWord.en.trim().toLowerCase();

    if (cleanInput === cleanWord) {
      const left = repeatLeft - 1;

      setRepeatStatus("ok");
      audioService.playSuccess();
      audioService.speak(currentWord.en);

      setTimeout(() => {
        setRepeatInput("");
        setRepeatStatus("idle");
        if (left <= 0) {
          setRepeatMode(false);
          moveNext(false);
        } else {
          setRepeatLeft(left);
        }
      }, 400);
    } else {
      setRepeatStatus("bad");
      audioService.playError();
      setTimeout(() => {
        setRepeatInput("");
        setRepeatStatus("idle");
        setRepeatLeft(REPEAT_COUNT);
      }, 600);
    }
  };

  const moveNext = (wasCorrect: boolean) => {
    setInputValue("");
    setStatus("idle");
    setRepeatMode(false);
    setRepeatLeft(0);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Deduplicate and filter based on final result
      const finalErrors = wasCorrect
        ? errorIds.filter((id) => id !== currentWord.id)
        : Array.from(new Set([...errorIds, currentWord.id]));

      onComplete(finalErrors);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-6 sm:py-10">
      <StudyHeader
        color="success"
        current={currentIndex + 1}
        title="Etap 4: Pisanie"
        total={words.length}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-2"
          exit={{ opacity: 0, y: -20 }}
          initial={{ opacity: 0, y: 20 }}
        >
          <Card
            className={`w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden transition-colors duration-500 ${
              repeatMode ? "bg-danger/5 ring-4 ring-danger/20" : "bg-content1"
            }`}
          >
            <CardBody className="p-6 flex flex-col items-center gap-6">
              <div className="w-28 h-28 sm:w-36 sm:h-36 relative">
                <WordImage
                  alt={currentWord.pl}
                  className="p-1"
                  containerClassName="rounded-3xl border-2 border-default-100 shadow-sm"
                  fit="contain"
                  image={currentWord.image}
                />

                <StatusBadge status={status} />
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-3xl sm:text-4xl font-black text-success uppercase tracking-tighter leading-none">
                  {currentWord.pl}
                </h2>
                <p className="text-default-400 text-xs font-bold uppercase tracking-widest">
                  {repeatMode ? "PRZEPISZ POPRAWNIE:" : "WPISZ PO ANGIELSKU:"}
                </p>
              </div>

              <form
                className="w-full space-y-4"
                onSubmit={repeatMode ? handleRepeatSubmit : handleSubmit}
              >
                {!repeatMode ? (
                  <>
                    {}
                    <Input
                      /* eslint-disable-next-line jsx-a11y/no-autofocus */
                      ref={inputRef}
                      autoFocus
                      autoFocus
                      aria-label={`Wpisz po angielsku: ${currentWord.pl}`}
                      autoComplete="off"
                      classNames={{
                        input: `text-center ${INPUT_TEXT_CLASS}`,
                        inputWrapper: "h-16 border-2",
                      }}
                      color={
                        status === "success"
                          ? "success"
                          : status === "wrong"
                            ? "danger"
                            : "default"
                      }
                      isDisabled={status === "success"}
                      placeholder="Wpisz słówko..."
                      radius="lg"
                      size="lg"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <GameButton
                      color="success"
                      isDisabled={status === "success"}
                      type="submit"
                    >
                      SPRAWDŹ! 🚀
                    </GameButton>
                  </>
                ) : (
                  <RepeatMode
                    currentWord={currentWord}
                    inputTextClass={INPUT_TEXT_CLASS}
                    repeatInput={repeatInput}
                    repeatLeft={repeatLeft}
                    repeatStatus={repeatStatus}
                    setRepeatInput={setRepeatInput}
                    totalRepeatCount={REPEAT_COUNT}
                  />
                )}
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
