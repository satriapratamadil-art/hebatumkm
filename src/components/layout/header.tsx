"use client"

import React from "react"
import { Menu, Plus, Wallet } from "lucide-react"
import { Button } from "../ui/button"
import { rupiah } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"
import { navigationItems } from "./sidebar"

interface HeaderProps {
  currentTab: number
  isLanding: boolean
  onToggleMobileMenu: () => void
  onOpenNewTx: () => void
  onToggleLanding: (show: boolean) => void
}

export function Header({
  currentTab,
  isLanding,
  onToggleMobileMenu,
  onOpenNewTx,
  onToggleLanding,
}: HeaderProps) {
  const { transactions } = useHebatStore()

  // Calculate live cash balance from transactions
  const totalIncome = transactions
    .filter((t) => t.kind === "income")
    .reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.kind === "expense")
    .reduce((acc, t) => acc + t.amount, 0)
  const cashBalance = Math.max(0, 15000000 + totalIncome - totalExpense)

  const activeNav = navigationItems.find((n) => n.id === currentTab) || navigationItems[0]

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface-card/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Buka menu navigasi"
          className="lg:hidden p-1.5 rounded-lg border border-line text-ink hover:bg-surface"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-ink leading-tight">
            {isLanding ? "HEBAT UMKM — Naik Kelas Bareng Ahlinya" : activeNav.title}
          </h1>
          <p className="hidden sm:block text-xs text-muted">
            {isLanding
              ? "Platform all-in-one keuangan, simulasi margin, dan pendampingan bisnis UMKM Indonesia."
              : activeNav.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick balance badge */}
        {!isLanding && (
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs">
            <Wallet size={14} className="text-brand shrink-0" />
            <span className="text-muted">Kas Terbuku:</span>
            <span className="font-num font-semibold text-ink">
              {rupiah(cashBalance)}
            </span>
          </div>
        )}

        {isLanding ? (
          <Button
            size="sm"
            onClick={() => onToggleLanding(false)}
            variant="primary"
          >
            Masuk ke Aplikasi
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onOpenNewTx}
            className="flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span className="hidden xs:inline">Catat Transaksi</span>
            <span className="xs:hidden">Catat</span>
          </Button>
        )}
      </div>
    </header>
  )
}
