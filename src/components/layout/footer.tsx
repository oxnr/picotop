'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DataStatus, PicojeetWordmark } from '@/components/ui'
import { Heart, ArrowSquareOut } from '@phosphor-icons/react'

interface FooterProps {
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

export function Footer({ apiHealth, lastUpdated, sources }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {/* API Status */}
        {(apiHealth || lastUpdated) && (
          <div className="mb-8">
            <DataStatus
              apiHealth={apiHealth}
              lastUpdated={lastUpdated}
              sources={sources}
              updateInterval={30}
            />
          </div>
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Picojeet Branding */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Bitcoin Cycle Prediction Platform
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Real-time on-chain analytics and AI-powered cycle predictions to help you time the perfect exit.
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground/80 space-y-1">
              <div>Real-time data from CoinGecko, Coinpaprika, BGeo Metrics & Fear/Greed Index</div>
              <div>App Store rankings via iTunes & Google Play APIs with on-chain metrics</div>
            </div>
          </div>

          {/* Odyssey Attribution */}
          <div className="space-y-6">
            <div>
              <motion.a
                href="https://binary.builders/odyssey/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                <img 
                  src="https://binary.builders/images/odyssey/odysee-logo.png" 
                  alt="Odyssey Logo"
                  className="h-14 w-auto"
                />
              </motion.a>
            </div>
            
            <div className="space-y-2">
              <div className="text-xl font-bold text-foreground">An Odyssey Project - Built by Binary Builders</div>
              <p className="text-muted-foreground leading-relaxed">
                Part of the Odyssey ecosystem advancing decentralized applications.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground/70">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" weight="fill" />
              <span>by</span>
              <a 
                href="https://binary.builders" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Binary Builders
              </a>
            </div>
            
            <div className="flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <PicojeetWordmark className="scale-90" />
              </motion.div>
            </div>
            
            <div className="text-sm text-muted-foreground/70">
              © 2025 Picojeet
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}