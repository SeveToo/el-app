import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

import { GameRecord } from "./types";

interface TutorialScreenProps {
  onStart: () => void;
  records: GameRecord[];
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onStart,
  records,
}) => {
  const filteredRecords = records.filter((r) => r.points > 0);
  const bestScore =
    filteredRecords.length > 0
      ? Math.max(...filteredRecords.map((r) => r.points))
      : 0;

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-[70vh] gap-6 p-4 sm:p-6 max-w-6xl mx-auto w-full">
      {/* LEFT PANEL: Branding & Instructions */}
      <Card className="flex-[1.5] backdrop-blur-md bg-content1/80 rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-default-100 shadow-2xl overflow-hidden">
        <CardBody className="p-6 sm:p-12 flex flex-col items-center gap-8 sm:gap-10 text-center">
          <div className="space-y-4">
            <motion.h1
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-7xl font-black text-foreground uppercase tracking-tighter"
              initial={{ y: -20, opacity: 0 }}
            >
              Rocket <span className="text-primary italic">Defense</span>
            </motion.h1>
            <p className="text-default-500 font-bold text-base sm:text-xl leading-relaxed max-w-lg">
              Chroń bazę przed rakietami ze słowami!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            <Card className="bg-success/10 border-2 border-success/20 p-2 sm:p-4 shadow-none">
              <CardBody className="flex flex-col items-center gap-3">
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-success/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
                  🖱️
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    className="absolute left-3 top-3 sm:left-4 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full"
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
                <div className="space-y-0.5 sm:space-y-1 text-center">
                  <p className="font-black text-success uppercase text-xs sm:text-sm leading-tight">
                    Lewy Przycisk
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-success/80 font-bold uppercase tracking-wider">
                    Dla zielonych rakiet
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-danger/10 border-2 border-danger/20 p-2 sm:p-4 shadow-none">
              <CardBody className="flex flex-col items-center gap-3">
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-danger/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
                  🖱️
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    className="absolute right-3 top-3 sm:right-4 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 bg-danger rounded-full"
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
                <div className="space-y-0.5 sm:space-y-1 text-center">
                  <p className="font-black text-danger uppercase text-xs sm:text-sm leading-tight">
                    Prawy / Shift + Klik
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-danger/80 font-bold uppercase tracking-wider">
                    Dla czerwonych rakiet
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-danger/10 px-4 py-2 rounded-full border border-danger/20 shadow-sm">
              <span className="text-xl">❤️</span>
              <span className="text-xs font-black text-danger uppercase">
                Zbieraj serca dla dodatkowych żyć!
              </span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm relative overflow-hidden group">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                className="absolute inset-0 bg-white/20 -skew-x-12"
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <span className="text-xl">⚡</span>
              <span className="text-xs font-black text-primary uppercase">
                SPACJA = FALA UDERZENIOWA (CZYŚCI CAŁĄ PLANSZĘ)
              </span>
            </div>
          </div>

          <div className="w-full pt-4">
            <Button
              className="w-full h-16 sm:h-24 text-xl sm:text-3xl font-black rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_15px_30px_rgba(59,130,246,0.4)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.6)] hover:scale-105 transition-all bg-primary text-white"
              size="lg"
              onClick={onStart}
            >
              START OBROŃCY
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* RIGHT PANEL: History (Desktop) / Collapsed Best Score (Mobile) */}
      <Card className="flex-1 backdrop-blur-md bg-content1/40 rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-dashed border-default-200 shadow-xl overflow-hidden hidden lg:flex flex-col">
        <CardBody className="p-8 flex flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
              Twoje Postępy
            </h3>
            {bestScore > 0 && (
              <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">
                  Rekord Życia
                </p>
                <p className="text-3xl font-black text-primary leading-none">
                  {bestScore}
                </p>
              </div>
            )}
          </div>

          {filteredRecords.length > 0 ? (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <p className="text-[10px] font-black text-default-400 uppercase tracking-widest px-1">
                Ostatnie Bitwy:
              </p>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {filteredRecords.map((r, i) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border ${i === 0 ? "bg-primary/5 border-primary/20" : "bg-default-50 border-default-100"} transition-all`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-default-400">
                        {r.date}
                      </span>
                      <span className="text-lg font-black text-foreground">
                        {r.points} pkt
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-black ${r.accuracy > 80 ? "text-success" : "text-primary"}`}
                      >
                        {r.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <span className="text-4xl mb-4">🚀</span>
              <p className="text-xs font-black uppercase tracking-widest">
                Brak zapisanych wyników
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* MOBILE HISTORY PREVIEW */}
      <div className="lg:hidden w-full px-2">
        {bestScore > 0 && (
          <div className="bg-content1/80 border-2 border-default-100 p-4 rounded-3xl flex justify-between items-center mb-4">
            <div>
              <p className="text-[8px] font-black text-default-400 uppercase tracking-widest">
                Najlepszy Wynik
              </p>
              <p className="text-2xl font-black text-primary">{bestScore}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-default-400 uppercase tracking-widest">
                Ostatnio
              </p>
              <p className="text-xl font-bold text-foreground">
                {filteredRecords[0]?.points || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
