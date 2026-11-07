import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get("hebat_session")?.value

  if (session) {
    try {
      const user = JSON.parse(session)
      return NextResponse.json({ user })
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({
    user: {
      id: "usr_demo",
      name: "Bambang Wijaya",
      business: "Kopi & Kudapan Mas Bambang",
      email: "bambang@masbambang.id",
      role: "umkm",
    },
  })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const cookieStore = await cookies()

    if (data.action === "logout") {
      cookieStore.set("hebat_session", "", {
        path: "/",
        maxAge: 0,
      })
      return NextResponse.json({ success: true })
    }

    if (data.action === "login") {
      const email = String(data.email || "").trim()
      const user = {
        id: `usr_${Date.now()}`,
        name: data.name || (email.split("@")[0] ?? "Pengusaha Hebat"),
        business: data.business || "Usaha Mandiri Sukses",
        email,
        role: "umkm",
      }

      cookieStore.set("hebat_session", JSON.stringify(user), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      })

      return NextResponse.json({ user })
    }

    if (data.action === "signup") {
      const user = {
        id: `usr_${Date.now()}`,
        name: String(data.name || "").trim() || "Mitra UMKM",
        business: String(data.business || "").trim() || "Usaha Baru",
        email: String(data.email || "").trim(),
        role: "umkm",
      }

      cookieStore.set("hebat_session", JSON.stringify(user), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      })

      return NextResponse.json({ user })
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Gagal memproses sesi" }, { status: 500 })
  }
}
