# HEBAT UMKM! — Naik Kelas Bareng Ahlinya

Platform manajemen keuangan, simulasi margin & titik impas (BEP), kasir Smart-POS, dan pendampingan bisnis bersama lulusan & mahasiswa FEB terverifikasi untuk UMKM Indonesia.

Proyek ini telah di-recreate dan di-convert secara penuh dari project Figma sebelumnya menjadi **website modern Next.js 15 yang 100% siap di-hosting di Vercel**, dengan penerapan kaidah desain profesional dari [anti-slop](https://github.com/miqdadbadjuber/anti-slop).

---

## 🚀 Panduan Hosting di Vercel

Proyek ini menggunakan struktur standar Next.js App Router (React 19, Tailwind CSS v4, TypeScript) tanpa dependensi proprietary, sehingga dapat langsung di-deploy ke Vercel dengan **0 error konfigurasi**:

### Cara 1: Deploy Melalui GitHub (Rekomendasi)
1. Buat repository baru di [GitHub](https://github.com).
2. Push seluruh folder ini ke repository GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: recreate hebat umkm with anti-slop design and vercel readiness"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com) -> Klik **"Add New Project"** -> Pilih repository GitHub Anda.
4. Vercel akan otomatis mendeteksi framework **Next.js**. Klik tombol **"Deploy"**.
5. Selesai! Website Anda langsung aktif dengan domain `.vercel.app`.

### Cara 2: Deploy Melalui Vercel CLI
Jalankan perintah berikut di terminal:
```bash
npx vercel
```
Ikuti petunjuk di terminal untuk menghubungkan akun Vercel Anda.

---

## 🛠️ Menjalankan di Komputer Lokal

Jika ingin menjalankan secara lokal untuk pengembangan:
```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev

# 3. Buka browser di http://localhost:3000
```

---

## 🌟 7 Fitur Workspace yang Tersedia

1. **Dashboard & Kilas Finansial**: Saldo kas bersih berjalan, total pemasukan vs pengeluaran, margin laba bersih, grafik arus kas interaktif (7 hari / 6 minggu), dan ringkasan mutasi terbaru.
2. **Hub Konsultan FEB**: Temukan pendamping bisnis dari alumni dan mahasiswa tingkat akhir Fakultas Ekonomi & Bisnis (UI, UGM, Unpad, Unair, ITB) dengan profil verifikasi, ulasan, keahlian, dan modal penjadwalan sesi video interaktif.
3. **Cashflow Simulator**: Uji kelayakan harga jual produk, HPP satuan, volume bulanan, biaya operasional (overhead), dan kalkulator angsuran KUR Mikro (bunga 6% flat) dengan proyeksi kas 6 bulan ke depan serta perhitungan Titik Impas (BEP).
4. **Smart-POS (Kasir Digital)**: Katalog menu cepat, pemotongan stok otomatis saat checkout, diskon bertingkat, pemilihan metode bayar (Tunai, QRIS, Transfer), serta pencetakan struk belanja thermal.
5. **Chat & Pendamping Usaha**: Konsultasi berbasis AI yang dirancang khusus untuk konteks UMKM Indonesia (panduan pemisahan rekening, rumus HPP makanan & minuman, aturan PPh Final 0.5%, syarat KUR).
6. **Cashflow Tracking**: Buku kas digital terstruktur dengan filter kategori (Penjualan, Restock, Gaji, Utilitas), pencarian, penambahan transaksi manual, dan fitur **Ekspor Laporan ke CSV**.
7. **Expense Smart-Filter**: Solusi pemisah belanjaan supermarket/pasar yang sering bercampur antara belanja bahan warung dan kebutuhan dapur/rumah tangga (susu anak, popok) dengan pencatatan 1-klik ke buku kas.
8. **Kantong Kas Virtual (Money Jars)**: Disiplin alokasi keuangan dengan amplop virtual (Operasional, Bahan Baku, Pajak PPh 0.5%, Dana Darurat, Ekspansi) lengkap dengan target dan progress bar.
9. **Halaman Publik / Landing Page**: Halaman utama komprehensif dengan kalkulator margin langsung, perbandingan cara lama vs HEBAT, testimoni UMKM, dan akses instan ke aplikasi.

---

## 🎨 Kaidah Desain Anti-Slop yang Diterapkan

Sesuai aturan [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop):
- **Bebas dari AI Slop Clichés:** Tidak ada gradasi neon ungu-biru jenuh, tidak ada tombol kapsul berpendar di sembarang tempat, dan tidak ada ikon tanpa tujuan.
- **Palet Warna Nusantara Berbobot:** Deep Forest Green (`#0F392B`), Natural Ivory Surface (`#FAF9F5`), dan Terracotta Ochre (`#D97706`).
- **Tabular Figures:** Semua angka rupiah dan persentase menggunakan font monospace tabular (`font-num`) untuk ketelitian visual akuntansi.
- **Bahasa Asli & Membumi:** Menggunakan kosakata riil UMKM Indonesia yang sopan, jelas, dan tanpa jargon pemasaran palsu.
- **Responsif:** Tampilan optimal dari layar smartphone (390px) hingga layar desktop ultra-wide.
