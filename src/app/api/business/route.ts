import { NextResponse } from "next/server"
import {
  initialConsultants,
  initialPockets,
  initialProducts,
  initialTransactions,
} from "@/lib/demo-data"

export async function GET() {
  return NextResponse.json(
    {
      consultants: initialConsultants,
      settings: {
        name: "Standar Layanan HEBAT UMKM",
        baseRate: 99000,
        trialMinutes: 15,
      },
      transactions: initialTransactions,
      products: initialProducts,
      pockets: initialPockets,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      message: "Operasi tersimpan dalam memori lokal aplikasi",
      data: body,
    })
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan transaksi" },
      { status: 400 },
    )
  }
}
