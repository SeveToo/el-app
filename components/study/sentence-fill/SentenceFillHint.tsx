"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { WordImage } from "@/components/ui/WordImage";
import { GameButton } from "@/components/ui/GameButton";
import { audioService } from "@/lib/audio";
import { Word } from "@/types";

interface Props {
  show: boolean;
  onClose: () => void;
  options: Word[];
  currentWord: Word;
}

export const SentenceFillHint = ({ show, onClose, options, currentWord }: Props) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[101] bg-background/98 backdrop-blur-2xl flex items-center justify-center p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <div className="max-w-xl w-full flex flex-col items-center gap-6 max-h-screen overflow-y-auto py-10 px-4">
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-primary">
                Znajdź pasujące słowo
              </h3>
              <p className="text-default-500 font-bold uppercase tracking-widest text-[9px]">
                Wybierz poprawną odpowiedź
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {options.map((opt) => (
                <Card
                  key={opt.id}
                  isPressable
                  className="w-full border border-default-200 hover:border-primary transition-all bg-content1 shadow-md hover:scale-[1.01] active:scale-95"
                  onClick={() => {
                    if (opt.id === currentWord.id) {
                      onClose();
                      audioService.playSuccess();
                      audioService.speak(opt.en);
                    } else {
                      audioService.playError();
                    }
                  }}
                >
                  <CardBody className="flex flex-row items-center gap-4 p-4">
                    <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16">
                      <WordImage
                        alt={opt.en}
                        className="p-1"
                        containerClassName="rounded-xl border border-default-100 shadow-sm"
                        fit="contain"
                        image={opt.image}
                        maxImages={1}
                      />
                    </div>
                    <div className="flex-grow text-left">
                      <p className="text-lg sm:text-2xl font-black uppercase tracking-widest text-foreground">
                        {opt.en}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <GameButton color="danger" variant="flat" onClick={onClose}>
              Zamknij ❌
            </GameButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
