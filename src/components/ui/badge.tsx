import React, { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "amber" | "neutral" | "danger" | "outline"
}

export function Badge({
  className,
  children,
  variant = "brand",
  ...props
}: BadgeProps) {
  const variantStyles = {
    brand: "bg-brand-soft text-brand border-brand/20",
    amber: "bg-amber-50 text-amber-900 border-amber-200",
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    outline: "bg-transparent text-ink border-line",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
