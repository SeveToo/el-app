"use client";

import GridConveyorGameModule from "./grid-conveyor";

import { Word } from "@/types";

export default function GridConveyorGame({
  sourceWords,
}: {
  sourceWords: Word[];
}) {
  return <GridConveyorGameModule sourceWords={sourceWords} />;
}
