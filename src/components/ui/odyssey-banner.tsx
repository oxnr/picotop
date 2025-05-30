'use client'

import { motion } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'

export function OdysseyBanner() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if banner was previously dismissed in this session
    const dismissed = sessionStorage.getItem('odyssey-banner-dismissed')
    if (dismissed) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVisible(false)
    sessionStorage.setItem('odyssey-banner-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <a
      href="https://binary.builders/odyssey/"
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="relative bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-sm cursor-pointer overflow-hidden"
      >
        {/* Pulsating background effect */}
        <motion.div 
          className="absolute inset-0 bg-purple-500/20"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Left go-brr videos */}
        <div className="absolute left-2 top-0 h-full flex items-center gap-1 opacity-40">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-4 w-auto -rotate-12"
          >
            <source src="/videos/go-brr.mp4" type="video/mp4" />
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-4 w-auto rotate-6"
            style={{ animationDelay: '0.5s' }}
          >
            <source src="/videos/go-brr.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right go-brr videos */}
        <div className="absolute right-2 top-0 h-full flex items-center gap-1 opacity-40">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-4 w-auto -rotate-6"
            style={{ animationDelay: '0.3s' }}
          >
            <source src="/videos/go-brr.mp4" type="video/mp4" />
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-4 w-auto rotate-12"
            style={{ animationDelay: '0.8s' }}
          >
            <source src="/videos/go-brr.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-6 text-white z-10 relative">
            {/* Odyssey Logo */}
            <img 
              src="https://binary.builders/images/odyssey/odysee-logo.png" 
              alt="Odyssey"
              className="h-6 w-auto"
            />
            
            <span className="text-sm font-medium">
              Picojeet is an Odyssey project, check out what we're building
            </span>
            
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1 z-20"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.div>
    </a>
  )
}