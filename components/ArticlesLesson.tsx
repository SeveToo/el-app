'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { Progress } from '@heroui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { audioService } from '@/lib/audio'
import Link from 'next/link'
import { ARTICLE_QUESTIONS } from '@/data/articles'

interface Question {
  id: string;
  sentence: string;
  correct: string;
  explanation: string;
  pl: string;
}

interface Props {
  questions: Question[];
  chapterId: string;
}

const RULES = [
  { term: 'A', rule: 'Przed spółgłoską (dźwięk), gdy mówimy o czymś po raz pierwszy lub o pracy.', example: 'A car, a teacher' },
  { term: 'AN', rule: 'Przed samogłoską (a, e, i, o, u), gdy mówimy o czymś ogólnie.', example: 'An apple, an hour' },
  { id: 'THE', term: 'THE', rule: 'Gdy mówimy o konkretnej rzeczy, jedynej w swoim rodzaju lub już wspomnianej.', example: 'The sun, the best' },
  { id: 'AT', term: 'AT', rule: 'Przy konkretnych godzinach, porach (night, noon) lub miejscach (at home, at work).', example: 'At 7:00, at school' },
  { id: 'NONE', term: '–', rule: 'Brak przedimka (Zero Article). Przy miastach, sportach, posiłkach i rzeczach ogólnych.', example: 'I like apples, in London' }
]

const OPTIONS = ['a', 'an', 'the', 'at', '–'];

export default function ArticlesLesson({ chapterId }: { chapterId: string }) {
  const [view, setView] = useState<'intro' | 'practice' | 'summary'>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [localQuestions, setLocalQuestions] = useState<Question[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [cooldown, setCooldown] = useState(0)
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Load scores and pick 10 questions
  useEffect(() => {
    if (view === 'practice' && localQuestions.length === 0) {
      const savedScores = JSON.parse(localStorage.getItem('article_scores') || '{}');
      
      // Filter available (score < 5)
      const available = ARTICLE_QUESTIONS.filter(q => (savedScores[q.id] || 0) < 5);
      
      // If none available, reset some or show all (fallback)
      const pool = available.length > 0 ? available : ARTICLE_QUESTIONS;
      
      // Shuffle and take 10
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
      setLocalQuestions(shuffled);
    }
  }, [view, localQuestions.length]);

  const updateScore = (qId: string, delta: number) => {
    const savedScores = JSON.parse(localStorage.getItem('article_scores') || '{}');
    const currentScore = savedScores[qId] || 0;
    const newScore = Math.max(0, Math.min(5, currentScore + delta));
    savedScores[qId] = newScore;
    localStorage.setItem('article_scores', JSON.stringify(savedScores));
  };

  const currentQ = localQuestions[currentIndex]

  // Auto-scroll when active index changes
  useEffect(() => {
    if (view === 'practice' && cardRefs.current[currentIndex]) {
      cardRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentIndex, view, localQuestions.length]);

  useEffect(() => {
    if (view !== 'practice') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExplanation) {
        if (e.key === 'Enter' && cooldown >= 100) {
          nextQuestion();
        }
        return;
      }

      const keyMap: Record<string, string> = {
        '1': 'a',
        '2': 'an',
        '3': 'the',
        '4': 'at',
        '5': '–'
      };
      
      if (keyMap[e.key]) {
        handleChoice(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentIndex, isCorrect, showExplanation, cooldown, localQuestions.length]);

  const speakExplanation = (text: string) => {
    // Split by single quotes e.g. 'Word' results in ["", "'Word'", " reszta"] or ["Rest ", "'Word'", " more"]
    const parts = text.split(/('[\w\s-]+')/g);
    
    parts.forEach((part, index) => {
      if (!part.trim()) return;
      
      const isEnglish = part.startsWith("'") && part.endsWith("'");
      const cleanText = isEnglish ? part.slice(1, -1) : part;
      
      audioService.speak(cleanText, {
        lang: isEnglish ? 'en-US' : 'pl-PL',
        cancel: index === 0 // only cancel on the first part
      });
    });
  };

  const handleChoice = (choice: string) => {
    if (!currentQ || showExplanation || (isCorrect === true && currentIndex === localQuestions.findIndex(q => q.id === currentQ.id))) return;

    setSelectedOption(choice);
    const correct = choice.toLowerCase() === currentQ.correct.toLowerCase();
    
    if (correct) {
      setIsCorrect(true);
      audioService.playSuccess();
      audioService.speak(currentQ.sentence.replace('___', choice));
      
      // Leveling: +1 for correct
      updateScore(currentQ.id, 1);
      
      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      setIsCorrect(false);
      audioService.playError();
      setWrongAnswers(prev => [...prev, currentQ.id]);
      setShowExplanation(true);
      speakExplanation(currentQ.explanation);
      
      // Leveling: -3 for wrong
      updateScore(currentQ.id, -3);
      
      // Cooldown timer
      setCooldown(0);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 1.1; // roughly 3 seconds
        });
      }, 30);

      // Add a copy of the question to the end for reinforcement
      const qCopy = { ...currentQ, id: `${currentQ.id}-retry-${Date.now()}` };
      setLocalQuestions(prev => [...prev, qCopy]);
    }
  }

  const nextQuestion = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setCooldown(0);
    
    if (currentIndex < localQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView('summary');
    }
  }

  if (view === 'intro') {
    const lastAccuracy = typeof window !== 'undefined' ? localStorage.getItem('article_last_accuracy') : null;

    return (
      <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-10 px-4">
        {/* Last Result Stats - Only show if played before */}
        {lastAccuracy && (
          <Card className="border-none bg-primary shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-1000">
            <CardBody className="p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
              
              <div className="relative flex flex-col items-center sm:items-start gap-1 shrink-0">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">MÓJ OSTATNI WYNIK</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-6xl font-black text-white">{lastAccuracy}%</span>
                 </div>
              </div>

              <div className="w-full space-y-3">
                 <p className="text-sm font-bold text-white/90 leading-tight italic">
                   {Number(lastAccuracy) >= 80 ? 'Świetnie! Trzymaj tak dalej 🔥' : 
                    Number(lastAccuracy) >= 50 ? 'Dobry start, powalcz o wyższy wynik! 💪' : 
                    'Trening czyni mistrza! Spróbuj jeszcze raz ⚡'}
                 </p>
                 <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${lastAccuracy}%` }} />
                 </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="text-center space-y-2 mt-4">
          <h1 className="text-4xl font-black text-primary uppercase tracking-tighter">Przedimki w praktyce</h1>
          <p className="text-default-500 font-bold uppercase tracking-widest text-xs">System Adaptacyjny • Pula {ARTICLE_QUESTIONS.length} Zadań</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {RULES.map((r) => (
            <Card key={r.term} className="border-none bg-content1 shadow-xl rounded-[2rem] overflow-hidden hover:scale-[1.02] transition-transform">
              <CardBody className="p-6 sm:p-8 flex flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl font-black text-primary shrink-0 shadow-inner">
                  {r.term}
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-black text-foreground leading-tight">{r.rule}</p>
                  <p className="text-xs sm:text-sm font-bold text-default-400 italic">Przykład: <span className="text-primary/70">{r.example}</span></p>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* Mnemotechnika od USERA - WERSJA TABELKA */}
          <Card className="border-none bg-amber-500/5 border-2 border-amber-500/20 rounded-[2rem] overflow-hidden shadow-sm">
            <CardBody className="p-6 sm:p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/30 flex items-center justify-center text-2xl shrink-0">💡</div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] leading-none">Lifehack dla Polaków:</p>
                    <p className="text-base sm:text-lg font-black text-amber-900 uppercase tracking-tight">Słyszysz 2 litery? Wstaw 1 (A). Słyszysz 1? Wstaw 2 (AN)!</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] overflow-hidden border-2 border-amber-500/20 shadow-xl bg-white/50 backdrop-blur-sm">
                  {/* Nagłówki */}
                  <div className="grid grid-cols-4 bg-amber-100/80 border-b-2 border-amber-500/10">
                    <div className="p-3 text-[10px] font-black uppercase text-amber-700 text-center tracking-widest opacity-70">Słowo</div>
                    <div className="p-3 text-[10px] font-black uppercase text-amber-700 text-center tracking-widest opacity-70">Dźwięk</div>
                    <div className="p-3 text-[10px] font-black uppercase text-amber-700 text-center tracking-widest opacity-70">Wstaw</div>
                    <div className="p-3 text-[10px] font-black uppercase text-amber-700 text-center tracking-widest opacity-70">Wynik</div>
                  </div>
                  
                  {/* Wiersze danych */}
                  {[
                    { en: 'Dog', first: 'D', rest: 'og', sound: 'di', count: '2 litery', result: 'A', help: '1 litera', hl: false },
                    { en: 'Apple', first: 'A', rest: 'pple', sound: 'æ', count: '1 litera', result: 'AN', help: '2 litery', hl: true },
                    { en: 'Car', first: 'C', rest: 'ar', sound: 'ki', count: '2 litery', result: 'A', help: '1 litera', hl: false },
                    { en: 'Egg', first: 'E', rest: 'gg', sound: 'e', count: '1 litera', result: 'AN', help: '2 litery', hl: true },
                    { en: 'Banana', first: 'B', rest: 'anana', sound: 'bi', count: '2 litery', result: 'A', help: '1 litera', hl: false },
                    { en: 'Orange', first: 'O', rest: 'range', sound: 'o', count: '1 litera', result: 'AN', help: '2 litery', hl: true },
                    { en: 'Lemon', first: 'L', rest: 'emon', sound: 'li', count: '2 litery', result: 'A', help: '1 litera', hl: false },
                    { en: 'Umbrella', first: 'U', rest: 'mbrella', sound: 'ʌ', count: '1 litera', result: 'AN', help: '2 litery', hl: true },
                    { en: 'Garden', first: 'G', rest: 'arden', sound: 'gi', count: '2 litery', result: 'A', help: '1 litera', hl: false },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-4 items-center border-b border-amber-500/10 last:border-0 ${i % 2 === 0 ? 'bg-white/30' : 'bg-transparent'}`}>
                      <div className="p-4 text-center text-[12px] sm:text-[14px] font-black text-amber-900 border-r border-amber-500/5">
                        <span className="text-amber-500 font-black">{row.first}</span>{row.rest}
                      </div>
                      <div className="p-4 text-center flex flex-col items-center justify-center gap-0.5 border-r border-amber-500/5">
                        <span className="text-[12px] sm:text-[14px] font-black text-amber-500 italic">{row.sound}</span>
                        <span className="text-[7px] sm:text-[8px] font-black text-amber-600/50 uppercase tracking-widest">{row.count}</span>
                      </div>
                      <div className="p-4 text-center flex flex-col items-center justify-center gap-0.5 border-r border-amber-500/5">
                         <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[12px] font-black shadow-sm ${row.hl ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                           {row.result}
                         </span>
                         <span className="text-[7px] sm:text-[8px] font-black text-blue-600/50 uppercase tracking-widest">{row.help}</span>
                      </div>
                      <div className={`p-4 text-center ${row.hl ? 'bg-amber-500/5' : ''}`}>
                         <p className="text-[12px] sm:text-[15px] font-black text-amber-950 tracking-tight lowercase">
                            <span className="text-blue-600 font-black">{row.result}</span> <span className="text-amber-500 font-black">{row.first}</span>{row.rest}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center pt-2">
                  <div className="w-full max-w-lg px-8 py-5 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-blue-500/5 rounded-[2rem] border-2 border-amber-500/10 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">✨</div>
                    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-amber-500/10">
                      
                      <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-2">Słyszysz 2</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-amber-500">2</span>
                          <span className="text-xl text-default-300">→</span>
                          <span className="text-2xl font-black text-blue-500">1</span>
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mt-2">Wstawiasz 1</p>
                      </div>

                      <div className="flex flex-col items-center pt-4 sm:pt-0 sm:pl-8">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-2">Słyszysz 1</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-amber-500">1</span>
                          <span className="text-xl text-default-300">→</span>
                          <span className="text-2xl font-black text-blue-500">2</span>
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mt-2">Wstawiasz 2</p>
                      </div>

                    </div>
                  </div>
                </div>

             </CardBody>
          </Card>
        </div>

        <Button 
          size="lg" 
          color="primary" 
          className="h-16 text-xl font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl mt-4"
          onClick={() => setView('practice')}
        >
          Zaczynamy! 🚀
        </Button>
      </div>
    )
  }

  if (view === 'summary') {
    const accuracy = Math.round(((localQuestions.length - new Set(wrongAnswers).size) / localQuestions.length) * 100);
    
    // Save to localStorage for intro screen
    if (typeof window !== 'undefined') {
       localStorage.setItem('article_last_accuracy', accuracy.toString());
    }

    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-20 px-4 text-center">
        <div className="space-y-4">
          <div className="text-8xl">🏆</div>
          <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter">Brawo!</h2>
          <p className="text-default-500 font-medium">Ukończono lekcję o przedimkach.</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="p-6 bg-content1 rounded-[2rem] border-2 border-primary/10">
            <p className="text-3xl font-black text-primary">{accuracy}%</p>
            <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">Skuteczność</p>
          </div>
          <div className="p-6 bg-content1 rounded-[2rem] border-2 border-primary/10">
            <p className="text-3xl font-black text-primary">{localQuestions.length}</p>
            <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">Zadań</p>
          </div>
        </div>

        <Link href="/" className="w-full">
          <Button color="primary" size="lg" className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl shadow-lg">
            Wróć do menu głównego
          </Button>
        </Link>
      </div>
    )
  }

  if (view === 'practice' && localQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center p-20 text-primary font-black animate-pulse uppercase tracking-widest w-full text-center">
        Przygotowuję zadania... ⚙️
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-6 sm:py-10 px-4 min-h-[600px] pb-40">
      <div className="w-full space-y-2">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-primary">
          <span>ETAP: PRZEDIMKI</span>
          <span>{currentIndex + 1} / {localQuestions.length}</span>
        </div>
        <Progress 
           value={((localQuestions.filter((q, i) => i < currentIndex || (i === currentIndex && isCorrect === true)).length) / localQuestions.length) * 100} 
           color="primary" 
           size="sm" 
           className="h-1.5" 
        />
      </div>

      <div className="flex flex-col gap-3">
        {localQuestions.map((q, index) => {
          const isActive = currentIndex === index;
          const isDone = index < currentIndex || (index === currentIndex && isCorrect === true);
          const hasError = wrongAnswers.includes(q.id) && isActive && isCorrect === false;

          return (
            <Card 
              key={q.id}
              ref={(el: any) => (cardRefs.current[index] = el)}
              className={`transition-all duration-500 border-2 active:scale-[0.98] ${
                isActive 
                  ? 'border-primary ring-8 ring-primary/5 bg-primary/5 shadow-2xl z-10 translate-y-[-2px]' 
                  : 'border-transparent bg-content1 shadow-sm opacity-50 grayscale-[0.2]'
              } ${isDone && !isActive ? 'opacity-90 grayscale-0 !bg-success/5 !border-success/20 pointer-events-none' : ''}`}
              onClick={() => {
                if (!isDone) setCurrentIndex(index);
              }}
            >
              <CardBody className="p-6 sm:p-8">
                <div className="space-y-3">
                <div className="text-lg sm:text-xl font-black text-foreground !leading-relaxed">
                  {q.sentence.split('___').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <div className="relative inline-flex flex-col items-center mx-2 min-w-[60px] align-bottom h-10 sm:h-12 justify-end">
                          <AnimatePresence>
                            {isActive && isCorrect === false && (
                              <motion.span 
                                initial={{ opacity: 0, y: 10, rotate: -5 }}
                                animate={{ opacity: 1, y: -20, rotate: -5 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-1 left-1/2 -translate-x-1/2 text-success font-black text-lg sm:text-2xl whitespace-nowrap italic drop-shadow-sm select-none"
                                style={{ fontFamily: 'var(--font-cursive, cursive)' }}
                              >
                                {q.correct}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          
                          <span className={`w-full border-b-4 text-center pb-0.5 transition-all duration-300 ${
                            (isActive && isCorrect === true) || (isDone && !isActive) ? 'text-success border-success' : 
                            (isActive && isCorrect === false) ? 'text-default-300 border-default-200 line-through opacity-60 scale-95' : 
                            isActive ? 'text-primary border-primary animate-pulse' : 'text-default-200 border-default-200'
                          }`}>
                            {isActive ? (selectedOption || '___') : (isDone ? q.correct : '___')}
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                  <p className="text-default-400 font-bold uppercase tracking-widest text-[10px] italic">
                    {q.pl}
                  </p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-divider z-[110] shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {OPTIONS.map((opt, i) => (
              <Button
                key={opt}
                size="lg"
                className={`h-16 sm:h-24 text-lg sm:text-2xl font-black uppercase tracking-widest rounded-2xl shadow-lg border-b-4 transition-all duration-200 ${
                  currentIndex < localQuestions.length && selectedOption === opt 
                    ? (isCorrect ? 'bg-success text-white border-success-700' : 'bg-danger text-white border-danger-700 shake')
                    : 'bg-content1 text-foreground border-default-200 hover:border-primary active:scale-95'
                }`}
                onClick={() => handleChoice(opt)}
                isDisabled={isCorrect === true || showExplanation}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] opacity-40 mb-1">{i + 1}</span>
                  <span>{opt}</span>
                </div>
              </Button>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <Card className="border-none bg-white border-2 border-danger/20 rounded-2xl shadow-xl">
                  <CardBody className="p-5 text-center flex flex-row items-center justify-between gap-4">
                    <div className="text-left">
                       <p className="text-[10px] font-black text-danger uppercase tracking-widest mb-1">❌ WYJAŚNIENIE</p>
                       <p className="text-xs sm:text-sm font-bold text-danger/80 leading-tight italic">
                         {currentQ.explanation}
                       </p>
                    </div>
                    <Button 
                      color="danger" 
                      variant="shadow" 
                      size="sm"
                      className="font-black uppercase tracking-widest rounded-xl px-6 min-w-fit relative overflow-hidden"
                      onClick={nextQuestion}
                      isDisabled={cooldown < 100}
                    >
                      <div 
                        className="absolute left-0 bottom-0 top-0 bg-white/20 transition-all duration-75"
                        style={{ width: `${cooldown}%` }}
                      />
                      <span className="relative z-10">{cooldown < 100 ? 'Analiza...' : 'Dalej ➔'}</span>
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
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
