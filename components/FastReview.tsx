'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { motion, AnimatePresence } from 'framer-motion'

import { audioService } from '@/lib/audio'
import { Word } from '@/types'
import { WordImage } from '@/components/WordImage'
import { StudyHeader } from '@/components/StudyHeader'

interface Props {
  words: Word[]
  onComplete: (errorIds: string[]) => void
}

export default function FastReview({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errorIds, setErrorIds] = useState<string[]>([])

  const currentWord = words[currentIndex]

  // Pronounce English word when it appears
  useEffect(() => {
    if (currentWord) {
      audioService.speak(currentWord.en)
      if (currentWord.en_example) {
        audioService.speak(currentWord.en_example, { cancel: false })
      }
    }
  }, [currentIndex, currentWord])

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(errorIds)
    }
  }

  if (!currentWord) return null

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto py-6 sm:py-10">
      <StudyHeader
        color="warning"
        current={currentIndex + 1}
        title="Etap 2: Szybka powtórka"
        total={words.length}
      />

      {/* Card Container - Fixed height to prevent jumping */}
      <div className="w-full h-[480px] sm:h-[550px] relative px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full"
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}>
            <Card className="w-full h-full flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="w-full h-[65%] flex-shrink-0">
                <WordImage
                  alt={currentWord.en}
                  image={currentWord.image}
                />
              </div>

              <CardBody className="flex-grow flex flex-col items-center justify-center gap-2 p-6 bg-content1 border-t-2 border-default-100">
                <div className="text-center space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase tracking-tighter leading-none">
                    {currentWord.en}
                  </h2>
                  <p className="text-xl sm:text-2xl font-bold text-success uppercase tracking-widest leading-none">
                    {currentWord.pl}
                  </p>
                </div>

                {currentWord.en_example && (
                  <div className="pt-3 border-t border-default-50 w-full text-center">
                    <p className="text-base sm:text-lg font-bold text-primary italic leading-tight px-2 line-clamp-2">
                      &quot;{currentWord.en_example}&quot;
                    </p>
                    {currentWord.pl_example && (
                      <p className="text-xs sm:text-sm font-black text-default-400 mt-1 uppercase tracking-widest opacity-80 line-clamp-2 px-2">
                        {currentWord.pl_example}
                      </p>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 w-full mt-2 px-2">
        <Button
          className="w-full h-16 sm:h-20 text-lg sm:text-xl font-black uppercase tracking-widest rounded-3xl shadow-xl border-b-4 sm:border-b-8 border-primary hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all duration-150"
          color="primary"
          variant="shadow"
          onClick={handleNext}>
          DALEJ
        </Button>
      </div>
    </div>
  )
}

