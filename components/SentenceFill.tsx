'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'

import { audioService } from '@/lib/audio'
import { Word } from '@/types'
import { WordImage } from '@/components/WordImage'

const removeDiacritics = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L")

const getSentenceParts = (word: { en_example: string; en: string }) => {
  let example = word.en_example || ''
  if (!example.includes('[')) {
    const regex = new RegExp(`(${word.en})`, 'gi')
    example = example.replace(regex, '[$1]')
  }
  return example.split(/\[(.*?)\]/g)
}


interface Props {
  words: Word[]
  onComplete: (errorIds: string[]) => void
}

export default function SentenceFill({ words, onComplete }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeGapIndex, setActiveGapIndex] = useState(0)
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
  
  // Visual Viewport tracking for mobile keyboard
  const [vOffset, setVOffset] = useState(0)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const currentWord = words[activeIndex]

  useEffect(() => {
    if (typeof window === 'undefined') return
    const vv = (window as any).visualViewport
    if (!vv) return

    const handleViewport = () => {
      setVOffset(vv.offsetTop)
      const ratio = vv.height / window.screen.height
      setKeyboardOpen(ratio < 0.75)
    }

    vv.addEventListener('resize', handleViewport)
    vv.addEventListener('scroll', handleViewport)
    handleViewport()

    return () => {
      vv.removeEventListener('resize', handleViewport)
      vv.removeEventListener('scroll', handleViewport)
    }
  }, [])

  // Focus current input when activeIndex changes
  useEffect(() => {
    setIsPlRevealed(false)
    if (!showHint) {
      inputRefs.current[activeIndex]?.[0]?.focus()
      const el = inputRefs.current[activeIndex]?.[0]
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [activeIndex, showHint])


  const triggerHint = (index: number) => {
    const correctWord = words[index]
    const others = words.filter(w => w.id !== correctWord.id)
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5)
    
    const options = [correctWord, ...shuffledOthers.slice(0, 2)].sort(() => Math.random() - 0.5)
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
      
      if (index < words.length - 1) {
        setActiveIndex(index + 1)
      } else {
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

      if (newWrongCount[index] >= 2) {
        setTimeout(() => triggerHint(index), 500)
      }

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
          <span key={i} className="text-warning-500 font-black">
            {part}
          </span>
        )
      }
      
      return <React.Fragment key={i}>{part}</React.Fragment>
    })

    return (
      <span className="inline-flex items-center flex-wrap justify-center gap-x-1.5">
        {rendered}
        {!highlighted && (
           <span className="text-warning font-black">({word.pl})</span>
        )}
      </span>
    )
  }

  const renderSentence = (word: Word, index: number) => {
    const parts = getSentenceParts(word)
    const gapsCount = Math.floor(parts.length / 2)
    
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 py-1 text-base sm:text-lg font-medium text-default-600 leading-relaxed">
        {parts.map((part, i) => {
          if (i % 2 !== 0) {
            const gapIdx = Math.floor(i / 2)
            if (statuses[index] === 'success') {
              return (
                <motion.span 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block px-1.5 py-0 rounded-lg bg-success/10 text-success font-black text-base sm:text-lg uppercase tracking-wider"
                >
                  {part}
                </motion.span>
              )
            }
            return (
              <div key={i} className="inline-block min-w-[70px]">
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
                   onFocus={() => {
                     setActiveIndex(index)
                     setActiveGapIndex(gapIdx)
                   }}
                  size="sm"
                  variant="underlined"
                  color={
                    statuses[index] === 'wrong' ? 'danger' :
                    activeIndex === index ? 'warning' : 'default'
                  }
                  placeholder="..."
                  classNames={{
                    input: `text-base sm:text-lg font-black uppercase text-center tracking-widest ${
                      activeIndex === index ? 'text-warning' : 'text-default-400'
                    }`,
                    inputWrapper: "border-b-2"
                  }}
                  autoComplete="off"
                  enterKeyHint="done"
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
    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto pb-40">
      
      {/* Spacer */}
      <div className="h-[145px] sm:h-[165px] invisible pointer-events-none"></div>

      {/* Fixed Header */}
      <div 
        className="fixed left-0 right-0 z-[100] bg-background pt-3 pb-3 border-divider border-b px-3 shadow-md transition-all duration-75"
        style={{ top: `${vOffset}px` }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {/* TOP BAR */}
          <div className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-default-400">
            <div className="flex items-center gap-2">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onClick={() => window.location.href = '/'}
                className="w-6 h-6 min-w-0 font-bold"
              >
                ✕
              </Button>
              <span className="text-primary/70">ETAP 5</span>
              <span>{activeIndex + 1} / {words.length}</span>
            </div>
            
            <div className="flex items-center gap-3">
               <span>POSTĘP: {Math.round((statuses.filter(s => s === 'success').length / words.length) * 100)}%</span>
               <Button 
                  isIconOnly 
                  size="sm" 
                  variant="flat" 
                  color="warning"
                  className="w-6 h-6 min-w-0 font-bold rounded-lg ml-2"
                  onClick={() => triggerHint(activeIndex)}
                >
                  💡
              </Button>
            </div>
          </div>

          <Progress
            value={(statuses.filter(s => s === 'success').length / words.length) * 100}
            color="primary"
            size="sm"
            className="h-1"
          />

          {/* MAIN BAR */}
          <div className="flex items-center gap-3 mt-1">
            <div className="shrink-0 h-20 w-20 sm:h-24 sm:w-24">
               <WordImage 
                 image={currentWord.image} 
                 alt={currentWord.en}
                 forceImageIndex={activeGapIndex}
                 maxImages={1}
                 zoom={true}
                containerClassName="rounded-xl border-2 border-primary/20 shadow-sm"
                className="p-0.5"
              />
            </div>

            {/* PL Hint Box */}
            <div className="flex-grow min-w-0">
               <div 
                className="relative cursor-pointer group flex items-center justify-center min-h-[50px] px-1 sm:px-4 bg-primary/5 rounded-2xl border-2 border-primary/20 hover:bg-primary/10 transition-all overflow-hidden"
                onClick={() => setIsPlRevealed(true)}
              >
                <div className={`text-sm sm:text-base font-black text-primary uppercase leading-tight text-center w-full transition-all duration-500 ${!isPlRevealed ? 'blur-xl opacity-10 select-none scale-110' : 'blur-0 opacity-100 scale-100'}`}>
                  {renderPlExample(currentWord)}
                </div>
                
                {!isPlRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                      👁️ POKAŻ PODPOWIEDŹ
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List of Sentences */}
      <div className="flex flex-col gap-2.5 px-2 pt-2">
        {words.map((word, index) => (
          <Card 
            key={word.id}
            className={`transition-all duration-300 border-2 ${
              activeIndex === index 
                ? 'border-primary ring-2 ring-primary/10 bg-primary/5 shadow-md z-10' 
                : 'border-transparent bg-content1'
            } ${statuses[index] === 'success' ? 'opacity-80 pointer-events-none' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <CardBody className="p-4 sm:p-5">
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
            className="fixed inset-0 z-[101] bg-background/98 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <div className="max-w-xl w-full flex flex-col items-center gap-6 max-h-screen overflow-y-auto py-10 px-4">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-primary">Znajdź pasujące słowo</h3>
                <p className="text-default-500 font-bold uppercase tracking-widest text-[9px]">Wybierz poprawną odpowiedź</p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                {hintOptions.map((opt) => (
                  <Card 
                    key={opt.id}
                    isPressable
                    className="w-full border border-default-200 hover:border-primary transition-all bg-content1 shadow-md hover:scale-[1.01] active:scale-95"
                    onClick={() => {
                      if (opt.id === currentWord.id) {
                        setShowHint(false)
                        audioService.playSuccess()
                        audioService.speak(opt.en)
                      } else {
                        audioService.playError()
                      }
                    }}
                  >
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                      <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16">
                        <WordImage 
                          image={opt.image} 
                          alt={opt.en}
                          maxImages={1}
                          containerClassName="rounded-xl border border-default-100 shadow-sm"
                          fit="contain"
                          className="p-1"
                        />
                      </div>
                      <div className="flex-grow text-left">
                        <p className="text-lg sm:text-2xl font-black uppercase tracking-widest text-foreground">{opt.en}</p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <Button 
                variant="flat" 
                color="danger" 
                size="lg"
                className="font-black uppercase tracking-[0.2em] w-full rounded-2xl h-12"
                onClick={() => setShowHint(false)}
              >
                Zamknij ❌
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

  )
}
