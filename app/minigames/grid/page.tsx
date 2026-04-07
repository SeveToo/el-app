import React from "react";
import fs from "fs";
import path from "path";
import GridConveyorGame from "@/components/minigames/grid-conveyor";

async function getGameWords(lessonIds?: string) {
  const chapters = lessonIds ? lessonIds.split(',') : ["fruits", "vegetables", "food"];
  let allWords: any[] = [];

  for (const chapter of chapters) {
    const trimmedChapter = chapter.trim();
    if (!trimmedChapter) continue;
    
    try {
      const filePath = path.join(process.cwd(), "data", "lessons", `${trimmedChapter}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const words = JSON.parse(fileContent);
        allWords = [...allWords, ...words];
      }
    } catch (e) {
      console.error(`Error loading words for ${trimmedChapter}`, e);
    }
  }

  // De-duplicate if any
  const uniqueWords = Array.from(new Map(allWords.map(w => [w.id, w])).values());
  return uniqueWords;
}

export default async function GridGame({ searchParams }: { searchParams: { lessons?: string } }) {
  const words = await getGameWords(searchParams.lessons);

  return (
    <div className="container mx-auto py-8">
      <GridConveyorGame sourceWords={words} />
    </div>
  );
}
