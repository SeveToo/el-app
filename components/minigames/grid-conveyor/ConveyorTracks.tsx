import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BeltItem } from "./types";

interface ConveyorTracksProps {
  beltItems: BeltItem[];
  speed: number;
}

interface ConveyorTracksProps {
  beltItems: BeltItem[];
  speed: number;
  lives: number; // For hit feedback
}

export const ConveyorTracks: React.FC<ConveyorTracksProps> = React.memo(({ beltItems, speed, lives }) => {
  const [lastLives, setLastLives] = React.useState(lives);
  const [pulse, setPulse] = React.useState(false);

  React.useEffect(() => {
    if (lives < lastLives) {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }
    setLastLives(lives);
  }, [lives, lastLives]);
  return (
    <div className="flex flex-col gap-4 sm:gap-6 relative mb-4 sm:mb-8 max-w-4xl mx-auto w-full">
      {/* The Base (Defense point) with Pulse Effect */}
      <motion.div 
        animate={pulse ? { x: [-5, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.2 }}
        className={`absolute -left-4 sm:-left-6 top-0 bottom-0 w-20 sm:w-24 bg-gradient-to-r ${pulse ? 'from-danger/30' : 'from-primary-500/20'} to-transparent z-0 rounded-l-3xl border-l-4 ${pulse ? 'border-danger' : 'border-primary'} shadow-[0_0_40px_rgba(59,130,246,0.3)] hidden sm:block transition-colors`} 
      />
      
      {/* Track 1 (Green) */}
      <div className="relative h-16 sm:h-24 bg-success-50 dark:bg-success/5 rounded-2xl sm:rounded-3xl border-2 border-success/30 overflow-hidden shadow-inner flex items-center">
         <motion.div 
           animate={pulse ? { backgroundColor: '#ef4444', scale: 1.2 } : {}}
           transition={{ duration: 0.2 }}
           className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-success flex items-center justify-center z-20 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
         >
           <span className="text-xl sm:text-2xl">{pulse ? '💥' : '🛡️'}</span>
         </motion.div>
         
         <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-10 text-[8px] sm:text-[11px] font-black text-success opacity-30 uppercase tracking-[0.25em] pointer-events-none whitespace-nowrap">
            FLANKA 🟢
         </div>
         
         <div className="relative w-full h-full overflow-visible">
           <AnimatePresence>
             {beltItems.filter(i => i.belt === "green").map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ left: '100%' }}
                  animate={{ left: '-10%' }}
                  transition={{ duration: item.duration / 1000, ease: "linear" }}
                  className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-3 z-10"
                >
                  <div className="bg-white dark:bg-content1 px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl border-1 sm:border-2 border-r-4 sm:border-r-8 border-success font-black text-[10px] sm:text-xl uppercase tracking-wider text-success whitespace-nowrap">
                    {item.en}
                  </div>
                  <div className="w-6 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-success to-transparent rounded-full blur-[1px] sm:blur-[2px] opacity-60" />
                </motion.div>
             ))}
           </AnimatePresence>
         </div>
      </div>

      {/* Track 2 (Red) */}
      <div className="relative h-16 sm:h-24 bg-danger-50 dark:bg-danger/5 rounded-2xl sm:rounded-3xl border-2 border-danger/30 overflow-hidden shadow-inner flex items-center">
         <motion.div 
           animate={pulse ? { backgroundColor: '#ef4444', scale: 1.2 } : {}}
           transition={{ duration: 0.2 }}
           className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-danger flex items-center justify-center z-20 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
         >
           <span className="text-xl sm:text-2xl">{pulse ? '💥' : '🛡️'}</span>
         </motion.div>

        <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-10 text-[8px] sm:text-[11px] font-black text-danger opacity-30 uppercase tracking-[0.25em] pointer-events-none whitespace-nowrap">
           FLANKA 🔴
        </div>

        <div className="relative w-full h-full overflow-visible">
          <AnimatePresence>
            {beltItems.filter(i => i.belt === "red").map((item) => (
              <motion.div
                key={item.id}
                initial={{ left: '100%' }}
                animate={{ left: '-10%' }}
                transition={{ duration: item.duration / 1000, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-3 z-10"
              >
                <div className="bg-white dark:bg-content1 px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl border-1 sm:border-2 border-r-4 sm:border-r-8 border-danger font-black text-[10px] sm:text-xl uppercase tracking-wider text-danger whitespace-nowrap">
                  {item.en}
                </div>
                <div className="w-6 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-danger to-transparent rounded-full blur-[1px] sm:blur-[2px] opacity-60" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
