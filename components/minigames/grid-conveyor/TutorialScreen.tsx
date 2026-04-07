import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { GameRecord } from "./types";

interface TutorialScreenProps {
  onStart: () => void;
  records: GameRecord[];
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onStart, records }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 p-6 text-center max-w-2xl mx-auto backdrop-blur-sm bg-content1/50 rounded-[3rem] border-2 border-default-100 shadow-2xl my-8">
      <div className="space-y-4">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black text-foreground uppercase tracking-tighter"
        >
          Rocket <span className="text-primary italic">Defense</span>
        </motion.h1>
        <p className="text-default-500 font-bold text-lg leading-relaxed">
          Chroń bazę przed rakietami ze słowami!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* LMB Tutorial */}
        <Card className="bg-success/10 border-2 border-success/20 p-4 shadow-none">
          <CardBody className="flex flex-col items-center gap-4">
            <div className="relative w-20 h-20 bg-success/20 rounded-full flex items-center justify-center text-3xl">
              🖱️
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute left-4 top-4 w-4 h-4 bg-success rounded-full"
              />
            </div>
            <div className="space-y-1">
              <p className="font-black text-success uppercase text-sm">Lewy Przycisk</p>
              <p className="text-xs text-success/80 font-bold uppercase tracking-wider">Dla zielonych rakiet</p>
            </div>
          </CardBody>
        </Card>

        {/* RMB Tutorial */}
        <Card className="bg-danger/10 border-2 border-danger/20 p-4 shadow-none">
          <CardBody className="flex flex-col items-center gap-4">
            <div className="relative w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center text-3xl">
              🖱️
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute right-4 top-4 w-4 h-4 bg-danger rounded-full"
              />
            </div>
            <div className="space-y-1">
              <p className="font-black text-danger uppercase text-sm">Prawy / Shift + Klik</p>
              <p className="text-xs text-danger/80 font-bold uppercase tracking-wider">Dla czerwonych rakiet</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-black text-default-400 uppercase tracking-widest mb-2">Bonusy:</p>
        <div className="flex items-center gap-2 bg-danger/10 px-4 py-2 rounded-full border border-danger/20">
          <span className="text-xl">❤️</span>
          <span className="text-xs font-black text-danger uppercase">Zbieraj serca dla dodatkowych żyć!</span>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden sm:flex flex-col gap-3 w-full">
         <div className="flex items-center gap-4 bg-content2/50 p-4 rounded-2xl border border-default-100">
           <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center text-xl">🖱️</div>
           <p className="text-sm font-bold text-default-600">Kliknięcie = Atak na ZIELONY pas</p>
         </div>
         <div className="flex items-center gap-4 bg-content2/50 p-4 rounded-2xl border border-default-100">
           <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center text-xl">⌨️</div>
           <p className="text-sm font-bold text-default-600">Shift + Klik / Prawy klik = Atak na CZERWONY pas</p>
         </div>
      </div>

      {/* Mobile Split-Touch Guide (Responsive) */}
      <div className="sm:hidden w-full space-y-4">
        <div className="bg-content2/50 p-5 rounded-[2rem] border border-default-200">
          <p className="text-[10px] font-black uppercase text-primary mb-4 tracking-widest text-center">Sterowanie na Telefonie:</p>
          <div className="flex gap-3">
            <div className="flex-1 p-3 bg-success/10 rounded-2xl border border-success/20 text-center space-y-2">
               <div className="w-full aspect-square bg-success/20 rounded-lg flex items-center justify-center text-2xl shadow-sm">👈</div>
               <p className="text-[9px] font-black uppercase text-success leading-tight">Lewa strona karty</p>
            </div>
            <div className="flex-1 p-3 bg-danger/10 rounded-2xl border border-danger/20 text-center space-y-2">
               <div className="w-full aspect-square bg-danger/20 rounded-lg flex items-center justify-center text-2xl shadow-sm">👉</div>
               <p className="text-[9px] font-black uppercase text-danger leading-tight">Prawa strona karty</p>
            </div>
          </div>
        </div>
      </div>
      {/* Leaderboard Table */}
      {records.length > 0 && (
        <div className="w-full space-y-3">
          <p className="text-[10px] font-black text-default-400 uppercase tracking-widest text-left px-2">Ostatnie Wyniki:</p>
          <div className="bg-content2/30 rounded-3xl p-1 border border-default-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-black text-default-400 uppercase border-b border-default-100">
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2 text-right">Punkty</th>
                  <th className="px-4 py-2 text-right">Celność</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id} className={`font-bold transition-colors ${i === 0 ? 'bg-primary/5 text-primary' : 'text-default-600'}`}>
                    <td className="px-4 py-2 text-[10px] opacity-70">{r.date}</td>
                    <td className="px-4 py-2 text-right text-base font-black">{r.points}</td>
                    <td className="px-4 py-2 text-right">{r.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Button 
        className="h-20 px-16 text-2xl font-black rounded-[2rem] shadow-[0_15px_30px_rgba(59,130,246,0.4)] hover:scale-105 transition-all bg-primary text-white" 
        size="lg"
        onClick={onStart}
      >
        START OBROŃCY
      </Button>
    </div>
  );
};
