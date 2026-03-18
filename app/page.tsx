'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ChapterCard from '@/components/ChapterCard'

const chapters = [
  {
    id: 'action_verbs',
    title: 'Action Verbs',
    progress: 0,
    subject: 'english',
    subtitle: 'Czasowniki czynnościowe',
  },
  {
    id: 'jobs',
    title: 'Jobs & Professions',
    progress: 0,
    subject: 'english',
    subtitle: 'Zawody i profesje',
  },
  {
    id: 'kitchen_tools',
    title: 'Kitchen Tools',
    progress: 0,
    subject: 'english',
    subtitle: 'Przybory kuchenne',
  },
  {
    id: 'prepositions',
    title: 'Prepositions of Place',
    progress: 0,
    subject: 'english',
    subtitle: 'Przyimki miejsca',
  },
  {
    id: 'weather',
    title: 'Weather',
    progress: 0,
    subject: 'english',
    subtitle: 'Pogoda',
  },
  {
    id: 1,
    title: 'Podstawy: Present Simple',
    progress: 20,
    subject: 'english',
    subtitle: 'Czasy i słownictwo',
  },
  {
    id: 4,
    title: 'Matematyka: Ułamki',
    progress: 15,
    subject: 'math',
    subtitle: 'Zadania i logika',
  },
  {
    id: 5,
    title: 'Matematyka: Potęgi',
    progress: 40,
    subject: 'math',
    subtitle: 'Zadania i logika',
  },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject') || 'english'

  const filteredChapters = chapters.filter(
    (c) => c.subject === subjectParam
  )

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
              progress={c.progress}
              subtitle={c.subtitle}
              title={c.title}
            />
          ))}
        </div>
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
      }>
      <HomeContent />
    </Suspense>
  )
}
