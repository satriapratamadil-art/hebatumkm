"use client"

import React, { useState } from "react"
import {
  Search,
  Plus,
  Minus,
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
} from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ProductModal } from "./product-modal"
import { ReceiptModal } from "./receipt-modal"
import { Product } from "@/lib/types"
import { rupiah } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

interface PosViewProps {
  onNotify: (msg: string) => void
}

export function PosView({ onNotify }: PosViewProps) {
  const { products, adjustStock, addTransaction, user } = useHebatStore()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [discountPct, setDiscountPct] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"tunai" | "qris" | "transfer">("tunai")
  const [cashInput, setCashInput] = useState("")

  // Modals
  const [showProductModal, setShowProductModal] = useState(false)
  const [receiptData, setReceiptData] = useState<{
    orderNumber: string
    items: { product: Product; quantity: number }[]
    total: number
    discount: number
    paymentMethod: string
    cashReceived: number
    change: number
  } | null>(null)

  const categories = ["Semua", "Minuman", "Makanan", "Camilan", "Retail / Lainnya"]

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    const matchCategory =
      selectedCategory === "Semua" || p.category === selectedCategory
    return matchSearch && matchCategory
  })

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      onNotify(`Stok produk "${product.name}" habis.`)
      return
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          onNotify(`Jumlah melebihi stok yang tersedia (${product.stock}).`)
          return prev
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            if (newQty > item.product.stock) {
              onNotify(`Jumlah melebihi stok tersedia (${item.product.stock}).`)
              return item
            }
            return { ...item, quantity: newQty }
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setCashInput("")
  }

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const discountAmount = Math.round((subtotal * discountPct) / 100)
  const total = Math.max(0, subtotal - discountAmount)
  const cashReceived = Number(cashInput) || total
  const change = Math.max(0, cashReceived - total)

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong.")
      return
    }

    if (paymentMethod === "tunai" && cashReceived < total) {
      alert("Nominal uang yang diterima kurang dari total belanja.")
      return
    }

    const orderNo = `INV-${Date.now().toString().slice(-6)}`

    // 1. Deduct stocks
    cart.forEach((item) => {
      adjustStock(item.product.id, item.quantity)
    })

    // 2. Add transaction to store
    addTransaction({
      name: `Penjualan Kasir #${orderNo}`,
      amount: total,
      kind: "income",
      category: "Penjualan",
      notes: `${cart.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")} via ${paymentMethod.toUpperCase()}`,
    })

    // 3. Show receipt modal
    setReceiptData({
      orderNumber: orderNo,
      items: [...cart],
      total,
      discount: discountAmount,
      paymentMethod,
      cashReceived: paymentMethod === "tunai" ? cashReceived : total,
      change: paymentMethod === "tunai" ? change : 0,
    })

    // 4. Clear cart
    clearCart()
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="rounded-xl border border-line bg-surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-1.5">
            <Receipt size={13} />
            Kasir Digital Cepat
          </Badge>
          <h2 className="text-xl font-bold text-ink">Smart-POS & Stok Harian</h2>
          <p className="text-xs text-muted">
            Pencatatan kasir instan dengan pengurangan stok otomatis dan cetak struk thermal.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowProductModal(true)}
          className="gap-1.5"
        >
          <Plus size={14} />
          <span>Tambah Produk Baru</span>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-12 items-start">
        {/* Products Column (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk atau kode SKU..."
                className="w-full rounded-lg border border-line bg-surface-card pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? "bg-brand text-white font-semibold"
                      : "border border-line bg-surface-card text-ink hover:bg-surface"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((item) => item.product.id === p.id)
              const inCartQty = inCartItem?.quantity || 0

              return (
                <Card
                  key={p.id}
                  className="p-4 flex flex-col justify-between hover:border-brand/40 transition-all cursor-pointer group"
                  onClick={() => addToCart(p)}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="text-[10px] font-semibold text-muted rounded bg-surface px-1.5 py-0.5 border border-line">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${
                          p.stock > 10
                            ? "bg-emerald-50 text-emerald-800"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-800"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        Stok: {p.stock}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-ink group-hover:text-brand line-clamp-1">
                      {p.name}
                    </h4>
                    {p.sku && (
                      <p className="text-[10px] font-mono text-muted">{p.sku}</p>
                    )}
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-line flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold font-num text-ink">
                        {rupiah(p.price)}
                      </p>
                      <p className="text-[9px] text-muted font-num">
                        HPP: {rupiah(p.cost)}
                      </p>
                    </div>

                    <div className="flex items-center">
                      {inCartQty > 0 ? (
                        <span className="h-6 px-2 rounded-md bg-brand text-white font-bold text-xs flex items-center justify-center">
                          {inCartQty}
                        </span>
                      ) : (
                        <span className="h-6 w-6 rounded-md bg-surface text-ink border border-line group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-colors">
                          <Plus size={13} />
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full rounded-xl border border-line bg-surface p-10 text-center text-xs text-muted">
                Tidak ada produk yang cocok dengan pencarian &ldquo;{search}&rdquo;. Klik tombol &ldquo;Tambah Produk Baru&rdquo; untuk mendaftarkan menu baru.
              </div>
            )}
          </div>
        </div>

        {/* Cart & Checkout Panel (5 Cols) */}
        <div className="xl:col-span-5">
          <Card className="p-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-brand" />
                <h3 className="text-sm font-bold text-ink">Keranjang Kasir</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-line pr-1 space-y-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="py-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink truncate">{item.product.name}</p>
                    <p className="text-[11px] font-num text-muted">
                      {rupiah(item.product.price)} / unit
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="h-6 w-6 rounded border border-line bg-surface flex items-center justify-center text-ink hover:bg-stone-200"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="font-bold font-num text-ink px-1 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="h-6 w-6 rounded border border-line bg-surface flex items-center justify-center text-ink hover:bg-stone-200"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[65px]">
                    <p className="font-bold font-num text-ink">
                      {rupiah(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-8 text-center text-xs text-muted">
                  Keranjang kasir masih kosong. Klik menu produk di sebelah kiri untuk menambahkan.
                </div>
              )}
            </div>

            {/* Discount selector */}
            {cart.length > 0 && (
              <div className="pt-2 border-t border-line">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted font-medium">Beri Diskon Penjualan:</span>
                  <div className="flex items-center gap-1">
                    {[0, 5, 10].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setDiscountPct(pct)}
                        className={`rounded px-2 py-0.5 text-[11px] font-medium border ${
                          discountPct === pct
                            ? "border-brand bg-brand-soft text-brand font-bold"
                            : "border-line bg-surface text-muted"
                        }`}
                      >
                        {pct === 0 ? "Tanpa Diskon" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Subtotal & Total */}
            <div className="rounded-lg border border-line bg-surface p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal:</span>
                <span className="font-num">{rupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Potongan Diskon ({discountPct}%):</span>
                  <span className="font-num">-{rupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-line/60 text-ink">
                <span>Total Tagihan:</span>
                <span className="text-brand font-num text-base">{rupiah(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            {cart.length > 0 && (
              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-muted block mb-1.5">
                    Metode Pembayaran Pelanggan:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("tunai")}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs transition-all ${
                        paymentMethod === "tunai"
                          ? "border-brand bg-brand-soft text-brand font-bold ring-1 ring-brand"
                          : "border-line bg-surface text-ink hover:bg-stone-100"
                      }`}
                    >
                      <Banknote size={16} />
                      <span className="text-[11px] mt-1">Tunai (Cash)</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("qris")}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs transition-all ${
                        paymentMethod === "qris"
                          ? "border-brand bg-brand-soft text-brand font-bold ring-1 ring-brand"
                          : "border-line bg-surface text-ink hover:bg-stone-100"
                      }`}
                    >
                      <QrCode size={16} />
                      <span className="text-[11px] mt-1">QRIS Statis</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("transfer")}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs transition-all ${
                        paymentMethod === "transfer"
                          ? "border-brand bg-brand-soft text-brand font-bold ring-1 ring-brand"
                          : "border-line bg-surface text-ink hover:bg-stone-100"
                      }`}
                    >
                      <CreditCard size={16} />
                      <span className="text-[11px] mt-1">Transfer</span>
                    </button>
                  </div>
                </div>

                {/* Cash Input & Quick Pills */}
                {paymentMethod === "tunai" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Uang Diterima:</span>
                      <input
                        type="number"
                        value={cashInput}
                        onChange={(e) => setCashInput(e.target.value)}
                        placeholder={String(total)}
                        className="w-32 rounded border border-line bg-surface-card p-1 text-right text-xs font-bold font-num text-ink focus:border-brand focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => setCashInput(String(total))}
                        className="rounded px-2 py-0.5 text-[10px] border border-line bg-surface hover:bg-stone-200"
                      >
                        Uang Pas
                      </button>
                      <button
                        onClick={() => setCashInput("50000")}
                        className="rounded px-2 py-0.5 text-[10px] border border-line bg-surface hover:bg-stone-200"
                      >
                        50 rb
                      </button>
                      <button
                        onClick={() => setCashInput("100000")}
                        className="rounded px-2 py-0.5 text-[10px] border border-line bg-surface hover:bg-stone-200"
                      >
                        100 rb
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold pt-1">
                      <span className="text-muted">Kembalian:</span>
                      <span className="font-num text-ink">{rupiah(change)}</span>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleCheckout}
                  className="w-full py-2.5 text-xs font-bold gap-2"
                >
                  <CheckCircle2 size={15} />
                  <span>Selesaikan & Cetak Struk</span>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          onSuccess={(msg) => onNotify(msg)}
        />
      )}

      {receiptData && (
        <ReceiptModal
          orderNumber={receiptData.orderNumber}
          items={receiptData.items}
          total={receiptData.total}
          discount={receiptData.discount}
          paymentMethod={receiptData.paymentMethod}
          cashReceived={receiptData.cashReceived}
          change={receiptData.change}
          businessName={user?.business || "Kopi & Kudapan Mas Bambang"}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  )
}
