import React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HEBAT UMKM! — Naik Kelas Bareng Ahlinya",
  description:
    "Kelola keuangan usaha, uji simulasi margin & titik impas (BEP), kasir Smart-POS, dan tumbuh bersama pendamping bisnis FEB terverifikasi.",
  icons: {
    icon: "/hebat-logo.png",
    apple: "/hebat-logo.png",
  },
  openGraph: {
    title: "HEBAT UMKM! — Naik Kelas Bareng Ahlinya",
    description:
      "Platform manajemen keuangan all-in-one dan pendampingan bisnis untuk UMKM Indonesia.",
    images: ["/hebat-logo.png"],
    locale: "id_ID",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-surface text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-1.5 focus:text-xs focus:text-white"
        >
          Lewati ke Konten Utama
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  )
}
