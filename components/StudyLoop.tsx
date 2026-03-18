'use client'

import React, { useState, useEffect } from 'react'
import Flashcards from '@/components/Flashcards'
import FastReview from '@/components/FastReview'
import MatchingGame from '@/components/MatchingGame'
import WrittenTest from '@/components/WrittenTest'
import { Progress } from '@heroui/progress'
import { Card, CardHeader, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import Link from 'next/link'

interface Word {
  id: string
  en: string
  pl: string
  en_example: string
  pl_example: string
  image: string
  status: number
}

type Stage =
  | 'flashcards'
  | 'fast_review'
  | 'matching'
  | 'written'
  | 'completed'

export default function StudyLoop({ words }: { words: Word[] }) {
  const [allWords, setAllWords] = useState<Word[]>(words)
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('flashcards')
  const [loopProgress, setLoopProgress] = useState(0)

  const WORDS_PER_LOOP = 10

  const currentGroup = allWords.slice(
    currentGroupIndex * WORDS_PER_LOOP,
    (currentGroupIndex + 1) * WORDS_PER_LOOP
  )

  const handleStageComplete = (data: any) => {
    if (stage === 'flashcards') {
      setStage('fast_review')
    } else if (stage === 'fast_review') {
      setStage('matching')
    } else if (stage === 'matching') {
      setStage('written')
    } else if (stage === 'written') {
      // Koniec pętli dla tej grupy
      if (
        (currentGroupIndex + 1) * WORDS_PER_LOOP <
        allWords.length
      ) {
        setLoopProgress(0)
        setCurrentGroupIndex(currentGroupIndex + 1)
        setStage('flashcards')
      } else {
        setStage('completed')
      }
    }
  }

  const globalProgress =
    (allWords.filter((w) => w.status === 1).length /
      allWords.length) *
    100

  if (stage === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-6xl font-black text-success uppercase tracking-tighter">
          🏆 Gratulacje!
        </h1>
        <p className="text-2xl font-medium text-default-500 max-w-md">
          Ukończyłeś całą pętlę nauki dla tej sekcji.
        </p>
        <Link href="/">
          <Button
            size="lg"
            color="primary"
            className="px-12 font-bold text-xl uppercase tracking-widest h-16 rounded-2xl shadow-xl">
            Powrót do menu 🏠
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-default-400">
          <span>
            Grupa {currentGroupIndex + 1} /{' '}
            {Math.ceil(allWords.length / WORDS_PER_LOOP)}
          </span>
          <span>
            Całkowity progres: {Math.round(globalProgress)}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Pasek postępu etapów na dole */}
        <div className="mt-16 flex justify-center gap-4 w-full max-w-md mx-auto">
          {['flashcards', 'fast_review', 'matching', 'written'].map(
            (s, idx) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full shadow-sm transition-all duration-500 ${
                  [
                    'flashcards',
                    'fast_review',
                    'matching',
                    'written',
                  ].indexOf(stage) >= idx
                    ? 'bg-primary'
                    : 'bg-default-200'
                }`}
              />
            )
          )}
        </div>
        {stage === 'flashcards' && (
          <Flashcards
            words={currentGroup}
            onComplete={handleStageComplete}
          />
        )}
        {stage === 'fast_review' && (
          <FastReview
            words={currentGroup}
            onComplete={handleStageComplete}
          />
        )}
        {stage === 'matching' && (
          <MatchingGame
            words={currentGroup}
            onComplete={handleStageComplete}
          />
        )}
        {stage === 'written' && (
          <WrittenTest
            words={currentGroup}
            onComplete={handleStageComplete}
          />
        )}
      </div>
    </div>
  )
}
