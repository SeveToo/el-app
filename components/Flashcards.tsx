'use client'

import React, { useState } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { motion, AnimatePresence } from 'framer-motion'

interface Word {
  id: string
  en: string
  pl: string
  en_example: string
  pl_example: string
  image: string
}

interface Props {
  words: Word[]
  onComplete: (knownIds: string[]) => void
}

export default function Flashcards({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState<string[]>([])
  const [history, setHistory] = useState<number[]>([])

  const currentWord = words[currentIndex]
  // const progress = ((currentIndex + 1) / words.length) * 100;

  const handleNext = (isKnown: boolean) => {
    if (isKnown) {
      setKnownIds([...knownIds, currentWord.id])
    }

    if (currentIndex < words.length - 1) {
      setHistory([...history, currentIndex])
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      onComplete(isKnown ? [...knownIds, currentWord.id] : knownIds)
    }
  }

  if (!currentWord) return <div>Brak słówek...</div>

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-10">
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between text-sm text-default-500">
          <span>Etap 1: Fiszki</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <Progress
          value={((currentIndex + 1) / words.length) * 100}
          color="primary"
        />
      </div>

      <div
        className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full preserve-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}>
          {/* Przód karty */}
          <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-6 border-2 border-primary/20 bg-card shadow-xl">
            <CardBody className="flex flex-col items-center justify-center gap-4">
              <img
                src={currentWord.image}
                alt={currentWord.en}
                className="w-48 h-48 object-cover rounded-xl shadow-lg"
              />
              <h2 className="text-4xl font-bold tracking-tight text-primary uppercase">
                {currentWord.en}
              </h2>
              <p className="text-default-400 text-sm italic">
                Kliknij, aby odwrócić
              </p>
            </CardBody>
          </Card>

          {/* Tył karty */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-6 border-2 border-success/20 bg-card shadow-xl">
            <CardBody className="flex flex-col items-center justify-center gap-6 text-center">
              <h2 className="text-4xl font-bold text-success capitalize">
                {currentWord.pl}
              </h2>
              <div className="space-y-2">
                <p className="text-lg font-medium italic">
                  "{currentWord.en_example}"
                </p>
                <p className="text-default-500">
                  {currentWord.pl_example}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <div className="flex gap-4 w-full">
        <Button
          className="flex-1 h-14 text-lg font-semibold"
          color="danger"
          variant="flat"
          onClick={(e) => {
            e.stopPropagation()
            handleNext(false)
          }}>
          Nie umiem ❌
        </Button>
        <Button
          className="flex-1 h-14 text-lg font-semibold"
          color="success"
          variant="shadow"
          onClick={(e) => {
            e.stopPropagation()
            handleNext(true)
          }}>
          Umiem! ✅
        </Button>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
