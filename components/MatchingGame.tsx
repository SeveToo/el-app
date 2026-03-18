'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { audioService } from '@/lib/audio'


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

export default function MatchingGame({ words, onComplete }: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<string[]>([])
  const [errorIds, setErrorIds] = useState<string[]>([])
  const [shuffleWords, setShuffleWords] = useState<Word[]>([])
  const [shuffleImages, setShuffleImages] = useState<Word[]>([])
  const [flashId, setFlashId] = useState<{ id: string; ok: boolean } | null>(null)

  useEffect(() => {
    setShuffleWords([...words].sort(() => Math.random() - 0.5))
    setShuffleImages([...words].sort(() => Math.random() - 0.5))
  }, [words])

  useEffect(() => {
    if (selectedWord && selectedImage) {
      if (selectedWord === selectedImage) {
        // Poprawne dopasowanie
        setFlashId({ id: selectedWord, ok: true })
        audioService.playSuccess()
        
        // Find the word object to pronounce it
        const wordObj = words.find(w => w.id === selectedWord)
        if (wordObj) audioService.speak(wordObj.en)

        setTimeout(() => {

          setMatchedIds((prev) => {
            const next = [...prev, selectedWord!]
            if (next.length === words.length) {
              setTimeout(() => onComplete(errorIds), 600)
            }
            return next
          })
          setFlashId(null)
        }, 500)
      } else {
        // Błąd
        setFlashId({ id: selectedWord, ok: false })
        audioService.playError()
        if (!errorIds.includes(selectedWord)) {

          setErrorIds((prev) => [...prev, selectedWord!])
        }
        setTimeout(() => setFlashId(null), 600)
      }
      setSelectedWord(null)
      setSelectedImage(null)
    }
  }, [selectedWord, selectedImage])

  const getWordStyle = (id: string) => {
    if (matchedIds.includes(id)) return 'opacity-0 pointer-events-none scale-90'
    if (flashId?.id === id)
      return flashId.ok
        ? 'border-success bg-success/10 text-success scale-105'
        : 'border-danger bg-danger/10 text-danger shake'
    if (selectedWord === id) return 'border-primary bg-primary/10 text-primary scale-105'
    return 'border-default-200 hover:border-primary/40 hover:bg-primary/5'
  }

  const getImageStyle = (id: string) => {
    if (matchedIds.includes(id)) return 'opacity-0 pointer-events-none scale-90'
    if (selectedImage === id) return 'border-primary ring-2 ring-primary scale-105'
    return 'border-default-200 hover:border-primary/40'
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6">
      {/* Header */}
      <div className="w-full flex flex-col gap-2 px-2">
        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-secondary">
          <span>Etap 3: Dopasowanie</span>
          <span>{matchedIds.length} / {words.length}</span>
        </div>
        <Progress value={(matchedIds.length / words.length) * 100} color="secondary" />
      </div>

      {/* Legenda */}
      <div className="flex gap-3 text-xs text-default-400 font-semibold uppercase tracking-widest w-full px-2">
        <span className="flex-1 text-center border-b-2 border-default-200 pb-1">📖 Słowa</span>
        <span className="flex-[2] text-center border-b-2 border-default-200 pb-1">🖼️ Obrazki</span>
      </div>

      {/* Grid: 1 kolumna słów + 2 kolumny obrazków */}
      <div className="grid grid-cols-3 gap-3 w-full px-2">
        {/* Kolumna słów */}
        <div className="flex flex-col gap-3">
          {shuffleWords.map((word) => (
            <motion.button
              key={word.id}
              layout
              transition={{ duration: 0.3 }}
              className={`h-14 sm:h-16 cursor-pointer rounded-2xl border-2 flex items-center justify-center font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all duration-200 ${getWordStyle(word.id)}`}
              onClick={() => !matchedIds.includes(word.id) && setSelectedWord(word.id)}
            >
              {word.en}
            </motion.button>
          ))}
        </div>

        {/* 2 kolumny obrazków — każdy obrazek jest ~2× wyższy niż słowo */}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {shuffleImages.map((word) => (
            <motion.button
              key={word.id}
              layout
              transition={{ duration: 0.3 }}
              className={`h-[6.5rem] sm:h-[8rem] cursor-pointer rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-200 bg-white ${getImageStyle(word.id)}`}
              onClick={() => !matchedIds.includes(word.id) && setSelectedImage(word.id)}
            >
              <img
                src={word.image}
                alt="match"
                className="w-full h-full object-contain p-1.5"
                draggable={false}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  )
}
