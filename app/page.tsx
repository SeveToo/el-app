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
  },
  {
    id: 1,
    title: 'Podstawy: Present Simple',
    progress: 20,
    subject: 'english',
  },
  {
    id: 4,
    title: 'Matematyka: Ułamki',
    progress: 15,
    subject: 'math',
  },
  {
    id: 5,
    title: 'Matematyka: Potęgi',
    progress: 40,
    subject: 'math',
  },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject') || 'english'

  const filteredChapters = chapters.filter(
    (c) => c.subject === subjectParam
  )

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-8 text-center uppercase tracking-widest text-primary">
          {subjectParam === 'math' ? 'Matematyka' : 'Język Angielski'}
        </h1>

        <div className="flex flex-col items-center gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredChapters.map((c) => (
              <ChapterCard
                key={c.id}
                href={`/chapters/${c.id}`}
                progress={c.progress}
                subtitle={
                  c.subject === 'math'
                    ? 'Zadania i logika'
                    : 'Czasy i słownictwo'
                }
                title={c.title}
              />
            ))}
          </div>
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

