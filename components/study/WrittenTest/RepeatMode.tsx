"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { GameButton } from "@/components/ui/GameButton";
import { RepeatProgressBar } from "@/components/ui/RepeatProgressBar";
import { audioService } from "@/lib/audio";
import { Word } from "@/types";

interface Props {
  currentWord: Word;
  repeatLeft: number;
  repeatInput: string;
  repeatStatus: "idle" | "ok" | "bad";
  setRepeatInput: (val: string) => void;
  inputTextClass: string;
  totalRepeatCount: number;
}

export function RepeatMode({
  currentWord,
  repeatLeft,
  repeatInput,
  repeatStatus,
  setRepeatInput,
  inputTextClass,
  totalRepeatCount,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [repeatLeft]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 10 }}
    >
      <div className="bg-danger/10 border-2 border-danger/20 rounded-[2rem] p-4 text-center relative">
        <p className="text-[10px] text-danger font-black uppercase tracking-[0.2em] mb-1">
          Poprawna odpowiedź:
        </p>
        <p className="text-3xl font-black text-danger uppercase tracking-widest">
          {currentWord.en}
        </p>
        <Button
          isIconOnly
          className="absolute top-2 right-2 text-danger"
          size="sm"
          variant="light"
          onClick={() => audioService.speak(currentWord.en)}
        >
          🔊
        </Button>
      </div>

      <RepeatProgressBar
        count={totalRepeatCount - repeatLeft}
        total={totalRepeatCount}
      />

      {}
      <Input
        ref={inputRef}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
        autoComplete="off"
        classNames={{
          input: `text-center ${inputTextClass} placeholder:opacity-20`,
          inputWrapper: "h-16 border-2",
        }}
        color={
          repeatStatus === "ok"
            ? "success"
            : repeatStatus === "bad"
              ? "danger"
              : "default"
        }
        placeholder={currentWord.en}
        radius="lg"
        size="lg"
        value={repeatInput}
        onChange={(e) => setRepeatInput(e.target.value)}
      />
      <GameButton color="danger" type="submit">
        PRZEPISZ ({repeatLeft}×) ✍️
      </GameButton>
    </motion.div>
  );
}
