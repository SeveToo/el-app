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
  image: string
}

interface Props {
  words: Word[]
  onComplete: (successCount: number) => void
}

export default function MatchingGame({ words, onComplete }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(
    null
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(
    null
  )
  const [matchedIds, setMatchedIds] = useState<string[]>([])
  const [shuffleWords, setShuffleWords] = useState<Word[]>([])
  const [shuffleImages, setShuffleImages] = useState<Word[]>([])
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setShuffleWords([...words].sort(() => Math.random() - 0.5))
    setShuffleImages([...words].sort(() => Math.random() - 0.5))
  }, [words])

  useEffect(() => {
    if (selectedWord && selectedImage) {
      if (selectedWord === selectedImage) {
        setMatchedIds([...matchedIds, selectedWord])
        if (matchedIds.length + 1 === words.length) {
          setTimeout(() => onComplete(words.length), 800)
        }
      } else {
        setIsError(true)
        setTimeout(() => setIsError(false), 800)
      }
      setSelectedWord(null)
      setSelectedImage(null)
    }
  }, [selectedWord, selectedImage])

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto py-10">
      <div className="w-full flex flex-col gap-2 px-4 max-w-md">
        <div className="flex justify-between text-sm text-cyan-500 font-bold uppercase tracking-widest">
          <span>Etap 2: Dopasowanie</span>
          <span>
            {matchedIds.length} / {words.length}
          </span>
        </div>
        <Progress
          value={(matchedIds.length / words.length) * 100}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full px-6">
        {/* Kolumna Słów */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-default-500 mb-2 uppercase text-center border-b pb-2">
            Słowa 📖
          </h3>
          {shuffleWords.map((word) => (
            <motion.div
              key={word.id}
              animate={
                matchedIds.includes(word.id)
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              className={`relative h-14 cursor-pointer rounded-xl border-2 flex items-center justify-center font-bold text-lg uppercase tracking-tight shadow-md transition-colors ${
                selectedWord === word.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : isError && selectedWord === word.id
                    ? 'border-danger bg-danger/10 text-danger'
                    : 'border-default-200 hover:border-primary/50'
              }`}
              onClick={() =>
                !matchedIds.includes(word.id) &&
                setSelectedWord(word.id)
              }>
              {word.en}
            </motion.div>
          ))}
        </div>

        {/* Kolumna Obrazków */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-default-500 mb-2 uppercase text-center border-b pb-2">
            Obrazki 🖼️
          </h3>
          {shuffleImages.map((word) => (
            <motion.div
              key={word.id}
              animate={
                matchedIds.includes(word.id)
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              className={`relative aspect-video cursor-pointer rounded-xl border-2 flex items-center justify-center overflow-hidden shadow-md transition-all ${
                selectedImage === word.id
                  ? 'border-primary scale-105'
                  : isError && selectedImage === word.id
                    ? 'border-danger bg-danger/10'
                    : 'border-default-200 hover:border-primary/50'
              }`}
              onClick={() =>
                !matchedIds.includes(word.id) &&
                setSelectedImage(word.id)
              }>
              <img
                src={word.image}
                alt="verb"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
