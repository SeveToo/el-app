'use client'

import React, { useState } from 'react'
import Flashcards from '@/components/Flashcards'
import FastReview from '@/components/FastReview'
import MatchingGame from '@/components/MatchingGame'
import WrittenTest from '@/components/WrittenTest'
import SentenceFill from '@/components/SentenceFill'

import { Progress } from '@heroui/progress'
import { Button } from '@heroui/button'
import Link from 'next/link'
import { saveProgress } from '@/lib/progress'

interface Word {
  id: string
  en: string
  pl: string
  en_example: string
  pl_example: string
  image: string
  status: number
}

type Stage = 'flashcards' | 'fast_review' | 'matching' | 'written' | 'sentence_fill' | 'completed'

const STAGES: Stage[] = ['flashcards', 'fast_review', 'matching', 'written', 'sentence_fill']

const WORDS_PER_LOOP = 10

export default function StudyLoop({
  words,
  chapterId,
}: {
  words: Word[]
  chapterId: string
}) {
  const [allWords] = useState<Word[]>(words)

  // Indeks bieżącej "rundy" (grupy 10 słówek)
  const [roundIndex, setRoundIndex] = useState(0)

  // Etap w ramach rundy
  const [stage, setStage] = useState<Stage>('flashcards')

  // Słowa z błędami zebrane przez wszystkie rundy
  const [globalErrorIds, setGlobalErrorIds] = useState<string[]>([])

  // Słowa w bieżącej rundzie
  const [currentGroup, setCurrentGroup] = useState<Word[]>(() =>
    allWords.slice(0, WORDS_PER_LOOP)
  )

  // Ile słówek zostało "użytych" (poza bieżącą grupą)
  const [usedCount, setUsedCount] = useState(WORDS_PER_LOOP)

  const stageIndex = STAGES.indexOf(stage)

  // ---------------------------------------------------------------------------
  // Zapis postępu
  // ---------------------------------------------------------------------------
  const persistProgress = (learned: number, completed = false) => {
    saveProgress(chapterId, {
      learnedCount: learned,
      totalWords: words.length,
      completedAt: completed ? new Date().toISOString() : undefined,
    })
  }

  // ---------------------------------------------------------------------------
  // Zebranie błędów z etapu + przejście do następnego
  // ---------------------------------------------------------------------------
  const handleStageComplete = (errorIds: string[]) => {
    // Dodaj nowe błędy do globalnej listy (bez duplikatów)
    const newErrors = errorIds.filter((id) => !globalErrorIds.includes(id))
    const updatedErrors = [...globalErrorIds, ...newErrors]
    setGlobalErrorIds(updatedErrors)

    const nextStageIndex = stageIndex + 1

    if (nextStageIndex < STAGES.length) {
      // Kolejny etap w ramach tej samej rundy
      setStage(STAGES[nextStageIndex])
    } else {
      // Koniec wszystkich etapów dla tej rundy
      const remaining = allWords.slice(usedCount) // jeszcze nie użyte słowa
      const hasMoreNew = remaining.length > 0

      if (hasMoreNew) {
        // Weź do WORDS_PER_LOOP nowych słów + błędy z tej rundy
        const newWords = remaining.slice(0, WORDS_PER_LOOP)
        const errorWords = updatedErrors
          .map((id) => allWords.find((w) => w.id === id)!)
          .filter(Boolean)

        // Ile nowych możemy wziąć (w grupie jest miejsce na max WORDS_PER_LOOP)
        const slotsForNew = Math.min(newWords.length, WORDS_PER_LOOP)
        const slotsForErrors = Math.max(0, WORDS_PER_LOOP - slotsForNew)

        const nextGroup = [
          ...errorWords.slice(0, slotsForErrors),
          ...newWords.slice(0, slotsForNew),
        ]

        const newUsed = usedCount + newWords.slice(0, slotsForNew).length
        persistProgress(newUsed)
        setCurrentGroup(shuffled(nextGroup))
        setUsedCount(newUsed)
        setRoundIndex(roundIndex + 1)
        setStage('flashcards')
      } else if (updatedErrors.length > 0) {
        // Brak nowych słów, ale są błędy — runda tylko z błędów
        const errorWords = updatedErrors
          .map((id) => allWords.find((w) => w.id === id)!)
          .filter(Boolean)
        persistProgress(allWords.length) // dotarliśmy do końca
        setCurrentGroup(shuffled(errorWords))
        setGlobalErrorIds([]) // reset błędów — ta runda je wyczyści
        setRoundIndex(roundIndex + 1)
        setStage('flashcards')
      } else {
        // Wszystko ukończone bez błędów
        persistProgress(allWords.length, true)
        setStage('completed')
      }
    }
  }

  const totalRounds = Math.ceil(allWords.length / WORDS_PER_LOOP)
  const globalProgress = Math.round(
    (Math.min(usedCount, allWords.length) / allWords.length) * 100
  )

  if (stage === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <h1 className="text-5xl font-black text-success uppercase tracking-tighter">
          🏆 Gratulacje!
        </h1>
        <p className="text-xl font-medium text-default-500 max-w-sm">
          Ukończyłeś całą pętlę nauki dla tej sekcji.
        </p>
        <Link href="/">
          <Button
            size="lg"
            color="primary"
            className="px-10 font-bold text-lg uppercase tracking-widest h-14 rounded-2xl shadow-xl"
          >
            Powrót do menu 🏠
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      {/* Nagłówek z postępem */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-default-400">
          <span>Runda {roundIndex + 1}</span>
          <span>Postęp: {globalProgress}%</span>
        </div>
        <Progress value={globalProgress} color="primary" size="sm" />

        {/* Pasek etapów */}
        <div className="flex gap-2 w-full">
          {STAGES.map((s, idx) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                stageIndex >= idx ? 'bg-primary' : 'bg-default-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-default-300 font-semibold px-0.5">
          <span>Fiszki</span>
          <span>Powtórka</span>
          <span>Dopasowanie</span>
          <span>Pisanie</span>
          <span>Zdania</span>
        </div>

      </div>

      {/* Błędy do powtórki (info) */}
      {globalErrorIds.length > 0 && (
        <div className="mb-4 px-4 py-2 bg-warning/10 border border-warning/20 rounded-xl text-xs text-warning font-semibold text-center">
          ⚠️ {globalErrorIds.length} słówek trafi do powtórki w następnej rundzie
        </div>
      )}

      {/* Aktywny komponent etapu */}
      <div>
        {stage === 'flashcards' && (
          <Flashcards words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === 'fast_review' && (
          <FastReview words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === 'matching' && (
          <MatchingGame words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === 'written' && (
          <WrittenTest words={currentGroup} onComplete={handleStageComplete} />
        )}
        {stage === 'sentence_fill' && (
          <SentenceFill words={currentGroup} onComplete={handleStageComplete} />
        )}
      </div>

    </div>
  )
}

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}
