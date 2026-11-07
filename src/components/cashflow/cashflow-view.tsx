"use client"

import React, { useState } from "react"
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Trash2,
} from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { TransactionModal } from "./transaction-modal"
import { rupiah, formatDateTime } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

interface CashflowViewProps {
  onNotify: (msg: string) => void
}

export function CashflowView({ onNotify }: CashflowViewProps) {
  const { transactions, deleteTransaction } = useHebatStore()
  const [search, setSearch] = useState("")
  const [kindFilter, setKindFilter] = useState<"semua" | "income" | "expense">("semua")
  const [categoryFilter, setCategoryFilter] = useState("Semua")
  const [showModal, setShowModal] = useState(false)

  const allCategories = [
    "Semua",
    "Penjualan",
    "Restock Bahan",
    "Utilitas & Operasional",
    "Gaji Karyawan",
    "Sewa Tempat",
    "Lain-lain",
  ]

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase())) ||
      t.category.toLowerCase().includes(search.toLowerCase())

    const matchKind = kindFilter === "semua" || t.kind === kindFilter
    const matchCategory =
      categoryFilter === "Semua" || t.category === categoryFilter

    return matchSearch && matchKind && matchCategory
  })

  const totalIn = filtered
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOut = filtered
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIn - totalOut

  // Export to CSV function
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk diekspor.")
      return
    }

    const headers = ["ID", "Nama Transaksi", "Jenis", "Kategori", "Nominal", "Tanggal", "Catatan"]
    const rows = filtered.map((t) => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      t.kind === "income" ? "Pemasukan" : "Pengeluaran",
      t.category,
      t.amount,
      t.date,
      `"${(t.notes || "").replace(/"/g, '""')}"`,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `buku_kas_hebat_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onNotify("Laporan kas berhasil diunduh dalam format CSV!")
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-line bg-surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-1.5">
            Buku Kas Terverifikasi
          </Badge>
          <h2 className="text-xl font-bold text-ink">Cashflow Tracking & Mutasi Kas</h2>
          <p className="text-xs text-muted">
            Catatan arus kas harian lengkap yang rapi dan siap dilaporkan untuk keperluan audit atau KUR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportCSV}
            className="gap-1.5"
          >
            <Download size={14} />
            <span>Ekspor CSV</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowModal(true)}
            className="gap-1.5"
          >
            <Plus size={14} />
            <span>Tambah Transaksi</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="p-4 bg-emerald-50/50 border-emerald-200">
          <span className="text-[11px] font-semibold text-emerald-900 block">
            Total Pemasukan (Tersaring)
          </span>
          <span className="text-xl font-bold font-num text-emerald-800 mt-1 block">
            +{rupiah(totalIn)}
          </span>
        </Card>

        <Card className="p-4 bg-amber-50/50 border-amber-200">
          <span className="text-[11px] font-semibold text-amber-900 block">
            Total Pengeluaran (Tersaring)
          </span>
          <span className="text-xl font-bold font-num text-brand-gold mt-1 block">
            -{rupiah(totalOut)}
          </span>
        </Card>

        <Card className="p-4 bg-surface border-line">
          <span className="text-[11px] font-semibold text-muted block">
            Selisih Bersih (Arus Kas)
          </span>
          <span
            className={`text-xl font-bold font-num mt-1 block ${
              netBalance >= 0 ? "text-emerald-800" : "text-amber-800"
            }`}
          >
            {netBalance >= 0 ? "+" : ""}
            {rupiah(netBalance)}
          </span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari keterangan, kategori, atau nominal..."
              className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setKindFilter("semua")}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border ${
                kindFilter === "semua"
                  ? "border-brand bg-brand-soft text-brand font-semibold"
                  : "border-line bg-surface text-ink hover:bg-stone-100"
              }`}
            >
              Semua Jenis
            </button>
            <button
              onClick={() => setKindFilter("income")}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border ${
                kindFilter === "income"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                  : "border-line bg-surface text-ink hover:bg-stone-100"
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setKindFilter("expense")}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border ${
                kindFilter === "expense"
                  ? "border-amber-600 bg-amber-50 text-amber-800 font-semibold"
                  : "border-line bg-surface text-ink hover:bg-stone-100"
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[10px] text-muted font-medium shrink-0">Kategori:</span>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded px-2 py-0.5 text-[10px] shrink-0 border transition-colors ${
                categoryFilter === cat
                  ? "border-brand bg-brand text-white font-semibold"
                  : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-line text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Tanggal & Waktu</th>
                <th className="py-3 px-4 font-semibold">Nama Mutasi</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold text-right">Nominal</th>
                <th className="py-3 px-4 font-semibold text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((tx) => {
                const isInc = tx.kind === "income"
                return (
                  <tr key={tx.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 text-muted whitespace-nowrap">
                      {formatDateTime(tx.date)}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-ink">{tx.name}</p>
                      {tx.notes && (
                        <p className="text-[10px] text-muted truncate max-w-sm">
                          {tx.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="rounded bg-surface px-2 py-0.5 text-[10px] font-medium text-ink border border-line">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-num font-bold">
                      <span className={isInc ? "text-emerald-800" : "text-brand-gold"}>
                        {isInc ? "+" : "-"}
                        {rupiah(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus catatan "${tx.name}"?`)) {
                            deleteTransaction(tx.id)
                            onNotify("Catatan transaksi telah dihapus.")
                          }
                        }}
                        title="Hapus transaksi"
                        className="text-muted hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={(msg) => onNotify(msg)}
        />
      )}
    </div>
  )
}
