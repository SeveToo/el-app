'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'

import { audioService } from '@/lib/audio'
import { prefixPath } from '@/lib/utils'

const removeDiacritics = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L")

const getSentenceParts = (word: { en_example: string; en: string }) => {
  let example = word.en_example || ''
  if (!example.includes('[')) {
    const regex = new RegExp(`(${word.en})`, 'gi')
    example = example.replace(regex, '[$1]')
  }
  return example.split(/\[(.*?)\]/g)
}



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
  const [inputs, setInputs] = useState<string[][]>(() => 
    words.map(w => new Array(Math.floor(getSentenceParts(w).length / 2)).fill(''))
  )
  const [statuses, setStatuses] = useState<('idle' | 'success' | 'wrong')[]>(new Array(words.length).fill('idle'))
  const [errorIds, setErrorIds] = useState<string[]>([])
  
  // Hint system
  const [showHint, setShowHint] = useState(false)
  const [hintOptions, setHintOptions] = useState<Word[]>([])
  const [wrongCount, setWrongCount] = useState<Record<number, number>>({})
  
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    words.map(() => [])
  )

  const [isPlRevealed, setIsPlRevealed] = useState(false)

  const currentWord = words[activeIndex]

  // Focus current input when activeIndex changes
  useEffect(() => {
    setIsPlRevealed(false)
    if (!showHint) {
      inputRefs.current[activeIndex]?.[0]?.focus()
    }
  }, [activeIndex, showHint])


  const triggerHint = (index: number) => {
    const correctWord = words[index]
    const others = words.filter(w => w.id !== correctWord.id)
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5)
    
    // Ensure we have at least some distractors if total words < 3
    const options = [correctWord, ...shuffledOthers.slice(0, 2)].sort(() => Math.random() - 0.5)
    
    // Użycie podpowiedzi oznacza niezablokowanie wiedzy z tego słowa, więc dodajemy do błędów (powtórka)
    setErrorIds(prev => prev.includes(correctWord.id) ? prev : [...prev, correctWord.id])

    setHintOptions(options)
    setShowHint(true)
  }



  const handleSubmit = (index: number) => {
    const word = words[index]
    const parts = getSentenceParts(word)
    const targets: string[] = []
    
    for (let i = 1; i < parts.length; i += 2) {
      targets.push(parts[i].trim().toLowerCase())
    }

    const userInputs = inputs[index].map(val => val.trim().toLowerCase())
    const isAllCorrect = userInputs.length === targets.length && 
                         userInputs.every((val, i) => val === targets[i])

    if (isAllCorrect) {
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
      
      const newWrongCount = { ...wrongCount, [index]: (wrongCount[index] || 0) + 1 }
      setWrongCount(newWrongCount)

      if (!errorIds.includes(word.id)) {
        setErrorIds(prev => [...prev, word.id])
      }

      // Auto-trigger hint after 2 fails
      if (newWrongCount[index] >= 2) {
        setTimeout(() => triggerHint(index), 500)
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

  const handleKeyDown = (e: React.KeyboardEvent, index: number, gapIdx: number, gapsCount: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (gapIdx < gapsCount - 1) {
        inputRefs.current[index]?.[gapIdx + 1]?.focus()
      } else {
        handleSubmit(index)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (index < words.length - 1) setActiveIndex(index + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index > 0) setActiveIndex(index - 1)
    }
  }

  const renderPlExample = (word: Word) => {
    const sentence = word.pl_example || word.pl
    const baseWord = word.pl

    if (!sentence || !baseWord || sentence.toLowerCase() === baseWord.toLowerCase()) return sentence

    const baseWords = baseWord.toLowerCase().split(/\s+/)
    const sentenceParts = sentence.split(/(\s+|[.,;!?]+)/)

    let highlighted = false

    const rendered = sentenceParts.map((part, i) => {
      if (!part.trim() || part.match(/^[.,;!?]+$/)) return <React.Fragment key={i}>{part}</React.Fragment>
      
      const partLower = removeDiacritics(part.toLowerCase())
      
      const isMatch = baseWords.some(bw => {
        const bwClean = removeDiacritics(bw)
        if (bwClean.length <= 3) {
          return partLower === bwClean || (partLower.startsWith(bwClean) && partLower.length - bwClean.length <= 2)
        }
        
        let root = bwClean
        if (root.match(/(owac|awac|iwac|ywac)$/)) root = root.slice(0, -4)
        else if (root.match(/(ac|ec|ic|yc)$/)) root = root.slice(0, -2)
        
        const prefixLen = Math.min(root.length, 5)
        const prefix = root.substring(0, prefixLen)
        
        return (partLower.startsWith(prefix) || partLower.includes(root)) && Math.abs(partLower.length - bwClean.length) <= 5
      })

      if (isMatch && !highlighted) {
        highlighted = true
        return (
          <span key={i} className="text-warning-500 bg-warning-50/20 px-1 py-0.5 rounded-md underline decoration-warning/50 decoration-4 underline-offset-4">
            {part}
          </span>
        )
      }
      
      return <React.Fragment key={i}>{part}</React.Fragment>
    })

    return (
      <span className="inline-flex items-center flex-wrap justify-center gap-x-1">
        {rendered}
        {!highlighted && (
           <span className="text-warning-500 opacity-90 ml-2 bg-warning-50/20 px-1.5 py-0.5 rounded-lg text-lg border-2 border-warning/20">({word.pl})</span>
        )}
      </span>
    )
  }

  const renderSentence = (word: Word, index: number) => {
    const parts = getSentenceParts(word)
    const gapsCount = Math.floor(parts.length / 2)
    
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 py-1 text-xl font-medium text-default-600 leading-relaxed">
        {parts.map((part, i) => {
          if (i % 2 !== 0) {
            const gapIdx = Math.floor(i / 2)
            if (statuses[index] === 'success') {
              return (
                <motion.span 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block px-2 py-0.5 rounded-lg bg-success/20 text-success font-black text-xl uppercase tracking-wider"
                >
                  {part}
                </motion.span>
              )
            }
            return (
              <div key={i} className="inline-block min-w-[80px]">
                <Input
                  ref={(el: any) => {
                    if (!inputRefs.current[index]) inputRefs.current[index] = [];
                    inputRefs.current[index][gapIdx] = el as HTMLInputElement;
                  }}
                  value={inputs[index]?.[gapIdx] || ''}
                  onChange={(e) => {
                    const newInputs = [...inputs]
                    const sentenceInputs = [...(newInputs[index] || [])]
                    sentenceInputs[gapIdx] = e.target.value
                    newInputs[index] = sentenceInputs
                    setInputs(newInputs)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, gapIdx, gapsCount)}
                  onFocus={() => setActiveIndex(index)}
                  size="sm"
                  variant="underlined"
                  color={
                    statuses[index] === 'wrong' ? 'danger' :
                    activeIndex === index ? 'warning' : 'default'
                  }
                  placeholder="..."
                  classNames={{
                    input: `text-lg font-black uppercase text-center tracking-widest ${
                      activeIndex === index ? 'text-warning' : 'text-default-400'
                    }`,
                    inputWrapper: "border-b-2"
                  }}
                  autoComplete="off"
                />
              </div>
            )
          }
          return <span key={i}>{part}</span>
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
              <div className="flex gap-4 items-center justify-center flex-wrap">
                {currentWord.image.split(',').map((imgSrc, idx) => (
                  <img 
                    key={idx}
                    src={prefixPath(imgSrc.trim())} 
                    alt={currentWord.pl}
                    className="h-32 w-32 object-contain rounded-2xl bg-white p-2 shadow-sm"
                  />
                ))}
              </div>
              <div className="text-center w-full max-w-sm mx-auto">
                <div 
                  className="relative cursor-pointer group flex justify-center items-center py-2 min-h-[60px]"
                  onClick={() => setIsPlRevealed(true)}
                >
                  <h2 className={`text-xl sm:text-2xl font-black text-primary uppercase tracking-tight flex items-center justify-center text-center transition-all duration-300 w-full ${!isPlRevealed ? 'blur-md opacity-30 select-none' : 'blur-0 opacity-100'}`}>
                    {renderPlExample(currentWord)}
                  </h2>
                  
                  {!isPlRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-background shadow-xl px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-primary border-2 border-primary/20 transform group-hover:scale-105 group-active:scale-95 transition-all">
                        👁️ Pokaż tłumaczenie
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">

                  <p className="text-xs font-bold text-default-400 uppercase tracking-widest">
                    Wpisz brakujące słowo:
                  </p>
                  <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light" 
                    className="text-warning min-w-unit-6 h-6 w-6"
                    onClick={() => triggerHint(activeIndex)}
                  >
                    💡
                  </Button>
                </div>
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

      {/* Hint Overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="max-w-4xl w-full flex flex-col items-center gap-8">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-primary">Znajdź właściwe słowo</h3>
                <p className="text-default-500 font-bold uppercase tracking-widest text-sm">Zatwierdź, aby wrócić do wpisywania</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                {hintOptions.map((opt) => (
                  <Card 
                    key={opt.id}
                    isPressable
                    className="aspect-square border-4 border-transparent hover:border-primary transition-all p-4 bg-content1"
                    onClick={() => {
                      if (opt.id === currentWord.id) {
                        setShowHint(false)
                        audioService.playSuccess()
                        audioService.speak(opt.en) // Speak on correct select
                      } else {
                        audioService.playError()
                      }
                    }}

                  >
                    <CardBody className="flex flex-col items-center justify-center gap-4">
                      <div className="flex gap-2 items-center justify-center flex-wrap">
                        {opt.image.split(',').map((imgSrc, idx) => (
                           <img key={idx} src={prefixPath(imgSrc.trim())} className="h-20 w-20 object-contain" alt={opt.en} />
                        ))}
                      </div>
                      <p className="text-xl font-black uppercase tracking-widest text-foreground">{opt.en}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <Button 
                variant="flat" 
                color="danger" 
                className="font-bold uppercase tracking-widest"
                onClick={() => setShowHint(false)}
              >
                Zamknij podpowiedź
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

  )
}
