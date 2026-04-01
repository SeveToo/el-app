"use client";

import React from "react";
import { Button } from "@heroui/button";
import Link from "next/link";

interface Props {
  accuracy: number;
  totalTasks: number;
}

export default function ArticlesSummary({ accuracy, totalTasks }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-20 px-4 text-center">
      <div className="space-y-4">
        <div className="text-8xl">🏆</div>
        <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter">
          Brawo!
        </h2>
        <p className="text-default-500 font-medium">
          Ukończono lekcję o przedimkach.
        </p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="p-6 card-premium bg-content1">
          <p className="text-3xl font-black text-primary">{accuracy}%</p>
          <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">
            Skuteczność
          </p>
        </div>
        <div className="p-6 card-premium bg-content1">
          <p className="text-3xl font-black text-primary">{totalTasks}</p>
          <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest">
            Zadań
          </p>
        </div>
      </div>

      <Link className="w-full" href="/">
        <Button
          className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-2xl shadow-lg"
          color="primary"
          size="lg"
        >
          Wróć do menu głównego
        </Button>
      </Link>
    </div>
  );
}
