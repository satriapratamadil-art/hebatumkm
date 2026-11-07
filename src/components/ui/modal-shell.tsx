"use client"

import React, { useEffect, ReactNode } from "react"
import { X } from "lucide-react"

interface ModalShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
  maxWidth?: string
}

export function ModalShell({
  title,
  subtitle,
  children,
  onClose,
  maxWidth = "max-w-lg",
}: ModalShellProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = originalOverflow
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-2xl border border-line bg-surface-card shadow-2xl animate-in fade-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4.5">
          <div>
            <h2 className="text-base font-bold text-ink">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup jendela modal"
            className="rounded-lg p-1.5 text-muted hover:bg-stone-100 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
