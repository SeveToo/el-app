"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Word } from "@/types";
import { useSentenceFill, removeDiacritics } from "@/hooks/useSentenceFill";
import { SentenceFillHeader } from "./sentence-fill/SentenceFillHeader";
import { SentenceFillCard } from "./sentence-fill/SentenceFillCard";
import { SentenceFillHint } from "./sentence-fill/SentenceFillHint";

interface Props {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export default function SentenceFill({ words, onComplete }: Props) {
  const router = useRouter();
  const {
    state: {
      activeIndex,
      activeGapIndex,
      inputs,
      statuses,
      errorIds,
      showHint,
      hintOptions,
      isPlRevealed,
      vOffset,
      currentWord,
    },
    actions: {
      setActiveIndex,
      setActiveGapIndex,
      setShowHint,
      setIsPlRevealed,
      triggerHint,
      handleInputChange,
      handleKeyDown,
    },
    refs: { inputRefs },
  } = useSentenceFill({ words, onComplete });

  const progress = Math.round(
    (statuses.filter((s) => s === "success").length / words.length) * 100,
  );

  const renderPlExample = (word: Word) => {
    const sentence = word.pl_example || word.pl;
    const baseWord = word.pl;

    if (!sentence || !baseWord || sentence.toLowerCase() === baseWord.toLowerCase())
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
          return partLower === bwClean || (partLower.startsWith(bwClean) && partLower.length - bwClean.length <= 2);
        }
        let root = bwClean;
        if (root.match(/(owac|awac|iwac|ywac)$/)) root = root.slice(0, -4);
        else if (root.match(/(ac|ec|ic|yc)$/)) root = root.slice(0, -2);
        const prefixLen = Math.min(root.length, 5);
        const prefix = root.substring(0, prefixLen);
        return (partLower.startsWith(prefix) || partLower.includes(root)) && Math.abs(partLower.length - bwClean.length) <= 5;
      });

      if (isMatch && !highlighted) {
        highlighted = true;
        return <span key={i} className="text-amber-600 dark:text-warning-500 font-black">{part}</span>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

    return (
      <span className="inline-flex items-center flex-wrap justify-center gap-x-1.5">
        {rendered}
        {!highlighted && <span className="text-amber-600 dark:text-warning font-black">({word.pl})</span>}
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
            status={statuses[index]}
            word={word}
            onClick={() => setActiveIndex(index)}
            onFocus={(gapIdx) => {
              setActiveIndex(index);
              setActiveGapIndex(gapIdx);
            }}
            onInputChange={(gapIdx, value) => handleInputChange(index, gapIdx, value)}
            onKeyDown={(e, gapIdx, gapsCount) => handleKeyDown(e, index, gapIdx, gapsCount)}
          />
        ))}
      </div>

      <SentenceFillHint
        currentWord={currentWord}
        options={hintOptions}
        show={showHint}
        onClose={() => setShowHint(false)}
      />
    </div>
  );
}
