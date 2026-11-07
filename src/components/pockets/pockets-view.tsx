"use client"

import React, { useState } from "react"
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
} from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { PocketModal } from "./pocket-modal"
import { ModalShell } from "../ui/modal-shell"
import { rupiah, shortMoney } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"
import { Pocket } from "@/lib/types"

interface PocketsViewProps {
  onNotify: (msg: string) => void
}

export function PocketsView({ onNotify }: PocketsViewProps) {
  const { pockets, updatePocket } = useHebatStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [adjustingPocket, setAdjustingPocket] = useState<{
    pocket: Pocket
    action: "deposit" | "withdraw"
  } | null>(null)
  const [adjustAmount, setAdjustAmount] = useState("")

  const totalAllocated = pockets.reduce((sum, p) => sum + p.allocation, 0)
  const totalTarget = pockets.reduce((sum, p) => sum + p.target, 0)
  const overallPercentage =
    totalTarget > 0 ? Math.round((totalAllocated / totalTarget) * 100) : 0

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustingPocket || !adjustAmount) return

    const num = Number(adjustAmount)
    if (num <= 0) {
      alert("Masukkan nominal yang valid.")
      return
    }

    const delta = adjustingPocket.action === "deposit" ? num : -num
    updatePocket(adjustingPocket.pocket.id, delta)

    onNotify(
      `Berhasil ${
        adjustingPocket.action === "deposit" ? "menyetor" : "menarik"
      } ${rupiah(num)} pada kantong "${adjustingPocket.pocket.name}".`,
    )

    setAdjustingPocket(null)
    setAdjustAmount("")
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-line bg-surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-1.5">
            <Wallet size={13} />
            Metode Penganggaran Amplop (Money Jars)
          </Badge>
          <h2 className="text-xl font-bold text-ink">Kantong Kas Virtual</h2>
          <p className="text-xs text-muted max-w-xl">
            Kunci sukses UMKM adalah membagi uang kas ke dalam pos-pos tujuan agar dana belanja tidak
            terpakai untuk keperluan lain.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="gap-1.5"
        >
          <Plus size={14} />
          <span>Buat Kantong Baru</span>
        </Button>
      </div>

      {/* Overview Card */}
      <Card className="p-5 bg-gradient-to-r from-surface to-brand-soft/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-muted block">
              Total Dana Teralokasi di Semua Kantong
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-num text-brand">
                {rupiah(totalAllocated)}
              </span>
              <span className="text-xs text-muted font-num">
                dari target {shortMoney(totalTarget)}
              </span>
            </div>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs font-semibold text-ink">
              Ketercapaian Alokasi: {overallPercentage}%
            </span>
            <div className="w-48 h-2.5 rounded-full bg-surface-card border border-line overflow-hidden mt-1.5">
              <div
                className="h-full bg-brand rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, overallPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Pockets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pockets.map((pocket) => {
          const pct = Math.min(
            100,
            Math.round((pocket.allocation / (pocket.target || 1)) * 100),
          )
          const isComplete = pocket.allocation >= pocket.target

          return (
            <Card
              key={pocket.id}
              className="p-5 flex flex-col justify-between hover:border-brand/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={pocket.type === "Pajak" ? "amber" : "brand"}>
                    {pocket.type}
                  </Badge>
                  {isComplete && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 size={12} /> Target Penuh
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-ink">{pocket.name}</h3>
                {pocket.notes && (
                  <p className="text-[11px] text-muted mt-1 leading-relaxed line-clamp-2">
                    {pocket.notes}
                  </p>
                )}

                {/* Progress */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-num">
                    <span className="font-bold text-ink">
                      {rupiah(pocket.allocation)}
                    </span>
                    <span className="text-muted text-[11px]">
                      Target {shortMoney(pocket.target)} ({pct}%)
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-surface border border-line overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isComplete ? "bg-emerald-600" : "bg-brand"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-line grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setAdjustingPocket({ pocket, action: "deposit" })
                  }
                  className="gap-1 text-[11px] py-1.5"
                >
                  <ArrowUpRight size={13} className="text-emerald-700" />
                  <span>Setor Kas</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setAdjustingPocket({ pocket, action: "withdraw" })
                  }
                  className="gap-1 text-[11px] py-1.5"
                >
                  <ArrowDownLeft size={13} className="text-amber-700" />
                  <span>Tarik Dana</span>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add Pocket Modal */}
      {showAddModal && (
        <PocketModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(msg) => onNotify(msg)}
        />
      )}

      {/* Deposit/Withdraw Modal */}
      {adjustingPocket && (
        <ModalShell
          title={
            adjustingPocket.action === "deposit"
              ? `Setor Saldo ke "${adjustingPocket.pocket.name}"`
              : `Tarik Dana dari "${adjustingPocket.pocket.name}"`
          }
          subtitle={`Saldo kantong saat ini: ${rupiah(
            adjustingPocket.pocket.allocation,
          )}`}
          onClose={() => setAdjustingPocket(null)}
          maxWidth="max-w-sm"
        >
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Nominal Rupiah (Rp)
              </label>
              <input
                type="number"
                min="1"
                required
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="Contoh: 250000"
                className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink font-num font-bold focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAdjustingPocket(null)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Konfirmasi
              </Button>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  )
}
