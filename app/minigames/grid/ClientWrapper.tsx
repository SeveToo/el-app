"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Word } from "@/types";
import GridConveyorGame from "@/components/minigames/grid-conveyor";

interface ClientWrapperProps {
  allLessonsData: Record<string, Word[]>;
}

export default function ClientWrapper({ allLessonsData }: ClientWrapperProps) {
  const searchParams = useSearchParams();
  
  const words = useMemo(() => {
    const lessonsParam = searchParams.get("lessons");
    const requestedLessons = lessonsParam ? lessonsParam.split(",") : ["fruits", "vegetables", "food"];
    
    let combined: Word[] = [];
    for (const lesson of requestedLessons) {
      if (allLessonsData[lesson]) {
        combined = [...combined, ...allLessonsData[lesson]];
      }
    }
    
    if (combined.length === 0) {
       // fallback if empty or invalid
       combined = Object.values(allLessonsData).flat();
    }
    
    return combined;
  }, [searchParams, allLessonsData]);

  return <GridConveyorGame sourceWords={words} />;
}
