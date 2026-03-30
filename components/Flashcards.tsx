'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { audioService } from '@/lib/audio'
import { Word } from '@/types'
import { WordImage } from '@/components/WordImage'
import { StudyHeader } from '@/components/StudyHeader'

interface Props {
  words: Word[]
  onComplete: (errorIds: string[]) => void
}

export default function Flashcards({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [errorIds, setErrorIds] = useState<string[]>([])
  const [direction, setDirection] = useState<number>(0)

  const currentWord = words[currentIndex]

  // Pronounce word and example when card is flipped to English side
  useEffect(() => {
    if (isFlipped && currentWord) {
      audioService.speak(currentWord.en)
      if (currentWord.en_example) {
        audioService.speak(currentWord.en_example, { cancel: false })
      }
    }
  }, [isFlipped, currentWord])

  const handleNext = (isKnown: boolean) => {
    const wordId = currentWord.id
    const newErrorIds =
      !isKnown && !errorIds.includes(wordId)
        ? [...errorIds, wordId]
        : errorIds

    if (!isKnown) {
      setErrorIds(newErrorIds)
      audioService.playError()
    } else {
      audioService.playSuccess()
    }

    setDirection(isKnown ? 1 : -1)

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
        setDirection(0)
      } else {
        onComplete(newErrorIds)
      }
    }, 400)
  }

  if (!currentWord) return <div>Brak słówek...</div>

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6 sm:py-10 relative overflow-hidden">
      {/* Progress Section */}
      <StudyHeader
        className="max-w-md px-2"
        color="primary"
        current={currentIndex + 1}
        title="Etap 1: Fiszki"
        total={words.length}
      />

      {/* Card Container */}
      <div className="w-full h-[480px] sm:h-[550px] relative px-2 max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            animate={{
              x: direction === 1 ? 600 : direction === -1 ? -600 : 0,
              opacity: direction !== 0 ? 0 : 1,
              rotate:
                direction === 1 ? 25 : direction === -1 ? -25 : 0,
            }}
            className="relative w-full h-full cursor-pointer"
            initial={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
              transition={{
                duration: 0.6,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}>
              {/* Front Side (PL) */}
              <Card
                className="absolute inset-0 flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}>
                <div className="w-full h-[65%] flex-shrink-0">
                  <WordImage
                    alt={currentWord.pl}
                    image={currentWord.image}
                    maxImages={1}
                  />
                </div>
                <CardBody className="flex-grow flex flex-col items-center justify-center gap-1 px-4 sm:px-6 bg-content1 border-t-2 border-default-100">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-primary uppercase leading-tight text-center">
                    {currentWord.pl}
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-default-400 uppercase tracking-widest italic text-center text-balance overflow-hidden line-clamp-2 px-2">
                    {currentWord.pl_example}
                  </p>
                </CardBody>
              </Card>

              {/* Back Side (EN) */}
              <Card
                className="absolute inset-0 flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}>
                <div className="w-full h-[65%] flex-shrink-0">
                  <WordImage
                    alt={currentWord.en}
                    image={currentWord.image}
                    maxImages={1}
                  />
                </div>
                <CardBody className="flex-grow flex flex-col items-center justify-center gap-1 px-4 sm:px-6 bg-content1 border-t-2 border-default-100 relative">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground uppercase leading-tight text-center">
                    {currentWord.en}
                  </h2>
                  <p className="text-base sm:text-xl font-bold text-primary italic text-center px-4 leading-snug overflow-hidden line-clamp-2">
                    &quot;{currentWord.en_example}&quot;
                  </p>

                  <Button
                    isIconOnly
                    className="absolute bottom-2 right-4 text-primary opacity-50 hover:opacity-100"
                    radius="full"
                    size="sm"
                    variant="light"
                    onClick={(e) => {
                      e.stopPropagation()
                      audioService.speak(currentWord.en)
                    }}>
                    🔊
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-4 w-full max-w-md px-2 mt-4">
        <Button
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl font-black uppercase tracking-widest rounded-3xl shadow-lg border-b-4 sm:border-b-8 border-danger hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all duration-150"
          color="danger"
          variant="flat"
          onClick={(e) => {
            e.stopPropagation()
            handleNext(false)
          }}>
          NIE ZNAM
        </Button>
        <Button
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl font-black uppercase tracking-widest rounded-3xl shadow-xl border-b-4 sm:border-b-8 border-success hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all duration-150"
          color="success"
          variant="shadow"
          onClick={(e) => {
            e.stopPropagation()
            handleNext(true)
          }}>
          ZNAM
        </Button>
      </div>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style global jsx>{`
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

