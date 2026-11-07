"use client"

import React, { useState } from "react"
import { Clock, GraduationCap, Video, Check } from "lucide-react"
import { ModalShell } from "../ui/modal-shell"
import { Button } from "../ui/button"
import { Consultant } from "@/lib/types"
import { rupiah } from "@/lib/utils"
import { useHebatStore } from "@/lib/store"

interface BookingModalProps {
  consultant: Consultant
  onClose: () => void
  onSuccess: (message: string) => void
}

export function BookingModal({
  consultant,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const { addBooking, user } = useHebatStore()
  const [selectedSlot, setSelectedSlot] = useState(consultant.availableSlots[0] || "Besok, 10:00 WIB")
  const [topic, setTopic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      alert("Silakan tulis topik atau kendala usahamu secara singkat.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      addBooking({
        consultantId: consultant.id,
        consultantName: consultant.name,
        consultantUniversity: consultant.university,
        userName: user?.name || "Bambang Wijaya",
        businessName: user?.business || "Kopi & Kudapan Mas Bambang",
        date: selectedSlot.split(",")[0] || "Besok",
        time: selectedSlot.split(",")[1]?.trim() || "10:00 WIB",
        topic,
        status: "confirmed",
        rate: consultant.rate,
        meetingLink: "https://meet.google.com/hbt-umkm-sesi",
      })

      setIsSubmitting(false)
      onSuccess(`Jadwal konsultasi bersama ${consultant.name} berhasil dikonfirmasi!`)
      onClose()
    }, 400)
  }

  return (
    <ModalShell
      title="Jadwalkan Pendampingan Usaha"
      subtitle="Sesi diskusi privat 45 menit via Google Meet terenkripsi"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Consultant Header */}
        <div className="rounded-xl border border-line bg-surface p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center font-bold text-sm text-brand shrink-0">
            {consultant.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-sm text-ink">{consultant.name}</h4>
            <p className="text-xs text-brand font-medium">{consultant.expertise}</p>
            <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
              <GraduationCap size={13} />
              {consultant.university}
            </p>
          </div>
        </div>

        {/* Slot Selection */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-2">
            Pilih Jadwal Sesi Tersedia
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {consultant.availableSlots.map((slot) => {
              const active = selectedSlot === slot
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex items-center justify-between rounded-lg border p-2.5 text-xs text-left transition-all ${
                    active
                      ? "border-brand bg-brand-soft/70 text-brand font-semibold ring-1 ring-brand"
                      : "border-line bg-surface-card text-ink hover:bg-surface"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={13} className={active ? "text-brand" : "text-muted"} />
                    {slot}
                  </span>
                  {active && <Check size={14} className="text-brand" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Topik Pembahasan / Masalah yang Ingin Dibereskan
          </label>
          <textarea
            rows={3}
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Mau audit resep HPP menu baru, cara pisah kas warung & dapur, atau persiapan berkas KUR Bank..."
            className="w-full rounded-lg border border-line bg-surface p-3 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-muted">
            Konsultan akan membaca catatan ini sebelum sesi dimulai.
          </p>
        </div>

        {/* Rate Summary */}
        <div className="rounded-xl border border-line bg-surface p-3.5 flex items-center justify-between text-xs">
          <div>
            <p className="text-muted text-[11px]">Investasi Pendampingan</p>
            <p className="font-bold text-ink text-sm font-num">{rupiah(consultant.rate)}</p>
          </div>
          <div className="text-right">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              Demo: Tanpa Biaya
            </span>
            <p className="text-[10px] text-muted mt-0.5">Sesi edukasi mandiri</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <Button type="button" variant="ghost" onClick={onClose} size="sm">
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-2"
          >
            <Video size={14} />
            <span>{isSubmitting ? "Memproses..." : "Konfirmasi Jadwal"}</span>
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
