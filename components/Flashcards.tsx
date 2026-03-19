'use client'

import React, { useState } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { Tooltip } from '@heroui/tooltip'
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

  // Pronounce English word when flipped to English side
  React.useEffect(() => {
    if (isFlipped && currentWord) {
      audioService.speak(currentWord.en)
      if (currentWord.en_example) {
        // Speak example with a tiny bit of queuing (natural queuing in Web Speech API)
        audioService.speak(currentWord.en_example, { cancel: false })
      }
    }
  }, [isFlipped, currentWord])



  const handleNext = (isKnown: boolean) => {
    const newErrorIds = !isKnown
      ? [...errorIds, currentWord.id]
      : errorIds
    
    if (!isKnown) {
      setErrorIds(newErrorIds)
      audioService.playError()
    } else {
      audioService.playSuccess()
    }


    // Ustawiamy kierunek animacji (1 dla prawo, -1 dla lewo)
    setDirection(isKnown ? 1 : -1)

    // Opóźnienie, aby animacja mogła się wykonać przed zmianą karty
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
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6 relative overflow-hidden">
      <div className="w-full flex flex-col gap-2 max-w-md">
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

      {/* Stosy wizualne (dekoracyjne) */}
      <div className="absolute left-[-100px] top-[260px] opacity-20 pointer-events-none hidden lg:block">
        <div className="w-40 h-60 bg-danger/20 rounded-[2.5rem] border-4 border-danger/30 rotate-[-15deg] shadow-lg" />
        <div className="w-40 h-60 bg-danger/10 rounded-[2.5rem] border-4 border-danger/20 rotate-[-10deg] absolute top-2 left-2" />
        <span className="absolute bottom-[-40px] left-10 font-black text-danger text-sm uppercase tracking-widest">NIE UMIEM</span>
      </div>

      <div className="absolute right-[-100px] top-[260px] opacity-20 pointer-events-none hidden lg:block">
        <div className="w-40 h-60 bg-success/20 rounded-[2.5rem] border-4 border-success/30 rotate-[15deg] shadow-lg" />
        <div className="w-40 h-60 bg-success/10 rounded-[2.5rem] border-4 border-success/20 rotate-[10deg] absolute top-2 right-2" />
        <span className="absolute bottom-[-40px] right-10 font-black text-success text-sm uppercase tracking-widest text-right">UMIEM</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: direction === 1 ? 500 : direction === -1 ? -500 : 0,
            opacity: direction !== 0 ? 0 : 1,
            rotate: direction === 1 ? 25 : direction === -1 ? -25 : 0
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-md aspect-[4/5] cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}>
          
          <motion.div
            className="w-full h-full preserve-3d"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              duration: 0.6,
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}>
            
            {/* Przód karty (PL - najpierw po polsku) */}
            <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-4 border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardBody className="flex flex-col items-center justify-center gap-3 overflow-hidden w-full">
                <div className="flex gap-2 items-center justify-center w-full flex-wrap shrink-0">
                  {currentWord.image.split(',').map((imgSrc, idx) => (
                    <img
                      key={idx}
                      src={prefixPath(imgSrc.trim())}
                      alt={currentWord.pl}
                      className="max-h-36 md:max-h-44 object-contain rounded-2xl shadow-sm"
                    />
                  ))}
                </div>
                <div className="text-center space-y-2 w-full px-2">
                  <h2 className="text-3xl font-black tracking-tight text-primary uppercase leading-tight">
                    {currentWord.pl}
                  </h2>
                  <p className="text-xs font-bold text-default-400 uppercase tracking-wider italic leading-snug">
                    {currentWord.pl_example}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Tył karty (ANG - po kliknięciu) */}
            <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-4 border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardBody className="flex flex-col items-center justify-center gap-3 overflow-hidden w-full">
                <div className="flex gap-2 items-center justify-center w-full flex-wrap shrink-0">
                  {currentWord.image.split(',').map((imgSrc, idx) => (
                    <img
                      key={idx}
                      src={prefixPath(imgSrc.trim())}
                      alt={currentWord.en}
                      className="max-h-36 md:max-h-44 object-contain rounded-2xl shadow-sm"
                    />
                  ))}
                </div>
                <div className="text-center space-y-2 w-full px-2">
                  <h2 className="text-3xl font-black tracking-tight text-foreground uppercase leading-tight">
                    {currentWord.en}
                  </h2>
                  <Tooltip 
                    content={
                      <div className="px-2 py-1 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Tłumaczenie:</p>
                        <p className="text-base font-black uppercase tracking-tight">{currentWord.pl_example}</p>
                      </div>
                    }
                    placement="bottom"
                    color="primary"
                    showArrow
                  >
                    <p className="text-sm font-bold text-primary italic underline underline-offset-4 decoration-2 cursor-help hover:scale-105 transition-transform active:scale-95 break-words leading-snug">
                       "{currentWord.en_example}"
                    </p>
                  </Tooltip>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-8 w-full max-w-md">
        <Button
          className="flex-1 h-20 text-xl font-black uppercase tracking-widest rounded-3xl shadow-lg border-b-8 border-danger/30 hover:translate-y-1 active:border-b-0 transition-all"
          color="danger"
          variant="flat"
          onClick={(e) => {
            e.stopPropagation()
            handleNext(false)
          }}>
          ❌ NIE
        </Button>
        <Button
          className="flex-1 h-20 text-xl font-black uppercase tracking-widest rounded-3xl shadow-lg border-b-8 border-success/30 hover:translate-y-1 active:border-b-0 transition-all"
          color="success"
          variant="flat"
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



