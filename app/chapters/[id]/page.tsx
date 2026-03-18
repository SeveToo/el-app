import Link from 'next/link'
import StudyLoop from '@/components/StudyLoop'
import { promises as fs } from 'fs'
import path from 'path'

export default async function ChapterPage(props: any) {
  const { id } = props?.params || {}

  let words = []
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'action_verbs.json'
    )
    const file = await fs.readFile(filePath, 'utf8')
    words = JSON.parse(file)
  } catch (e) {
    console.error('Error loading words:', e)
  }

  return (
    <section className="py-8 md:py-10 min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12 flex items-center justify-between border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-primary">
              Nauka: {id}
            </h1>
            <p className="text-default-500 font-medium text-lg uppercase tracking-widest">
              Tryb: Pętla nauki (Stages 1-3)
            </p>
          </div>
          <Link href="/">
            <Button
              variant="bordered"
              color="default"
              className="font-bold uppercase tracking-widest">
              Powrót 🏠
            </Button>
          </Link>
        </div>

        {words.length > 0 ? (
          <StudyLoop words={words} />
        ) : (
          <div className="text-center p-10 bg-card rounded-2xl border-2 border-dashed border-default-200">
            <p className="text-3xl font-black text-danger uppercase opacity-50 mb-4 tracking-tighter">
              Brak danych 😿
            </p>
            <p className="text-default-500 max-w-md mx-auto italic font-medium">
              Upewnij się, że plik `public/action_verbs.json` istnieje
              i jest poprawny.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

import { Button } from '@heroui/button'
