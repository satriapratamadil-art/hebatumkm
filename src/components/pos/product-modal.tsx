"use client"

import React, { useState } from "react"
import { ModalShell } from "../ui/modal-shell"
import { Button } from "../ui/button"
import { Product } from "@/lib/types"
import { useHebatStore } from "@/lib/store"

interface ProductModalProps {
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function ProductModal({ onClose, onSuccess }: ProductModalProps) {
  const { addProduct } = useHebatStore()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [cost, setCost] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState<Product["category"]>("Makanan")
  const [sku, setSku] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !cost || !stock) {
      alert("Harap lengkapi semua kolom wajib.")
      return
    }

    const newProd = addProduct({
      name: name.trim(),
      price: Number(price),
      cost: Number(cost),
      stock: Number(stock),
      category,
      sku: sku.trim() || undefined,
    })

    onSuccess(`Produk "${newProd.name}" berhasil ditambahkan ke katalog kasir!`)
    onClose()
  }

  return (
    <ModalShell
      title="Tambah Produk Baru ke POS"
      subtitle="Data produk langsung tersinkronisasi ke katalog kasir dan stok harian"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Nama Produk / Menu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Es Kopi Susu Pandan"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Kategori Produk
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Product["category"])}
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
            >
              <option value="Minuman">Minuman</option>
              <option value="Makanan">Makanan</option>
              <option value="Camilan">Camilan</option>
              <option value="Retail / Lainnya">Retail / Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Kode SKU / Barcode (Opsional)
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Contoh: KOP-05"
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Harga Jual ke Pelanggan <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 18000"
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none font-num"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              HPP Satuan (Modal Bahan) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Contoh: 7500"
              className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none font-num"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Jumlah Stok Awal <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Contoh: 50"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none font-num"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Simpan Produk
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
