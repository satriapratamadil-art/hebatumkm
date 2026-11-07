"use client"

import React from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  Scale,
  Store,
  MessageSquareText,
  Activity,
  ScanLine,
  Wallet,
  Globe,
  Info,
  type LucideIcon,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

export interface NavItem {
  id: number
  title: string
  icon: LucideIcon
  desc: string
  tag?: string
}

export const navigationItems: NavItem[] = [
  {
    id: 0,
    title: "Dashboard",
    icon: LayoutDashboard,
    desc: "Ringkasan finansial & transaksi terkini",
  },
  {
    id: 1,
    title: "Hub Konsultan",
    icon: Users,
    desc: "Pendamping FEB & praktisi terverifikasi",
  },
  {
    id: 2,
    title: "Cashflow Simulator",
    icon: Scale,
    desc: "Uji skenario harga, HPP & titik impas (BEP)",
    tag: "Uji Margin",
  },
  {
    id: 3,
    title: "Smart-POS",
    icon: Store,
    desc: "Kasir cepat, stok harian & cetak struk",
  },
  {
    id: 4,
    title: "Chat & Pendamping",
    icon: MessageSquareText,
    desc: "Tanya regulasi, HPP & strategi usaha",
    tag: "AI Demo",
  },
  {
    id: 5,
    title: "Cashflow Tracking",
    icon: Activity,
    desc: "Buku kas mutasi uang masuk & keluar",
  },
  {
    id: 6,
    title: "Expense Smart-Filter",
    icon: ScanLine,
    desc: "Pemisah belanja usaha vs dapur pribadi",
    tag: "Audit Bon",
  },
  {
    id: 7,
    title: "Kantong Virtual",
    icon: Wallet,
    desc: "Alokasi pos operasional, restock & pajak",
  },
]

interface SidebarProps {
  currentTab: number
  onSelectTab: (index: number) => void
  isLanding: boolean
  onToggleLanding: (showLanding: boolean) => void
  onOpenAuth: () => void
  onOpenAbout: () => void
}

export function Sidebar({
  currentTab,
  onSelectTab,
  isLanding,
  onToggleLanding,
  onOpenAuth,
  onOpenAbout,
}: SidebarProps) {
  const { user, resetAll } = useHebatStore()

  return (
    <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-line bg-surface-card h-screen sticky top-0 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-brand/20 bg-brand-soft flex items-center justify-center shrink-0">
              <Image
                src="/hebat-logo.png"
                alt="Logo HEBAT UMKM"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-ink">
                  HEBAT UMKM
                </span>
                <span className="rounded bg-brand/10 px-1.5 py-0.2 text-[9px] font-semibold text-brand">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-muted truncate max-w-[170px]">
                {user?.business || "Kopi & Kudapan Mas Bambang"}
              </p>
            </div>
          </div>

          {/* Landing / Dashboard Mode Switcher */}
          <button
            onClick={() => onToggleLanding(!isLanding)}
            className={cn(
              "mt-3.5 w-full flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-all",
              isLanding
                ? "border-brand bg-brand-soft text-brand font-semibold shadow-xs"
                : "border-line bg-surface text-ink hover:border-brand/40 hover:bg-stone-100",
            )}
          >
            <span className="flex items-center gap-2">
              <Globe size={14} className={isLanding ? "text-brand" : "text-muted"} />
              {isLanding ? "Mode: Halaman Utama Publik" : "Lihat Landing Page Publik"}
            </span>
            <span className="text-[10px] text-muted">
              {isLanding ? "Aktif" : "Buka"}
            </span>
          </button>
        </div>

        {/* Workspace Navigation */}
        <div className="p-3">
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted">
            Workspace Usaha
          </p>
          <nav className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = currentTab === item.id && !isLanding

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id)
                    onToggleLanding(false)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors group",
                    active
                      ? "bg-brand text-white font-semibold shadow-xs"
                      : "text-ink hover:bg-surface hover:text-brand font-medium",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={16}
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-white" : "text-muted group-hover:text-brand",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={cn(
                        "ml-1.5 shrink-0 rounded px-1.5 py-0.2 text-[9px] font-medium leading-none",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-brand-soft text-brand border border-brand/20",
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
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3 border-t border-line space-y-2">
        <div className="flex items-center justify-between px-3 py-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-muted">Vercel Production Mode</span>
          </div>
          <button
            onClick={() => {
              if (confirm("Reset data lokal ke setelan awal demo?")) {
                resetAll()
              }
            }}
            title="Reset data demo"
            className="text-muted hover:text-ink text-[11px] flex items-center gap-1"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        </div>

        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink hover:bg-stone-100 transition-colors"
        >
          <Info size={14} className="text-muted" />
          <span>Tentang HEBAT & Anti-Slop</span>
        </button>

        <div className="flex items-center justify-between rounded-lg bg-surface p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-brand-soft border border-brand/20 flex items-center justify-center font-bold text-xs text-brand shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || "BW"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink truncate">
                {user?.name || "Bambang Wijaya"}
              </p>
              <p className="text-[10px] text-muted truncate">
                {user?.role === "umkm" ? "Pelaku UMKM" : user?.role || "UMKM"}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="text-[11px] font-semibold text-brand hover:underline shrink-0 ml-2"
          >
            Akun
          </button>
        </div>
      </div>
    </aside>
  )
}
