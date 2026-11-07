"use client"

import React, { useState } from "react"
import { ModalShell } from "../ui/modal-shell"
import { Button } from "../ui/button"
import { useHebatStore } from "@/lib/store"

interface AuthModalProps {
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { user, setUser } = useHebatStore()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState(user?.name || "")
  const [business, setBusiness] = useState(user?.business || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      alert("Harap masukkan email.")
      return
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || (email.split("@")[0] ?? "Pengusaha Hebat"),
      business: business || "Usaha Mandiri Sukses",
      email,
      role: "umkm" as const,
    }

    setUser(newUser)
    onSuccess(
      isLogin
        ? `Selamat datang kembali, ${newUser.name}!`
        : `Akun usaha "${newUser.business}" berhasil didaftarkan!`,
    )
    onClose()
  }

  const handleLogout = () => {
    setUser(null)
    onSuccess("Anda telah keluar dari akun.")
    onClose()
  }

  return (
    <ModalShell
      title={isLogin ? "Masuk ke Akun HEBAT" : "Daftar Akun Usaha Baru"}
      subtitle="Kelola data kasir, produk, dan laporan keuangan dalam satu akun"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Mode */}
        <div className="flex rounded-lg border border-line bg-surface p-1 text-xs">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-md py-1.5 font-semibold transition-colors ${
              isLogin
                ? "bg-surface-card text-ink shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-md py-1.5 font-semibold transition-colors ${
              !isLogin
                ? "bg-surface-card text-ink shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Nama Lengkap Pemilik Usaha
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Siti Rahayu"
                className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Nama Usaha / Toko
              </label>
              <input
                type="text"
                required
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Contoh: Dapur Kue Rahayu"
                className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Alamat Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Kata Sandi
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-line">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-600 hover:underline"
            >
              Keluar Akun
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {isLogin ? "Masuk Sekarang" : "Daftar Akun"}
            </Button>
          </div>
        </div>
      </form>
    </ModalShell>
  )
}
