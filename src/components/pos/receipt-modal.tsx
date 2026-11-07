"use client"

import React from "react"
import { Printer, CheckCircle2 } from "lucide-react"
import { ModalShell } from "../ui/modal-shell"
import { Button } from "../ui/button"
import { rupiah, formatDateTime } from "@/lib/utils"
import { Product } from "@/lib/types"

interface ReceiptModalProps {
  orderNumber: string
  items: { product: Product; quantity: number }[]
  total: number
  discount: number
  paymentMethod: string
  cashReceived: number
  change: number
  businessName: string
  onClose: () => void
}

export function ReceiptModal({
  orderNumber,
  items,
  total,
  discount,
  paymentMethod,
  cashReceived,
  change,
  businessName,
  onClose,
}: ReceiptModalProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <ModalShell
      title="Struk Pembayaran Berhasil"
      subtitle={`No. Transaksi: ${orderNumber}`}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Success Alert */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Transaksi tercatat di buku kas dan stok produk telah diperbarui.</span>
        </div>

        {/* Thermal Receipt Visual Paper */}
        <div
          id="receipt-paper"
          className="rounded-xl border border-line bg-surface p-6 font-mono text-xs text-ink space-y-4 shadow-inner"
        >
          {/* Header */}
          <div className="text-center border-b border-dashed border-stone-300 pb-3 space-y-1">
            <h3 className="font-bold text-sm tracking-wider uppercase">{businessName}</h3>
            <p className="text-[10px] text-muted">Solusi Kasir Digital HEBAT UMKM</p>
            <p className="text-[10px] text-muted">{formatDateTime(new Date().toISOString())}</p>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2 border-b border-dashed border-stone-300 pb-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-[11px]">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold truncate">{item.product.name}</p>
                  <p className="text-muted text-[10px]">
                    {item.quantity} × {rupiah(item.product.price)}
                  </p>
                </div>
                <span className="font-bold shrink-0">
                  {rupiah(item.quantity * item.product.price)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
            <div className="flex justify-between text-muted">
              <span>Subtotal:</span>
              <span>{rupiah(total + discount)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Diskon:</span>
                <span>-{rupiah(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold pt-1">
              <span>TOTAL AKHIR:</span>
              <span className="text-brand">{rupiah(total)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-1 text-[10px] text-muted">
            <div className="flex justify-between">
              <span>Metode Bayar:</span>
              <span className="font-semibold text-ink uppercase">{paymentMethod}</span>
            </div>
            {paymentMethod === "tunai" && (
              <>
                <div className="flex justify-between">
                  <span>Uang Diterima:</span>
                  <span className="text-ink">{rupiah(cashReceived)}</span>
                </div>
                <div className="flex justify-between font-semibold text-ink">
                  <span>Kembalian:</span>
                  <span>{rupiah(change)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[10px] text-muted border-t border-dashed border-stone-300">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p className="text-[9px] mt-0.5">Dikelola rapi bersama HEBAT UMKM</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer size={14} />
            Cetak Nota
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Selesai
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
