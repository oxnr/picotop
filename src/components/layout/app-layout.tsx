'use client'

import { Header } from './header'
import { Footer } from './footer'
import { OdysseyBanner } from '@/components/ui'

interface AppLayoutProps {
  children: React.ReactNode
  footerProps?: {
    apiHealth?: {
      coingecko: boolean
      coinpaprika: boolean
      feargreed: boolean
      bgeo: boolean
      applestore: boolean
      googleplay: boolean
    }
    lastUpdated?: string
    sources?: {
      price: string
      dominance: string
      metrics: string
      fearGreed: number
    }
  }
}

export function AppLayout({ children, footerProps }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Odyssey Banner */}
      <OdysseyBanner />
      
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <Footer {...footerProps} />
    </div>
  )
}