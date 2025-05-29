'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TrendUp } from '@phosphor-icons/react'

interface RainbowChartProps {
  currentPrice: number
  rainbowBand: string
}

const RAINBOW_BANDS = [
  { name: 'Red', color: '#ff0000', range: '$15K - $30K', signal: 'FIRE SALE' },
  { name: 'Orange', color: '#ff8000', range: '$30K - $45K', signal: 'BUY' },
  { name: 'Yellow', color: '#ffff00', range: '$45K - $65K', signal: 'ACCUMULATE' },
  { name: 'Green', color: '#00ff00', range: '$65K - $85K', signal: 'HOLD' },
  { name: 'Blue', color: '#0080ff', range: '$85K - $105K', signal: 'DISTRIBUTE' },
  { name: 'Indigo', color: '#8000ff', range: '$105K - $150K', signal: 'SELL' },
  { name: 'Violet', color: '#ff00ff', range: '$150K+', signal: 'PANIC SELL' },
]

function getBandIndex(bandName: string): number {
  return RAINBOW_BANDS.findIndex(band => band.name === bandName)
}

function getPricePosition(price: number): number {
  // Updated mapping for current price levels (0-100%)
  if (price < 15000) return 0
  if (price < 30000) return 10
  if (price < 45000) return 25
  if (price < 65000) return 40
  if (price < 85000) return 55
  if (price < 105000) return 70
  if (price < 150000) return 85
  return 100
}

export function RainbowChart({ currentPrice, rainbowBand }: RainbowChartProps) {
  const currentBandIndex = getBandIndex(rainbowBand)
  const pricePosition = getPricePosition(currentPrice)
  
  return (
    <Card className="border-0 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <TrendUp className="h-5 w-5 text-accent-purple" />
          <CardTitle className="text-foreground">Bitcoin Rainbow Chart</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Long-term price bands based on logarithmic regression
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="text-center p-4 bg-secondary/10 rounded-lg border-l-4 border-primary">
          <div className="text-2xl font-bold text-foreground mb-1">
            {rainbowBand} Band
          </div>
          <div className="text-lg text-primary font-medium mb-2">
            ${currentPrice.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Current signal: <span className={`font-bold ${
              RAINBOW_BANDS[currentBandIndex]?.signal.includes('SELL') ? 'text-red-400' :
              RAINBOW_BANDS[currentBandIndex]?.signal.includes('BUY') ? 'text-green-400' :
              'text-yellow-400'
            }`}>
              {RAINBOW_BANDS[currentBandIndex]?.signal || 'UNKNOWN'}
            </span>
          </div>
        </div>

        {/* Rainbow Bands Visualization */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground mb-3">Price Bands & Signals</h3>
          {RAINBOW_BANDS.map((band, index) => {
            const isCurrentBand = band.name === rainbowBand
            const isBelow = index < currentBandIndex
            const isAbove = index > currentBandIndex
            
            return (
              <motion.div
                key={band.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isCurrentBand 
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30' 
                    : isBelow
                    ? 'border-green-400/30 bg-green-400/5'
                    : isAbove
                    ? 'border-red-400/30 bg-red-400/5'
                    : 'border-border bg-secondary/5'
                }`}
              >
                {/* Color indicator */}
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: band.color }}
                  />
                  <div>
                    <div className={`font-medium ${isCurrentBand ? 'text-primary' : 'text-foreground'}`}>
                      {band.name} Band
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {band.range}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    band.signal.includes('SELL') ? 'text-red-400' :
                    band.signal.includes('BUY') || band.signal.includes('ACCUMULATE') ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {band.signal}
                  </div>
                  {isCurrentBand && (
                    <div className="text-xs text-primary font-medium">
                      ← CURRENT
                    </div>
                  )}
                </div>
                
                {/* Position indicator for current price */}
                {isCurrentBand && (
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(pricePosition - index * 15)}%` }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-medium text-foreground mb-2">How to Read:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Red/Orange: Accumulation zones</li>
                <li>• Yellow/Green: Fair value range</li>
                <li>• Blue/Indigo/Violet: Distribution zones</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-foreground mb-2">Current Position:</div>
              <div className="text-muted-foreground">
                Bitcoin is in the <span className="text-primary font-medium">{rainbowBand}</span> band,
                suggesting to <span className={`font-medium ${
                  RAINBOW_BANDS[currentBandIndex]?.signal.includes('SELL') ? 'text-red-400' :
                  RAINBOW_BANDS[currentBandIndex]?.signal.includes('BUY') ? 'text-green-400' :
                  'text-yellow-400'
                }`}>
                  {RAINBOW_BANDS[currentBandIndex]?.signal.toLowerCase()}
                </span>.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}