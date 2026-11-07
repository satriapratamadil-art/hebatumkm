# DESIGN.md — HEBAT UMKM

> **Design Direction & Anti-Slop Specification**
> Aligned with [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop)

---

## 1. Design Dials (R-37 Declared)
- **ENERGY: 2** (Quiet, grounded confidence. Designed for hardworking real-world small business operators who value clarity, predictability, and stability over flashy hype).
- **RHYTHM: 3** (Structural, asymmetric cadence. Avoids repetitive bento grids; balances dense data ledger tables with spacious, generous calculation summaries and interactive tools).
- **MOTION: 1** (Restrained, functional micro-transitions at 0.15s–0.2s. Instant tab response, clean modal fade-ins, strictly zero bouncy or floating AI gimmicks).

---

## 2. Visual Palette
Designed specifically for Indonesian business credibility—earthy, botanical, and trustworthy:
- **Primary Brand (Deep Forest Emerald):** `#0F392B` — represents financial stability, maturity, and growth.
- **Brand Dark (Pine Ink):** `#09241B` — high-contrast hover state and structural elements.
- **Brand Soft (Sage Tint):** `#EBF3EE` — readable background for badges, active states, and focus accents.
- **Surface Canvas (Natural Ivory):** `#FAF9F5` — warm, comfortable neutral that reduces eye fatigue compared to sterile pure white.
- **Card Surface (Pure White):** `#FFFFFF` — clean contrast cards with crisp `#E2E7E2` 1px borders.
- **Accent (Terracotta Ochre):** `#D97706` / `#C86D24` — financial highlights, warnings, and attention items.
- **Text Primary (Charcoal Forest):** `#182520` — WCAG AAA contrast ratio.
- **Text Muted (Sage Gray):** `#586A61` — readable secondary metadata and timestamps.

---

## 3. Typography & Hierarchy
- **Primary Sans:** `'DM Sans', system-ui, sans-serif` — humanist, legible, friendly without being childish.
- **Monospace Figures:** `'JetBrains Mono', monospace` with `tabular-nums font-mono` applied to all currency amounts (`rupiah`), percentages, quantities, and dates to ensure crisp numerical alignment.
- **Radius Restraint:** Strict ban on generic pill buttons (`rounded-full`) everywhere. Standard elements use `rounded-lg` (8px) for buttons/inputs and `rounded-xl` (12px) for cards.

---

## 4. Anti-Slop Audit Checklist (Verified)
- [x] **No AI Gradients:** Zero saturated purple-to-indigo gradients.
- [x] **No Floating Orbs / Glows:** Cards have crisp 1px borders and subtle 0.03 opacity shadows; no blurry neon edges.
- [x] **No Lucide Icon Soup:** Every icon communicates an explicit functional action (`Scale` for BEP, `Store` for POS, `ReceiptText` for nota).
- [x] **Authentic Indonesian Copywriting:** Zero generic buzzwords ("Revolutionary", "AI-Powered", "Next-Gen", "Seamlessly"). Replaced with real UMKM terms: HPP, Margin Kotor, Uang Dapur vs Kas Toko, Angsuran KUR, Bon Campuran, Sertifikat FEB.
- [x] **Complete Functional Interactivity:** Every slider, POS cart, receipt printer, transaction creator, and pocket allocator is interactive and updates state.
