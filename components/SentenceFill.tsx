'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Progress } from '@heroui/progress'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { audioService } from '@/lib/audio'

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

export default function SentenceFill({ words, onComplete }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [inputs, setInputs] = useState<string[]>(new Array(words.length).fill(''))
  const [statuses, setStatuses] = useState<('idle' | 'success' | 'wrong')[]>(new Array(words.length).fill('idle'))
  const [errorIds, setErrorIds] = useState<string[]>([])
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentWord = words[activeIndex]

  // Focus current input when activeIndex changes
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus()
    if (currentWord) {
      // Speech on selection? User didn't request it, but it's consistent.
      // Actually, let's speak the PL help if needed? 
      // The user said "tłumaczenie i obrazek się zmieniają".
    }
  }, [activeIndex])

  const handleSubmit = (index: number) => {
    const word = words[index]
    const userInput = inputs[index].trim().toLowerCase()
    const target = word.en.trim().toLowerCase()

    if (userInput === target) {
      if (statuses[index] !== 'success') {
        const newStatuses = [...statuses]
        newStatuses[index] = 'success'
        setStatuses(newStatuses)
        audioService.playSuccess()
        audioService.speak(word.en_example)
      }
      
      // Move to next if not last
      if (index < words.length - 1) {
        setActiveIndex(index + 1)
      } else {
        // Check if all are done
        const allSuccess = statuses.every((s, i) => i === index || s === 'success')
        if (allSuccess) {
          setTimeout(() => onComplete(errorIds), 1000)
        }
      }
    } else {
      const newStatuses = [...statuses]
      newStatuses[index] = 'wrong'
      setStatuses(newStatuses)
      audioService.playError()
      
      if (!errorIds.includes(word.id)) {
        setErrorIds(prev => [...prev, word.id])
      }

      // Briefly show error then reset
      setTimeout(() => {
        setStatuses(prev => {
          const s = [...prev]
          s[index] = 'idle'
          return s
        })
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(index)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (index < words.length - 1) setActiveIndex(index + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index > 0) setActiveIndex(index - 1)
    }
  }

  const renderSentence = (word: Word, index: number) => {
    const parts = word.en_example.split(new RegExp(`(${word.en})`, 'gi'))
    
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 py-1">
        {parts.map((part, i) => {
          if (part.toLowerCase() === word.en.toLowerCase()) {
            return (
              <div key={i} className="inline-block min-w-[120px]">
                <Input
                  ref={(el: any) => { inputRefs.current[index] = el as any; }}



                  value={inputs[index]}
                  onChange={(e) => {
                    const newInputs = [...inputs]
                    newInputs[index] = e.target.value
                    setInputs(newInputs)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => setActiveIndex(index)}
                  size="sm"
                  variant="underlined"
                  color={
                    statuses[index] === 'success' ? 'success' :
                    statuses[index] === 'wrong' ? 'danger' :
                    activeIndex === index ? 'primary' : 'default'
                  }
                  placeholder="..."
                  classNames={{
                    input: "text-lg font-black uppercase text-center tracking-widest",
                    inputWrapper: "border-b-2"
                  }}
                  autoComplete="off"
                />
              </div>
            )
          }
          return <span key={i} className="text-xl font-medium text-default-600 leading-relaxed">{part}</span>
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-20">
      
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pt-4 pb-6 border-b border-divider mb-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-default-400 px-2 mb-2">
            <span>ETAP 5: UZUPEŁNIANIE</span>
            <span>{statuses.filter(s => s === 'success').length} / {words.length}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentWord.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              <img 
                src={currentWord.image} 
                alt={currentWord.pl}
                className="h-32 w-32 object-contain rounded-2xl bg-white p-2 shadow-sm"
              />
              <div className="text-center">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">
                  {currentWord.pl_example || currentWord.pl}
                </h2>
                <p className="text-xs font-bold text-default-400 uppercase tracking-widest mt-1">
                  Wpisz brakujące słowo:
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* List of Sentences */}
      <div className="flex flex-col gap-4 px-2">
        {words.map((word, index) => (
          <Card 
            key={word.id}
            className={`transition-all duration-300 border-2 ${
              activeIndex === index 
                ? 'border-primary ring-2 ring-primary/20 bg-primary/5 scale-[1.02]' 
                : 'border-transparent bg-content1/50'
            } ${statuses[index] === 'success' ? 'opacity-60' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <CardBody className="p-6">
              {renderSentence(word, index)}
            </CardBody>
          </Card>
        ))}
      </div>

    </div>
  )
}
