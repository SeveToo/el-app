import { promises as fs } from "fs";
import path from "path";

import { Word, Question } from "@/types";

/**
 * Zwraca dane lekcji (słowa lub pytania) dla danego ID.
 * Ścieżka danych jest zunifikowana w jednym miejscu.
 */
export async function getLessonData(id: string): Promise<(Word | Question)[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "lessons", `${id}.json`);
    const file = await fs.readFile(filePath, "utf8");

    return JSON.parse(file) as (Word | Question)[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error loading lesson data for ID "${id}":`, error);

    return [];
  }
}

/**
 * Agreguje dane z wielu lekcji i losuje próbkę (np. dla Testów/Checkpointów).
 */
export async function getTestData(ids: string[], limit = 20): Promise<Word[]> {
  const allResults = await Promise.all(ids.map((id) => getLessonData(id)));

  // Plaszczymy wyniki i bierzemy tylko Word (filtrujemy Question jeśli są)
  const allWords = allResults
    .flat()
    .filter((item): item is Word => "en" in item);

  // Losowanie i ograniczanie
  return allWords.sort(() => Math.random() - 0.5).slice(0, limit);
}
