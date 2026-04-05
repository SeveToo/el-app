"use client";

import { useState, useEffect, useRef } from "react";

import { Word } from "@/types";
import { audioService } from "@/lib/audio";

export const removeDiacritics = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");

export const getSentenceParts = (word: { en_example: string; en: string }) => {
  let example = word.en_example || "";

  // 1. Try to use manual brackets if they exist
  if (example.includes("[")) {
    return example.split(/\[(.*?)\]/g);
  }

  // 2. Try to match the keyword or its variants (case-insensitive)
  const variants = word.en.split("/").map((v) => v.trim());
  const sortedVariants = [...variants].sort((a, b) => b.length - a.length);

  // Try to match the prefix (first 4 chars) to catch plural forms like Strawberry -> strawberries
  const findAndWrap = (text: string) => {
    for (const v of sortedVariants) {
      // Direct match
      const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\w*\\b`, "gi");

      if (regex.test(text)) {
        return text.replace(regex, "[$&]");
      }

      // Root match (at least 4 chars)
      if (v.length >= 4) {
        const root = v.substring(0, v.length - 1); // remove last char to catch y -> i etc.
        const rootEscaped = root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const rootRegex = new RegExp(`\\b${rootEscaped}\\w+\\b`, "gi");

        if (rootRegex.test(text)) {
          return text.replace(rootRegex, "[$&]");
        }
      }
    }

    return text;
  };

  example = findAndWrap(example);

  // 3. Absolute Fallback: If still no brackets, wrap the longest word (min 4 chars)
  if (!example.includes("[")) {
    const words = example.split(/\s+/);
    const longest = words.reduce(
      (a, b) =>
        b.replace(/[^a-zA-Z]/g, "").length > a.replace(/[^a-zA-Z]/g, "").length
          ? b
          : a,
      "",
    );

    if (longest.length >= 3) {
      example = example.replace(longest, `[${longest}]`);
    }
  }

  return example.split(/\[(.*?)\]/g);
};

interface UseSentenceFillProps {
  words: Word[];
  onComplete: (errorIds: string[]) => void;
}

export function useSentenceFill({ words, onComplete }: UseSentenceFillProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGapIndex, setActiveGapIndex] = useState(0);
  const [inputs, setInputs] = useState<string[][]>(() =>
    words.map((w) =>
      new Array(Math.floor(getSentenceParts(w).length / 2)).fill(""),
    ),
  );
  const [statuses, setStatuses] = useState<("idle" | "success" | "wrong")[]>(
    new Array(words.length).fill("idle"),
  );
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintOptions, setHintOptions] = useState<Word[]>([]);
  const [wrongCount, setWrongCount] = useState<Record<number, number>>({});
  const [isPlRevealed, setIsPlRevealed] = useState(false);
  const [vOffset, setVOffset] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[][]>(words.map(() => []));
  const currentWord = words[activeIndex];

  // Visual Viewport tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = (window as any).visualViewport;

    if (!vv) return;

    const handleViewport = () => setVOffset(vv.offsetTop);

    vv.addEventListener("resize", handleViewport);
    vv.addEventListener("scroll", handleViewport);
    handleViewport();

    return () => {
      vv.removeEventListener("resize", handleViewport);
      vv.removeEventListener("scroll", handleViewport);
    };
  }, []);

  // Focus and scroll
  useEffect(() => {
    setIsPlRevealed(false);
    if (!showHint) {
      const el = inputRefs.current[activeIndex]?.[0];

      if (el) {
        el.focus();
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [activeIndex, showHint]);

  const triggerHint = (index: number) => {
    const targetWord = words[index];
    const others = words.filter((w) => w.id !== targetWord.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    const options = [targetWord, ...shuffledOthers.slice(0, 2)].sort(
      () => Math.random() - 0.5,
    );

    setErrorIds((prev) =>
      prev.includes(targetWord.id) ? prev : [...prev, targetWord.id],
    );
    setHintOptions(options);
    setShowHint(true);
  };

  const handleSubmit = (index: number) => {
    const word = words[index];
    const parts = getSentenceParts(word);
    const targets: string[] = [];

    for (let i = 1; i < parts.length; i += 2) {
      targets.push(parts[i].trim().toLowerCase());
    }

    const userInputs = inputs[index].map((val) => val.trim().toLowerCase());
    const isAllCorrect =
      userInputs.length === targets.length &&
      userInputs.every((val, i) => {
        const options = targets[i]
          .split("/")
          .map((opt) => opt.trim().toLowerCase());

        return options.includes(val);
      });

    if (isAllCorrect) {
      if (statuses[index] !== "success") {
        const newStatuses = [...statuses];

        newStatuses[index] = "success";
        setStatuses(newStatuses);
        audioService.playSuccess();
        audioService.speak(word.en_example);
      }

      if (index < words.length - 1) {
        setActiveIndex(index + 1);
      } else {
        const allSuccess = statuses.every(
          (s, i) => i === index || s === "success",
        );

        if (allSuccess) {
          setTimeout(() => onComplete(errorIds), 1000);
        }
      }
    } else {
      const newStatuses = [...statuses];

      newStatuses[index] = "wrong";
      setStatuses(newStatuses);
      audioService.playError();

      const newWrongCount = {
        ...wrongCount,
        [index]: (wrongCount[index] || 0) + 1,
      };

      setWrongCount(newWrongCount);

      if (!errorIds.includes(word.id)) {
        setErrorIds((prev) => [...prev, word.id]);
      }

      if (newWrongCount[index] >= 2) {
        setTimeout(() => triggerHint(index), 500);
      }

      setTimeout(() => {
        setStatuses((prev) => {
          const s = [...prev];

          s[index] = "idle";

          return s;
        });
      }, 1000);
    }
  };

  const handleInputChange = (index: number, gapIdx: number, value: string) => {
    const newInputs = [...inputs];
    const sentenceInputs = [...(newInputs[index] || [])];

    sentenceInputs[gapIdx] = value;
    newInputs[index] = sentenceInputs;
    setInputs(newInputs);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    gapIdx: number,
    gapsCount: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (gapIdx < gapsCount - 1) {
        inputRefs.current[index]?.[gapIdx + 1]?.focus();
      } else {
        handleSubmit(index);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (index < words.length - 1) setActiveIndex(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) setActiveIndex(index - 1);
    }
  };

  return {
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
      handleSubmit,
      handleInputChange,
      handleKeyDown,
    },
    refs: {
      inputRefs,
    },
  };
}
