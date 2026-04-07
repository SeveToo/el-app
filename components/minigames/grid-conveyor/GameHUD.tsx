import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameHUDProps {
  score: number;
  combo: number;
  lives: number;
  speedMultiplier: string;
  energy: number;
  onSuperPower: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = React.memo(
  ({ score, combo, lives, speedMultiplier, energy, onSuperPower }) => {
    const isCapped = energy >= 100;

    return (
      <div className="flex flex-col gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center bg-content1 p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-default-100 w-full relative overflow-hidden">
          {/* Background Energy Glow when full */}
          {isCapped && (
            <motion.div
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              className="absolute inset-0 bg-primary pointer-events-none"
              initial={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          {/* SCORE */}
          <div className="space-y-0.5 sm:space-y-1 relative z-10">
            <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400 tracking-widest">
              Punkty
            </p>
            <p className="text-xl sm:text-4xl font-black text-primary leading-none">
              {score}
            </p>
          </div>

          {/* COMBO */}
          <div className="flex flex-col items-center gap-0.5 min-w-[60px] sm:min-w-[100px] relative z-10">
            <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-400 tracking-widest">
              Combo
            </p>
            <AnimatePresence mode="popLayout">
              {combo > 1 ? (
                <motion.p
                  key={combo}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    y: 0,
                    opacity: 1,
                    textShadow: "0px 0px 0px rgba(255, 0, 0, 0)",
                  }}
                  className={`text-2xl sm:text-5xl font-black leading-none italic ${combo >= 5 ? "text-warning" : "text-danger"}`}
                  exit={{ scale: 0, opacity: 0 }}
                  initial={{
                    scale: 3,
                    rotate: Math.random() * 20 - 10,
                    y: -20,
                    opacity: 0,
                    textShadow: "0px 0px 20px rgba(255, 0, 0, 0.8)",
                  }}
                >
                  x{combo}
                </motion.p>
              ) : (
                <motion.p
                  key="no-combo"
                  className="text-lg sm:text-3xl font-black leading-none text-default-400/50"
                >
                  --
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* SPEED/ENERGY SECTION */}
          <div className="flex flex-col items-center gap-1 min-w-[80px] sm:min-w-[150px] relative z-10">
            <div className="flex flex-col items-center">
              <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-500 tracking-widest leading-none">
                Energia
              </p>

              <div className="w-full flex items-center gap-2 mt-1 sm:mt-2">
                <div className="flex-1 h-3 sm:h-5 bg-default-100 rounded-full overflow-hidden border border-default-200">
                  <motion.div
                    animate={{ width: `${energy}%` }}
                    className={`h-full ${isCapped ? "bg-primary shadow-[0_0_15px_rgba(var(--heroui-primary-rgb),0.6)]" : "bg-primary/60"}`}
                    initial={{ width: 0 }}
                  />
                </div>

                <button
                  className={`flex items-center justify-center p-1 sm:p-2 rounded-lg transition-all ${isCapped ? "bg-primary text-white scale-110 active:scale-95 shadow-lg animate-bounce" : "bg-default-200 text-default-400 opacity-20 cursor-not-allowed"}`}
                  disabled={!isCapped}
                  onClick={onSuperPower}
                >
                  <span className="text-[10px] sm:text-sm">⚡</span>
                </button>
              </div>

              <p className="text-[7px] sm:text-[9px] font-black mt-1 text-primary/70 uppercase">
                {isCapped ? "GOTÓW (SPACJA)" : `${energy}%`}
              </p>
            </div>
          </div>

          {/* LIVES */}
          <div className="space-y-0.5 sm:space-y-1 text-right relative z-10">
            <div className="flex flex-col items-end">
              <p className="text-[8px] sm:text-[10px] font-black uppercase text-default-500 tracking-widest leading-none mb-1">
                Prędkość
              </p>
              <p className="text-sm sm:text-xl font-black text-secondary leading-none mb-2">
                {speedMultiplier}x
              </p>
            </div>
            <div className="flex gap-1 sm:gap-1.5 justify-end">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 sm:w-5 h-3 sm:h-5 rounded-md sm:rounded-lg ${i < lives ? "bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-default-200 opacity-20 shadow-none"} transition-all duration-300`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

GameHUD.displayName = "GameHUD";
