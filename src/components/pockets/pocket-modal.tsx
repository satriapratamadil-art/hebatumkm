"use client"

import React, { useState } from "react"
import { ModalShell } from "../ui/modal-shell"
import { Button } from "../ui/button"
import { Pocket } from "@/lib/types"
import { useHebatStore } from "@/lib/store"

interface PocketModalProps {
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function PocketModal({ onClose, onSuccess }: PocketModalProps) {
  const { addPocket } = useHebatStore()
  const [name, setName] = useState("")
  const [type, setType] = useState<Pocket["type"]>("Bisnis")
  const [allocation, setAllocation] = useState("")
  const [target, setTarget] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !target) {
      alert("Harap lengkapi nama kantong dan target alokasi.")
      return
    }

    addPocket({
      name: name.trim(),
      type,
      allocation: Number(allocation) || 0,
      target: Number(target),
      notes: notes.trim() || undefined,
    })

    onSuccess(`Kantong "${name}" berhasil dibuat!`)
    onClose()
  }

  return (
    <ModalShell
      title="Buat Kantong Kas Virtual Baru"
      subtitle="Disiplin keuangan dengan membagi alokasi dana ke dalam pos terencana"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Nama Kantong <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Tabungan THR Karyawan atau Mesin Kopi Baru"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Jenis Pos
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Pocket["type"])}
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
            >
              <option value="Bisnis">Bisnis & Operasional</option>
              <option value="Pajak">Kewajiban Pajak</option>
              <option value="Darurat">Dana Darurat</option>
              <option value="Pengembangan">Pengembangan Usaha</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Target Nominal (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Contoh: 5000000"
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink font-bold font-num placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Alokasi Saldo Awal (Rp)
          </label>
          <input
            type="number"
            min="0"
            value={allocation}
            onChange={(e) => setAllocation(e.target.value)}
            placeholder="Contoh: 500000 (boleh 0)"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink font-num placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Tujuan / Catatan Pos
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Disisihkan tiap hari Jumat dari kas masuk"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Simpan Kantong
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
