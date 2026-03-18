'use client'

import React, { useState } from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Progress } from '@heroui/progress'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { audioService } from '@/lib/audio'


interface Word {
  id: string
  en: string
  pl: string
  image: string
}

interface Props {
  words: Word[]
  onComplete: (errorIds: string[]) => void
}

// Ile razy trzeba przepisać słówko po błędzie
const REPEAT_COUNT = 3

export default function WrittenTest({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'wrong'>('idle')
  const [errorIds, setErrorIds] = useState<string[]>([])

  // Tryb karny: ile razy pozostało do przepisania
  const [repeatMode, setRepeatMode] = useState(false)
  const [repeatLeft, setRepeatLeft] = useState(0)
  const [repeatInput, setRepeatInput] = useState('')
  const [repeatStatus, setRepeatStatus] = useState<'idle' | 'ok' | 'bad'>('idle')

  const currentWord = words[currentIndex]

  // ── główne sprawdzenie ──────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = inputValue.trim().toLowerCase()
    const cleanWord = currentWord.en.trim().toLowerCase()

    if (cleanInput === cleanWord) {
      setStatus('success')
      audioService.playSuccess()
      audioService.speak(currentWord.en)
      setTimeout(() => moveNext(true), 700)
    } else {
      setStatus('wrong')
      audioService.playError()

      // Dodaj do błędów
      if (!errorIds.includes(currentWord.id)) {
        setErrorIds((prev) => [...prev, currentWord.id])
      }
      // Po chwili wejdź w tryb karny
      setTimeout(() => {
        setStatus('idle')
        setInputValue('')
        setRepeatMode(true)
        setRepeatLeft(REPEAT_COUNT)
        setRepeatInput('')
        setRepeatStatus('idle')
      }, 900)
    }
  }

  // ── sprawdzenie przepisywania ───────────────────────────────────────────────
  const handleRepeatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = repeatInput.trim().toLowerCase()
    const cleanWord = currentWord.en.trim().toLowerCase()

    if (cleanInput === cleanWord) {
      const left = repeatLeft - 1
      setRepeatStatus('ok')
      audioService.playSuccess()
      audioService.speak(currentWord.en) // Pronounce on every successful repeat
      setTimeout(() => {


        setRepeatInput('')
        setRepeatStatus('idle')
        if (left <= 0) {
          // Skończyło – przejdź dalej
          setRepeatMode(false)
          moveNext(false) // słówko i tak liczy się jako błąd
        } else {
          setRepeatLeft(left)
        }
      }, 400)
    } else {
      setRepeatStatus('bad')
      audioService.playError()
      setTimeout(() => {

        setRepeatInput('')
        setRepeatStatus('idle')
        // Reset licznika przy złym wpisie
        setRepeatLeft(REPEAT_COUNT)
      }, 600)
    }
  }

  // ── przejście do kolejnego słówka ───────────────────────────────────────────
  const moveNext = (wasCorrect: boolean) => {
    setInputValue('')
    setStatus('idle')
    setRepeatMode(false)
    setRepeatLeft(0)

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      const finalErrors = wasCorrect
        ? errorIds.filter((id) => id !== currentWord.id)
        : Array.from(new Set([...errorIds, currentWord.id]))
      onComplete(finalErrors)
    }
  }

  if (!currentWord) return null

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-8">
      {/* Nagłówek */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between text-sm text-success font-black uppercase tracking-widest">
          <span>Etap 4: Test Pisemny</span>
          <span>{currentIndex + 1} / {words.length}</span>
        </div>
        <Progress value={((currentIndex + 1) / words.length) * 100} color="success" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <Card className={`w-full border shadow-xl overflow-hidden transition-colors duration-300 ${
            repeatMode ? 'border-danger/40 bg-danger/5' : 'border-success/30'
          }`}>
            <CardBody className="flex flex-col items-center gap-6 text-center pt-6 px-6 pb-6">

              {/* Obrazek */}
              <div className="relative">
                <img
                  src={currentWord.image}
                  alt={currentWord.pl}
                  className="w-36 h-36 object-contain rounded-2xl"
                />
                {status !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-lg ${
                      status === 'success' ? 'bg-success' : 'bg-danger'
                    }`}
                  >
                    {status === 'success' ? '✓' : '✗'}
                  </motion.div>
                )}
              </div>

              {/* Słowo PL */}
              <div className="space-y-1">
                <h2 className="text-3xl font-bold uppercase tracking-tight text-success">
                  {currentWord.pl}
                </h2>
                <p className="text-default-400 text-sm font-medium italic">
                  Wpisz po angielsku:
                </p>
              </div>

              {/* ── Tryb normalny ── */}
              {!repeatMode && (
                <form onSubmit={handleSubmit} className="w-full">
                  <Input
                    autoFocus
                    size="lg"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    color={
                      status === 'success' ? 'success'
                        : status === 'wrong' ? 'danger'
                        : 'default'
                    }
                    placeholder="Typing..."
                    classNames={{ input: 'text-center placeholder:opacity-30 tracking-widest font-bold text-lg uppercase' }}
                  />
                  <Button
                    type="submit"
                    className="w-full mt-3 h-12 font-bold text-lg bg-success text-success-foreground"
                  >
                    Sprawdź! 🚀
                  </Button>
                </form>
              )}

              {/* ── Tryb karny: przepisywanie ── */}
              {repeatMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col gap-3"
                >
                  {/* Poprawna odpowiedź */}
                  <div className="bg-danger/10 border border-danger/20 rounded-2xl py-3 px-4">
                    <p className="text-xs text-danger font-bold uppercase tracking-widest mb-1">
                      ❌ Błąd! Poprawna odpowiedź:
                    </p>
                    <p className="text-2xl font-black text-danger uppercase tracking-widest">
                      {currentWord.en}
                    </p>
                    <Button 
                      size="sm" 
                      variant="light" 
                      isIconOnly 
                      className="absolute top-2 right-2 text-danger"
                      onClick={() => audioService.speak(currentWord.en)}
                    >
                      🔊
                    </Button>
                  </div>


                  {/* Licznik powtórzeń */}
                  <div className="flex gap-1.5 justify-center">
                    {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-8 rounded-full transition-all duration-300 ${
                          i < REPEAT_COUNT - repeatLeft ? 'bg-success' : 'bg-default-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-default-400 font-semibold uppercase tracking-widest">
                    Przepisz poprawnie jeszcze {repeatLeft}×
                  </p>

                  {/* Input przepisywania */}
                  <form onSubmit={handleRepeatSubmit} className="w-full">
                    <Input
                      autoFocus
                      size="lg"
                      value={repeatInput}
                      onChange={(e) => setRepeatInput(e.target.value)}
                      color={
                        repeatStatus === 'ok' ? 'success'
                          : repeatStatus === 'bad' ? 'danger'
                          : 'default'
                      }
                      placeholder={currentWord.en}
                      classNames={{
                        input: 'text-center placeholder:opacity-20 tracking-widest font-bold text-lg uppercase',
                      }}
                    />
                    <Button
                      type="submit"
                      className="w-full mt-3 h-12 font-bold text-lg bg-danger text-white"
                    >
                      Przepisz ✍️
                    </Button>
                  </form>
                </motion.div>
              )}

            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
