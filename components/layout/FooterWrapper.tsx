"use client";

import { usePathname } from "next/navigation";
import React from "react";

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudyPage = pathname?.includes("/chapters/");

  if (isStudyPage) return null;

  return (
    <footer className="w-full flex items-center justify-center py-3">
      {children}
    </footer>
  );
}
