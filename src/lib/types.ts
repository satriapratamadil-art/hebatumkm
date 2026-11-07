export type UserRole = "umkm" | "konsultan" | "admin"

export interface User {
  id: string
  name: string
  business: string
  email: string
  role: UserRole
}

export type TransactionKind = "income" | "expense"

export interface Transaction {
  id: string
  name: string
  amount: number
  kind: TransactionKind
  category: string
  date: string
  notes?: string
}

export interface Product {
  id: string
  name: string
  price: number
  cost: number
  stock: number
  category: "Makanan" | "Minuman" | "Camilan" | "Retail / Lainnya"
  sku?: string
}

export interface Pocket {
  id: string
  name: string
  type: "Bisnis" | "Pajak" | "Darurat" | "Pengembangan"
  allocation: number
  target: number
  notes?: string
}

export interface Consultant {
  id: string
  name: string
  expertise: string
  university: string
  education: string
  bio: string
  verified: boolean
  demo: boolean
  rate: number
  rating: number
  reviewCount: number
  experienceYears: number
  availableSlots: string[]
}

export interface Booking {
  id: string
  consultantId: string
  consultantName: string
  consultantUniversity: string
  userName: string
  businessName: string
  date: string
  time: string
  topic: string
  status: "confirmed" | "completed" | "cancelled"
  rate: number
  meetingLink?: string
}

export interface SimulatorParams {
  price: number
  volume: number
  cost: number
  overhead: number
  debt: number
  balance: number
  interest: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  time: string
  quickActions?: { label: string; action: string }[]
}

export interface ReceiptScanItem {
  id: string
  name: string
  amount: number
  category: "business" | "personal"
  reason: string
}
