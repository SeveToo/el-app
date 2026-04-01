"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface Props {
  count: number;
  total: number;
  className?: string;
  activeColor?: string;
}

export function RepeatProgressBar({
  count,
  total,
  className,
  activeColor = "bg-success",
}: Props) {
  return (
    <div className={cn("flex gap-1.5 justify-center", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-8 rounded-full transition-all duration-300",
            i < count
              ? `${activeColor} shadow-[0_0_10px_rgba(34,197,94,0.5)]`
              : "bg-default-200",
          )}
        />
      ))}
    </div>
  );
}
