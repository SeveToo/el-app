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

  const initGame = useCallback(() => {
    const shuffled = [...sourceWords].sort(() => Math.random() - 0.5);
    const gridItems = shuffled.slice(0, GRID_SIZE).map((w) => ({
      wordId: w.id,
      image: w.image,
      en: w.en,
      pl: w.pl,
    }));
    
    setGrid(gridItems);
    setBeltItems([]);
    setProjectiles([]);
    setHearts([]);
    setScore(0);
    setCombo(0);
    setLives(3);
    setStats({ correct: 0, wrong: 0 });
    setSpeed(INITIAL_BELT_SPEED);
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

  const spawnWord = useCallback(() => {
    // CRITICAL: Always use current stable grid
    if (grid.length === 0) return;
    
    const target = grid[Math.floor(Math.random() * grid.length)];
    const newWord: BeltItem = {
      id: Math.random().toString(36).substring(7),
      wordId: target.wordId,
      en: target.en,
      belt: Math.random() > 0.5 ? "green" : "red",
      startTime: Date.now(),
    };

    setBeltItems((prev) => [...prev, newWord]);
  }, [grid]);

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
    const total = correct + wrong;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    const newRecord: GameRecord = {
      id: Math.random().toString(36).substring(7),
      points: finalScore,
      accuracy: acc,
      date: new Date().toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    };

    setRecords(prev => {
      const next = [newRecord, ...prev].slice(0, 5);
      localStorage.setItem("grid_game_records", JSON.stringify(next));
      return next;
    });
  }, []);

  // Optimized Game Loop (Checks roughly every 100ms)
  useEffect(() => {
    if (gameState !== "playing") return;

    const tick = () => {
      const now = Date.now();

      // 1. Spawning
      if (now - lastSpawnTime.current > spawnCooldown.current) {
         setBeltItems(prev => {
            if (prev.length < maxBeltItems) {
               spawnWord();
               lastSpawnTime.current = now;
               // Dynamic cooldown
               spawnCooldown.current = Math.max(1500, SPAWN_COOLDOWN_INITIAL - Math.floor(score / 40) * 200);
            }
            return prev;
         });
      }

      // 2. Miss Check (Expiry)
      setBeltItems((prev) => {
        const expired = prev.filter((item) => now - item.startTime > speed);
        if (expired.length > 0) {
          setLives((l) => {
            const nextL = l - expired.length;
            if (nextL <= 0) {
               setGameState("ended");
               saveScore(score, stats.correct, stats.wrong + expired.length);
            }
            return Math.max(0, nextL);
          });
          setCombo(0);
          setStats(ps => ({ ...ps, wrong: ps.wrong + expired.length }));
          audioService.playError();
          return prev.filter((item) => now - item.startTime <= speed);
        }
        return prev;
      });

      gameLoopRef.current = setTimeout(tick, 200) as unknown as number;
    };

    gameLoopRef.current = setTimeout(tick, 200) as unknown as number;
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameState, spawnWord, score, speed, maxBeltItems, stats, saveScore]);

  const handleGridClick = useCallback((wordId: string, isRightClick: boolean) => {
    if (gameState !== "playing") return;

    // 1. Audio and Context Resume (Immediate)
    const typeNeeded = isRightClick ? "red" : "green";
    
    // 2. Find match locally to avoid nested state updates
    let matchedItem: BeltItem | undefined;
    setBeltItems(prev => {
      matchedItem = prev.find(item => item.wordId === wordId && item.belt === typeNeeded);
      if (matchedItem) {
        return prev.filter(item => item.id !== matchedItem!.id);
      }
      return prev;
    });

    // 3. Handle Result (outside setBeltItems)
    // We use a small delay or trust the closure for matchedItem
    // Better: use a temporary variable if possible, but setBeltItems is async.
    // Instead, let's peek at the current state via a ref or just use the find logic again
    // but that's expensive. Let's try the direct approach:
    
    const actualMatch = beltItems.find(item => item.wordId === wordId && item.belt === typeNeeded);

    if (actualMatch) {
      audioService.playSuccess();
      
      // Projectile
      const projectileId = Math.random().toString(36).substring(7);
      setProjectiles(p => [...p, { id: projectileId, fromX: 0, fromY: 0, toBelt: actualMatch.belt, targetWordId: actualMatch.wordId }]);
      setTimeout(() => setProjectiles(p => p.filter(proj => proj.id !== projectileId)), 400);

      // Scoring & Stats
      const points = 10 + (combo * 2);
      setScore(s => {
        const next = s + points;
        // Heart Condition: Must have lost health AND 15% chance AND 10s cooldown
        const now = Date.now();
        if (lives < 3 && Math.random() < 0.15 && (now - lastHeartDrop.current > 10000)) {
           spawnHeart();
           lastHeartDrop.current = now;
        }
        return next;
      });
      setCombo(c => c + 1);
      setStats(ps => ({ ...ps, correct: ps.correct + 1 }));

      // Difficulty
      setTimeout(() => {
        setScore(current => {
          if (current > 0 && current % 20 === 0) {
            setSpeed(prev => Math.max(prev - 200, 3000));
            spawnCooldown.current = Math.max(1000, spawnCooldown.current - 100);
          }
          if (current > 0 && current % 100 === 0) {
            setMaxBeltItems(prev => Math.min(prev + 1, 8));
          }
          return current;
        });
      }, 0);
    } else {
      audioService.playError();
      setCombo(0);
      setStats(ps => ({ ...ps, wrong: ps.wrong + 1 }));
      setLives(l => {
        const next = l - 1;
        if (next <= 0) {
           setGameState("ended");
           saveScore(score, stats.correct, stats.wrong + 1);
        }
        return Math.max(0, next);
      });
    }
  }, [gameState, combo, spawnHeart, beltItems, score, stats, saveScore]);

  if (gameState === "ready") return <TutorialScreen onStart={initGame} records={records} />;
  if (gameState === "ended") return <GameOverScreen score={score} stats={stats} onRetry={initGame} records={records} />;

  return (
    <div className="flex flex-col gap-1.5 sm:gap-4 w-full p-1 sm:p-6 overflow-hidden relative min-h-[70vh] sm:min-h-0">
      <AnimatePresence mode="wait">
        {gameState === "countdown" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-[3rem]"
          >
            <p className="text-white/60 text-[8px] sm:text-xs font-black uppercase tracking-[0.3em] mb-2 sm:mb-4">PRZYGOTUJ SIĘ</p>
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="text-7xl sm:text-9xl font-black text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
            >
              {countdown}
            </motion.div>
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
