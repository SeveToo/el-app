"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { WordImage } from "@/components/ui/WordImage";
import { Word } from "@/types";
import { audioService } from "@/lib/audio";

interface Props {
  word: Word;
  isFlipped: boolean;
  onClick: () => void;
  direction: number;
}

export const FlashcardItem = ({ word, isFlipped, onClick, direction }: Props) => {
  return (
    <motion.div
      animate={{
        x: direction === 1 ? 600 : direction === -1 ? -600 : 0,
        opacity: direction !== 0 ? 0 : 1,
        rotate: direction === 1 ? 25 : direction === -1 ? -25 : 0,
      }}
      aria-label={`Fiszka: ${isFlipped ? word.en : word.pl}. Kliknij, aby obrócić.`}
      className="relative w-full h-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-[2.5rem]"
      initial={{ x: 0, opacity: 1, scale: 1 }}
      role="button"
      tabIndex={0}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* Front Side (PL) */}
        <Card
          className="absolute inset-0 flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-[65%] flex-shrink-0">
            <WordImage alt={word.pl} image={word.image} maxImages={1} />
          </div>
          <CardBody className="flex-grow flex flex-col items-center justify-center gap-1 px-4 sm:px-6 bg-content1 border-t-2 border-default-100">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-primary uppercase leading-tight text-center">
              {word.pl}
            </h2>
            <p className="text-sm sm:text-base font-bold text-default-400 uppercase tracking-widest italic text-center text-balance overflow-hidden line-clamp-2 px-2">
              {word.pl_example}
            </p>
          </CardBody>
        </Card>

        {/* Back Side (EN) */}
        <Card
          className="absolute inset-0 flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-[65%] flex-shrink-0">
            <WordImage alt={word.en} image={word.image} maxImages={1} />
          </div>
          <CardBody className="flex-grow flex flex-col items-center justify-center gap-1 px-4 sm:px-6 bg-content1 border-t-2 border-default-100 relative">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground uppercase leading-tight text-center">
              {word.en}
            </h2>
            <p className="text-base sm:text-xl font-bold text-primary italic text-center px-4 leading-snug overflow-hidden line-clamp-2">
              &quot;{word.en_example}&quot;
            </p>

            <Button
              isIconOnly
              className="absolute bottom-2 right-4 text-primary opacity-50 hover:opacity-100"
              radius="full"
              size="sm"
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                audioService.speak(word.en);
              }}
            >
              🔊
            </Button>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
