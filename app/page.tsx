"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

import ChapterCard from "@/components/ui/ChapterCard";
import { AdBanner } from "@/components/layout/AdBanner";
import { getAllProgress, calcPercent } from "@/lib/progress";
import { LESSONS } from "@/config/lessons";


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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
