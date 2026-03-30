export type ChapterProgress = {
  learnedCount: number;
  totalWords: number;
  completedAt?: string;
  // State for resuming
  roundIndex?: number;
  stage?: string;
  usedCount?: number;
  globalErrorIds?: string[];
  currentGroupIndices?: number[];
};

const STORAGE_KEY = "el_progress";

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

  return Math.round((p.learnedCount / p.totalWords) * 100);
}
