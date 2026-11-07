"use client"

import React from "react"
import { CheckCircle2, ExternalLink } from "lucide-react"
import { ModalShell } from "../ui/modal-shell"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface AboutModalProps {
  onClose: () => void
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <ModalShell
      title="Tentang HEBAT UMKM & Kaidah Anti-Slop"
      subtitle="Arsitektur modern, siap hosting Vercel, dan desain berbobot"
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs text-ink leading-relaxed">
        <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
          <Badge variant="brand">Standar Desain & Rekayasa</Badge>
          <h4 className="font-bold text-sm text-ink pt-1">
            Recreated with Anti-Slop Philosophy
          </h4>
          <p className="text-muted text-[11px] leading-relaxed">
            Sesuai panduan dari repository{" "}
            <a
              href="https://github.com/miqdadbadjuber/anti-slop"
              target="_blank"
              rel="noreferrer"
              className="text-brand font-semibold underline inline-flex items-center gap-0.5"
            >
              miqdadbadjuber/anti-slop <ExternalLink size={10} />
            </a>
            , aplikasi ini sengaja menghindari klise AI generik:
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">Tanpa AI Aesthetic Tropes:</strong> Tidak ada gradasi
              ungu/indigo jenuh, tidak ada tombol kapsul mengambang dengan border tipis berpendar,
              dan tidak ada icon-soup tanpa tujuan fungsional.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">Palet Warna Nusantara yang Matang:</strong> Forest
              Emerald Deep Green (`#0F392B`), Natural Ivory Surface (`#FAF9F5`), dan Terracotta
              Ochre Accent (`#D97706`).
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">Bahasa Asli & Membumi (Indonesian Context):</strong> Bebas
              dari buzzword klise seperti &ldquo;Revolutionize your business with next-gen AI&rdquo;.
              Menggunakan bahasa riil UMKM: HPP, Margin Kotor, Uang Dapur vs Kasir, Bon Campuran,
              serta KUR BRI/Mandiri.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink">Siap Hosting di Vercel:</strong> Struktur Next.js 15 App
              Router murni tanpa dependensi proprietary yang terkunci di sandbox, dengan persistensi
              data lokal dan API endpoints yang tangguh.
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-line flex items-center justify-between">
          <span className="text-[10px] text-muted">
            Versi 1.0.0 · Tailwind CSS v4 & Next.js 15
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
