'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { GameButton } from '@/components/ui/GameButton'

import { audioService } from '@/lib/audio'
import { Word } from '@/types'
import { WordImage } from '@/components/ui/WordImage'

const removeDiacritics = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')

const getSentenceParts = (word: {
  en_example: string
  en: string
}) => {
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
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeGapIndex, setActiveGapIndex] = useState(0)
  const [inputs, setInputs] = useState<string[][]>(() =>
    words.map((w) =>
      new Array(Math.floor(getSentenceParts(w).length / 2)).fill('')
    )
  )
  const [statuses, setStatuses] = useState<
    ('idle' | 'success' | 'wrong')[]
  >(new Array(words.length).fill('idle'))
  const [errorIds, setErrorIds] = useState<string[]>([])

  // Hint system
  const [showHint, setShowHint] = useState(false)
  const [hintOptions, setHintOptions] = useState<Word[]>([])
  const [wrongCount, setWrongCount] = useState<
    Record<number, number>
  >({})

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
    const others = words.filter((w) => w.id !== correctWord.id)
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5)

    const options = [correctWord, ...shuffledOthers.slice(0, 2)].sort(
      () => Math.random() - 0.5
    )

    setErrorIds((prev) =>
      prev.includes(correctWord.id) ? prev : [...prev, correctWord.id]
    )
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

    const userInputs = inputs[index].map((val) =>
      val.trim().toLowerCase()
    )
    const isAllCorrect =
      userInputs.length === targets.length &&
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
        const allSuccess = statuses.every(
          (s, i) => i === index || s === 'success'
        )

        if (allSuccess) {
          setTimeout(() => onComplete(errorIds), 1000)
        }
      }
    } else {
      const newStatuses = [...statuses]

      newStatuses[index] = 'wrong'
      setStatuses(newStatuses)
      audioService.playError()

      const newWrongCount = {
        ...wrongCount,
        [index]: (wrongCount[index] || 0) + 1,
      }

      setWrongCount(newWrongCount)

      if (!errorIds.includes(word.id)) {
        setErrorIds((prev) => [...prev, word.id])
      }

      if (newWrongCount[index] >= 2) {
        setTimeout(() => triggerHint(index), 500)
      }

      setTimeout(() => {
        setStatuses((prev) => {
          const s = [...prev]

          s[index] = 'idle'

          return s
        })
      }, 1000)
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    gapIdx: number,
    gapsCount: number
  ) => {
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

    if (
      !sentence ||
      !baseWord ||
      sentence.toLowerCase() === baseWord.toLowerCase()
    )
      return sentence

    const baseWords = baseWord.toLowerCase().split(/\s+/)
    const sentenceParts = sentence.split(/(\s+|[.,;!?]+)/)

    let highlighted = false

    const rendered = sentenceParts.map((part, i) => {
      if (!part.trim() || part.match(/^[.,;!?]+$/))
        return <React.Fragment key={i}>{part}</React.Fragment>

      const partLower = removeDiacritics(part.toLowerCase())

      const isMatch = baseWords.some((bw) => {
        const bwClean = removeDiacritics(bw)

        if (bwClean.length <= 3) {
          return (
            partLower === bwClean ||
            (partLower.startsWith(bwClean) &&
              partLower.length - bwClean.length <= 2)
          )
        }

        let root = bwClean

        if (root.match(/(owac|awac|iwac|ywac)$/))
          root = root.slice(0, -4)
        else if (root.match(/(ac|ec|ic|yc)$/))
          root = root.slice(0, -2)

        const prefixLen = Math.min(root.length, 5)
        const prefix = root.substring(0, prefixLen)

        return (
          (partLower.startsWith(prefix) ||
            partLower.includes(root)) &&
          Math.abs(partLower.length - bwClean.length) <= 5
        )
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
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block px-1.5 py-0 rounded-lg bg-success/10 text-success font-black text-base sm:text-lg uppercase tracking-wider"
                  initial={{ scale: 0.9, opacity: 0 }}>
                  {part}
                </motion.span>
              )
            }

            return (
              <div key={i} className="inline-block min-w-[70px]">
                <Input
                  ref={(el: any) => {
                    if (!inputRefs.current[index])
                      inputRefs.current[index] = []
                    inputRefs.current[index][gapIdx] =
                      el as HTMLInputElement
                  }}
                  autoComplete="off"
                  classNames={{
                    input: `text-base sm:text-lg font-black uppercase text-center tracking-widest ${
                      activeIndex === index
                        ? 'text-warning'
                        : 'text-default-400'
                    }`,
                    inputWrapper: 'border-b-2',
                  }}
                  color={
                    statuses[index] === 'wrong'
                      ? 'danger'
                      : activeIndex === index
                        ? 'warning'
                        : 'default'
                  }
                  enterKeyHint="done"
                  placeholder="..."
                  size="sm"
                  value={inputs[index]?.[gapIdx] || ''}
                  variant="underlined"
                  onChange={(e) => {
                    const newInputs = [...inputs]
                    const sentenceInputs = [
                      ...(newInputs[index] || []),
                    ]

                    sentenceInputs[gapIdx] = e.target.value
                    newInputs[index] = sentenceInputs
                    setInputs(newInputs)
                  }}
                  onFocus={() => {
                    setActiveIndex(index)
                    setActiveGapIndex(gapIdx)
                  }}
                  onKeyDown={(e) =>
                    handleKeyDown(e, index, gapIdx, gapsCount)
                  }
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
      <div className="h-[145px] sm:h-[165px] invisible pointer-events-none" />

      {/* Fixed Header */}
      <div
        className="fixed left-0 right-0 z-[100] bg-background/80 backdrop-blur-xl pt-4 pb-4 border-divider border-b px-4 shadow-xl transition-all duration-75"
        style={{ top: `${vOffset}px` }}>
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {/* TOP BAR */}
          <div className="w-full flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-default-500">
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                className="w-8 h-8 min-w-0 font-bold bg-content1 shadow-sm"
                size="sm"
                variant="flat"
                onClick={() => router.push('/')}>
                ✕
              </Button>
              <div className="flex flex-col">
                <span className="text-primary/70 leading-none">
                  ETAP 5
                </span>
                <span className="text-foreground leading-none mt-1">
                  {activeIndex + 1} z {words.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="opacity-50 leading-none">
                  POSTĘP
                </span>
                <span className="text-primary leading-none mt-1">
                  {Math.round(
                    (statuses.filter((s) => s === 'success').length /
                      words.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <Button
                isIconOnly
                className="w-10 h-10 min-w-0 text-lg rounded-xl ml-1"
                color="warning"
                size="sm"
                variant="shadow"
                onClick={() => triggerHint(activeIndex)}>
                💡
              </Button>
            </div>
          </div>

          <div className="relative w-full h-2 bg-default-100 rounded-full overflow-hidden">
            <motion.div
              animate={{
                width: `${(statuses.filter((s) => s === 'success').length / words.length) * 100}%`,
              }}
              className="absolute left-0 top-0 h-full bg-primary"
              initial={{ width: 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* MAIN BAR */}
          <div className="flex items-center gap-4 mt-1">
            <div className="shrink-0 h-24 w-24 sm:h-28 sm:w-28 relative">
              <WordImage
                alt={currentWord.en}
                className="rounded-xl"
                containerClassName="rounded-2xl border-2 border-primary/10 shadow-lg bg-white p-1"
                forceImageIndex={activeGapIndex}
                image={currentWord.image}
                maxImages={1}
                zoom={true}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-background shadow-lg">
                <span className="text-[10px] font-black">
                  {activeIndex + 1}
                </span>
              </div>
            </div>

            {/* PL Hint Box */}
            <div className="flex-grow min-w-0">
              <button
                className={`relative cursor-pointer group flex items-center justify-center min-h-[70px] px-4 sm:px-6 bg-primary/5 rounded-[1.5rem] border-2 transition-all overflow-hidden ${isPlRevealed ? 'border-primary/20 bg-primary/10' : 'border-dashed border-primary/30'}`}
                onClick={() => setIsPlRevealed(true)}
                type="button">
                <div
                  className={`text-base sm:text-lg font-bold text-primary tracking-tight leading-tight text-center w-full transition-all duration-700 ${!isPlRevealed ? 'blur-2xl opacity-0 select-none scale-125' : 'blur-0 opacity-100 scale-100'}`}>
                  {renderPlExample(currentWord)}
                </div>

                {!isPlRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border-2 border-white/20">
                        👁️ Podpowiedź
                      </div>
                      <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-1">
                        Kliknij, aby odkryć sens
                      </p>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List of Sentences */}
      <div className="flex flex-col gap-2.5 px-2 pt-2">
        {words.map((word, index) => (
          <Card
            key={word.id}
            className={`transition-all duration-500 border-2 active:scale-[0.98] ${
              activeIndex === index
                ? 'border-primary ring-8 ring-primary/5 bg-primary/5 shadow-2xl z-10 translate-y-[-2px]'
                : 'border-transparent bg-content1 shadow-sm opacity-60 grayscale-[0.3]'
            } ${statuses[index] === 'success' ? 'opacity-90 grayscale-0 !bg-success/5 !border-success/20' : ''}`}
            onClick={() => setActiveIndex(index)}>
            <CardBody className="p-6 sm:p-8">
              {renderSentence(word, index)}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Hint Overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[101] bg-background/98 backdrop-blur-2xl flex items-center justify-center p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}>
            <div className="max-w-xl w-full flex flex-col items-center gap-6 max-h-screen overflow-y-auto py-10 px-4">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-primary">
                  Znajdź pasujące słowo
                </h3>
                <p className="text-default-500 font-bold uppercase tracking-widest text-[9px]">
                  Wybierz poprawną odpowiedź
                </p>
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
                    }}>
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                      <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16">
                        <WordImage
                          alt={opt.en}
                          className="p-1"
                          containerClassName="rounded-xl border border-default-100 shadow-sm"
                          fit="contain"
                          image={opt.image}
                          maxImages={1}
                        />
                      </div>
                      <div className="flex-grow text-left">
                        <p className="text-lg sm:text-2xl font-black uppercase tracking-widest text-foreground">
                          {opt.en}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <GameButton
                color="danger"
                variant="flat"
                onClick={() => setShowHint(false)}>
                Zamknij ❌
              </GameButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

