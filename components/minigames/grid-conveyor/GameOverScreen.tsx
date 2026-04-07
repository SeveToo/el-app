import React, { useState } from "react";
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
  const [showAll, setShowAll] = useState(false);
  const total = stats.correct + stats.wrong;
  const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  
  const bestScore = records.length > 0 ? Math.max(...records.map(r => r.points)) : score;
  const displayRecords = showAll ? records : records.slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-[60vh] gap-6 sm:gap-8 max-w-5xl mx-auto my-4 sm:my-8 scale-[0.98] sm:scale-100 px-2 sm:px-0">
      {/* Left Panel: Score & Actions */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 text-center bg-content1/80 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] border-2 border-danger/20 shadow-2xl relative">
        <div className="space-y-4 mb-8">
          <motion.h2 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl sm:text-7xl font-black text-danger uppercase tracking-tighter"
          >
            Game Over
          </motion.h2>
          <p className="text-4xl sm:text-5xl font-black text-primary leading-none drop-shadow-md">
            {score} PKT
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t-2 border-default-100 mt-6">
            <div className="flex flex-col gap-1">
               <p className="text-[10px] font-black uppercase text-default-400">Poprawne</p>
               <p className="text-xl sm:text-2xl font-bold text-success leading-none">{stats.correct}</p>
            </div>
            <div className="flex flex-col gap-1">
               <p className="text-[10px] font-black uppercase text-default-400">Błędy</p>
               <p className="text-xl sm:text-2xl font-bold text-danger leading-none">{stats.wrong}</p>
            </div>
            <div className="flex flex-col gap-1">
               <p className="text-[10px] font-black uppercase text-default-400">Celność</p>
               <p className="text-xl sm:text-2xl font-bold text-primary leading-none">{accuracy}%</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            className="flex-1 h-14 sm:h-16 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl shadow-xl hover:scale-105 transition-all bg-primary text-white" 
            onClick={onRetry}
          >
            PONÓW PRÓBĘ
          </Button>
          <Link href="/" className="flex-1 w-full">
            <Button 
              className="w-full h-14 sm:h-16 text-lg font-black rounded-2xl sm:rounded-3xl shadow-lg border-2 border-default-200" 
              variant="bordered"
            >
              MENU
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Panel: History */}
      {records.length > 0 && (
        <div className="w-full lg:w-80 flex flex-col bg-content1/80 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] border-2 border-default-100 shadow-xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
             <p className="text-[11px] font-black text-default-500 uppercase tracking-[0.2em] leading-tight">
               Historia<br/>Wyników
             </p>
             <div className="text-right px-3 py-1.5 bg-warning/10 rounded-xl border border-warning/20 shadow-sm shrink-0">
                <p className="text-[9px] font-bold text-warning uppercase mb-0.5">Najlepszy Wynik</p>
                <p className="text-base font-black text-warning leading-none">{bestScore} PKT</p>
             </div>
          </div>
          
          <div className="bg-white/5 rounded-2xl overflow-hidden border border-default-100 flex-1 flex flex-col justify-between">
            <table className="w-full text-xs text-left shrink-0">
              <thead>
                <tr className="bg-default-50 text-[9px] font-black uppercase text-default-500">
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2 text-right">PKT</th>
                  <th className="px-3 py-2 text-right w-12">ACC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100">
                {displayRecords.map((r, i) => (
                  <tr key={r.id} className={`${i === 0 ? 'bg-danger/5' : ''}`}>
                    <td className="px-3 py-2.5 text-[10px] text-default-400 font-bold whitespace-nowrap">
                       {r.date.replace(', ', '\n')}
                    </td>
                    <td className="px-3 py-2.5 text-right font-black text-primary text-sm">{r.points}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-default-500">{r.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {records.length > 3 && (
              <button 
                onClick={() => setShowAll(!showAll)}
                className="w-full py-3 text-[10px] font-black uppercase text-default-500 hover:bg-default-100/50 hover:text-foreground transition-colors border-t border-default-100 shrink-0"
              >
                {showAll ? 'Zwiń Historię' : `Pokaż Więcej (${records.length - 3})`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
