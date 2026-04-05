"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import { motion } from "framer-motion";

import ChapterCard from "@/components/ui/ChapterCard";
import { AdBanner } from "@/components/layout/AdBanner";
import { getAllProgress, calcPercent } from "@/lib/progress";
import { LESSONS } from "@/config/lessons";

// ─── Nexus Tree Components ──────────────────────────────────────────────────

function NexusNode({ 
  lesson, 
  color, 
  glow, 
  progress = 0 
}: { 
  lesson: any, 
  color: string, 
  glow: string, 
  progress?: number 
}) {
  const isTest = lesson.type === "test";
  const isFinal = lesson.type === "final";
  const isCompleted = progress === 100;

  return (
    <motion.div
      whileHover={{ scale: 1.1, translateY: -5 }}
      className="flex flex-col items-center gap-2"
    >
      <Link href={isTest || isFinal ? "#" : `/chapters/${lesson.id}`}>
        <div 
          className={`
            relative flex items-center justify-center transition-all duration-300
            ${isFinal ? "w-20 h-20 text-4xl" : isTest ? "w-16 h-16 text-3xl" : "w-16 h-16 text-3xl"}
          `}
          style={{
            borderRadius: isTest || isFinal ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "50%",
            background: isFinal 
              ? "linear-gradient(135deg, #fcd34d 0%, #d97706 100%)" 
              : isTest 
              ? "var(--heroui-default-200)" 
              : "var(--heroui-default-100)",
            border: isFinal 
              ? "3px solid #fff" 
              : isTest 
              ? `2px dashed ${color}` 
              : `2px solid ${isCompleted ? color : "var(--heroui-default-200)"}`,
            boxShadow: (isCompleted || isFinal) ? `0 0 25px ${glow}` : "none",
          }}
        >
          {lesson.icon || (isTest ? "🛡️" : "🧩")}
          
          {/* Progress Ring (Outer) */}
          {!isFinal && !isTest && progress > 0 && (
            <svg className="absolute -inset-1 w-[4.5rem] h-[4.5rem] -rotate-90 pointer-events-none">
              <circle
                cx="36"
                cy="36"
                r="34"
                fill="none"
                className="stroke-default-200"
                strokeWidth="3"
              />
              <motion.circle
                cx="36"
                cy="36"
                r="34"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          )}
        </div>
      </Link>
      
      <div className="text-center px-1">
        <div className={`text-[11px] font-black leading-tight uppercase tracking-wide
          ${isFinal ? "text-warning" : isTest ? "text-default-600" : "text-foreground"}
        `}>
          {lesson.title}
        </div>
        {!isFinal && !isTest && (
          <div className="text-[9px] text-default-500 font-bold mt-0.5">
            {progress}% ukończone
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NexusBranch({ 
  name, 
  lessons, 
  color, 
  glow, 
  progressMap 
}: { 
  name: string, 
  lessons: any[], 
  color: string, 
  glow: string, 
  progressMap: Record<string, number> 
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2">
        <div 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        />
        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-foreground opacity-90">
          {name}
        </h3>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-y-12 gap-x-4">
        {lessons.map((lesson) => (
          <NexusNode 
            key={lesson.id} 
            color={color} 
            glow={glow} 
            lesson={lesson} 
            progress={progressMap[lesson.id] || 0} 
          />
        ))}
      </div>
    </div>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject") || "english";

  // Wczytaj postęp z localStorage (client-side)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const all = getAllProgress();
    const pct: Record<string, number> = {};

    for (const [id, p] of Object.entries(all)) {
      pct[id] = calcPercent(p);
    }
    setProgressMap(pct);
  }, []);

  const filteredChapters = LESSONS.filter((c) => c.subject === subjectParam);

  const handleSelectionChange = (key: React.Key) => {
    router.push(`/?subject=${key}`);
  };

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col gap-8">
        {/* Banner na górze */}
        <AdBanner />

        {/* Swicz widoczny tylko na mobile, zastępuje h1 */}
        <div className="flex justify-center -mb-2 sm:hidden">
          <Tabs
            aria-label="Wybierz przedmiot"
            color="primary"
            radius="full"
            selectedKey={subjectParam}
            onSelectionChange={handleSelectionChange}
          >
            <Tab key="english" title="Angielski" />
          </Tabs>
        </div>

        {/* Sekcja Nexus Tree (Skill Tree) - Nowość */}
        <div className="flex flex-col gap-10 my-4">
          <NexusBranch
            color="#22c55e"
            glow="rgba(34,197,94,0.15)"
            name="Rzeczowniki"
            progressMap={progressMap}
            lessons={[
              { id: "fruits", icon: "🍎", title: "Owoce" },
              { id: "vegetables", icon: "🥦", title: "Warzywa" },
              { id: "food", icon: "🍔", title: "Jedzenie" },
              { id: "CHECKPOINT_1", type: "test", title: "Test: Kuchnia & Owoce" },
              { id: "kitchen_tools", icon: "🍳", title: "Kuchnia" },
              { id: "furniture", icon: "🛋️", title: "Dom" },
              { id: "nature", icon: "🌲", title: "Natura" },
              { id: "CHECKPOINT_2", type: "test", title: "Test: Otoczenie" },
              { id: "body_parts", icon: "🦴", title: "Ciało" },
              { id: "family", icon: "👨‍👩‍👧", title: "Rodzina" },
              { id: "jobs", icon: "💼", title: "Zawody" },
              { id: "final_test", type: "final", title: "Egzamin", icon: "🏆" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold opacity-30 uppercase tracking-widest pl-2">Wszystkie Lekcje</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
            {filteredChapters.map((c) => (
              <ChapterCard
                key={c.id}
                completed={progressMap[c.id] === 100}
                href={`/chapters/${c.id}`}
                progress={progressMap[c.id] ?? 0}
                subtitle={c.subtitle}
                title={c.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 font-bold uppercase tracking-widest animate-pulse">
          Ładowanie Centrum Nauki...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
