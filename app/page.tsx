"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import { AdBanner } from "@/components/layout/AdBanner";
import { AppLogo } from "@/components/layout/AppLogo";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { getAllProgress, calcPercent } from "@/lib/progress";

// ─── Nexus Tree Components ──────────────────────────────────────────────────

function NexusShape({
  className,
  stroke,
  size = 64,
}: {
  className?: string;
  stroke?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 512 512"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M199.469 44.9707C226.799 2.74315 288.585 2.74316 315.916 44.9707C326.631 61.5258 346.46 69.7391 365.743 65.6094C414.928 55.0759 458.617 98.7645 448.083 147.949C443.953 167.232 452.167 187.061 468.722 197.776C510.949 225.107 510.949 286.893 468.722 314.224C452.167 324.939 443.953 344.768 448.083 364.051C458.617 413.236 414.928 456.924 365.743 446.391C346.46 442.261 326.631 450.474 315.916 467.029C288.585 509.257 226.799 509.257 199.469 467.029C188.754 450.474 168.924 442.261 149.642 446.391C100.457 456.924 56.7683 413.236 67.3018 364.051C71.4315 344.768 63.2182 324.939 46.6631 314.224C4.43554 286.893 4.43554 225.107 46.6631 197.776C63.2182 187.061 71.4315 167.232 67.3018 147.949C56.7683 98.7645 100.457 55.0759 149.642 65.6094C168.924 69.7391 188.754 61.5258 199.469 44.9707Z"
        fill="currentColor"
        stroke={stroke || "none"}
        strokeWidth="20"
      />
    </svg>
  );
}

function NexusNode({
  lesson,
  color,
  glow,
  progress = 0,
}: {
  lesson: any;
  color: string;
  glow: string;
  progress?: number;
}) {
  const isTest = lesson.type === "test";
  const isFinal = lesson.type === "final";
  const isCompleted = progress === 100;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.1, translateY: -5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={lesson.href || `/chapters/${lesson.id}`}>
        <div
          className={`
            relative flex items-center justify-center transition-all duration-300
            ${lesson.isLocked ? "grayscale opacity-40 cursor-not-allowed pointer-events-none" : "hover:shadow-2xl"}
            ${isFinal ? "w-20 h-20 text-4xl" : isTest ? "w-16 h-16 text-3xl" : "w-16 h-16 text-3xl"}
          `}
          style={{
            borderRadius: isTest || isFinal ? "0" : "50%",
            background:
              isTest || isFinal ? "transparent" : "var(--heroui-default-100)",
            border: "none",
            boxShadow:
              !isTest && !isFinal && isCompleted ? `0 0 25px ${glow}` : "none",
          }}
        >
          {(isTest || isFinal) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: hovered ? 360 : 0 }}
                transition={{
                  rotate: hovered
                    ? { duration: 8, ease: "linear", repeat: Infinity }
                    : { duration: 0.5, ease: "easeOut" },
                }}
              >
                <NexusShape
                  className={
                    isFinal
                      ? "text-[#ffe9c1] dark:text-[#2d1625]"
                      : "text-[#dbe2ff] dark:text-[#101921]"
                  }
                  size={isFinal ? 80 : 64}
                  stroke="none"
                />
              </motion.div>
            </div>
          )}

          <div className="relative z-10">
            {lesson.icon || (isTest ? "🛡️" : "🧩")}
          </div>

          {/* Progress Ring (Outer) */}
          {!isFinal && !isTest && progress > 0 && (
            <svg className="absolute -inset-1 w-[4.5rem] h-[4.5rem] -rotate-90 pointer-events-none">
              <circle
                className="stroke-default-200 opacity-20"
                cx="36"
                cy="36"
                fill="none"
                r="34"
                strokeWidth="4"
              />
              <motion.circle
                animate={{ pathLength: progress / 100 }}
                cx="36"
                cy="36"
                fill="none"
                initial={{ pathLength: 0 }}
                r="34"
                stroke={color}
                strokeLinecap="round"
                strokeWidth="4"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          )}
        </div>
      </Link>

      <div className="text-center px-1">
        <div
          className={`text-[11px] font-black leading-tight uppercase tracking-wide
          ${isFinal ? "text-amber-800 dark:text-warning" : "text-foreground"}
        `}
        >
          {lesson.title}
        </div>
        {!isFinal && !isTest && progress > 0 && (
          <div className="text-[9px] text-default-500 font-bold mt-0.5">
            {progress}% ukończone
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MinigameCard({
  progressMap,
  lessons,
}: {
  progressMap: Record<string, number>;
  lessons: any[];
}) {
  const completedLessons = lessons.filter((l) => progressMap[l.id] === 100);
  const isUnlocked = completedLessons.length >= 3;
  const [selected, setSelected] = useState<string[]>([]);

  const toggleLesson = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Card
      className={`overflow-hidden border-2 transition-all duration-500 rounded-[2.5rem] sm:rounded-[3rem] ${
        isUnlocked
          ? "border-primary/20 bg-primary/[0.03] hover:border-primary/40"
          : "border-default-100 bg-default-50 grayscale opacity-80"
      }`}
    >
      <CardBody className="p-6 sm:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left side: Icon/Banner */}
          <div className="w-full md:w-48 aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center border border-primary/20">
            <span className="text-6xl mb-2 drop-shadow-xl animate-bounce">
              🚀
            </span>
            <p className="text-xs font-black uppercase text-primary/80 tracking-widest leading-none">
              Rocket
            </p>
            <p className="text-[10px] font-bold text-foreground opacity-60 uppercase">
              Defense
            </p>
          </div>

          {/* Right side: Controls */}
          <div className="flex-1 space-y-6 w-full">
            <div className="space-y-1">
              <h2 className="text-2xl font-black uppercase text-foreground leading-none tracking-tight">
                Obrona Bazy: <span className="text-primary italic">Grid</span>
              </h2>
              <p className="text-sm font-medium text-default-500">
                Chroń system przed rakietami, dopasowując słowa z Twoich lekcji.
              </p>
            </div>

            {!isUnlocked ? (
              <div className="bg-default-200/50 p-6 rounded-[2rem] border border-default-300">
                <p className="text-xs font-black text-default-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  🔒 Zablokowane
                </p>
                <p className="text-sm font-bold text-default-500 leading-relaxed">
                  Ukończ minimum{" "}
                  <span className="text-primary text-base">3 lekcje</span> na
                  100%, aby odblokować ten tryb! ({completedLessons.length}/3)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Wybierz lekcje do gry:
                </p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {completedLessons.map((l) => (
                    <button
                      key={l.id}
                      className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase transition-all border-2 
                                  ${
                                    selected.includes(l.id)
                                      ? "bg-primary border-primary text-white shadow-[0_5px_15px_rgba(34,197,94,0.4)]"
                                      : "bg-white border-default-200 text-default-500 hover:border-primary/50"
                                  }`}
                      onClick={() => toggleLesson(l.id)}
                    >
                      {l.title}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <Link
                    className="w-full sm:w-auto"
                    href={`/minigames/grid?lessons=${
                      selected.length > 0
                        ? selected.join(",")
                        : completedLessons.map((l) => l.id).join(",")
                    }`}
                  >
                    <Button
                      className="h-14 px-10 text-lg font-black rounded-2xl bg-primary text-white w-full sm:w-auto shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      URUCHOM GRĘ
                    </Button>
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                       Status: Gotowy
                    </p>
                    <p className="text-[10px] font-bold text-primary italic">
                      * {selected.length > 0 ? `Wybrano ${selected.length} lekcji` : 'Wszystkie ukończone'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function NexusBranch({
  name,
  lessons,
  color,
  glow,
  progressMap,
}: {
  name: string;
  lessons: any[];
  color: string;
  glow: string;
  progressMap: Record<string, number>;
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

  const handleSelectionChange = (key: React.Key) => {
    router.push(`/?subject=${key}`);
  };

  return (
    <section className="py-4 md:py-8 pb-32">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col gap-8">
        {/* Banner na górze */}
        <AdBanner />

        {/* ─── Nowa Sekcja: Mini-Gry ─────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-foreground opacity-90">
              Mini-Gry
            </h3>
          </div>

          <MinigameCard 
            progressMap={progressMap} 
            lessons={[
               { id: "fruits", title: "Owoce" },
               { id: "vegetables", title: "Warzywa" },
               { id: "food", title: "Jedzenie" },
               { id: "kitchen_tools", title: "Kuchnia" },
               { id: "furniture", title: "Dom" },
               { id: "nature", title: "Natura" },
               { id: "body_parts", title: "Ciało" },
               { id: "family", title: "Rodzina" },
               { id: "jobs", title: "Zawody" },
            ]}
          />
        </div>

        {/* Sekcja Nexus Tree (Skill Tree) - Nowość */}
        <div className="flex flex-col gap-14 my-4">
          <NexusBranch
            color="#22c55e"
            glow="rgba(34,197,94,0.15)"
            lessons={[
              { id: "fruits", icon: "🍎", title: "Owoce" },
              { id: "vegetables", icon: "🥦", title: "Warzywa" },
              { id: "food", icon: "🍔", title: "Jedzenie" },
              {
                id: "minigame_grid",
                icon: "🎮",
                title: "Mini Gra: Grid",
                href: "/minigames/grid",
                isLocked:
                  (progressMap["fruits"] || 0) < 100 ||
                  (progressMap["vegetables"] || 0) < 100 ||
                  (progressMap["food"] || 0) < 100,
              },
              {
                id: "CHECKPOINT_1",
                type: "test",
                title: "Test: Kuchnia & Owoce",
              },
              { id: "kitchen_tools", icon: "🍳", title: "Kuchnia" },
              { id: "furniture", icon: "🛋️", title: "Dom" },
              { id: "nature", icon: "🌲", title: "Natura" },
              { id: "CHECKPOINT_2", type: "test", title: "Test: Otoczenie" },
              { id: "body_parts", icon: "🦴", title: "Ciało" },
              { id: "family", icon: "👨‍👩‍👧", title: "Rodzina" },
              { id: "jobs", icon: "💼", title: "Zawody" },
              {
                id: "final_nouns",
                type: "final",
                title: "Mistrz Rzeczowników",
                icon: "🏆",
              },
            ]}
            name="Rzeczowniki"
            progressMap={progressMap}
          />

          <NexusBranch
            color="#3b82f6"
            glow="rgba(59,130,246,0.15)"
            lessons={[
              { id: "action_verbs", icon: "⚡", title: "Czynności" },
              { id: "routines", icon: "⏰", title: "Rutyna" },
              { id: "chores", icon: "🧹", title: "Obowiązki" },
              {
                id: "final_verbs",
                type: "final",
                title: "Mistrz Akcji",
                icon: "🏆",
              },
            ]}
            name="Czasowniki"
            progressMap={progressMap}
          />

          <NexusBranch
            color="#a855f7"
            glow="rgba(168,85,247,0.15)"
            lessons={[
              { id: "emotions", icon: "😊", title: "Emocje" },
              { id: "tastes", icon: "🍋", title: "Smaki" },
              { id: "weather", icon: "🌤️", title: "Pogoda" },
              { id: "hair", icon: "💇", title: "Włosy" },
              {
                id: "final_adj",
                type: "final",
                title: "Mistrz Opisu",
                icon: "🏆",
              },
            ]}
            name="Przymiotniki"
            progressMap={progressMap}
          />

          <NexusBranch
            color="#f59e0b"
            glow="rgba(245,158,11,0.15)"
            lessons={[
              { id: "prepositions", icon: "📍", title: "Przyimki" },
              { id: "articles", icon: "📖", title: "Przedimki" },
              {
                id: "final_other",
                type: "final",
                title: "Egzamin Końcowy",
                icon: "🏆",
              },
            ]}
            name="Inne / Gramatyka"
            progressMap={progressMap}
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full">
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
            style={{ willChange: "transform" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AppLogo size={120} />
          </motion.div>
          <h2 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-default-500 animate-pulse">
            Ładowanie Centrum Nauki...
          </h2>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
