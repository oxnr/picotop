'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DataStatus } from '@/components/ui'
import { Heart, ArrowSquareOut } from '@phosphor-icons/react'

interface FooterProps {
  apiHealth?: {
    coingecko: boolean
    coinpaprika: boolean
    feargreed: boolean
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Odyssey Attribution */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src="https://binary.builders/images/odyssey/odysee-logo.png" 
                  alt="Odyssey Logo"
                  className="h-12 w-auto"
                />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-foreground">An Odyssey Project</h3>
                <p className="text-sm text-muted-foreground">
                  Built with love by Binary Builders
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Picojeet is proudly part of the Odyssey ecosystem - advancing the future of 
              decentralized applications and empowering degens to time their perfect exits.
            </p>
            
            <motion.a
              href="https://binary.builders/odyssey/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 mt-4 text-primary hover:text-primary/80 transition-colors"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-medium">Learn more about Odyssey</span>
              <ArrowSquareOut className="h-4 w-4" />
            </motion.a>
          </div>

          {/* Project Info */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Picojeet</h4>
              <p className="text-xs text-muted-foreground">
                Real-time Bitcoin cycle prediction platform for timing your perfect jeets.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Data Sources</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• CoinGecko & Coinpaprika APIs</li>
                <li>• Fear & Greed Index</li>
                <li>• Enhanced App Store Rankings</li>
                <li>• Real-time On-chain Metrics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" weight="fill" />
              <span>by</span>
              <a 
                href="https://binary.builders" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Binary Builders
              </a>
            </div>
            
            <div className="text-xs text-muted-foreground">
              © 2025 Picojeet
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}