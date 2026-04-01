"use client";

import React from "react";
import { Progress } from "@heroui/progress";

interface StudyHeaderProps {
  title: string;
  current: number;
  total: number;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default";
  className?: string;
}

/**
 * StudyHeader Component
 * Standardizes the top progress bar and stage title across all study components.
 */
export const StudyHeader: React.FC<StudyHeaderProps> = ({
  title,
  current,
  total,
  color = "primary",
  className = "",
}) => {
  const progressValue = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full flex flex-col gap-2 px-2 ${className}`}>
      <div className="flex justify-between text-[11px] sm:text-xs font-black uppercase tracking-widest">
        <span
          className={
            color !== "default"
              ? `text-${color}`
              : "text-default-400 opacity-80"
          }
        >
          {title}
        </span>
        <span className="text-default-400">
          {current} / {total}
        </span>
      </div>
      <Progress className="h-1" color={color} size="sm" value={progressValue} />
    </div>
  );
};
