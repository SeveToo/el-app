import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";
import { GridItem } from "./types";

interface WordGridProps {
  grid: GridItem[];
  onItemClick: (wordId: string, isRightClick: boolean) => void;
}

export const WordGrid: React.FC<WordGridProps> = React.memo(({ grid, onItemClick }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2.5 w-full flex-1 max-w-2xl mx-auto px-1 sm:px-0 auto-rows-fr">
      {grid.map((item) => (
        <motion.div
          key={item.wordId}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <Card 
            isPressable 
            className="w-full aspect-square bg-white transition-all border-1 sm:border-2 border-transparent hover:border-primary shadow-sm hover:shadow-xl group overflow-hidden relative rounded-xl sm:rounded-[1.5rem]"
            onClick={(e) => {
              e.preventDefault();
              // Desktop: Regular click logic (LMB = Green, Shift+LMB = Red)
              // Mobile (< 640px): Split-touch logic (Left = Green, Right = Red)
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
              // Standard Right-Click (Disable split check here to prevent double-hits)
              if (window.innerWidth >= 640) {
                onItemClick(item.wordId, true);
              }
            }}
          >
            <CardBody className="p-0 flex flex-col items-center justify-center h-full w-full relative">
              {/* Visual Split Indicator - ONLY ON MOBILE */}
              <div className="absolute inset-y-0 left-0 w-1/2 bg-success/10 sm:hidden pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-danger/10 sm:hidden border-l border-default-100/30 pointer-events-none" />
              
              <div className="w-[70%] h-[70%] relative z-10">
                <Image
                  src={`/${item.image}`}
                  alt={item.en}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 150px"
                  priority
                />
              </div>

              <div className="absolute bottom-2 inset-x-0 text-[7px] sm:text-[10px] font-black uppercase text-primary transition-colors text-center px-1 leading-none z-20">
                {item.en}
              </div>
              
              <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex flex-row gap-0.5 sm:gap-1 opacity-60 group-hover:opacity-100 transition-opacity bg-white/90 px-1 py-0.5 rounded-full backdrop-blur-sm shadow-sm border border-default-200 z-30">
                 <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-success"/>
                 <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-danger"/>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  );
});
