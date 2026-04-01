"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

interface Props {
  status: "success" | "wrong" | "idle";
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  if (status === "idle") return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20 transition-colors duration-300",
          status === "success" ? "bg-success" : "bg-danger",
          className,
        )}
        exit={{ opacity: 0, scale: 0 }}
        initial={{ opacity: 0, scale: 0 }}
      >
        {status === "success" ? "✓" : "✗"}
      </motion.div>
    </AnimatePresence>
  );
}
