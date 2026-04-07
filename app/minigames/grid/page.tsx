import fs from "fs";
import path from "path";

import React, { Suspense } from "react";

import ClientWrapper from "./ClientWrapper";

// Statically read ALL lesson files from data/lessons and pass them to the client
async function getAllGameWords() {
  const dictionary: Record<string, any[]> = {};

  try {
    const dirPath = path.join(process.cwd(), "data", "lessons");

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));

      for (const file of files) {
        const fileContent = fs.readFileSync(path.join(dirPath, file), "utf-8");
        const words = JSON.parse(fileContent);
        const lessonName = file.replace(".json", "");

        dictionary[lessonName] = words;
      }
    }
  } catch (e) {
    console.error(`Error loading words directory`, e);
  }

  return dictionary;
}

export default async function GridGame() {
  const allLessonsData = await getAllGameWords();

  return (
    <div className="container mx-auto py-8">
      {/* Suspense is required when using Client Components with useSearchParams */}
      <Suspense
        fallback={
          <div className="min-h-screen text-center py-20">
            Ładowanie Areny...
          </div>
        }
      >
        <ClientWrapper allLessonsData={allLessonsData} />
      </Suspense>
    </div>
  );
}
