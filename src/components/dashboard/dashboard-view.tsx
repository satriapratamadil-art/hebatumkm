"use client"

import React, { useState } from "react"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Store,
  Scale,
  ScanLine,
  Plus,
  ArrowRight,
  Percent,
} from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { CashChart } from "./cash-chart"
import { useHebatStore } from "@/lib/store"
import { rupiah, shortMoney, formatDate } from "@/lib/utils"

interface DashboardViewProps {
  onNavigateTab: (tabIndex: number) => void
  onOpenNewTx: () => void
}

export function DashboardView({
  onNavigateTab,
  onOpenNewTx,
}: DashboardViewProps) {
  const { transactions, pockets, user } = useHebatStore()
  const [filterPeriod, setFilterPeriod] = useState<"semua" | "income" | "expense">("semua")

  const totalIncome = transactions
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const startingBalance = 15000000
  const netCash = Math.max(0, startingBalance + totalIncome - totalExpense)
  const netProfit = totalIncome - totalExpense
  const netMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

  const filteredTxs = transactions.filter((t) => {
    if (filterPeriod === "semua") return true
    return t.kind === filterPeriod
  })

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="rounded-xl border border-line bg-surface-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand">Buku Kas Harian Aktif</Badge>
            <span className="text-xs text-muted">
              • Terhubung ke lokal browser
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-ink mt-1.5">
            Selamat datang, {user?.name || "Bambang Wijaya"}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Ringkasan pembukuan usaha{" "}
            <span className="font-semibold text-ink">
              {user?.business || "Kopi & Kudapan Mas Bambang"}
            </span>{" "}
            per hari ini.
          </p>
        </div>

        {/* Quick Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onNavigateTab(3)}
            className="gap-1.5"
          >
            <Store size={14} />
            <span>Kasir POS</span>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onNavigateTab(2)}
            className="gap-1.5"
          >
            <Scale size={14} />
            <span>Uji HPP</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenNewTx}
            className="gap-1.5"
          >
            <Plus size={14} />
            <span>Catat Transaksi</span>
          </Button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted">
              Saldo Kas Tersedia
            </span>
            <div className="p-1.5 rounded-md bg-brand-soft text-brand">
              <Wallet size={14} />
            </div>
          </div>
          <p className="text-xl font-bold font-num text-ink mt-2">
            {rupiah(netCash)}
          </p>
          <p className="text-[10px] text-muted mt-1">
            Termasuk modal awal & saldo berjalan
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted">
              Pemasukan Kasir
            </span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-800">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <p className="text-xl font-bold font-num text-emerald-800 mt-2">
            +{rupiah(totalIncome)}
          </p>
          <p className="text-[10px] text-muted mt-1">
            {transactions.filter((t) => t.kind === "income").length} transaksi tercatat
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted">
              Pengeluaran & Bahan
            </span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-800">
              <ArrowDownLeft size={14} />
            </div>
          </div>
          <p className="text-xl font-bold font-num text-brand-gold mt-2">
            -{rupiah(totalExpense)}
          </p>
          <p className="text-[10px] text-muted mt-1">
            Restock, utilitas, & operasional
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted">
              Margin Bersih Operasional
            </span>
            <div className="p-1.5 rounded-md bg-stone-100 text-stone-700">
              <Percent size={14} />
            </div>
          </div>
          <p className="text-xl font-bold font-num text-ink mt-2">
            {netMargin.toFixed(1)}%
          </p>
          <p className="text-[10px] text-muted mt-1">
            {netProfit >= 0 ? "Surplus kas usaha" : "Defisit sementara"} (
            {shortMoney(netProfit)})
          </p>
        </Card>
      </div>

      {/* Main Grid: Chart & Kantong Usaha */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cashflow Chart (2 Cols) */}
        <Card className="lg:col-span-2 p-5">
          <CashChart transactions={transactions} />
        </Card>

        {/* Kantong Virtual Mini Widget (1 Col) */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h3 className="text-sm font-bold text-ink">Kantong Usaha</h3>
                <p className="text-[11px] text-muted">Alokasi pos dana aktif</p>
              </div>
              <button
                onClick={() => onNavigateTab(7)}
                className="text-[11px] font-semibold text-brand hover:underline flex items-center gap-1"
              >
                <span>Kelola</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {pockets.slice(0, 4).map((p) => {
                const percentage = Math.min(
                  100,
                  Math.round((p.allocation / (p.target || 1)) * 100),
                )
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-ink truncate max-w-[130px]">
                        {p.name}
                      </span>
                      <span className="font-num text-muted text-[11px]">
                        {rupiah(p.allocation)} / {shortMoney(p.target)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface border border-line/60">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-line">
            <button
              onClick={() => onNavigateTab(6)}
              className="w-full flex items-center justify-between rounded-lg border border-line bg-surface p-2.5 text-xs text-ink hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ScanLine size={15} className="text-brand" />
                <span className="font-medium">Audit Bon Belanja Hari Ini</span>
              </div>
              <span className="text-[10px] text-muted">Filter</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Section */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-line">
          <div>
            <h3 className="text-sm font-bold text-ink">Buku Kas: Mutasi Terakhir</h3>
            <p className="text-[11px] text-muted">
              Menampilkan {Math.min(filteredTxs.length, 6)} transaksi terbaru
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5 text-xs">
            <button
              onClick={() => setFilterPeriod("semua")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                filterPeriod === "semua"
                  ? "bg-surface-card text-ink font-semibold shadow-2xs"
                  : "text-muted"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterPeriod("income")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                filterPeriod === "income"
                  ? "bg-surface-card text-emerald-800 font-semibold shadow-2xs"
                  : "text-muted"
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setFilterPeriod("expense")}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                filterPeriod === "expense"
                  ? "bg-surface-card text-brand-gold font-semibold shadow-2xs"
                  : "text-muted"
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        <div className="divide-y divide-line">
          {filteredTxs.slice(0, 6).map((tx) => {
            const isInc = tx.kind === "income"
            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isInc
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {isInc ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink truncate">{tx.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="rounded bg-surface px-1.5 py-0.2 border border-line">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-num font-bold ${
                      isInc ? "text-emerald-800" : "text-brand-gold"
                    }`}
                  >
                    {isInc ? "+" : "-"}
                    {rupiah(tx.amount)}
                  </p>
                  {tx.notes && (
                    <p className="text-[10px] text-muted truncate max-w-[140px]">
                      {tx.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {filteredTxs.length === 0 && (
            <div className="py-8 text-center text-xs text-muted">
              Belum ada mutasi untuk kategori ini.
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-line flex justify-end">
          <button
            onClick={() => onNavigateTab(5)}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            <span>Buka Seluruh Riwayat Buku Kas ({transactions.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </Card>
    </div>
  )
}
