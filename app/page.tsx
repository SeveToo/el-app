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

function NexusShape({ className, fill, stroke, size = 64 }: { className?: string, fill?: string, stroke?: string, size?: number }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M199.469 44.9707C226.799 2.74315 288.585 2.74316 315.916 44.9707C326.631 61.5258 346.46 69.7391 365.743 65.6094C414.928 55.0759 458.617 98.7645 448.083 147.949C443.953 167.232 452.167 187.061 468.722 197.776C510.949 225.107 510.949 286.893 468.722 314.224C452.167 324.939 443.953 344.768 448.083 364.051C458.617 413.236 414.928 456.924 365.743 446.391C346.46 442.261 326.631 450.474 315.916 467.029C288.585 509.257 226.799 509.257 199.469 467.029C188.754 450.474 168.924 442.261 149.642 446.391C100.457 456.924 56.7683 413.236 67.3018 364.051C71.4315 344.768 63.2182 324.939 46.6631 314.224C4.43554 286.893 4.43554 225.107 46.6631 197.776C63.2182 187.061 71.4315 167.232 67.3018 147.949C56.7683 98.7645 100.457 55.0759 149.642 65.6094C168.924 69.7391 188.754 61.5258 199.469 44.9707Z" 
        fill={fill || "#252422"} 
        stroke={stroke || "#EB5E28"} 
        strokeWidth="21.8507"
      />
    </svg>
  );
}

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
            borderRadius: isTest || isFinal ? "0" : "50%",
            background: isTest || isFinal ? "transparent" : "var(--heroui-default-100)",
            border: "none",
            boxShadow: (!isTest && !isFinal && isCompleted) ? `0 0 25px ${glow}` : "none",
          }}
        >
          {(isTest || isFinal) && (
            <NexusShape 
              size={isFinal ? 80 : 64}
              className="absolute inset-0"
              fill="#252422"
              stroke="#EB5E28"
            />
          )}

          <div className="relative z-10">
            {lesson.icon || (isTest ? "🛡️" : "🧩")}
          </div>
          
          {/* Progress Ring (Outer) */}
          {!isFinal && !isTest && progress > 0 && (
            <svg className="absolute -inset-1 w-[4.5rem] h-[4.5rem] -rotate-90 pointer-events-none">
              <circle
                cx="36"
                cy="36"
                r="34"
                fill="none"
                className="stroke-default-200 opacity-20"
                strokeWidth="4"
              />
              <motion.circle
                cx="36"
                cy="36"
                r="34"
                fill="none"
                stroke={color}
                strokeWidth="4"
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
          ${isFinal ? "text-warning" : isTest ? "text-foreground" : "text-foreground"}
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
        <div className="flex flex-col gap-14 my-4">
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
              { id: "final_nouns", type: "final", title: "Mistrz Rzeczowników", icon: "🏆" },
            ]}
          />

          <NexusBranch
            color="#3b82f6"
            glow="rgba(59,130,246,0.15)"
            name="Czasowniki"
            progressMap={progressMap}
            lessons={[
              { id: "action_verbs", icon: "⚡", title: "Czynności" },
              { id: "routines", icon: "⏰", title: "Rutyna" },
              { id: "chores", icon: "🧹", title: "Obowiązki" },
              { id: "final_verbs", type: "final", title: "Mistrz Akcji", icon: "🏆" },
            ]}
          />

          <NexusBranch
            color="#a855f7"
            glow="rgba(168,85,247,0.15)"
            name="Przymiotniki"
            progressMap={progressMap}
            lessons={[
              { id: "emotions", icon: "😊", title: "Emocje" },
              { id: "tastes", icon: "🍋", title: "Smaki" },
              { id: "weather", icon: "🌤️", title: "Pogoda" },
              { id: "hair", icon: "💇", title: "Włosy" },
              { id: "final_adj", type: "final", title: "Mistrz Opisu", icon: "🏆" },
            ]}
          />

          <NexusBranch
            color="#f59e0b"
            glow="rgba(245,158,11,0.15)"
            name="Inne / Gramatyka"
            progressMap={progressMap}
            lessons={[
              { id: "prepositions", icon: "📍", title: "Przyimki" },
              { id: "articles", icon: "📖", title: "Przedimki" },
              { id: "final_other", type: "final", title: "Egzamin Końcowy", icon: "🏆" },
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
