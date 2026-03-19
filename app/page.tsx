'use client'

import * as React from 'react'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ChapterCard from '@/components/ChapterCard'
import { AdBanner } from '@/components/AdBanner'
import { getAllProgress, calcPercent } from '@/lib/progress'

const CHAPTERS = [
  {
    id: 'action_verbs',
    title: 'Action Verbs',
    subject: 'english',
    subtitle: 'Czasowniki czynnościowe',
  },
  {
    id: 'jobs',
    title: 'Jobs & Professions',
    subject: 'english',
    subtitle: 'Zawody i profesje',
  },
  {
    id: 'kitchen_tools',
    title: 'Kitchen Tools',
    subject: 'english',
    subtitle: 'Przybory kuchenne',
  },
  {
    id: 'prepositions',
    title: 'Prepositions of Place',
    subject: 'english',
    subtitle: 'Przyimki miejsca',
  },
  {
    id: 'weather',
    title: 'Weather',
    subject: 'english',
    subtitle: 'Pogoda',
  },
  {
    id: 'articles',
    title: 'A, An, The & At',
    subject: 'english',
    subtitle: 'Przedimki w praktyce',
  },
  {
    id: 'final_test',
    title: 'Final Test 🏆',
    subject: 'english',
    subtitle: 'Sprawdź swoje umiejętności',
  },
  {
    id: '1',
    title: 'Podstawy: Present Simple',
    subject: 'english',
    subtitle: 'Czasy i słownictwo',
  },
  {
    id: '4',
    title: 'Matematyka: Ułamki',
    subject: 'math',
    subtitle: 'Zadania i logika',
  },
  {
    id: '5',
    title: 'Matematyka: Potęgi',
    subject: 'math',
    subtitle: 'Zadania i logika',
  },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject') || 'english'

  // Wczytaj postęp z localStorage (client-side)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const all = getAllProgress()
    const pct: Record<string, number> = {}
    for (const [id, p] of Object.entries(all)) {
      pct[id] = calcPercent(p)
    }
    setProgressMap(pct)
  }, [])

  const filteredChapters = CHAPTERS.filter((c) => c.subject === subjectParam)

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-6 text-center uppercase tracking-widest text-primary">
          {subjectParam === 'math' ? 'Matematyka' : 'Język Angielski'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChapters.map((c) => (
            <ChapterCard
              key={c.id}
              href={`/chapters/${c.id}`}
              progress={progressMap[c.id] ?? 0}
              subtitle={c.subtitle}
              title={c.title}
              completed={progressMap[c.id] === 100}
            />
          ))}
        </div>

        <AdBanner />
      </div>
    </section>
  )
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
  )
}
