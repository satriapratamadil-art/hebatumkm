"use client"

import React, { useState } from "react"
import { Scale, Landmark, RotateCcw } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { rupiah, shortMoney, calculateBEP } from "@/lib/utils"

export function SimulatorView() {
  const defaultParams = {
    price: 22000,
    volume: 900,
    cost: 9500,
    overhead: 4500000,
    debt: 750000,
    balance: 15000000,
    kurAmount: 25000000,
    kurTenor: 12,
    kurRate: 6, // 6% flat annual
  }

  const [sim, setSim] = useState(defaultParams)

  // Calculations
  const grossRevenue = sim.price * sim.volume
  const totalVariableCost = sim.cost * sim.volume
  const unitContribution = Math.max(0, sim.price - sim.cost)
  const grossProfit = unitContribution * sim.volume
  const marginPercentage = sim.price > 0 ? (unitContribution / sim.price) * 100 : 0

  const totalFixedCost = sim.overhead + sim.debt
  const netProfitMonthly = grossProfit - totalFixedCost
  const netMarginPercentage = grossRevenue > 0 ? (netProfitMonthly / grossRevenue) * 100 : 0

  const bep = calculateBEP(sim.price, sim.cost, totalFixedCost)
  const isAboveBEP = sim.volume >= bep.units

  // KUR Monthly Installment
  const kurMonthlyPrincipal = sim.kurAmount / sim.kurTenor
  const kurMonthlyInterest = (sim.kurAmount * (sim.kurRate / 100)) / 12
  const kurTotalMonthly = kurMonthlyPrincipal + kurMonthlyInterest

  // 6-Month Cash Projection
  const monthlyProjection = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = i + 1
    const endBalance = Math.max(0, sim.balance + netProfitMonthly * monthIndex)
    return {
      month: `Bulan ${monthIndex}`,
      balance: endBalance,
    }
  })

  // Runway in months if losing money
  const runwayMonths =
    netProfitMonthly < 0
      ? (sim.balance / Math.abs(netProfitMonthly)).toFixed(1)
      : "Aman (Arus kas surplus)"

  const applyPreset = (preset: typeof defaultParams) => {
    setSim(preset)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Presets */}
      <div className="rounded-xl border border-line bg-surface-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge variant="brand" className="mb-2">
            <Scale size={13} />
            Kalkulator Finansial Deterministik
          </Badge>
          <h2 className="text-xl font-bold text-ink">
            Cashflow Simulator & Kalkulator Titik Impas (BEP)
          </h2>
          <p className="text-xs text-muted mt-1 max-w-xl">
            Uji kelayakan bisnis sebelum mengeluarkan modal. Ketahui berapa porsi yang harus terjual
            setiap bulan agar usaha tidak merugi.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted font-medium">Contoh Skenario:</span>
          <button
            onClick={() =>
              applyPreset({
                ...defaultParams,
                price: 18000,
                volume: 1200,
                cost: 7200,
                overhead: 4000000,
                debt: 500000,
              })
            }
            className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:bg-stone-100"
          >
            Kedai Kopi
          </button>
          <button
            onClick={() =>
              applyPreset({
                ...defaultParams,
                price: 28000,
                volume: 650,
                cost: 14500,
                overhead: 3800000,
                debt: 0,
              })
            }
            className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:bg-stone-100"
          >
            Katering Nasi
          </button>
          <button
            onClick={() => setSim(defaultParams)}
            title="Reset nilai bawaan"
            className="p-1 rounded-lg text-muted hover:text-ink border border-line"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12 items-start">
        {/* Sliders Input Panel (7 Cols) */}
        <div className="xl:col-span-7 space-y-5">
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-ink border-b border-line pb-3">
              Parameter Keuangan Usaha
            </h3>

            {/* Slider 1: Harga Jual */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-ink">Harga Jual Rata-rata per Unit</span>
                <span className="font-bold font-num text-brand text-sm">
                  {rupiah(sim.price)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="150000"
                step="1000"
                value={sim.price}
                onChange={(e) => setSim({ ...sim, price: Number(e.target.value) })}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-muted mt-0.5">
                <span>Rp 1.000</span>
                <span>Rp 150.000</span>
              </div>
            </div>

            {/* Slider 2: HPP per Unit */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div>
                  <span className="font-medium text-ink">HPP Satuan (Bahan Pokok + Kemasan)</span>
                  <span className="text-[10px] text-muted block">Biaya langsung per porsi</span>
                </div>
                <span className="font-bold font-num text-ink text-sm">
                  {rupiah(sim.cost)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={sim.cost}
                onChange={(e) => setSim({ ...sim, cost: Number(e.target.value) })}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-muted mt-0.5">
                <span>Rp 500</span>
                <span>Rp 100.000</span>
              </div>
            </div>

            {/* Slider 3: Volume Bulanan */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div>
                  <span className="font-medium text-ink">Target Volume Penjualan / Bulan</span>
                  <span className="text-[10px] text-muted block">
                    Sekitar {Math.round(sim.volume / 30)} unit per hari
                  </span>
                </div>
                <span className="font-bold font-num text-ink text-sm">
                  {sim.volume.toLocaleString("id-ID")} unit
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="3000"
                step="10"
                value={sim.volume}
                onChange={(e) => setSim({ ...sim, volume: Number(e.target.value) })}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-muted mt-0.5">
                <span>10 unit</span>
                <span>3.000 unit</span>
              </div>
            </div>

            {/* Slider 4: Overhead Bulanan */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div>
                  <span className="font-medium text-ink">Biaya Operasional Tetap (Overhead)</span>
                  <span className="text-[10px] text-muted block">
                    Sewa tempat, listrik, wifi, kebersihan, gaji tetap
                  </span>
                </div>
                <span className="font-bold font-num text-ink text-sm">
                  {rupiah(sim.overhead)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20000000"
                step="200000"
                value={sim.overhead}
                onChange={(e) => setSim({ ...sim, overhead: Number(e.target.value) })}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-muted mt-0.5">
                <span>Rp 0</span>
                <span>Rp 20.000.000</span>
              </div>
            </div>

            {/* Slider 5: Cicilan Pinjaman */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div>
                  <span className="font-medium text-ink">Cicilan Utang / KUR per Bulan</span>
                  <span className="text-[10px] text-muted block">Kewajiban angsuran perbankan</span>
                </div>
                <span className="font-bold font-num text-brand-gold text-sm">
                  {rupiah(sim.debt)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000000"
                step="100000"
                value={sim.debt}
                onChange={(e) => setSim({ ...sim, debt: Number(e.target.value) })}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-muted mt-0.5">
                <span>Rp 0</span>
                <span>Rp 10.000.000</span>
              </div>
            </div>

            {/* Slider 6: Saldo Kas Awal */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-ink">Saldo Kas Cadangan Awal</span>
                <span className="font-bold font-num text-ink text-sm">
                  {rupiah(sim.balance)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50000000"
                step="500000"
                value={sim.balance}
                onChange={(e) => setSim({ ...sim, balance: Number(e.target.value) })}
                className="w-full accent-brand"
              />
            </div>
          </Card>

          {/* KUR Simulator Module */}
          <Card className="p-5 bg-surface space-y-4">
            <div className="flex items-center gap-2">
              <Landmark size={16} className="text-brand" />
              <h4 className="text-xs font-bold text-ink">
                Simulasi Angsuran Pinjaman KUR Mikro Pemerintah
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-muted block mb-1">Plafon Pinjaman</label>
                <select
                  value={sim.kurAmount}
                  onChange={(e) => setSim({ ...sim, kurAmount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-line bg-surface-card p-2 text-xs font-medium text-ink"
                >
                  <option value={10000000}>Rp 10.000.000</option>
                  <option value={25000000}>Rp 25.000.000</option>
                  <option value={50000000}>Rp 50.000.000</option>
                  <option value={100000000}>Rp 100.000.000</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-muted block mb-1">Tenor Angsuran</label>
                <select
                  value={sim.kurTenor}
                  onChange={(e) => setSim({ ...sim, kurTenor: Number(e.target.value) })}
                  className="w-full rounded-lg border border-line bg-surface-card p-2 text-xs font-medium text-ink"
                >
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                  <option value={36}>36 Bulan (3 Tahun)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-muted block mb-1">Suku Bunga KUR Flat</label>
                <div className="p-2 rounded-lg border border-line bg-surface-card text-xs font-semibold text-brand">
                  6% per Tahun (Subsidi)
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-muted">Estimasi Angsuran Bulanan:</span>
              <div className="flex items-center gap-2">
                <span className="font-num font-bold text-ink text-sm">
                  {rupiah(kurTotalMonthly)} / bulan
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSim({ ...sim, debt: Math.round(kurTotalMonthly) })}
                  className="text-[10px] py-1 px-2"
                >
                  Terapkan ke Cicilan
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results & Analysis Panel (5 Cols) */}
        <div className="xl:col-span-5 space-y-5">
          {/* BEP Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Titik Impas (Break-Even Point)
              </span>
              <Badge variant={isAboveBEP ? "brand" : "amber"}>
                {isAboveBEP ? "Target Penjualan Tercapai" : "Di Bawah Titik Impas"}
              </Badge>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4 text-center">
              <p className="text-xs text-muted">Untuk balik modal biaya bulanan, kamu harus menjual:</p>
              <p className="text-3xl font-extrabold font-num text-ink mt-1">
                {bep.units.toLocaleString("id-ID")}{" "}
                <span className="text-sm font-normal text-muted">unit / bulan</span>
              </p>
              <p className="text-xs text-brand font-semibold mt-1">
                Setara omzet minimum {rupiah(bep.rupiah)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-line bg-surface">
                <span className="text-muted block text-[11px]">Margin Kotor per Unit</span>
                <span className="font-num font-bold text-ink mt-0.5 block text-sm">
                  {rupiah(unitContribution)}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold">
                  {marginPercentage.toFixed(1)}% dari harga
                </span>
              </div>

              <div className="p-3 rounded-lg border border-line bg-surface">
                <span className="text-muted block text-[11px]">Beban Tetap Bulanan</span>
                <span className="font-num font-bold text-brand-gold mt-0.5 block text-sm">
                  {rupiah(totalFixedCost)}
                </span>
                <span className="text-[10px] text-muted">Overhead + Angsuran</span>
              </div>
            </div>
          </Card>

          {/* Net Profit / Loss Card */}
          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              Proyeksi Laba Bersih Bulanan
            </h4>

            <div
              className={`p-4 rounded-xl border ${
                netProfitMonthly >= 0
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-amber-200 bg-amber-50/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Laba Bersih Usaha:</span>
                <span
                  className={`text-2xl font-extrabold font-num ${
                    netProfitMonthly >= 0 ? "text-emerald-800" : "text-amber-800"
                  }`}
                >
                  {netProfitMonthly >= 0 ? "+" : ""}
                  {rupiah(netProfitMonthly)}
                </span>
              </div>
              <p className="text-[11px] text-muted mt-1.5 leading-relaxed">
                {netProfitMonthly >= 0
                  ? `Bisnis menghasilkan surplus ${netMarginPercentage.toFixed(1)}% setelah menanggung HPP dan biaya operasional.`
                  : "Defisit kas. Kamu perlu menaikkan volume penjualan atau menekan overhead agar tidak menguras modal cadangan."}
              </p>
            </div>

            {/* Runway Alert */}
            <div className="p-3 rounded-lg border border-line bg-surface text-xs flex items-center justify-between">
              <span className="text-muted">Ketahanan Kas Cadangan:</span>
              <span className="font-bold text-ink font-num">{runwayMonths}</span>
            </div>

            {/* 6-Month Projection Visual Bar */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-muted block mb-2">
                Simulasi Saldo Kas 6 Bulan ke Depan:
              </span>
              <div className="grid grid-cols-6 gap-1.5 text-center">
                {monthlyProjection.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-md border border-line bg-surface text-[10px]"
                  >
                    <span className="text-muted block text-[9px]">Bln {idx + 1}</span>
                    <span className="font-num font-bold text-ink block mt-0.5">
                      {shortMoney(proj.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
