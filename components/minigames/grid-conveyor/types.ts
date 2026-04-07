import { Word } from "@/types";

export interface BeltItem {
  id: string;
  wordId: string;
  en: string;
  belt: "green" | "red";
  startTime: number;
  duration: number;
  expiryTime: number;
}

export interface GridItem {
  wordId: string;
  image: string;
  en: string;
  pl: string;
  hits: number;
}

export interface Projectile {
  id: string;
  fromX: number;
  fromY: number;
  toBelt: "green" | "red";
  targetWordId: string;
}

export interface HeartItem {
  id: string;
  x: number;
  y: number;
  startTime: number;
  duration: number;
}

export interface GameRecord {
  id: string;
  points: number;
  accuracy: number;
  date: string;
}

export type GameState = "ready" | "countdown" | "playing" | "ended";
