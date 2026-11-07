"use client"

import React, { useState } from "react"
import {
  Search,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { BookingModal } from "./booking-modal"
import { Consultant } from "@/lib/types"
import { rupiah } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

interface ConsultantsViewProps {
  onNotify: (msg: string) => void
}

export function ConsultantsView({ onNotify }: ConsultantsViewProps) {
  const { consultants, bookings } = useHebatStore()
  const [search, setSearch] = useState("")
  const [selectedUniv, setSelectedUniv] = useState("Semua")
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [activeTab, setActiveTab] = useState<"katalog" | "jadwalsaya">("katalog")

  const universities = ["Semua", "UI", "UGM", "Unpad", "Airlangga", "ITB"]

  const filteredConsultants = consultants.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.expertise.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase())

    const matchUniv =
      selectedUniv === "Semua" ||
      c.university.toLowerCase().includes(selectedUniv.toLowerCase())

    return matchSearch && matchUniv
  })

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-line bg-gradient-to-r from-brand-soft to-surface-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-2">
            <GraduationCap size={13} />
            Pendamping FEB & Praktisi UMKM
          </Badge>
          <h2 className="text-xl font-bold text-ink">
            Bukan jalan sendiri. Diskusi langsung bareng ahlinya.
          </h2>
          <p className="text-xs text-muted mt-1 max-w-xl leading-relaxed">
            Didampingi oleh mahasiswa tingkat akhir & alumni Fakultas Ekonomi dan Bisnis (FEB) dari
            kampus terkemuka Indonesia yang telah lulus kurasi 14 hari studi kasus UMKM.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab("katalog")}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              activeTab === "katalog"
                ? "bg-surface-card text-ink font-semibold shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Katalog Mentor ({consultants.length})
          </button>
          <button
            onClick={() => setActiveTab("jadwalsaya")}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              activeTab === "jadwalsaya"
                ? "bg-surface-card text-brand font-semibold shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            Jadwal Saya ({bookings.length})
          </button>
        </div>
      </div>

      {activeTab === "katalog" ? (
        <>
          {/* Search & University Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama konsultan, keahlian (HPP, Pajak, KUR), atau kampus..."
                className="w-full rounded-xl border border-line bg-surface-card pl-10 pr-4 py-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {universities.map((univ) => {
                const active = selectedUniv === univ
                return (
                  <button
                    key={univ}
                    onClick={() => setSelectedUniv(univ)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium shrink-0 transition-colors ${
                      active
                        ? "bg-brand text-white font-semibold"
                        : "border border-line bg-surface-card text-ink hover:bg-surface"
                    }`}
                  >
                    {univ}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Consultants Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredConsultants.map((consultant) => (
              <Card
                key={consultant.id}
                className="flex flex-col justify-between hover:border-brand/40 transition-all p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-12 w-12 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center font-bold text-sm text-brand shrink-0">
                      {consultant.name.slice(0, 2).toUpperCase()}
                    </div>
                    <Badge variant={consultant.verified ? "brand" : "amber"}>
                      <ShieldCheck size={12} />
                      {consultant.verified ? "Terverifikasi FEB" : "Dalam Pelatihan"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-ink mt-3.5">
                    {consultant.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand mt-0.5">
                    {consultant.expertise}
                  </p>

                  <p className="text-[11px] text-muted flex items-center gap-1.5 mt-2">
                    <GraduationCap size={14} className="shrink-0" />
                    <span>{consultant.university}</span>
                  </p>

                  <p className="text-xs text-muted leading-relaxed mt-3 line-clamp-3">
                    {consultant.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={13} fill="currentColor" />
                      <span>{consultant.rating}</span>
                      <span className="text-muted font-normal text-[11px]">
                        ({consultant.reviewCount} sesi)
                      </span>
                    </div>
                    <span className="text-[11px] text-muted">
                      {consultant.experienceYears} thn pengalaman
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted block">Investasi per sesi</span>
                    <span className="font-bold text-sm font-num text-ink">
                      {rupiah(consultant.rate)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedConsultant(consultant)}
                    className="gap-1.5"
                  >
                    <span>Jadwalkan</span>
                    <ArrowRight size={13} />
                  </Button>
                </div>
              </Card>
            ))}

            {filteredConsultants.length === 0 && (
              <div className="col-span-full rounded-xl border border-line bg-surface p-12 text-center text-xs text-muted">
                Tidak ada konsultan yang cocok dengan kata kunci &ldquo;{search}&rdquo;. Coba
                gunakan kata kunci lain atau pilih opsi &ldquo;Semua Kampus&rdquo;.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Jadwal Saya Tab */
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-surface-card p-5">
            <h3 className="text-base font-bold text-ink mb-1">
              Daftar Sesi Pendampingan Terkonfirmasi
            </h3>
            <p className="text-xs text-muted mb-4">
              Link ruang video Google Meet akan aktif otomatis 10 menit sebelum sesi dimulai.
            </p>

            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-lg border border-line bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand">
                        <CheckCircle size={12} /> Terkonfirmasi
                      </Badge>
                      <span className="text-xs font-semibold text-ink">
                        {booking.consultantName}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      <span className="font-medium text-ink">Topik:</span> {booking.topic}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {booking.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={booking.meetingLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-brand bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                    >
                      <Video size={13} />
                      Buka Google Meet
                    </a>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="py-10 text-center text-xs text-muted">
                  Belum ada sesi konsultasi yang kamu jadwalkan. Pilih konsultan dari tab katalog di
                  atas untuk memulai.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedConsultant && (
        <BookingModal
          consultant={selectedConsultant}
          onClose={() => setSelectedConsultant(null)}
          onSuccess={(msg) => {
            onNotify(msg)
            setActiveTab("jadwalsaya")
          }}
        />
      )}
    </div>
  )
}
