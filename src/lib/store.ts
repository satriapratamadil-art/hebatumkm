"use client"

import { useEffect, useState } from "react"
import {
  Booking,
  Consultant,
  Pocket,
  Product,
  Transaction,
  User,
} from "./types"
import {
  defaultUser,
  initialBookings,
  initialConsultants,
  initialPockets,
  initialProducts,
  initialTransactions,
} from "./demo-data"

const STORAGE_KEY = "hebat_umkm_state_v1"

interface AppState {
  user: User | null
  products: Product[]
  transactions: Transaction[]
  pockets: Pocket[]
  consultants: Consultant[]
  bookings: Booking[]
}

const defaultState: AppState = {
  user: defaultUser,
  products: initialProducts,
  transactions: initialTransactions,
  pockets: initialPockets,
  consultants: initialConsultants,
  bookings: initialBookings,
}

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return {
      user: parsed.user ?? defaultUser,
      products: parsed.products?.length ? parsed.products : initialProducts,
      transactions: parsed.transactions?.length ? parsed.transactions : initialTransactions,
      pockets: parsed.pockets?.length ? parsed.pockets : initialPockets,
      consultants: initialConsultants, // Keep fresh curated consultants
      bookings: parsed.bookings ?? initialBookings,
    }
  } catch {
    return defaultState
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event("hebat_state_updated"))
  } catch (e) {
    console.error("Failed to save state to localStorage", e)
  }
}

export function useHebatStore() {
  const [state, setState] = useState<AppState>(defaultState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setState(loadState())
    setMounted(true)

    const handleUpdate = () => {
      setState(loadState())
    }

    window.addEventListener("hebat_state_updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("hebat_state_updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const addTransaction = (tx: Omit<Transaction, "id" | "date"> & { date?: string }) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: tx.date || new Date().toISOString(),
    }
    const current = loadState()
    const updated = {
      ...current,
      transactions: [newTx, ...current.transactions],
    }
    saveState(updated)
    return newTx
  }

  const deleteTransaction = (id: string) => {
    const current = loadState()
    const updated = {
      ...current,
      transactions: current.transactions.filter((t) => t.id !== id),
    }
    saveState(updated)
  }

  const addProduct = (prod: Omit<Product, "id">) => {
    const newProd: Product = {
      ...prod,
      id: `prod_${Date.now()}`,
    }
    const current = loadState()
    const updated = {
      ...current,
      products: [newProd, ...current.products],
    }
    saveState(updated)
    return newProd
  }

  const adjustStock = (productId: string, quantitySold: number) => {
    const current = loadState()
    const updated = {
      ...current,
      products: current.products.map((p) => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, p.stock - quantitySold) }
        }
        return p
      }),
    }
    saveState(updated)
  }

  const addPocket = (pocket: Omit<Pocket, "id">) => {
    const newPocket: Pocket = {
      ...pocket,
      id: `pkt_${Date.now()}`,
    }
    const current = loadState()
    const updated = {
      ...current,
      pockets: [...current.pockets, newPocket],
    }
    saveState(updated)
    return newPocket
  }

  const updatePocket = (pocketId: string, deltaAllocation: number) => {
    const current = loadState()
    const updated = {
      ...current,
      pockets: current.pockets.map((p) => {
        if (p.id === pocketId) {
          return {
            ...p,
            allocation: Math.max(0, p.allocation + deltaAllocation),
          }
        }
        return p
      }),
    }
    saveState(updated)
  }

  const addBooking = (bookingData: Omit<Booking, "id">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bkg_${Date.now()}`,
    }
    const current = loadState()
    const updated = {
      ...current,
      bookings: [newBooking, ...current.bookings],
    }
    saveState(updated)
    return newBooking
  }

  const setUser = (user: User | null) => {
    const current = loadState()
    const updated = { ...current, user }
    saveState(updated)
  }

  const resetAll = () => {
    saveState(defaultState)
  }

  return {
    ...state,
    mounted,
    addTransaction,
    deleteTransaction,
    addProduct,
    adjustStock,
    addPocket,
    updatePocket,
    addBooking,
    setUser,
    resetAll,
  }
}
