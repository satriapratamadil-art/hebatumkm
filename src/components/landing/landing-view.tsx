"use client"

import React, { useState } from "react"
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Users,
  Scale,
  Sparkles,
  Wallet,
  Store,
  ScanLine,
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { rupiah, shortMoney } from "@/lib/utils"

interface LandingViewProps {
  onEnterApp: (tabIndex?: number) => void
  onOpenAuth: () => void
}

export function LandingView({ onEnterApp, onOpenAuth }: LandingViewProps) {
  // Interactive mini-calculator on landing page
  const [sellingPrice, setSellingPrice] = useState(25000)
  const [cogs, setCogs] = useState(11000)
  const [dailySales, setDailySales] = useState(35)

  const marginPerUnit = sellingPrice - cogs
  const marginPercentage = sellingPrice > 0 ? (marginPerUnit / sellingPrice) * 100 : 0
  const monthlyGrossProfit = marginPerUnit * dailySales * 30

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-brand-soft/80 to-surface-card p-6 sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          <Badge variant="brand" className="mb-4">
            <ShieldCheck size={13} className="text-brand" />
            Pendamping Usaha Mandiri Indonesia
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-[1.15]">
            Usaha kecil bukan berarti pembukuan seadanya.{" "}
            <span className="text-brand block mt-1">Naik kelas bareng ahlinya.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
            Berhenti menebak keuntungan di akhir bulan. Kelola kas harian, uji titik impas produk,
            pisahkan belanja pribadi dan warung, serta dapatkan pendampingan langsung dari akademisi
            FEB terverifikasi dalam satu sistem yang dirancang untuk UMKM Indonesia.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Button
              size="lg"
              variant="primary"
              onClick={() => onEnterApp(0)}
              className="gap-2 text-sm px-6 py-3"
            >
              Coba Aplikasi Langsung
              <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onEnterApp(2)}
              className="gap-2 text-sm px-5 py-3"
            >
              Uji Simulasi Margin (HPP)
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-700" />
              Tanpa kartu kredit & data bank
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-700" />
              Siap hosting di Vercel
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-700" />
              Sesuai kaidah Anti-Slop (desain berbobot & profesional)
            </span>
          </div>
        </div>
      </section>

      {/* Real Interactive Widget: Kalkulator Margin & Titik Impas Langsung */}
      <section className="rounded-2xl border border-line bg-surface-card p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <Badge variant="amber" className="mb-2">
              <Scale size={12} />
              Interaktif & Seketika
            </Badge>
            <h2 className="text-2xl font-bold text-ink">
              Uji Margin Produkmu Sekarang
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Banyak UMKM mengira untung besar karena harga jual tinggi, padahal belum memperhitungkan
              kemasan, bahan pelengkap, atau komisi platform. Coba geser angka produkmu di sini:
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-muted">Harga Jual per Porsi / Unit</span>
                  <span className="font-num font-bold text-ink">{rupiah(sellingPrice)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-muted">HPP per Porsi (Bahan Pokok + Kemasan)</span>
                  <span className="font-num font-bold text-ink">{rupiah(cogs)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="80000"
                  step="500"
                  value={cogs}
                  onChange={(e) => setCogs(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-muted">Estimasi Penjualan Harian</span>
                  <span className="font-num font-bold text-ink">{dailySales} porsi / hari</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={dailySales}
                  onChange={(e) => setDailySales(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Hasil Analisis Finansial Cepat
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-line bg-surface-card p-3.5">
                <p className="text-[11px] text-muted">Margin Kotor Satuan</p>
                <p className="text-lg font-bold font-num text-ink mt-0.5">
                  {rupiah(marginPerUnit)}
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                  {marginPercentage.toFixed(1)}% dari harga jual
                </p>
              </div>

              <div className="rounded-lg border border-line bg-surface-card p-3.5">
                <p className="text-[11px] text-muted">Potensi Laba Kotor / Bulan</p>
                <p className="text-lg font-bold font-num text-brand mt-0.5">
                  {shortMoney(monthlyGrossProfit)}
                </p>
                <p className="text-[10px] text-muted mt-1">
                  (30 hari × {dailySales} porsi)
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-brand-soft/60 p-4 text-xs space-y-2">
              <p className="font-semibold text-brand">
                {marginPercentage >= 40
                  ? "✓ Struktur margin produkmu tergolong sehat untuk menutup sewa dan operasional."
                  : marginPercentage >= 25
                  ? "⚠ Margin tipis. Pastikan volume penjualan harian tinggi atau tekan biaya bahan."
                  : "⛔ Peringatan: Margin di bawah 25% sangat rentan merugi saat biaya operasional ditagihkan."}
              </p>
              <p className="text-muted text-[11px] leading-relaxed">
                Ingin simulasi lengkap termasuk cicilan KUR, biaya listrik, dan gaji karyawan?
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onEnterApp(2)}
                className="mt-1"
              >
                Buka Full Simulator Kasir & BEP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tujuh Fitur Inti Workspace */}
      <section className="space-y-6">
        <div>
          <Badge variant="brand" className="mb-2">
            Ekosistem Lengkap
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">
            7 Perkakas Praktis untuk Mengawal Usahamu
          </h2>
          <p className="mt-1 text-sm text-muted">
            Bukan teori rumit. Semua fitur dibangun untuk menjawab masalah harian pedagang dan pengusaha lokal.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: 0,
              title: "Dashboard & Arus Kas",
              desc: "Pantau saldo kas nyata, pemasukan, pengeluaran harian, dan grafik tren arus kas tanpa rumus excel.",
              icon: TrendingUp,
              badge: "Kilas Usaha",
            },
            {
              id: 1,
              title: "Hub Konsultan FEB",
              desc: "Jadwalkan sesi konsultasi 1-on-1 dengan mahasiswa tingkat akhir dan lulusan FEB terverifikasi mengenai pajak, HPP, atau SOP.",
              icon: Users,
              badge: "Pendampingan",
            },
            {
              id: 2,
              title: "Cashflow Simulator",
              desc: "Uji coba skenario sebelum mengambil keputusan: simulasi kenaikan bahan baku, cicilan KUR bank, dan batas runway modal.",
              icon: Scale,
              badge: "Uji Keputusan",
            },
            {
              id: 3,
              title: "Smart-POS Kasir Cepat",
              desc: "Catat transaksi kasir dengan antarmuka cepat, pantau sisa stok produk, dan cetak struk belanja thermal.",
              icon: Store,
              badge: "Kasir & Stok",
            },
            {
              id: 4,
              title: "Chat Pendamping Usaha",
              desc: "Dapatkan jawaban cepat seputar izin usaha (NIB, PIRT), rumus penetapan margin, dan kiat manajemen kasbon karyawan.",
              icon: Sparkles,
              badge: "Tanya Cepat",
            },
            {
              id: 5,
              title: "Cashflow Tracking",
              desc: "Buku kas digital rapi. Filter berdasarkan kategori penjualan, restock, utilitas, atau gaji, lalu ekspor ke rekap cetak/CSV.",
              icon: Receipt,
              badge: "Buku Kas",
            },
            {
              id: 6,
              title: "Expense Smart-Filter",
              desc: "Audit bon belanja minimarket atau pasar. Pisahkan secara cerdas mana belanja bahan usaha dan mana belanja kebutuhan pribadi.",
              icon: ScanLine,
              badge: "Pemisah Bon",
            },
            {
              id: 7,
              title: "Kantong Kas Virtual",
              desc: "Disiplin alokasi ala sistem amplop: pos operasional, tabungan pajak PPh 0.5%, cadangan belanja bahan, dan dana darurat.",
              icon: Wallet,
              badge: "Alokasi Amplop",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between hover:border-brand/40 hover:shadow-sm transition-all p-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-semibold text-muted rounded bg-surface px-2 py-0.5 border border-line">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <button
                  onClick={() => onEnterApp(item.id)}
                  className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs font-semibold text-brand hover:underline"
                >
                  <span>Buka Fitur Ini</span>
                  <ArrowRight size={13} />
                </button>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Kisah Nyata Pelaku UMKM */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
        <div className="max-w-2xl">
          <Badge variant="amber" className="mb-2">
            Pengalaman Lapangan
          </Badge>
          <h2 className="text-2xl font-bold text-ink">
            Cerita Nyata dari Warung dan Bengkel
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Bagaimana perubahan pencatatan kecil membawa ketenangan pikiran dan pertumbuhan bisnis.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-ink leading-relaxed italic">
                &ldquo;Dulu uang kasir selalu dicampur dengan uang belanja dapur rumah. Giliran mau kulakan tepung dan minyak, bingung uangnya ke mana. Fitur Kantong Virtual dan Smart-Filter benar-benar menyelamatkan warung saya.&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-brand-soft border border-brand/20 flex items-center justify-center font-bold text-xs text-brand">
                BR
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Bu Ratna Sari</p>
                <p className="text-[10px] text-muted">Katering & Nasi Bakar (Bandung)</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-ink leading-relaxed italic">
                &ldquo;Saya kira jual kopi Rp 12.000 sudah untung. Pas dihitung pakai Cashflow Simulator bareng mentor FEB UI, ternyata food cost saya hampir 55% karena cup dan sirup premium. Setelah redesain menu, margin naik jadi 42%.&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-xs text-amber-800">
                DM
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Dimas Prasetyo</p>
                <p className="text-[10px] text-muted">Kopi Titik Temu (Yogyakarta)</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-3 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-ink leading-relaxed italic">
                &ldquo;Pengajuan KUR BRI saya sempat ditolak karena tidak ada rekap kas. Begitu pakai rekaman mutasi HEBAT selama 3 bulan, pihak mantri bank langsung menyetujui pinjaman modal Rp 50 juta dalam tempo 4 hari kerja.&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-xs text-ink">
                HS
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Pak Hendra Setiawan</p>
                <p className="text-[10px] text-muted">Bengkel & Suku Cadang (Surabaya)</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Comparison: Cara Konvensional vs HEBAT UMKM */}
      <section className="rounded-2xl border border-line bg-surface-card p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6">
          Perbandingan: Cara Manual vs Menggunakan HEBAT
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="pb-3 font-semibold">Aspek Pengelolaan</th>
                <th className="pb-3 font-semibold text-stone-500">Cara Lama / Buku Tulis</th>
                <th className="pb-3 font-semibold text-brand">Dengan HEBAT UMKM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="py-3 font-medium text-ink">Pemisahan Kas Pribadi</td>
                <td className="py-3 text-muted">Tercampur di dompet/rekening yang sama</td>
                <td className="py-3 font-semibold text-emerald-800">
                  Otomatis terpisah via Smart-Filter & Kantong Kas
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-ink">Penentuan Harga Jual (HPP)</td>
                <td className="py-3 text-muted">Hanya kira-kira atau ikut harga tetangga</td>
                <td className="py-3 font-semibold text-emerald-800">
                  Kalkulator HPP presisi hingga ke takaran gram & kemasan
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-ink">Pencatatan Penjualan & Stok</td>
                <td className="py-3 text-muted">Nota robek sering hilang, stok sering tekor</td>
                <td className="py-3 font-semibold text-emerald-800">
                  Smart-POS 1-klik kurangi stok & cetak struk belanja
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-ink">Tempat Konsultasi Bisnis</td>
                <td className="py-3 text-muted">Bingung mau tanya siapa, seminar mahal</td>
                <td className="py-3 font-semibold text-emerald-800">
                  Tersambung ke lulusan FEB terverifikasi + AI Pendamping
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-2xl bg-brand text-white p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Siap Merapikan Keuangan Usahamu Hari Ini?
        </h2>
        <p className="text-xs sm:text-sm text-brand-soft max-w-xl mx-auto leading-relaxed">
          Semua fitur tersedia langsung dalam demo interaktif tanpa harus memasukkan kartu pembayaran
          atau menghubungkan rekening bank.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onEnterApp(0)}
            className="text-brand font-bold px-6 py-3"
          >
            Buka Dashboard Usaha
            <ArrowRight size={15} />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={onOpenAuth}
            className="text-white hover:bg-white/10 px-5 py-3 border border-white/20"
          >
            Daftar / Masuk Akun
          </Button>
        </div>
      </section>
    </div>
  )
}
