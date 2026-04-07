"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { motion, AnimatePresence } from "framer-motion";

import { SentenceFillHeader } from "./sentence-fill/SentenceFillHeader";
import { SentenceFillCard } from "./sentence-fill/SentenceFillCard";
import { SentenceFillHint } from "./sentence-fill/SentenceFillHint";

import {
  useSentenceFill,
  removeDiacritics,
  getSentenceParts,
} from "@/hooks/useSentenceFill";
import { Word } from "@/types";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
  onWordAction: (wordId: string, customPoints?: number) => void;
}

export default function SentenceFill({
  words,
  onComplete,
  onWordAction,
}: Props) {
  const router = useRouter();
  const {
    state: {
      activeIndex,
      activeGapIndex,
      inputs,
      statuses,
      showHint,
      hintOptions,
      isPlRevealed,
      numberMismatch,
      vOffset,
      currentWord,
    },
    actions: {
      setActiveIndex,
      setActiveGapIndex,
      setShowHint,
      setIsPlRevealed,
      setNumberMismatch,
      triggerHint,
      handleInputChange,
      handleKeyDown,
    },
    refs: { inputRefs },
  } = useSentenceFill({ words, onComplete });

  const [showExplanation, setShowExplanation] = React.useState(false);

  React.useEffect(() => {
    if (!numberMismatch) setShowExplanation(false);
  }, [numberMismatch]);

  React.useEffect(() => {
    statuses.forEach((status, idx) => {
      if (status === "success") {
        onWordAction(words[idx].id, 5);
      }
    });
  }, [statuses, words, onWordAction]);

  const progress = Math.round(
    (statuses.filter((s) => s === "success").length / words.length) * 100,
  );

  const renderPlExample = (word: Word) => {
    const sentence = word.pl_example || word.pl;
    const baseWord = word.pl;

    if (
      !sentence ||
      !baseWord ||
      sentence.toLowerCase() === baseWord.toLowerCase()
    )
      return sentence;

    const baseWords = baseWord.toLowerCase().split(/\s+/);
    const sentenceParts = sentence.split(/(\s+|[.,;!?]+)/);

    let highlighted = false;

    const rendered = sentenceParts.map((part, i) => {
      if (!part.trim() || part.match(/^[.,;!?]+$/))
        return <React.Fragment key={i}>{part}</React.Fragment>;

      const partLower = removeDiacritics(part.toLowerCase());

      const isMatch = baseWords.some((bw) => {
        const bwClean = removeDiacritics(bw);

        if (bwClean.length <= 3) {
          return (
            partLower === bwClean ||
            (partLower.startsWith(bwClean) &&
              partLower.length - bwClean.length <= 2)
          );
        }
        let root = bwClean;

        if (root.match(/(owac|awac|iwac|ywac)$/)) root = root.slice(0, -4);
        else if (root.match(/(ac|ec|ic|yc)$/)) root = root.slice(0, -2);
        const prefixLen = Math.min(root.length, 5);
        const prefix = root.substring(0, prefixLen);

        return (
          (partLower.startsWith(prefix) || partLower.includes(root)) &&
          Math.abs(partLower.length - bwClean.length) <= 5
        );
      });

      if (isMatch && !highlighted) {
        highlighted = true;

        return (
          <span
            key={i}
            className="text-amber-600 dark:text-warning-500 font-black"
          >
            {part}
          </span>
        );
      }

      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

    return (
      <span className="inline-flex items-center flex-wrap justify-center gap-x-1.5">
        {rendered}
        {!highlighted && (
          <span className="text-amber-600 dark:text-warning font-black">
            ({word.pl})
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto pb-40">
      <div className="h-[145px] sm:h-[165px] invisible pointer-events-none" />

      <SentenceFillHeader
        activeGapIndex={activeGapIndex}
        activeIndex={activeIndex}
        currentWord={currentWord}
        isPlRevealed={isPlRevealed}
        progress={progress}
        renderPlExample={renderPlExample}
        vOffset={vOffset}
        wordsCount={words.length}
        onExit={() => router.push("/")}
        onRevealPl={() => setIsPlRevealed(true)}
        onShowHint={() => triggerHint(activeIndex)}
      />

      <div className="flex flex-col gap-2.5 px-2 pt-2">
        {words.map((word, index) => (
          <SentenceFillCard
            key={word.id}
            activeIndex={activeIndex}
            index={index}
            inputRefs={inputRefs.current[index]}
            inputs={inputs[index] || []}
            numberMismatch={activeIndex === index ? numberMismatch : null}
            status={statuses[index]}
            word={word}
            onClick={() => setActiveIndex(index)}
            onFocus={(gapIdx) => {
              setActiveIndex(index);
              setActiveGapIndex(gapIdx);
            }}
            onInputChange={(gapIdx, value) =>
              handleInputChange(index, gapIdx, value)
            }
            onKeyDown={(e, gapIdx, gapsCount) =>
              handleKeyDown(e, index, gapIdx, gapsCount)
            }
            onShowExplanation={() => setShowExplanation(true)}
          />
        ))}
      </div>

      <SentenceFillHint
        currentWord={currentWord}
        options={hintOptions}
        show={showHint}
        onClose={() => setShowHint(false)}
      />

      {(() => {
        const parts = getSentenceParts(currentWord);
        const currentTargets: string[] = [];

        for (let i = 1; i < parts.length; i += 2) {
          currentTargets.push(parts[i].trim());
        }

        return (
          <>
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md"
                  exit={{ opacity: 0, y: 20 }}
                  initial={{ opacity: 0, y: 20 }}
                >
                  <div className="bg-white dark:bg-content1 border-2 border-warning shadow-2xl rounded-3xl p-6 flex flex-col gap-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-warning-100 dark:bg-warning/20 flex items-center justify-center text-warning text-2xl font-bold">
                        💡
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-default-700 font-bold text-lg leading-tight">
                        Słówko{" "}
                        <span className="text-warning-600 dark:text-warning-500 font-black italic underline underline-offset-4">
                          {numberMismatch === "plural" ? "are" : "is"}
                        </span>{" "}
                        wskazuje na liczbę{" "}
                        {numberMismatch === "plural" ? "mnogą" : "pojedynczą"}!
                      </p>
                      <div className="h-0.5 w-12 bg-warning/30 mx-auto rounded-full" />
                      <p className="text-default-700 text-sm font-semibold leading-relaxed">
                        {numberMismatch === "plural" ? (
                          <>
                            Wystarczy dodać{" "}
                            <span className="text-primary font-black px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 rounded-md ring-1 ring-primary-500/20">
                              s
                            </span>
                            ,{" "}
                            <span className="text-primary font-black px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 rounded-md ring-1 ring-primary-500/20">
                              es
                            </span>{" "}
                            lub{" "}
                            <span className="text-primary font-black px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 rounded-md ring-1 ring-primary-500/20">
                              ies
                            </span>{" "}
                            na końcu!
                          </>
                        ) : (
                          <>
                            Musisz usunąć końcówkę{" "}
                            <span className="text-primary font-black px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 rounded-md ring-1 ring-primary-500/20">
                              s
                            </span>
                            ,{" "}
                            <span className="text-primary font-black px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 rounded-md ring-1 ring-primary-500/20">
                              es
                            </span>{" "}
                            lub{" "}
                            <span className="text-primary font-black px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 rounded-md ring-1 ring-primary-500/20">
                              ies
                            </span>
                            !
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <div className="bg-default-50 dark:bg-default-100 p-4 rounded-xl border border-dashed border-warning/50">
                        <div className="text-[10px] uppercase font-black text-default-400 mb-1">
                          Pamiętaj:
                        </div>
                        <div className="text-base font-bold flex flex-wrap justify-center gap-1.5 items-center">
                          W tym przypadku:
                          <span className="font-black flex gap-2">
                            {currentTargets.map((target, idx) => {
                              if (numberMismatch === "plural") {
                                const match = target.match(/^(.*)(ies|es|s)$/i);

                                if (match) {
                                  return (
                                    <span
                                      key={idx}
                                      className="text-default-700 bg-white dark:bg-black/20 px-2 py-0.5 rounded-lg border border-default-100 shadow-sm"
                                    >
                                      {'"'}
                                      {match[1]}
                                      <span className="text-primary font-black">
                                        {match[2]}
                                      </span>
                                      {'"'}
                                    </span>
                                  );
                                }
                              }

                              return (
                                <span
                                  key={idx}
                                  className="text-warning-600 bg-white dark:bg-black/20 px-2 py-0.5 rounded-lg border border-default-100 shadow-sm"
                                >
                                  {'"'}
                                  {target}
                                  {'"'}
                                </span>
                              );
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      fullWidth
                      className="font-black uppercase tracking-widest h-14 rounded-2xl shadow-md mt-2"
                      color="warning"
                      variant="solid"
                      onClick={() => {
                        setShowExplanation(false);
                        setNumberMismatch(null);
                      }}
                    >
                      Aaa, już kumam! 🚀
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );
      })()}
    </div>
  );
}
