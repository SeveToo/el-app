import StudyLoop from '@/components/StudyLoop'
import ArticlesLesson from '@/components/ArticlesLesson'
import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { Button } from '@heroui/button'

// JSONy dostępne jako lekcje
const JSON_LESSONS = [
  'action_verbs',
  'jobs',
  'kitchen_tools',
  'prepositions',
  'weather',
  'articles',
  'final_test',
]

export async function generateStaticParams() {
  return JSON_LESSONS.map((id) => ({
    id: id,
  }))
}

export default async function ChapterPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params


  let words: any[] = []

  // Sprawdź czy jest JSON dla tego id
  if (JSON_LESSONS.includes(id)) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', `${id}.json`)
      const file = await fs.readFile(filePath, 'utf8')
      words = JSON.parse(file)
    } catch (e) {
      console.error('Error loading words:', e)
    }
  }

  return (
    <section className="py-6 md:py-10 min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4">
        {words.length > 0 ? (
          id === 'articles' ? (
            <ArticlesLesson questions={words} chapterId={id} />
          ) : (
            <StudyLoop words={words} chapterId={id} />
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
  )
}
