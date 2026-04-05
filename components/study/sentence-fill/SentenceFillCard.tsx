"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Word } from "@/types";
import { getSentenceParts } from "@/hooks/useSentenceFill";

interface Props {
  word: Word;
  index: number;
  activeIndex: number;
  status: "idle" | "success" | "wrong";
  inputs: string[];
  onInputChange: (gapIdx: number, value: string) => void;
  onFocus: (gapIdx: number) => void;
  onKeyDown: (e: React.KeyboardEvent, gapIdx: number, gapsCount: number) => void;
  onClick: () => void;
  inputRefs: (HTMLInputElement | null)[];
}

export const SentenceFillCard = ({
  word,
  index,
  activeIndex,
  status,
  inputs,
  onInputChange,
  onFocus,
  onKeyDown,
  onClick,
  inputRefs,
}: Props) => {
  const parts = getSentenceParts(word);
  const gapsCount = Math.floor(parts.length / 2);

  return (
    <Card
      className={`transition-all duration-500 border-2 active:scale-[0.98] ${
        activeIndex === index
          ? "border-primary ring-8 ring-primary/5 bg-primary/5 shadow-2xl z-10 translate-y-[-2px]"
          : "border-transparent bg-content1 shadow-sm opacity-60 grayscale-[0.3]"
      } ${
        status === "success"
          ? "opacity-90 grayscale-0 !bg-success/5 !border-success/20"
          : ""
      }`}
      onClick={onClick}
    >
      <CardBody className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 py-1 text-base sm:text-lg font-medium text-default-600 leading-relaxed">
          {parts.map((part, i) => {
            if (i % 2 !== 0) {
              const gapIdx = Math.floor(i / 2);

              if (status === "success") {
                return (
                  <motion.span
                    key={i}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block px-1.5 py-0 rounded-lg bg-success/10 text-success font-black text-base sm:text-lg uppercase tracking-wider"
                    initial={{ scale: 0.9, opacity: 0 }}
                  >
                    {part}
                  </motion.span>
                );
              }

              return (
                <div key={i} className="inline-block min-w-[70px]">
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs[gapIdx] = el;
                    }}
                    autoComplete="off"
                    classNames={{
                      input: `text-base sm:text-lg font-black uppercase text-center tracking-widest ${
                        activeIndex === index ? "text-warning" : "text-default-400"
                      }`,
                      inputWrapper: "border-b-2",
                    }}
                    color={
                      status === "wrong"
                        ? "danger"
                        : activeIndex === index
                          ? "warning"
                          : "default"
                    }
                    enterKeyHint="done"
                    placeholder="..."
                    size="sm"
                    value={inputs[gapIdx] || ""}
                    variant="underlined"
                    onChange={(e) => onInputChange(gapIdx, e.target.value)}
                    onFocus={() => onFocus(gapIdx)}
                    onKeyDown={(e) => onKeyDown(e, gapIdx, gapsCount)}
                  />
                </div>
              );
            }

            return <span key={i}>{part}</span>;
          })}
        </div>
      </CardBody>
    </Card>
  );
};
