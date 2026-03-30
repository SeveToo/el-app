'use client'

import React, { useState } from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'

import { audioService } from '@/lib/audio'
import { Word } from '@/types'
import { WordImage } from '@/components/WordImage'
import { StudyHeader } from '@/components/StudyHeader'

interface Props {
  words: Word[]
  onComplete: (errorIds: string[]) => void
}

const REPEAT_COUNT = 3

export default function WrittenTest({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'wrong'>(
    'idle'
  )
  const [errorIds, setErrorIds] = useState<string[]>([])

  // Punishment Mode State
  const [repeatMode, setRepeatMode] = useState(false)
  const [repeatLeft, setRepeatLeft] = useState(0)
  const [repeatInput, setRepeatInput] = useState('')
  const [repeatStatus, setRepeatStatus] = useState<
    'idle' | 'ok' | 'bad'
  >('idle')

  const currentWord = words[currentIndex]

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

      if (!errorIds.includes(currentWord.id)) {
        setErrorIds((prev) => [...prev, currentWord.id])
      }

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

  const handleRepeatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = repeatInput.trim().toLowerCase()
    const cleanWord = currentWord.en.trim().toLowerCase()

    if (cleanInput === cleanWord) {
      const left = repeatLeft - 1

      setRepeatStatus('ok')
      audioService.playSuccess()
      audioService.speak(currentWord.en)

      setTimeout(() => {
        setRepeatInput('')
        setRepeatStatus('idle')
        if (left <= 0) {
          setRepeatMode(false)
          moveNext(false)
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
        setRepeatLeft(REPEAT_COUNT)
      }, 600)
    }
  }

  const moveNext = (wasCorrect: boolean) => {
    setInputValue('')
    setStatus('idle')
    setRepeatMode(false)
    setRepeatLeft(0)

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Deduplicate and filter based on final result
      const finalErrors = wasCorrect
        ? errorIds.filter((id) => id !== currentWord.id)
        : Array.from(new Set([...errorIds, currentWord.id]))

      onComplete(finalErrors)
    }
  }

  if (!currentWord) return null

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-6 sm:py-10">
      <StudyHeader
        color="success"
        current={currentIndex + 1}
        title="Etap 4: Pisanie"
        total={words.length}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-2"
          exit={{ opacity: 0, y: -20 }}
          initial={{ opacity: 0, y: 20 }}>
          <Card
            className={`w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden transition-colors duration-500 ${
              repeatMode
                ? 'bg-danger/5 ring-4 ring-danger/20'
                : 'bg-content1'
            }`}>
            <CardBody className="p-6 flex flex-col items-center gap-6">
              <div className="w-28 h-28 sm:w-36 sm:h-36 relative">
                <WordImage
                  alt={currentWord.pl}
                  className="p-1"
                  containerClassName="rounded-3xl border-2 border-default-100 shadow-sm"
                  fit="contain"
                  image={currentWord.image}
                />

                {status !== 'idle' && (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20 ${
                      status === 'success'
                        ? 'bg-success'
                        : 'bg-danger'
                    }`}
                    initial={{ opacity: 0, scale: 0 }}>
                    {status === 'success' ? '✓' : '✗'}
                  </motion.div>
                )}
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-3xl sm:text-4xl font-black text-success uppercase tracking-tighter leading-none">
                  {currentWord.pl}
                </h2>
                <p className="text-default-400 text-xs font-bold uppercase tracking-widest">
                  {repeatMode
                    ? 'PRZEPISZ POPRAWNIE:'
                    : 'WPISZ PO ANGIELSKU:'}
                </p>
              </div>

              {!repeatMode ? (
                <form
                  className="w-full space-y-4"
                  onSubmit={handleSubmit}>
                  <Input
                    autoComplete="off"
                    classNames={{
                      input:
                        'text-center text-xl font-black uppercase tracking-widest',
                      inputWrapper: 'h-16 border-2',
                    }}
                    color={
                      status === 'success'
                        ? 'success'
                        : status === 'wrong'
                          ? 'danger'
                          : 'default'
                    }
                    isDisabled={status === 'success'}
                    placeholder="Wpisz słówko..."
                    radius="lg"
                    size="lg"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button
                    className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl shadow-lg border-b-4 border-success-600 active:border-b-0 active:translate-y-1 transition-all"
                    color="success"
                    isDisabled={status === 'success'}
                    size="lg"
                    type="submit">
                    SPRAWDŹ! 🚀
                  </Button>
                </form>
              ) : (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-4"
                  initial={{ opacity: 0, y: 10 }}>
                  <div className="bg-danger/10 border-2 border-danger/20 rounded-[2rem] p-4 text-center relative">
                    <p className="text-[10px] text-danger font-black uppercase tracking-[0.2em] mb-1">
                      Poprawna odpowiedź:
                    </p>
                    <p className="text-3xl font-black text-danger uppercase tracking-widest">
                      {currentWord.en}
                    </p>
                    <Button
                      isIconOnly
                      className="absolute top-2 right-2 text-danger"
                      size="sm"
                      variant="light"
                      onClick={() =>
                        audioService.speak(currentWord.en)
                      }>
                      🔊
                    </Button>
                  </div>

                  <div className="flex gap-1.5 justify-center">
                    {Array.from({ length: REPEAT_COUNT }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-8 rounded-full transition-all duration-300 ${
                            i < REPEAT_COUNT - repeatLeft
                              ? 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                              : 'bg-default-200'
                          }`}
                        />
                      )
                    )}
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={handleRepeatSubmit}>
                    <Input
                      autoComplete="off"
                      classNames={{
                        input:
                          'text-center text-xl font-black uppercase tracking-widest placeholder:opacity-20',
                        inputWrapper: 'h-16 border-2',
                      }}
                      color={
                        repeatStatus === 'ok'
                          ? 'success'
                          : repeatStatus === 'bad'
                            ? 'danger'
                            : 'default'
                      }
                      placeholder={currentWord.en}
                      radius="lg"
                      size="lg"
                      value={repeatInput}
                      onChange={(e) => setRepeatInput(e.target.value)}
                    />
                    <Button
                      className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl border-b-4 border-danger-600 active:border-b-0 active:translate-y-1 transition-all"
                      color="danger"
                      size="lg"
                      type="submit">
                      PRZEPISZ ({repeatLeft}×) ✍️
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

