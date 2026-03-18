'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
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
  onComplete: (successIds: string[]) => void
}

export default function FastReview({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [successIds, setSuccessIds] = useState<string[]>([])

  const currentWord = words[currentIndex]

  const handleAction = (isOk: boolean) => {
    if (isOk) {
      setSuccessIds([...successIds, currentWord.id])
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(isOk ? [...successIds, currentWord.id] : successIds)
    }
  }

  if (!currentWord) return null

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-10">
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between text-sm text-amber-500 font-bold uppercase tracking-widest">
          <span>Etap 1.5: Szybka powtórka</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <Progress
          value={((currentIndex + 1) / words.length) * 100}
          color="warning"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="w-full">
          <Card className="w-full p-4 border border-warning/20 bg-card shadow-lg">
            <CardBody className="flex flex-col items-center gap-6">
              <img
                src={currentWord.image}
                alt={currentWord.en}
                className="w-full h-40 object-contain rounded-md"
              />
              <div className="text-center space-y-1">
                <p className="text-3xl font-black text-primary">
                  {currentWord.en}
                </p>
                <p className="text-xl font-medium text-success">
                  {currentWord.pl}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 w-full">
        <Button
          className="flex-1 h-14 bg-danger/20 text-danger font-bold text-xl uppercase tracking-tighter"
          variant="flat"
          onClick={() => handleAction(false)}>
          WRONG 💥
        </Button>
        <Button
          className="flex-1 h-14 bg-success text-success-foreground font-bold text-xl uppercase tracking-tighter shadow-lg"
          onClick={() => handleAction(true)}>
          OK ✅
        </Button>
      </div>
    </div>
  )
}
