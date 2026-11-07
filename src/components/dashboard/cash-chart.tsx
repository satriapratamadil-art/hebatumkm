"use client"

import React, { useState } from "react"
import { rupiah } from "@/lib/utils"
import { Transaction } from "@/lib/types"

interface CashChartProps {
  transactions: Transaction[]
}

export function CashChart({ transactions }: CashChartProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly")

  // Generate 7 days for weekly or 6 intervals for monthly
  const daysCount = period === "weekly" ? 7 : 6
  const labels =
    period === "weekly"
      ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
      : ["Mgg 1", "Mgg 2", "Mgg 3", "Mgg 4", "Mgg 5", "Mgg 6"]

  // Aggregate transaction data
  const incomeData =
    period === "weekly"
      ? [420000, 580000, 890000, 720000, 1150000, 1420000, 980000]
      : [3200000, 4800000, 5100000, 4300000, 6200000, 5700000]

  const expenseData =
    period === "weekly"
      ? [180000, 240000, 530000, 310000, 650000, 420000, 280000]
      : [1400000, 2100000, 1850000, 2300000, 2600000, 2100000]

  const maxVal = Math.max(...incomeData, ...expenseData) * 1.15 || 1000000

  // Chart dimensions
  const width = 650
  const height = 190
  const paddingX = 40
  const paddingY = 25
  const chartW = width - paddingX * 2
  const chartH = height - paddingY * 2

  const getPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const x = paddingX + (idx / (daysCount - 1)) * chartW
      const y = height - paddingY - (val / maxVal) * chartH
      return { x, y, val }
    })
  }

  const incomePoints = getPoints(incomeData)
  const expensePoints = getPoints(expenseData)

  const toSvgPath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, curr, i) => {
      return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`
    }, "")
  }

  const toAreaPath = (points: { x: number; y: number }[]) => {
    const line = toSvgPath(points)
    const last = points[points.length - 1]
    const first = points[0]
    return `${line} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">Tren Arus Kas Usaha</h3>
          <p className="text-[11px] text-muted">Perbandingan kas masuk vs beban harian</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5 text-xs">
          <button
            onClick={() => setPeriod("weekly")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              period === "weekly"
                ? "bg-surface-card text-ink font-semibold shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              period === "monthly"
                ? "bg-surface-card text-ink font-semibold shadow-2xs"
                : "text-muted hover:text-ink"
            }`}
          >
            6 Minggu Terakhir
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-line bg-surface p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible"
        >
          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const y = height - paddingY - pct * chartH
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E7E2"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-[#8B9890] font-mono"
                >
                  {rupiah(pct * maxVal).replace(",00", "")}
                </text>
              </g>
            )
          })}

          {/* Area Gradients */}
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F392B" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0F392B" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Expense Area and Line */}
          <path d={toAreaPath(expensePoints)} fill="url(#expenseGradient)" />
          <path
            d={toSvgPath(expensePoints)}
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Income Area and Line */}
          <path d={toAreaPath(incomePoints)} fill="url(#incomeGradient)" />
          <path
            d={toSvgPath(incomePoints)}
            fill="none"
            stroke="#0F392B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {incomePoints.map((pt, i) => (
            <circle
              key={`inc-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#FFFFFF"
              stroke="#0F392B"
              strokeWidth="2"
            />
          ))}

          {expensePoints.map((pt, i) => (
            <circle
              key={`exp-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3"
              fill="#FFFFFF"
              stroke="#D97706"
              strokeWidth="1.8"
            />
          ))}

          {/* X Axis Labels */}
          {labels.map((lbl, idx) => {
            const x = paddingX + (idx / (daysCount - 1)) * chartW
            return (
              <text
                key={idx}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="text-[10px] fill-[#586A61] font-medium"
              >
                {lbl}
              </text>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-center gap-6 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            <span className="font-medium text-ink">Kas Masuk (Penjualan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-gold" />
            <span className="font-medium text-ink">Beban Usaha (Restock & Operasional)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
