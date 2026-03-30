"use client";

import React from "react";
import { Link } from "@heroui/link";

export const AdBanner = () => {
  // Dynamiczna ścieżka dla GitHub Pages vs Localhost
  const getPath = (p: string) => {
    const isGH =
      typeof window !== "undefined" &&
      window.location.hostname.includes("github.io");

    return isGH ? `/el-app${p}` : p;
  };

  return (
    <div className="w-full flex justify-center px-0 font-sans my-0">
      <div className="w-full max-w-xl aspect-[843/245] overflow-hidden group cursor-pointer active:scale-95 transition-all duration-300">
        <Link
          className="block w-full h-full"
          href="https://hypekorepetycje.pl"
          target="_blank"
        >
          <img
            alt="HypeKorepetycje"
            className="w-full h-full object-contain"
            src={getPath("/ads/ad.webp")}
          />
        </Link>
      </div>
    </div>
  );
};
