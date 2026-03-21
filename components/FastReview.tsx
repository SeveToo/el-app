'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
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


  const handleAction = (isOk: boolean) => {
    const wordId = currentWord.id
    const newErrorIds = !isOk && !errorIds.includes(wordId) 
      ? [...errorIds, wordId] 
      : errorIds
    
    if (!isOk) {
      setErrorIds(newErrorIds)
      audioService.playError()
    } else {
      audioService.playSuccess()
    }


    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(newErrorIds)
    }
  }

  if (!currentWord) return null

  const images = currentWord.image.split(',').map(s => s.trim())

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto py-6 sm:py-10">
      <div className="w-full flex flex-col gap-2 px-2">
        <div className="flex justify-between text-xs text-amber-500 font-black uppercase tracking-widest">
          <span>Szybka powtórka</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <Progress
          value={((currentIndex + 1) / words.length) * 100}
          color="warning"
          size="sm"
          className="h-1"
        />
      </div>

      {/* Card Container - Fixed height to prevent jumping */}
      <div className="w-full h-[480px] sm:h-[550px] relative px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full">
            <Card className="w-full h-full flex flex-col border-none bg-content1 shadow-2xl rounded-[2.5rem] overflow-hidden">
              {/* Image Section - slightly smaller on mobile for better balance */}
              <div className="w-full h-[60%] bg-white relative overflow-hidden">
                <div className={`grid w-full h-full ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-0.5`}>
                  {images.map((imgSrc, idx) => (
                    <img
                      key={idx}
                      src={prefixPath(imgSrc)}
                      alt={currentWord.en}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
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
                      "{currentWord.en_example}"
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
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl font-black uppercase tracking-widest rounded-3xl shadow-lg border-b-4 sm:border-b-8 border-danger hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all duration-150"
          color="danger"
          variant="flat"
          onClick={() => handleAction(false)}>
          WRONG 💥
        </Button>
        <Button
          className="flex-1 h-16 sm:h-20 text-lg sm:text-xl font-black uppercase tracking-widest rounded-3xl shadow-xl border-b-4 sm:border-b-8 border-success hover:brightness-110 active:translate-y-1 active:border-b-0 transition-all duration-150"
          color="success"
          variant="shadow"
          onClick={() => handleAction(true)}>
          OK ✅
        </Button>
      </div>
    </div>
  )
}
