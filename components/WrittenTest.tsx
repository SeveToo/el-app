'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Progress } from '@heroui/progress'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function WrittenTest({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'success' | 'warning'
  >('idle')
  const [errorIds, setErrorIds] = useState<string[]>([])

  const currentWord = words[currentIndex]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = inputValue.trim().toLowerCase()
    const cleanWord = currentWord.en.trim().toLowerCase()

    if (cleanInput === cleanWord) {
      setStatus('success')
      setTimeout(() => {
        handleNext(true)
      }, 700)
    } else {
      setStatus('warning')
      if (!errorIds.includes(currentWord.id)) {
        setErrorIds((prev) => [...prev, currentWord.id])
      }
      setTimeout(() => {
        setStatus('idle')
        handleNext(false)
      }, 1000)
    }
  }

  const handleNext = (ok: boolean) => {
    setInputValue('')
    setStatus('idle')
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      const finalErrors = ok
        ? errorIds.filter((id) => id !== currentWord.id)
        : Array.from(new Set([...errorIds, currentWord.id]))
      onComplete(finalErrors)
    }
  }

  if (!currentWord) return null

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-10">
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between text-sm text-success font-black uppercase tracking-widest">
          <span>Etap 3: Test Pisemny</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <Progress
          value={((currentIndex + 1) / words.length) * 100}
          color="success"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full">
          <Card className="w-full p-6 border border-success/30 bg-card shadow-xl overflow-hidden">
            <CardBody className="flex flex-col items-center gap-8 text-center pt-8">
              <div className="relative">
                <img
                  src={currentWord.image}
                  alt="Verb to write"
                  className="w-48 h-48 object-cover rounded-full border-4 border-success/10 shadow-lg"
                />
                {status !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-lg ${status === 'success' ? 'bg-success' : 'bg-danger'}`}>
                    {status === 'success' ? '✓' : '✗'}
                  </motion.div>
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-4xl font-bold uppercase tracking-tight text-success">
                  {currentWord.pl}
                </h2>
                <p className="text-default-400 font-medium italic">
                  Wpisz słowo po angielsku:
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="w-full px-4 pt-4">
                <Input
                  autoFocus
                  size="lg"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  color={
                    status === 'success'
                      ? 'success'
                      : status === 'warning'
                        ? 'danger'
                        : 'default'
                  }
                  placeholder="Typing..."
                  className="text-center text-2xl font-bold uppercase"
                  classNames={{
                    input:
                      'text-center placeholder:opacity-30 tracking-widest',
                  }}
                />
                <Button
                  type="submit"
                  className="w-full mt-4 h-12 font-bold text-lg bg-success text-success-foreground">
                  Sprawdź! 🚀
                </Button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
