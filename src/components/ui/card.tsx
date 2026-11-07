import React, { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
