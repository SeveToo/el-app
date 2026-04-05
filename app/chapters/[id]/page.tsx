import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@heroui/button";

import ArticlesLesson from "@/components/articles/ArticlesLesson";
import StudyLoop from "@/components/study/StudyLoop";
import { LESSONS } from "@/config/lessons";
import { Word, Question } from "@/types";
import { getLessonData, getTestData } from "@/lib/lessons";
import { getCheckpointLessons } from "@/config/checkpoints";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const lesson = LESSONS.find((l) => l.id === id);

  let prefix = "";

  if (lesson?.type === "test") prefix = "Test: ";
  if (lesson?.type === "final") prefix = "Egzamin: ";

  return {
    title: lesson ? `${prefix}${lesson.title} | EL APP` : "Lekcja",
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
  const lesson = LESSONS.find((l) => l.id === id);

  let words: (Word | Question)[] = [];

  if (lesson?.type === "test" || lesson?.type === "final") {
    const componentIds = getCheckpointLessons(id);

    words = await getTestData(componentIds);
  } else if (lesson) {
    words = await getLessonData(id);
  }

  return (
    <section className="py-6 md:py-10 h-full bg-background">
      <div className="container mx-auto max-w-4xl px-4">
        {words.length > 0 ? (
          lesson?.type === "articles" ? (
            <ArticlesLesson questions={words as Question[]} />
          ) : (
            <StudyLoop
              chapterId={id}
              lessonType={lesson?.type}
              words={words as Word[]}
            />
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
