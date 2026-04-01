import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Word {
  id: string;
  en: string;
  pl: string;
  en_example: string;
  pl_example: string;
  image: string;
  status?: number;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  subtitle: string;
  type?: "standard" | "articles";
}

export interface Question {
  id: string;
  sentence: string;
  correct: string;
  explanation: string;
  pl: string;
}


