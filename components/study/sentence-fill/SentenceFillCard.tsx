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
  numberMismatch?: "plural" | "singular" | null;
  inputs: string[];
  onInputChange: (gapIdx: number, value: string) => void;
  onFocus: (gapIdx: number) => void;
  onKeyDown: (
    e: React.KeyboardEvent,
    gapIdx: number,
    gapsCount: number,
  ) => void;
  onClick: () => void;
  onShowExplanation?: () => void;
  inputRefs: (HTMLInputElement | null)[];
}

export const SentenceFillCard = ({
  word,
  index,
  activeIndex,
  status,
  numberMismatch,
  inputs,
  onInputChange,
  onFocus,
  onKeyDown,
  onClick,
  onShowExplanation,
  inputRefs,
}: Props) => {
  const parts = getSentenceParts(word);
  const gapsCount = Math.floor(parts.length / 2);

  return (
    <Card
      isPressable
      aria-label={`Zdanie ${index + 1}: ${word.pl}. Kliknij, aby wybrać.`}
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
                    aria-label={`Luka ${gapIdx + 1} w zdaniu ${index + 1}`}
                    autoComplete="off"
                    classNames={{
                      input: `text-base sm:text-lg font-black uppercase text-center tracking-widest ${
                        activeIndex === index
                          ? "text-amber-600 dark:text-warning"
                          : "text-default-400"
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

            if (numberMismatch && typeof part === "string") {
              const regex =
                numberMismatch === "plural" ? /\bare\b/gi : /\bis\b/gi;
              const matches = part.split(regex);

              if (matches.length > 1) {
                return (
                  <span key={i}>
                    {matches.map((text, idx) => (
                      <React.Fragment key={idx}>
                        {text}
                        {idx < matches.length - 1 && (
                          <motion.span
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            className="inline-block px-1 rounded bg-primary-50 dark:bg-primary-500/20 text-primary font-black sm:mx-0.5"
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {numberMismatch === "plural" ? "are" : "is"}
                          </motion.span>
                        )}
                      </React.Fragment>
                    ))}
                  </span>
                );
              }
            }

            return <span key={i}>{part}</span>;
          })}
        </div>

        {numberMismatch && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
          >
            <button
              className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-warning-50 dark:bg-warning/10 border-2 border-warning/30 hover:border-warning text-warning transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                onShowExplanation?.();
              }}
            >
              <span className="text-xl">🧐</span>
              <span className="font-black uppercase tracking-widest text-xs sm:text-sm">
                Dalej nie czaję?
              </span>
            </button>
          </motion.div>
        )}
      </CardBody>
    </Card>
  );
};
