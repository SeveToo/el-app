'use client'

import React from 'react'
import { Card, CardBody } from '@heroui/card'
import { Image } from '@heroui/image'
import { Button } from '@heroui/button'
import { Question } from '@/types'

interface Props {
  questions: Question[]
  onStart: () => void
}

export const RULES = [
  {
    term: 'A',
    rule: 'Przed spółgłoską (dźwięk), gdy mówimy o czymś po raz pierwszy lub o pracy.',
    example: 'A car, a teacher',
  },
  {
    term: 'AN',
    rule: 'Przed samogłoską (a, e, i, o, u), gdy mówimy o czymś ogólnie.',
    example: 'An apple, an hour',
  },
  {
    term: 'THE',
    rule: 'Gdy mówimy o konkretnej rzeczy, jedynej w swoim rodzaju lub już wspomnianej.',
    example: 'The sun, the best',
  },
  {
    term: 'AT',
    rule: 'Przy konkretnych godzinach, porach (night, noon) lub miejscach (at home, at work).',
    example: 'At 7:00, at school',
  },
  {
    term: '–',
    rule: 'Brak przedimka (Zero Article). Przy miastach, sportach, posiłkach i rzeczach ogólnych.',
    example: 'I like apples, in London',
  },
]

export default function ArticlesIntro({ questions, onStart }: Props) {
  const lastAccuracy =
    typeof window !== 'undefined'
      ? localStorage.getItem('article_last_accuracy')
      : null

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-10 px-4">
      {/* Last Result Stats - Only show if played before */}
      {lastAccuracy && (
        <Card className="border-none bg-primary shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-1000">
          <CardBody className="p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

            <div className="relative flex flex-col items-center sm:items-start gap-1 shrink-0">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
                MÓJ OSTATNI WYNIK
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white">
                  {lastAccuracy}%
                </span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <p className="text-sm font-bold text-white/90 leading-tight italic">
                {Number(lastAccuracy) >= 80
                  ? 'Świetnie! Trzymaj tak dalej 🔥'
                  : Number(lastAccuracy) >= 50
                    ? 'Dobry start, powalcz o wyższy wynik! 💪'
                    : 'Trening czyni mistrza! Spróbuj jeszcze raz ⚡'}
              </p>
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: `${lastAccuracy}%` }}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="text-center space-y-2 mt-4">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter">
          Przedimki w praktyce
        </h1>
        <p className="text-default-500 font-bold uppercase tracking-widest text-xs">
          System Adaptacyjny • Pula {questions.length} Zadań
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {RULES.map((r) => (
          <Card
            key={r.term}
            className="card-premium hover:scale-[1.02] transition-transform">
            <CardBody className="p-6 sm:p-8 flex flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl font-black text-primary shrink-0 shadow-inner">
                {r.term}
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-black text-foreground leading-tight">
                  {r.rule}
                </p>
                <p className="text-xs sm:text-sm font-bold text-default-400 italic">
                  Przykład:{' '}
                  <span className="text-primary/70">
                    {r.example}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Visual Mnemonic Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            img: '/articles/dog_a.png',
            term: 'A',
            rule: 'Słyszysz 2 (di-og)',
            pl: 'Wstawiasz 1',
          },
          {
            img: '/articles/apple_an.png',
            term: 'AN',
            rule: 'Słyszysz 1 (æ-pple)',
            pl: 'Wstawiasz 2',
          },
          {
            img: '/articles/sun_the.png',
            term: 'THE',
            rule: 'Jedyny taki unikat',
            pl: 'Konkret',
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="card-premium border-none bg-content1 shadow-xl group hover:scale-[1.05] transition-all duration-500 overflow-hidden">
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                alt={item.term}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={item.img}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end pb-6 z-10">
                <span className="text-5xl font-black text-white drop-shadow-2xl">
                  {item.term}
                </span>
              </div>
            </div>
            <CardBody className="p-5 text-center space-y-1">
              <p className="text-[13px] font-black text-primary uppercase tracking-tighter leading-tight">
                {item.rule}
              </p>
              <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest italic">
                {item.pl}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Button
        className="h-16 text-xl font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl mt-4"
        color="primary"
        size="lg"
        onClick={onStart}>
        Zaczynamy! 🚀
      </Button>
    </div>
  )
}
