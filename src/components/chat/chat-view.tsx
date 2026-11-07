"use client"

import React, { useState } from "react"
import { Send, MessageSquareText, Users, Bot } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ChatMessage } from "@/lib/types"

interface ChatViewProps {
  onNavigateTab: (tabIndex: number) => void
}

export function ChatView({ onNavigateTab }: ChatViewProps) {
  const initialMessages: ChatMessage[] = [
    {
      id: "msg_1",
      role: "assistant",
      text: `Halo! Saya AI Pendamping Usaha HEBAT.

Saya siap membantu menjawab pertanyaan seputar:
1. **Pemisahan Kas:** Mencegah uang kasir toko terpakai untuk belanja dapur.
2. **Kalkulasi HPP & Food Cost:** Menghitung modal bahan dan batas minimal harga jual.
3. **Pajak UMKM:** Penjelasan tarif PPh Final 0,5% dan batas omzet bebas pajak.
4. **Persiapan KUR:** Kelayakan buku kas sebelum diajukan ke bank.

Ada yang ingin kamu diskusikan untuk usahamu hari ini?`,
      time: "09:00 WIB",
    },
  ]

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickPrompts = [
    "Cara memisahkan uang kasir toko & uang belanja dapur?",
    "Rumus menghitung HPP makanan kemasan & takaran porsi?",
    "Bagaimana aturan pajak PPh Final 0.5% untuk UMKM?",
    "Tips syarat pengajuan KUR Mikro ke Bank pemerintah?",
  ]

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      if (res.ok) {
        const data = await res.json()
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: "assistant",
          text: data.text,
          time: data.time,
        }
        setMessages((prev) => [...prev, botMsg])
      } else {
        throw new Error()
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        text: `Mulai dari memisahkan rekening usaha dan pribadi secara tegas. Catat pemasukan kasir harian di menu Smart-POS, uji margin di Cashflow Simulator, dan simpan alokasi laba di Kantong Virtual. Untuk bimbingan langsung, silakan konsultasi dengan akademisi FEB di Hub Konsultan.`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-xl border border-line bg-surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-1.5">
            <MessageSquareText size={13} />
            AI Pendamping Edukasi UMKM
          </Badge>
          <h2 className="text-xl font-bold text-ink">Chat & Tanya Regulasi Usaha</h2>
          <p className="text-xs text-muted">
            Konsultasi cepat terkait strategi penentuan harga, SOP keuangan, dan persiapan pengajuan kredit.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onNavigateTab(1)}
          className="gap-1.5"
        >
          <Users size={14} />
          <span>Hubungi Mentor Manusia (FEB)</span>
        </Button>
      </div>

      {/* Main Chat Box */}
      <Card className="p-0 overflow-hidden flex flex-col h-[650px] max-h-[75vh]">
        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === "assistant"
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? "items-start" : "items-start justify-end"}`}
              >
                {isBot && (
                  <div className="h-8 w-8 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isBot
                      ? "bg-surface border border-line text-ink whitespace-pre-line"
                      : "bg-brand text-white font-medium"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] mt-2 block ${
                      isBot ? "text-muted" : "text-brand-soft/80"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand shrink-0">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4 text-xs text-muted">
                Sedang menyusun penjelasan terbaik untuk usahamu...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-line/60 bg-surface/50 overflow-x-auto flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted shrink-0">
            Contoh Pertanyaan:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="rounded-full border border-line bg-surface-card px-2.5 py-1 text-[10px] text-ink hover:border-brand/40 hover:bg-brand-soft/40 transition-colors shrink-0 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="p-3.5 border-t border-line bg-surface-card flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik pertanyaan seputar HPP, margin, pajak, atau kasir..."
            className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={!inputText.trim() || isLoading}
            className="gap-1.5"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Kirim</span>
          </Button>
        </form>
      </Card>
    </div>
  )
}
