import React from "react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { motion } from "framer-motion";

import { GameRecord } from "./types";

interface GameOverScreenProps {
  score: number;
  stats: { correct: number; wrong: number };
  onRetry: () => void;
  records: GameRecord[];
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, stats, onRetry, records }) => {
  const total = stats.correct + stats.wrong;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 sm:gap-8 p-4 sm:p-6 text-center max-w-xl mx-auto bg-content1/80 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] border-2 border-danger/20 shadow-2xl my-4 sm:my-8">
      <div className="space-y-2 sm:space-y-4">
        <motion.h2 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl sm:text-7xl font-black text-danger uppercase tracking-tighter"
        >
          Game Over
        </motion.h2>
        <p className="text-3xl sm:text-4xl font-black text-primary leading-none">
          {score} PKT
        </p>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t-2 border-default-100">
          <div className="flex flex-col gap-0.5 sm:gap-1">
             <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400">Poprawne</p>
             <p className="text-lg sm:text-xl font-bold text-success leading-none">{stats.correct}</p>
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1">
             <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400">Błędy</p>
             <p className="text-lg sm:text-xl font-bold text-danger leading-none">{stats.wrong}</p>
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1">
             <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400">Celność</p>
             <p className="text-lg sm:text-xl font-bold text-primary leading-none">{accuracy}%</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <Button 
          className="w-full h-14 sm:h-16 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-xl hover:scale-105 transition-all bg-primary" 
          color="primary" 
          onClick={onRetry}
        >
          PONÓW PRÓBĘ
        </Button>
        <Link href="/" className="w-full">
          <Button 
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-lg border-2 border-default-200" 
            variant="bordered"
          >
            MENU
          </Button>
        </Link>
      </div>

      {/* History Table */}
      {records.length > 0 && (
        <div className="w-full pt-4 border-t-2 border-default-100">
          <p className="text-[10px] font-black text-default-400 uppercase tracking-[0.2em] mb-3 text-left">Historia Wyników:</p>
          <div className="bg-white/5 rounded-2xl overflow-hidden border border-default-100">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-default-50 text-[9px] font-black uppercase text-default-500">
                  <th className="px-3 py-1.5">Data</th>
                  <th className="px-3 py-1.5 text-right">PKT</th>
                  <th className="px-3 py-1.5 text-right">ACC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100">
                {records.map((r, i) => (
                  <tr key={r.id} className={`${i === 0 ? 'bg-danger/5' : ''}`}>
                    <td className="px-3 py-2 text-default-400 font-bold">{r.date}</td>
                    <td className="px-3 py-2 text-right font-black text-primary">{r.points}</td>
                    <td className="px-3 py-2 text-right font-bold text-default-500">{r.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
