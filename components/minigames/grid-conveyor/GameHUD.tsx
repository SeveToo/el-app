import React from "react";
import { motion } from "framer-motion";

interface GameHUDProps {
  score: number;
  combo: number;
  lives: number;
}

export const GameHUD: React.FC<GameHUDProps> = React.memo(({ score, combo, lives }) => {
  return (
    <div className="flex justify-between items-center bg-content1 p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-default-100 mb-4 sm:mb-8 max-w-4xl mx-auto w-full">
      <div className="space-y-0.5 sm:space-y-1">
        <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400 tracking-widest">Punkty</p>
        <p className="text-2xl sm:text-4xl font-black text-primary leading-none">{score}</p>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400 tracking-widest">Combo</p>
        <motion.p 
          key={combo}
          initial={{ scale: 1.5, color: '#ef4444' }}
          animate={{ scale: 1, color: 'var(--heroui-foreground)' }}
          className="text-xl sm:text-3xl font-black leading-none"
        >
          x{combo}
        </motion.p>
      </div>

      <div className="space-y-0.5 sm:space-y-1 text-right">
        <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400 tracking-widest">Życia</p>
        <div className="flex gap-1 sm:gap-1.5 justify-end">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${i < lives ? 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-default-200 opacity-20 shadow-none'} transition-all`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
