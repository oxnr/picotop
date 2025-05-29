'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { 
  Sun, 
  Moon, 
  MagnifyingGlass,
  CurrencyBtc
} from '@phosphor-icons/react'
import { Button } from '@/components/ui'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <CurrencyBtc className="h-5 w-5 text-white" weight="bold" />
              </div>
              <span className="text-xl font-bold text-white">CycleTop</span>
            </div>
          </div>

          {/* Center - Search (now more prominent) */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlass className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder="Search Bitcoin metrics, app rankings, market data..."
                className="block w-full pl-12 pr-4 py-3 text-base bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative text-muted-foreground hover:text-foreground"
            >
              {mounted && (
                <motion.div
                  key={theme}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-600" />
                  )}
                </motion.div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}