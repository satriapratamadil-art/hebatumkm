"use client"

import React, { useState } from "react"
import {
  ScanLine,
  Camera,
  CheckCircle2,
  Split,
} from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { rupiah } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

interface ExpenseFilterViewProps {
  onNotify: (msg: string) => void
}

interface ParsedItem {
  id: string
  name: string
  amount: number
  isPersonal: boolean
  reason: string
}

export function ExpenseFilterView({ onNotify }: ExpenseFilterViewProps) {
  const { addTransaction } = useHebatStore()
  const [receiptText, setReceiptText] = useState(
    `Beras Premium 5kg - 72000
Minyak Goreng 2L - 34000
Susu Formula Anak 800g - 95000
Kemasan Cup 16oz (100 pcs) - 45000
Popok Bayi Ukuran L - 68000
Gula Pasir 2kg - 35000
Jajan Cokelat Anak - 12000`,
  )

  const [analyzedItems, setAnalyzedItems] = useState<ParsedItem[]>([])
  const [hasAudited, setHasAudited] = useState(false)
  const [receiptFileName, setReceiptFileName] = useState("")

  const personalKeywords = [
    "susu formula",
    "susu anak",
    "popok",
    "pampers",
    "jajan",
    "mainan",
    "skincare",
    "baju anak",
    "rokok pribadi",
    "pulsa pribadi",
    "cokelat anak",
  ]

  const handleAudit = () => {
    if (!receiptText.trim()) {
      alert("Harap masukkan daftar barang belanjaan dari nota.")
      return
    }

    const lines = receiptText.split("\n").filter((l) => l.trim().length > 0)
    const parsed: ParsedItem[] = lines.map((line, idx) => {
      // Simple parser for name and price
      const parts = line.split(/[-:=]/)
      const name = parts[0].trim()
      let amount = 30000
      if (parts[1]) {
        const num = Number(parts[1].replace(/[^0-9]/g, ""))
        if (num > 0) amount = num
      }

      const lower = name.toLowerCase()
      const isPersonal = personalKeywords.some((kw) => lower.includes(kw))

      return {
        id: `item_${idx}`,
        name,
        amount,
        isPersonal,
        reason: isPersonal
          ? "Terdeteksi kebutuhan rumah tangga / keluarga pribadi"
          : "Sesuai untuk operasional atau bahan baku usaha",
      }
    })

    setAnalyzedItems(parsed)
    setHasAudited(true)
    onNotify("Audit nota selesai! Silakan tinjau pemisahan pos di bawah.")
  }

  const businessTotal = analyzedItems
    .filter((i) => !i.isPersonal)
    .reduce((sum, i) => sum + i.amount, 0)

  const personalTotal = analyzedItems
    .filter((i) => i.isPersonal)
    .reduce((sum, i) => sum + i.amount, 0)

  const handleRecordBusinessExpense = () => {
    if (businessTotal <= 0) return

    addTransaction({
      name: "Belanja Bahan Baku (Hasil Audit Smart-Filter)",
      amount: businessTotal,
      kind: "expense",
      category: "Restock Bahan",
      notes: `Dipisahkan dari nota campuran. Barang: ${analyzedItems
        .filter((i) => !i.isPersonal)
        .map((i) => i.name)
        .join(", ")}`,
    })

    onNotify(
      `Berhasil membukukan pos usaha senilai ${rupiah(businessTotal)} ke buku kas!`,
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-line bg-surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-1.5">
            <ScanLine size={13} />
            Pemisah Pengeluaran Usaha & Pribadi
          </Badge>
          <h2 className="text-xl font-bold text-ink">Expense Smart-Filter</h2>
          <p className="text-xs text-muted max-w-xl">
            Solusi untuk belanjaan supermarket yang sering bercampur antara stok toko dan kebutuhan dapur rumah tangga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-stone-100 cursor-pointer">
            <Camera size={14} className="text-brand" />
            <span>Foto / Upload Nota</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setReceiptFileName(file.name)
                  onNotify(`Nota "${file.name}" terunggah dalam simulasi OCR!`)
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12 items-start">
        {/* Input Column (5 Cols) */}
        <div className="xl:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-line pb-2.5">
              Input Bon Belanja / Nota Belanjaan
            </h3>

            {receiptFileName && (
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-center justify-between">
                <span>File: {receiptFileName}</span>
                <span className="text-[10px] font-bold">Simulasi OCR Siap</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Rincian Barang & Nominal (per baris)
              </label>
              <textarea
                rows={9}
                value={receiptText}
                onChange={(e) => {
                  setReceiptText(e.target.value)
                  setHasAudited(false)
                }}
                placeholder="Contoh: Beras 5kg - 72000&#10;Susu Anak - 95000&#10;Cup Kopi - 45000"
                className="w-full rounded-xl border border-line bg-surface p-3 text-xs text-ink font-mono placeholder:text-muted focus:border-brand focus:outline-none leading-relaxed"
              />
              <p className="text-[10px] text-muted mt-1">
                Format: Nama Barang - Nominal Rupiah
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              onClick={handleAudit}
              className="w-full gap-2 text-xs font-bold py-2.5"
            >
              <Split size={14} />
              <span>Audit & Pisahkan Pos Pengeluaran</span>
            </Button>
          </Card>
        </div>

        {/* Results Column (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          {hasAudited ? (
            <>
              {/* Summary 2-Box Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Card className="p-4 bg-emerald-50/70 border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">
                      Pos Beban Usaha
                    </span>
                    <Badge variant="brand">Kas Toko</Badge>
                  </div>
                  <p className="text-xl font-bold font-num text-emerald-800 mt-2">
                    {rupiah(businessTotal)}
                  </p>
                  <p className="text-[10px] text-emerald-950 mt-1">
                    Boleh dibukukan ke biaya bahan / operasional toko
                  </p>
                </Card>

                <Card className="p-4 bg-amber-50/70 border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      Pos Pribadi / Dapur
                    </span>
                    <Badge variant="amber">Dompet Pribadi</Badge>
                  </div>
                  <p className="text-xl font-bold font-num text-brand-gold mt-2">
                    {rupiah(personalTotal)}
                  </p>
                  <p className="text-[10px] text-amber-950 mt-1">
                    Bayar pakai uang pribadi, jangan ambil kas usaha!
                  </p>
                </Card>
              </div>

              {/* Parsed List */}
              <Card className="p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Hasil Pemisahan Barang
                </h4>

                <div className="divide-y divide-line">
                  {analyzedItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-ink truncate">
                            {item.name}
                          </p>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                              item.isPersonal
                                ? "bg-amber-100 text-amber-900"
                                : "bg-emerald-100 text-emerald-900"
                            }`}
                          >
                            {item.isPersonal ? "PRIBADI" : "USAHA"}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted mt-0.5">
                          {item.reason}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-num font-bold text-ink">
                          {rupiah(item.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted">
                    Total Bon:{" "}
                    <strong className="text-ink font-num">
                      {rupiah(businessTotal + personalTotal)}
                    </strong>
                  </p>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleRecordBusinessExpense}
                    className="gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Catat Pos Usaha ({rupiah(businessTotal)}) ke Buku Kas</span>
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center text-xs text-muted border-dashed">
              <ScanLine size={32} className="mx-auto text-muted/60 mb-2" />
              <p className="font-semibold text-ink">Belum ada nota yang diaudit</p>
              <p className="text-[11px] mt-1 max-w-sm mx-auto">
                Ketik atau tempel rincian bon belanjaanmu di kolom sebelah kiri, lalu klik &ldquo;Audit & Pisahkan Pos Pengeluaran&rdquo;.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
