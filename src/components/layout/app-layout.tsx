'use client'

import { Header } from './header'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}