import { STORAGE_KEYS } from "@/config/storage-keys";

export type Stage =
  | "flashcards"
  | "fast_review"
  | "matching"
  | "written"
  | "sentence_fill"
  | "completed";

export const STAGES: Stage[] = [
  "flashcards",
  "fast_review",
  "matching",
  "written",
  "sentence_fill",
];

export const WORDS_PER_LOOP = 10;

export type ChapterProgress = {
  learnedCount: number;
  totalWords: number;
  completedAt?: string;
  // State for resuming
  roundIndex?: number;
  stage?: Stage;
  usedCount?: number;
  globalErrorIds?: string[];
  currentGroupIndices?: number[];
  roundPoints?: Record<string, number>; // Record<wordId, points 0-5>
};

const STORAGE_KEY = STORAGE_KEYS.PROGRESS;

function readAll(): Record<string, ChapterProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getProgress(chapterId: string): ChapterProgress | null {
  const all = readAll();

  return all[String(chapterId)] ?? null;
}

export function getAllProgress(): Record<string, ChapterProgress> {
  return readAll();
}

export function saveProgress(chapterId: string, progress: ChapterProgress) {
  if (typeof window === "undefined") return;
  const all = readAll();

  all[String(chapterId)] = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function calcPercent(p: ChapterProgress | null): number {
  if (!p || p.totalWords === 0) return 0;
  if (p.completedAt) return 100;

  // New mastery-based calculation:
  // Each word has 5 possible mastery points (one for each stage).
  // Total possible points = totalWords * 5.
  const totalPossiblePoints = p.totalWords * 5;
  const currentPoints = p.usedCount ? p.usedCount * 5 : 0; // Points from fully learned words (previous rounds)
  
  // Points from current round words (stored in roundPoints)
  const currentRoundPoints = Object.values(p.roundPoints || {}).reduce((sum, val) => sum + val, 0);

  const totalPointsEarned = currentPoints + currentRoundPoints;

  // Fallback to stage-based projection if no points are recorded yet
  if (totalPointsEarned === 0 && p.stage && p.stage !== "flashcards") {
    const sIndex = STAGES.indexOf(p.stage);
    const groupSize = p.currentGroupIndices?.length ?? WORDS_PER_LOOP;
    const added = (sIndex / STAGES.length) * groupSize;
    const rawLearned = (p.usedCount ?? p.learnedCount) + added;
    return Math.min(Math.round((rawLearned / p.totalWords) * 100), 100);
  }

  return Math.min(Math.round((totalPointsEarned / totalPossiblePoints) * 100), 100);
}
