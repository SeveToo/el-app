"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audioService } from "@/lib/audio";
import { Word } from "@/types";

// Sub-components
import { GameHUD } from "./GameHUD";
import { ConveyorTracks } from "./ConveyorTracks";
import { WordGrid } from "./WordGrid";
import { ProjectileLayer } from "./ProjectileLayer";
import { TutorialScreen } from "./TutorialScreen";
import { GameOverScreen } from "./GameOverScreen";
import { HeartDrop } from "./HeartDrop";

// Types
import { BeltItem, GridItem, Projectile, HeartItem, GameState, GameRecord } from "./types";

const GRID_SIZE = 12; // 3x4 or 4x3 = 12 items
const INITIAL_BELT_SPEED = 11000; // 11s - better balance
const SPEED_INCREMENT = 400; 
const MAX_WORDS_ON_BELT = 5;
const SPAWN_COOLDOWN_INITIAL = 3000; // 3s between spawns
const HEART_DURATION = 5000;

export default function GridConveyorGame({ sourceWords }: { sourceWords: Word[] }) {
  // Game State
  const [gameState, setGameState] = useState<GameState>("ready");
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [beltItems, setBeltItems] = useState<BeltItem[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(INITIAL_BELT_SPEED);
  const [maxBeltItems, setMaxBeltItems] = useState(MAX_WORDS_ON_BELT);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [countdown, setCountdown] = useState(3);
  const [records, setRecords] = useState<GameRecord[]>([]);

  // Load records
  useEffect(() => {
    const saved = localStorage.getItem("grid_game_records");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  // Internal Refs for performance (Avoid re-renders for every tick)
  const lastSpawnTime = useRef<number>(0);
  const spawnCooldown = useRef<number>(SPAWN_COOLDOWN_INITIAL);
  const lastHeartDrop = useRef<number>(0);
  const gameLoopRef = useRef<number>();
  const scoreRef = useRef<number>(0);
  const statsRef = useRef({ correct: 0, wrong: 0 });
  const gridRef = useRef<GridItem[]>([]);
  const beltItemsRef = useRef<BeltItem[]>([]);
  const processedIdsRef = useRef<Set<string>>(new Set());
  const hasEndedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(INITIAL_BELT_SPEED);

  useEffect(() => { 
    gridRef.current = grid; 
    beltItemsRef.current = beltItems;
  }, [grid, beltItems]);

  const initGame = useCallback(() => {
    hasEndedRef.current = false;
    processedIdsRef.current.clear();
    const shuffled = [...sourceWords].sort(() => Math.random() - 0.5);
    const gridItems = shuffled.slice(0, GRID_SIZE).map((w) => ({
      wordId: w.id,
      image: w.image,
      en: w.en,
      pl: w.pl,
      hits: 0,
    }));
    
    setGrid(gridItems);
    setBeltItems([]);
    setProjectiles([]);
    setHearts([]);
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    setLives(3);
    setStats({ correct: 0, wrong: 0 });
    statsRef.current = { correct: 0, wrong: 0 };
    setSpeed(INITIAL_BELT_SPEED);
    speedRef.current = INITIAL_BELT_SPEED;
    setCountdown(3);
    setGameState("countdown");
    lastSpawnTime.current = Date.now();
    spawnCooldown.current = SPAWN_COOLDOWN_INITIAL;
  }, [sourceWords]);

  // Countdown controller
  useEffect(() => {
    if (gameState !== "countdown") return;
    if (countdown <= 0) {
      setGameState("playing");
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  const getNewWord = useCallback((currentGrid: GridItem[]) => {
    if (currentGrid.length === 0) return null;
    const target = currentGrid[Math.floor(Math.random() * currentGrid.length)];
    const spd = speedRef.current;
    const ts = Date.now();
    return {
      id: Math.random().toString(36).substring(7),
      wordId: target.wordId,
      en: target.en,
      belt: (Math.random() > 0.5 ? "green" : "red") as "green" | "red",
      startTime: ts,
      duration: spd,
      expiryTime: ts + spd
    };
  }, []);

  const spawnHeart = useCallback(() => {
    const newHeart: HeartItem = {
      id: Math.random().toString(36).substring(7),
      x: 15 + Math.random() * 70, // Keep away from edges
      y: 10 + Math.random() * 40,
      startTime: Date.now(),
      duration: HEART_DURATION
    };
    setHearts(prev => [...prev, newHeart]);

    // Auto-remove heart after duration
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, HEART_DURATION);
  }, []);

  const handleCollectHeart = (id: string) => {
    setHearts(prev => prev.filter(h => h.id !== id));
    setLives(l => Math.min(l + 1, 5)); // Cap at 5 lives
    audioService.playSuccess();
  };

  const saveScore = useCallback((finalScore: number, correct: number, wrong: number) => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    
    const total = correct + wrong;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    const newRecord: GameRecord = {
      id: Math.random().toString(36).substring(7),
      points: finalScore,
      accuracy: acc,
      date: new Date().toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    };

    const saved = localStorage.getItem("grid_game_records");
    let currentRecords: GameRecord[] = [];
    if (saved) currentRecords = JSON.parse(saved);
    
    const next = [newRecord, ...currentRecords].slice(0, 15);
    localStorage.setItem("grid_game_records", JSON.stringify(next));
    setRecords(next);
  }, []);

  // Optimized Game Loop (Strict Mode Safe)
  useEffect(() => {
    if (gameState !== "playing") return;

    const tick = () => {
      const now = Date.now();

      const currentItems = beltItemsRef.current;
      const expired = currentItems.filter((item) => now > item.expiryTime && !processedIdsRef.current.has(item.id));

      if (expired.length > 0) {
        expired.forEach(e => processedIdsRef.current.add(e.id));
        console.log(`💥 [MINIĘCIE] Przepuszczono rakiety: ${expired.map(e => e.en).join(', ')}. (Życie -${expired.length})`);
        
        if (!hasEndedRef.current) {
          setLives((l) => {
            const nextL = Math.max(0, l - expired.length);
            if (nextL <= 0 && l > 0) {
               setGameState("ended");
               saveScore(scoreRef.current, statsRef.current.correct, statsRef.current.wrong + expired.length);
            }
            return nextL;
          });
          setCombo(0);
          setStats(ps => {
             const n = { ...ps, wrong: ps.wrong + expired.length };
             statsRef.current = n;
             return n;
          });
          audioService.playError();
        }
      }

      setBeltItems((prev) => {
        let changed = false;
        let next = prev;

        const freshExpired = prev.filter((item) => now > item.expiryTime);
        if (freshExpired.length > 0) {
          next = prev.filter((item) => now <= item.expiryTime);
          changed = true;
        }

        if (now - lastSpawnTime.current > spawnCooldown.current && next.length < maxBeltItems) {
           const newWord = getNewWord(gridRef.current);
           if (newWord) {
             next = [...next, newWord];
             changed = true;
             lastSpawnTime.current = now;
             spawnCooldown.current = Math.max(1500, SPAWN_COOLDOWN_INITIAL - Math.floor(scoreRef.current / 40) * 200);
           }
        }

        return changed ? next : prev;
      });

      gameLoopRef.current = setTimeout(tick, 200) as unknown as number;
    };

    gameLoopRef.current = setTimeout(tick, 200) as unknown as number;
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameState, maxBeltItems, getNewWord, saveScore]);

  const handleGridClick = useCallback((wordId: string, isRightClick: boolean) => {
    if (gameState !== "playing" || hasEndedRef.current) return;

    const typeNeeded = isRightClick ? "red" : "green";
    const now = Date.now();
    
    // Evaluate the match synchronously against the reliably synchronized reference array!
    const actualMatch = beltItemsRef.current.find(item => item.wordId === wordId && item.belt === typeNeeded && !processedIdsRef.current.has(item.id));

    if (actualMatch) {
      processedIdsRef.current.add(actualMatch.id);
      console.log(`✅ [TRAFIENIE] Zestrzelono: ${actualMatch.en} (Strona: ${typeNeeded})! Opcje na pasie: ${beltItemsRef.current.map(i => i.en).join(', ')}`);
      
      const matchedCell = gridRef.current.find(c => c.wordId === wordId);
      const willRetire = matchedCell && (matchedCell.hits || 0) + 1 >= 5;

      // Ensure the hit object is eliminated AND check if we need to auto-destroy any duplicate rockets 
      // because the word grid icon is about to vanish!
      setBeltItems(prev => {
         const cleaned = prev.filter(item => item.id !== actualMatch.id);
         if (willRetire) {
             // Word is retiring from the grid. Vaporize all other instances of this word currently on the belts!
             const orphaned = cleaned.filter(b => b.wordId === wordId);
             orphaned.forEach(o => processedIdsRef.current.add(o.id)); // Add deleted orphans to processed list
             return cleaned.filter(b => b.wordId !== wordId);
         }
         return cleaned;
      });
      
      audioService.playSuccess();
      
      const projectileId = Math.random().toString(36).substring(7);
      setProjectiles(p => [...p, { id: projectileId, fromX: 0, fromY: 0, toBelt: actualMatch.belt, targetWordId: actualMatch.wordId }]);
      setTimeout(() => setProjectiles(p => p.filter(proj => proj.id !== projectileId)), 400);

      setCombo(c => {
        const newC = c + 1;
        const points = 10 + (newC * 2);
        setScore(s => {
          const nextS = s + points;
          scoreRef.current = nextS;
          
          if (nextS > 0 && nextS % 20 === 0) {
             setSpeed(prev => {
                const nextSpd = Math.max(prev - 200, 3000);
                speedRef.current = nextSpd;
                return nextSpd;
             });
             spawnCooldown.current = Math.max(1000, spawnCooldown.current - 100);
          }
          if (nextS > 0 && nextS % 100 === 0) setMaxBeltItems(prev => Math.min(prev + 1, 8));
          
          return nextS;
        });
        return newC;
      });

      setStats(ps => {
         const n = { ...ps, correct: ps.correct + 1 };
         statsRef.current = n;
         return n;
      });

      if (lives < 3 && Math.random() < 0.15 && (now - lastHeartDrop.current > 10000)) {
         spawnHeart();
         lastHeartDrop.current = now;
      }

      setGrid(prev => {
         return prev.map(cell => {
            if (cell.wordId === wordId) {
               const newHits = (cell.hits || 0) + 1;
               if (newHits >= 5) {
                  const usedIds = new Set(prev.map(p => p.wordId));
                  const available = sourceWords.filter(sw => !usedIds.has(sw.id));
                  if (available.length > 0) {
                     const newWord = available[Math.floor(Math.random() * available.length)];
                     return { wordId: newWord.id, image: newWord.image, en: newWord.en, pl: newWord.pl, hits: 0 };
                  }
               }
               return { ...cell, hits: newHits };
            }
            return cell;
         });
      });
    } else {
      console.log(`❌ [PUDŁO] Błędny strzał! Szukano: słowo ID ${wordId}, strona: ${typeNeeded}. Opcje na pasie: ${beltItemsRef.current.map(i => `${i.wordId}(${i.belt})`).join(', ')}. (Życie -1)`);
      audioService.playError();
      setCombo(0);
      setStats(ps => {
         const n = { ...ps, wrong: ps.wrong + 1 };
         statsRef.current = n;
         return n;
      });
      setLives(l => {
        const next = Math.max(0, l - 1);
        if (next <= 0 && l > 0) {
           setGameState("ended");
           saveScore(scoreRef.current, statsRef.current.correct, statsRef.current.wrong);
        }
        return next;
      });
    }
  }, [gameState, spawnHeart, saveScore, lives, sourceWords]);

  if (gameState === "ready") return <TutorialScreen onStart={initGame} records={records} />;
  if (gameState === "ended") return <GameOverScreen score={score} stats={stats} onRetry={initGame} records={records} />;

  return (
    <div className="flex flex-col gap-1.5 sm:gap-4 w-full p-1 sm:p-6 overflow-hidden relative min-h-[70vh] sm:min-h-0">
      <AnimatePresence mode="wait">
        {gameState === "countdown" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none"
          >
            <div className="bg-background/80 backdrop-blur-md px-6 py-2 rounded-full border-2 border-primary/20 shadow-lg flex items-center gap-3">
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Przygotuj się:</p>
               <motion.div
                 key={countdown}
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1.2, opacity: 1 }}
                 exit={{ scale: 0.5, opacity: 0 }}
                 transition={{ duration: 0.5 }}
                 className="text-xl font-black text-foreground"
               >
                 {countdown}
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GameHUD score={score} combo={combo} lives={lives} />
      
      <div className="relative mb-1">
        <ConveyorTracks beltItems={beltItems} speed={speed} lives={lives} />
        <ProjectileLayer projectiles={projectiles} />
        
        <AnimatePresence>
          {hearts.map(heart => (
            <HeartDrop key={heart.id} heart={heart} onCollect={handleCollectHeart} />
          ))}
        </AnimatePresence>
      </div>

      <WordGrid grid={grid} onItemClick={handleGridClick} />

      <div className="text-center mt-1">
         <p className="text-[8px] font-black text-default-400 uppercase tracking-widest sm:hidden">
            LEWA POŁOWA = ZIELONA | PRAWA = CZERWONA
         </p>
         <p className="text-[10px] font-black text-default-400 uppercase tracking-widest hidden sm:block">
            Shift + Lewy Przycisk Myszy = Prawy Przycisk Myszy 🛡️
         </p>
      </div>
    </div>
  );
}
