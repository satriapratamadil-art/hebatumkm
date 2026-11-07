import React, { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "amber"
  size?: "sm" | "md" | "lg"
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      "bg-brand text-white border border-brand hover:bg-brand-dark active:scale-[0.99]",
    secondary:
      "bg-white text-ink border border-line hover:border-brand/40 hover:bg-brand-soft/30 active:scale-[0.99]",
    amber:
      "bg-brand-gold text-white border border-brand-gold hover:bg-amber-600 active:scale-[0.99]",
    danger:
      "bg-danger-soft text-danger border border-red-200 hover:bg-red-100 active:scale-[0.99]",
    ghost: "bg-transparent text-muted hover:text-ink hover:bg-stone-100",
  }

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-[11px] font-medium rounded-md gap-1.5",
    md: "px-4 py-2 text-xs font-semibold rounded-lg gap-2",
    lg: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2.5",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 select-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
