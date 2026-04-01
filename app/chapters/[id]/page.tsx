import { promises as fs } from "fs";
import path from "path";

import Link from "next/link";
import { Button } from "@heroui/button";
import { Metadata } from "next";

import ArticlesLesson from "@/components/articles/ArticlesLesson";
import StudyLoop from "@/components/study/StudyLoop";
import { LESSONS } from "@/config/lessons";
import { Word, Question } from "@/types";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const lesson = LESSONS.find((l) => l.id === id);

  return {
    title: lesson ? `${lesson.title} | EL APP` : "Lekcja",
    description: lesson?.subtitle || "Rozpocznij naukę w EL APP",
  };
}

export async function generateStaticParams() {
  return LESSONS.map((l) => ({
    id: l.id,
  }));
}

export default async function ChapterPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let words: (Word | Question)[] = [];

  const lesson = LESSONS.find((l) => l.id === id);

  // Sprawdź czy jest JSON dla tego id
  if (lesson) {
    try {
      const filePath = path.join(process.cwd(), "public", "data", `${id}.json`);
      const file = await fs.readFile(filePath, "utf8");

      words = JSON.parse(file) as (Word | Question)[];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error loading words:", e);
    }
  }

  return (
    <section className="py-6 md:py-10 min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4">
        {words.length > 0 ? (
          lesson?.type === "articles" ? (
            <ArticlesLesson questions={words as Question[]} />
          ) : (
            <StudyLoop chapterId={id} words={words as Word[]} />
          )
        ) : (
          <div className="flex flex-col items-center gap-6 text-center mt-20">
            <div className="text-center p-10 bg-card rounded-2xl border-2 border-dashed border-default-200 max-w-md">
              <p className="text-3xl font-black text-danger uppercase opacity-50 mb-4 tracking-tighter">
                Brak danych 😿
              </p>
              <p className="text-default-500 italic font-medium">
                Lekcja o ID &quot;{id}&quot; nie ma jeszcze słownictwa.
              </p>
            </div>
            <Link href="/">
              <Button color="primary" variant="ghost">
                ← Wróć do listy lekcji
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
