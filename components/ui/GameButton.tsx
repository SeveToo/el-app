'use client'

import React from 'react'
import { Button } from "@heroui/button"
import { cn } from "@/lib/utils"

type GameButtonProps = {
  color?: "success" | "danger" | "primary"
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost"
  children: React.ReactNode
  onClick?: (e: any) => void
  type?: "button" | "submit"
  isDisabled?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

const borderMap = {
  success: "border-success-600",
  danger: "border-danger-600", 
  primary: "border-primary-600",
}

export function GameButton({ color = "primary", className, ...props }: GameButtonProps) {
  return (
    <Button
      className={cn(
        "w-full h-16 text-lg font-black uppercase tracking-widest",
        "rounded-2xl shadow-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all",
        borderMap[color],
        className
      )}
      color={color}
      size="lg"
      variant={props.variant || "solid"}
      {...props}
    />
  )
}
