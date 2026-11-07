"use client"

import React from "react"
import Image from "next/image"
import { X, Globe, Info } from "lucide-react"
import { navigationItems } from "./sidebar"
import { cn } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentTab: number
  onSelectTab: (index: number) => void
  isLanding: boolean
  onToggleLanding: (show: boolean) => void
  onOpenAuth: () => void
  onOpenAbout: () => void
}

export function MobileDrawer({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  isLanding,
  onToggleLanding,
  onOpenAuth,
  onOpenAbout,
}: MobileDrawerProps) {
  const { user, resetAll } = useHebatStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-72 max-w-[85vw] bg-surface-card h-full flex flex-col justify-between border-r border-line p-4 shadow-xl z-10">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-brand/20 bg-brand-soft flex items-center justify-center shrink-0">
                <Image
                  src="/hebat-logo.png"
                  alt="Logo HEBAT UMKM"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-sm text-ink">HEBAT UMKM</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup menu"
              className="p-1.5 rounded-lg text-muted hover:bg-surface"
            >
              <X size={18} />
            </button>
          </div>

          {/* Toggle Landing / App */}
          <button
            onClick={() => {
              onToggleLanding(!isLanding)
              onClose()
            }}
            className="my-3 w-full flex items-center justify-between rounded-lg border border-line bg-surface p-2.5 text-xs font-medium text-ink"
          >
            <span className="flex items-center gap-2">
              <Globe size={14} className="text-brand" />
              {isLanding ? "Buka Dashboard Usaha" : "Lihat Landing Page"}
            </span>
          </button>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = currentTab === item.id && !isLanding
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id)
                    onToggleLanding(false)
                    onClose()
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                    active
                      ? "bg-brand text-white font-semibold"
                      : "text-ink hover:bg-surface font-medium",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.2 text-[9px]",
                        active ? "bg-white/20 text-white" : "bg-brand-soft text-brand",
                      )}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-line space-y-2">
          <button
            onClick={() => {
              onOpenAbout()
              onClose()
            }}
            className="w-full flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink"
          >
            <Info size={14} className="text-muted" />
            <span>Tentang HEBAT & Anti-Slop</span>
          </button>
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface text-xs">
            <span className="truncate max-w-[140px] font-medium text-ink">
              {user?.name || "Bambang Wijaya"}
            </span>
            <button
              onClick={() => {
                onOpenAuth()
                onClose()
              }}
              className="text-brand font-semibold text-[11px]"
            >
              Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
