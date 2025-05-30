'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { 
  Sun, 
  Moon
} from '@phosphor-icons/react'
import { PicojeetWordmark } from '@/components/ui'

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
            <PicojeetWordmark />
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Right side - Controls */}
          <div className="flex items-center">
            {/* Theme toggle - Elegant glassy button */}
            <motion.button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full backdrop-blur-md border border-white/10 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group overflow-hidden"
              style={{
                background: mounted && theme === 'dark' 
                  ? 'linear-gradient(to bottom right, rgba(254, 240, 138, 0.1), rgba(251, 191, 36, 0.1))' 
                  : 'linear-gradient(to bottom right, rgba(96, 165, 250, 0.1), rgba(37, 99, 235, 0.1))'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glass effect overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              
              {/* Inner shadow for depth */}
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-black/5 to-transparent" />
              
              {mounted && (
                <motion.div
                  key={theme}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 flex items-center justify-center w-full h-full"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-400 drop-shadow-[0_2px_4px_rgba(250,204,21,0.3)]" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-500 drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]" />
                  )}
                </motion.div>
              )}
              
              {/* Hover glow effect - smaller and contained */}
              <div 
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                style={{
                  backgroundColor: mounted && theme === 'dark' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(59, 130, 246, 0.15)'
                }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}