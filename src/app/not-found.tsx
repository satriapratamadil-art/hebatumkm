import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <span className="text-4xl font-extrabold font-mono text-brand">404</span>
        <h1 className="text-xl font-bold text-ink">Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-muted leading-relaxed">
          Halaman yang Anda tuju mungkin telah dipindahkan atau tautan yang Anda masukkan kurang tepat.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
