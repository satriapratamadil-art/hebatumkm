import { NextResponse } from "next/server"

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  hpp: `**Panduan Perhitungan HPP (Harga Pokok Penjualan) untuk Usaha Kuliner & Retail:**

1. **Biaya Bahan Baku Langsung:**
   Hitung takaran per porsi/unit. Contoh Kopi Susu:
   - Kopi espresso (18g): Rp 2.500
   - Susu UHT (120ml): Rp 2.400
   - Gula aren cair (25ml): Rp 1.100
   - Es batu & air: Rp 400
   *Total Bahan Baku:* Rp 6.400

2. **Kemasan (Packaging):**
   - Cup sablon + lid + sedotan: Rp 1.200

3. **Total HPP Produk:** Rp 7.600 per cup.

**Rekomendasi Margin:**
Untuk bisnis F&B, targetkan *Food Cost* di kisaran 30%–38%. Jika HPP Rp 7.600, harga jual ideal adalah Rp 20.000–Rp 24.000 agar memiliki ruang untuk promo dan komisi ojek online.`,

  rekening: `**Langkah Memisahkan Keuangan Usaha dan Pribadi:**

1. **Buka 2 Rekening Terpisah:**
   - Rekening A (Usaha): Khusus untuk penerimaan QRIS/tunai penjualan dan belanja bahan.
   - Rekening B (Pribadi): Untuk kebutuhan rumah tangga, makan keluarga, cicilan pribadi.

2. **Gaji Diri Sendiri (Owner's Salary):**
   Tentukan angka nominal tetap bulanan (misalnya Rp 3.500.000 atau Rp 5.000.000) dan transfer di tanggal yang sama setiap bulan. 
   *Penting:* Jika uang di dompet pribadi habis sebelum akhir bulan, jangan mengambil uang kas toko!

3. **Gunakan Fitur 'Expense Smart-Filter' HEBAT:**
   Jika terpaksa belanja bahan usaha bercampur susu anak atau kebutuhan rumah di minimarket, gunakan fitur Smart-Filter di menu samping untuk memisahkan nominalnya ke buku kas yang benar.`,

  pajak: `**Kewajiban Pajak UMKM (PP No. 55 Tahun 2022):**

1. **Tarif PPh Final 0,5%:**
   Dikenakan atas omzet kotor bulanan bagi wajib pajak badan atau orang pribadi dengan omzet di bawah Rp 4,8 Miliar setahun.

2. **Batas Bebas Pajak untuk Wajib Pajak Orang Pribadi:**
   Bagi pemilik UMKM orang pribadi, omzet sampai dengan **Rp 500 Juta per tahun BEBAS PAJAK (0%)**. Anda baru mulai membayar 0,5% atas selisih omzet di atas Rp 500 Juta.

3. **Simpan Bukti Pembukuan:**
   Cukup simpan rekap arus kas bulanan dan setorkan via kode billing e-Billing Pajak setiap tanggal 15 bulan berikutnya.`,

  kur: `**Tips Pengajuan KUR (Kredit Usaha Rakyat) agar Cepat Disetujui Bank:**

1. **Syarat Utama:**
   - Usaha telah berjalan aktif minimal 6 bulan.
   - Tidak sedang memiliki kredit produktif di bank lain (kredit konsumtif seperti KPR/Paylater masih diperbolehkan selama riwayat BI Checking/SLIK lancar).
   - Memiliki NIB (Nomor Induk Berusaha).

2. **Bukti Transaksi Terverifikasi:**
   Bank membutuhkan kepastian arus kas. Cetak riwayat mutasi QRIS atau rekap dari fitur **Cashflow Tracking HEBAT** selama 3–6 bulan terakhir untuk membuktikan perputaran kas harian.

3. **Uji Cicilan di Simulator:**
   Gunakan menu **Cashflow Simulator** untuk memastikan margin kotor usaha mampu membayar angsuran bulanan tanpa mengganggu belanja stok barang.`,
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const lower = String(message || "").toLowerCase()

    let responseText = ""

    if (lower.includes("hpp") || lower.includes("harga jual") || lower.includes("margin") || lower.includes("food cost")) {
      responseText = KNOWLEDGE_RESPONSES.hpp
    } else if (lower.includes("pisah") || lower.includes("rekening") || lower.includes("pribadi") || lower.includes("dapur") || lower.includes("gaji")) {
      responseText = KNOWLEDGE_RESPONSES.rekening
    } else if (lower.includes("pajak") || lower.includes("pph") || lower.includes("0.5") || lower.includes("pp 55") || lower.includes("lapor")) {
      responseText = KNOWLEDGE_RESPONSES.pajak
    } else if (lower.includes("kur") || lower.includes("pinjaman") || lower.includes("modal") || lower.includes("bank") || lower.includes("bunga")) {
      responseText = KNOWLEDGE_RESPONSES.kur
    } else {
      responseText = `Terima kasih atas pertanyaannya. Sebagai langkah awal untuk usahamu:

1. Pastikan setiap uang masuk dari kasir dicatat rapi melalui menu **Smart-POS** atau **Cashflow Tracking**.
2. Alokasikan keuntungan harian ke dalam **Kantong Virtual** (minimal pos Restock, Operasional, dan Pajak 0.5%).
3. Uji kelayakan biaya dan target unit penjualan di **Cashflow Simulator**.

Untuk konsultasi mendalam atau bedah laporan keuangan secara langsung dengan akademisi dan praktisi ekonomi terverifikasi, silakan jadwalkan sesi di **Hub Konsultan**.`
    }

    return NextResponse.json({
      text: responseText,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    })
  } catch {
    return NextResponse.json({ error: "Gagal memproses percakapan" }, { status: 500 })
  }
}
