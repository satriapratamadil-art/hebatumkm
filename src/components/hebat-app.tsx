"use client"

import React, { useState } from "react"
import { Sidebar } from "./layout/sidebar"
import { Header } from "./layout/header"
import { MobileDrawer } from "./layout/mobile-drawer"
import { LandingView } from "./landing/landing-view"
import { DashboardView } from "./dashboard/dashboard-view"
import { ConsultantsView } from "./consultants/consultants-view"
import { SimulatorView } from "./simulator/simulator-view"
import { PosView } from "./pos/pos-view"
import { ChatView } from "./chat/chat-view"
import { CashflowView } from "./cashflow/cashflow-view"
import { ExpenseFilterView } from "./filter/expense-filter-view"
import { PocketsView } from "./pockets/pockets-view"
import { TransactionModal } from "./cashflow/transaction-modal"
import { AuthModal } from "./auth/auth-modal"
import { AboutModal } from "./layout/about-modal"
import { CheckCircle2, X } from "lucide-react"

export default function HebatApp() {
  const [currentTab, setCurrentTab] = useState(0)
  const [isLanding, setIsLanding] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Global Modals
  const [showNewTxModal, setShowNewTxModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  // Toast notifications
  const [toastMessage, setToastMessage] = useState("")

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage("")
    }, 4500)
  }

  const handleNavigateTab = (tabIndex: number) => {
    setCurrentTab(tabIndex)
    setIsLanding(false)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar for Desktop */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigateTab}
        isLanding={isLanding}
        onToggleLanding={setIsLanding}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleNavigateTab}
        isLanding={isLanding}
        onToggleLanding={setIsLanding}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          isLanding={isLanding}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNewTx={() => setShowNewTxModal(true)}
          onToggleLanding={setIsLanding}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {isLanding ? (
            <LandingView
              onEnterApp={(tabIdx = 0) => handleNavigateTab(tabIdx)}
              onOpenAuth={() => setShowAuthModal(true)}
            />
          ) : (
            <>
              {currentTab === 0 && (
                <DashboardView
                  onNavigateTab={handleNavigateTab}
                  onOpenNewTx={() => setShowNewTxModal(true)}
                />
              )}
              {currentTab === 1 && <ConsultantsView onNotify={notify} />}
              {currentTab === 2 && <SimulatorView />}
              {currentTab === 3 && <PosView onNotify={notify} />}
              {currentTab === 4 && <ChatView onNavigateTab={handleNavigateTab} />}
              {currentTab === 5 && <CashflowView onNotify={notify} />}
              {currentTab === 6 && <ExpenseFilterView onNotify={notify} />}
              {currentTab === 7 && <PocketsView onNotify={notify} />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      {showNewTxModal && (
        <TransactionModal
          onClose={() => setShowNewTxModal(false)}
          onSuccess={(msg) => notify(msg)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(msg) => notify(msg)}
        />
      )}

      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-line bg-surface-card p-3.5 text-xs text-ink shadow-lg animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="p-1 rounded text-muted hover:text-ink"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
