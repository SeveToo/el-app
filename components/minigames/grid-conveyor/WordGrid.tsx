import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";

import { GridItem } from "./types";

interface WordGridProps {
  grid: GridItem[];
  onItemClick: (wordId: string, isRightClick: boolean) => void;
}

export const WordGrid: React.FC<WordGridProps> = React.memo(
  ({ grid, onItemClick }) => {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2.5 w-full flex-1 max-w-2xl mx-auto px-1 sm:px-0 auto-rows-fr">
        {grid.map((item, index) => (
          <div key={`cell_${index}`} className="relative w-full aspect-[3/3.6]">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.wordId}
                animate={{
                  rotateY: 0,
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                className="absolute inset-0 group rounded-[1.4rem]"
                exit={{
                  rotateY: 110,
                  scale: 1.2,
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                initial={{
                  rotateY: -110,
                  scale: 0.5,
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  opacity: { duration: 0.4 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  isPressable
                  className="w-full h-full bg-white transition-all border-1 sm:border-2 border-transparent hover:border-primary shadow-md hover:shadow-lg group overflow-hidden relative rounded-[1.2rem] sm:rounded-[1.4rem]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.blur();
                    const isMobile = window.innerWidth < 640;

                    if (isMobile) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;

                      onItemClick(item.wordId, x > rect.width / 2);
                    } else {
                      onItemClick(item.wordId, e.shiftKey);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (window.innerWidth >= 640) {
                      onItemClick(item.wordId, true);
                    }
                  }}
                >
                  <CardBody className="p-0 flex flex-col items-center justify-center h-full w-full relative">
                    {/* Visual Split Indicator - ONLY ON MOBILE */}
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-success/10 sm:hidden pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-danger/10 sm:hidden border-l border-default-100/30 pointer-events-none" />

                    {/* Hit Progress Indicators (5 dots) */}
                    <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex gap-0.5 z-30 opacity-60">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${i < (item.hits || 0) ? "bg-primary shadow-[0_0_5px_rgba(var(--heroui-primary-rgb),0.5)]" : "bg-default-300 opacity-30"}`}
                        />
                      ))}
                    </div>

                    <div className="w-[70%] h-[70%] relative z-10">
                      <Image
                        fill
                        priority
                        alt={item.en}
                        className="object-contain"
                        sizes="(max-width: 768px) 30vw, 150px"
                        src={`/${item.image}`}
                      />
                    </div>

                    <div className="absolute bottom-2 inset-x-0 text-[7px] sm:text-[10px] font-black uppercase text-primary transition-colors text-center px-1 leading-none z-20">
                      {item.en}
                    </div>

                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex flex-row gap-0.5 sm:gap-1 opacity-60 group-hover:opacity-100 transition-opacity bg-white/90 px-1 py-0.5 rounded-full backdrop-blur-sm shadow-sm border border-default-200 z-30">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-success" />
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-danger" />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  },
);

WordGrid.displayName = "WordGrid";
