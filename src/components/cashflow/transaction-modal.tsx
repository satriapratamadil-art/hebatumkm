"use client"

import React, { useState } from "react"
import { ModalShell } from "../ui/modal-shell"
import { Button } from "../ui/button"
import { TransactionKind } from "@/lib/types"
import { useHebatStore } from "@/lib/store"

interface TransactionModalProps {
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function TransactionModal({ onClose, onSuccess }: TransactionModalProps) {
  const { addTransaction } = useHebatStore()
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [kind, setKind] = useState<TransactionKind>("income")
  const [category, setCategory] = useState("Penjualan")
  const [notes, setNotes] = useState("")

  const incomeCategories = ["Penjualan", "Pesanan Katering", "Bonus / Pendapatan Lain"]
  const expenseCategories = [
    "Restock Bahan",
    "Utilitas & Operasional",
    "Gaji Karyawan",
    "Sewa Tempat",
    "Cicilan Utang",
    "Lain-lain",
  ]

  const categories = kind === "income" ? incomeCategories : expenseCategories

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount) {
      alert("Harap lengkapi nama transaksi dan nominal.")
      return
    }

    addTransaction({
      name: name.trim(),
      amount: Number(amount),
      kind,
      category,
      notes: notes.trim() || undefined,
    })

    onSuccess(`Transaksi "${name}" berhasil dicatat ke buku kas!`)
    onClose()
  }

  return (
    <ModalShell
      title="Catat Mutasi Kas Baru"
      subtitle="Pencatatan langsung mempengaruhi saldo kas dan laporan pembukuan"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kind Toggle */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            Jenis Mutasi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setKind("income")
                setCategory("Penjualan")
              }}
              className={`rounded-lg border p-2 text-xs font-semibold transition-all ${
                kind === "income"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600"
                  : "border-line bg-surface text-muted hover:bg-stone-100"
              }`}
            >
              + Pemasukan (Kasir / Pesanan)
            </button>
            <button
              type="button"
              onClick={() => {
                setKind("expense")
                setCategory("Restock Bahan")
              }}
              className={`rounded-lg border p-2 text-xs font-semibold transition-all ${
                kind === "expense"
                  ? "border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-600"
                  : "border-line bg-surface text-muted hover:bg-stone-100"
              }`}
            >
              - Pengeluaran (Belanja / Biaya)
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Keterangan Singkat Mutasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Belanja Biji Kopi Arabika 2kg atau Penjualan Siang"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Nominal Rupiah (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 150000"
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink font-bold font-num placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Kategori Pos Kas
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Pembayaran tunai kasir atau transfer BCA"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Simpan ke Buku Kas
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
