'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { audioService } from '@/lib/audio'
import { prefixPath } from '@/lib/utils'

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
    const newErrorIds = !isKnown && !errorIds.includes(wordId) 
      ? [...errorIds, wordId] 
      : errorIds

    if (!isKnown) {
      setErrorIds(newErrorIds)
      audioService.playError()
    } else {
      audioService.playSuccess()
    }
    
    // Set animation direction (1 for right/success, -1 for left/fail)
    setDirection(isKnown ? 1 : -1)

    // Delay to let animation finish before changing card
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

  // Take only first image if multiple are provided
  const imgPath = currentWord.image.split(',')[0].trim()

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6 sm:py-10 relative overflow-hidden">
      {/* Progress Section */}
      <div className="w-full flex flex-col gap-2 max-w-md px-2">
        <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-default-400">
          <span>ETAP 1: FISZKI</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <Progress
          value={((currentIndex + 1) / words.length) * 100}
          className="h-1"
          color="primary"
        />
      </div>

      {/* Card Container - Fixed height on mobile to prevent layout jumping */}
      <div className="w-full h-[480px] sm:h-[550px] relative px-2 max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 0, opacity: 1, scale: 1 }}
            animate={{ 
              x: direction === 1 ? 600 : direction === -1 ? -600 : 0,
              opacity: direction !== 0 ? 0 : 1,
              rotate: direction === 1 ? 25 : direction === -1 ? -25 : 0
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}>
            
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                duration: 0.6,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}>
              
              {/* Front Side (PL) */}
              <Card 
                className="absolute inset-0 flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full h-[65%] relative overflow-hidden bg-white">
                  <img
                    src={prefixPath(imgPath)}
                    alt={currentWord.pl}
                    className="w-full h-full object-cover"
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
                  transform: 'rotateY(180deg)' 
                }}
              >
                <div className="w-full h-[65%] relative overflow-hidden bg-white">
                  <img
                    src={prefixPath(imgPath)}
                    alt={currentWord.en}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardBody className="flex-grow flex flex-col items-center justify-center gap-1 px-4 sm:px-6 bg-content1 border-t-2 border-default-100 relative">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground uppercase leading-tight text-center">
                    {currentWord.en}
                  </h2>
                  <p className="text-base sm:text-xl font-bold text-primary italic text-center px-4 leading-snug overflow-hidden line-clamp-2">
                    "{currentWord.en_example}"
                  </p>
                  
                  <Button 
                    isIconOnly 
                    variant="light" 
                    radius="full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      audioService.speak(currentWord.en)
                    }}
                    className="absolute bottom-2 right-4 text-primary opacity-50 hover:opacity-100"
                  >
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
          ❌ NIE
        </Button>
        <Button
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl font-black uppercase tracking-widest rounded-3xl shadow-xl border-b-4 sm:border-b-8 border-success hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all duration-150"
          color="success"
          variant="shadow"
          onClick={(e) => {
            e.stopPropagation()
            handleNext(true)
          }}>
          ✅ TAK!
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
