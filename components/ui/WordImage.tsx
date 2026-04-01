"use client";

import React from "react";
import { motion } from "framer-motion";

import { prefixPath } from "@/lib/utils";

interface WordImageProps {
  image: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fit?: "cover" | "contain";
  zoom?: boolean;
  maxImages?: number;
  forceImageIndex?: number;
}

/**
 * WordImage Component
 * Centralizes the logic for displaying word images across all study stages.
 * Handles:
 * - Single vs Multiple images (comma separated)
 * - Object fit (cover/contain)
 * - Vertical/Horizontal centering
 * - Zoom effect
 * - Responsive sizing and consistent styling
 */
export const WordImage: React.FC<WordImageProps> = ({
  image,
  alt,
  className = "",
  containerClassName = "",
  fit = "cover",
  zoom = false,
  maxImages = 2,
  forceImageIndex,
}) => {
  if (!image) return null;

  let imageSources = image
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (typeof forceImageIndex === "number" && forceImageIndex >= 0) {
    const single = imageSources[forceImageIndex] || imageSources[0]; // fallback to first if out-of-bounds

    imageSources = [single];
  } else {
    imageSources = imageSources.slice(0, maxImages);
  }

  const isMulti = imageSources.length > 1;

  return (
    <div
      className={`w-full h-full relative overflow-hidden bg-white ${containerClassName}`}
    >
      <div
        className={`w-full h-full ${
          isMulti
            ? "grid grid-cols-2 gap-0.5 items-center"
            : "flex items-center justify-center"
        }`}
      >
        {imageSources.map((src, idx) => (
          <motion.img
            key={`${src}-${idx}`}
            alt={alt}
            animate={{ scale: 1 }}
            className={`
              w-full h-full 
              ${fit === "cover" ? "object-cover" : "object-contain"} 
              object-center 
              ${zoom ? "scale-110" : ""}
              ${className}
            `}
            initial={zoom ? { scale: 1.1 } : false}
            src={prefixPath(src)}
            style={{
              objectPosition: "50% 50%",
              // Force redraw on src change for cleaner transition if mapping doesn't have good keys
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
};
