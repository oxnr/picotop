'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import { TrendUp, Target } from '@phosphor-icons/react'
import { getSignalStyle } from '@/lib/constants/signals'

interface VisualRainbowChartProps {
  currentPrice: number
  rainbowBand: string
}

type TimePeriod = '1Y' | '2Y' | '5Y' | 'ALL'

// Historical Bitcoin price data with rainbow band context
const historicalRainbowData = [
  { date: '2016-01', price: 400, band: 'Red', phase: 'Accumulation' },
  { date: '2017-01', price: 1000, band: 'Orange', phase: 'Early Bull' },
  { date: '2017-06', price: 2500, band: 'Yellow', phase: 'Bull Run' },
  { date: '2017-12', price: 20000, band: 'Violet', phase: 'Euphoria' },
  { date: '2018-12', price: 3200, band: 'Red', phase: 'Capitulation' },
  { date: '2020-03', price: 3800, band: 'Red', phase: 'COVID Crash' },
  { date: '2020-12', price: 29000, band: 'Blue', phase: 'Institution' },
  { date: '2021-04', price: 65000, band: 'Indigo', phase: 'Peak 1' },
  { date: '2021-11', price: 69000, band: 'Indigo', phase: 'ATH' },
  { date: '2022-06', price: 17500, band: 'Orange', phase: 'Bear' },
  { date: '2023-10', price: 35000, band: 'Green', phase: 'Recovery' },
  { date: '2024-03', price: 73000, band: 'Blue', phase: 'New ATH' },
  { date: '2025-01', price: 108700, band: 'Indigo', phase: 'Current' },
]

const rainbowBands = [
  { name: 'Red', color: '#ff0000', range: '$0 - $30K', signal: 'FIRE SALE', description: 'Historic bottoms, maximum accumulation' },
  { name: 'Orange', color: '#ff8000', range: '$30K - $45K', signal: 'BUY', description: 'Bear market recovery, accumulate aggressively' },
  { name: 'Yellow', color: '#ffff00', range: '$45K - $65K', signal: 'ACCUMULATE', description: 'Early bull market, still undervalued' },
  { name: 'Green', color: '#00ff00', range: '$65K - $85K', signal: 'HOLD', description: 'Fair value range, healthy bull market' },
  { name: 'Blue', color: '#0080ff', range: '$85K - $105K', signal: 'DISTRIBUTE', description: 'Approaching overvaluation, take some profits' },
  { name: 'Indigo', color: '#8000ff', range: '$105K - $150K', signal: 'SELL', description: 'Late cycle, major distribution zone' },
  { name: 'Violet', color: '#ff00ff', range: '$150K+', signal: 'PANIC SELL', description: 'Extreme euphoria, cycle top imminent' },
]

export function VisualRainbowChart({ currentPrice, rainbowBand }: VisualRainbowChartProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('ALL')

  const getCurrentBand = () => {
    return rainbowBands.find(band => band.name === rainbowBand) || rainbowBands[5]
  }

  const currentBand = getCurrentBand()
  const currentBandIndex = rainbowBands.findIndex(band => band.name === rainbowBand)

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
    return `$${price.toFixed(0)}`
  }

  const getFilteredData = () => {
    const now = new Date()
    const cutoffDates = {
      '1Y': new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      '2Y': new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
      '5Y': new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()),
      'ALL': new Date(2016, 0, 1)
    }
    
    const cutoff = cutoffDates[selectedPeriod]
    return historicalRainbowData.filter(item => {
      const itemDate = new Date(item.date + '-01')
      return itemDate >= cutoff
    })
  }

  const filteredData = getFilteredData()

  const timePeriods: { label: string; value: TimePeriod }[] = [
    { label: '1Y', value: '1Y' },
    { label: '2Y', value: '2Y' },
    { label: '5Y', value: '5Y' },
    { label: 'ALL', value: 'ALL' }
  ]

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendUp className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-foreground">Bitcoin Rainbow Chart Analysis</CardTitle>
          </div>
          <div 
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              getSignalStyle(currentBand.signal as any)?.bg || 'bg-gray-500/20'
            } ${
              getSignalStyle(currentBand.signal as any)?.text || 'text-gray-400'
            } ${
              getSignalStyle(currentBand.signal as any)?.border || 'border-gray-500/30'
            } border`}
          >
            {currentBand.signal}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Logarithmic price bands with cycle timing and ALT season correlation
          </p>
          <div className="flex space-x-1">
            {timePeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-secondary/10 rounded-lg border-l-4" style={{ borderColor: currentBand.color }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-2xl font-bold text-foreground">
                ${currentPrice.toLocaleString()}
              </div>
              <div className="text-sm font-medium" style={{ color: currentBand.color }}>
                {currentBand.name} Band
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Range</div>
              <div className="text-sm font-medium text-foreground">{currentBand.range}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentBand.description}
          </p>
        </div>

        {/* Historical Price Chart with Rainbow Bands */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentBand.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currentBand.color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                scale="log"
                domain={[100, 200000]}
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={formatPrice}
              />
              
              {/* Rainbow band reference lines */}
              <ReferenceLine y={30000} stroke="#ff8000" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={45000} stroke="#ffff00" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={65000} stroke="#00ff00" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={85000} stroke="#0080ff" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={105000} stroke="#8000ff" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={150000} stroke="#ff00ff" strokeOpacity={0.5} strokeDasharray="2 2" />
              
              <Area
                type="monotone"
                dataKey="price"
                stroke={currentBand.color}
                strokeWidth={3}
                fill="url(#priceGradient)"
              />
              
              {/* Current price indicator */}
              <ReferenceLine 
                y={currentPrice} 
                stroke="#ffffff" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rainbow Band Visualization */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Rainbow Bands & Market Psychology</h4>
          
          {rainbowBands.map((band, index) => {
            const isCurrentBand = band.name === rainbowBand
            const isBelow = index < currentBandIndex
            const isAbove = index > currentBandIndex
            
            return (
              <motion.div
                key={band.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex items-center justify-between p-3 rounded-lg transition-all ${
                  isCurrentBand 
                    ? 'bg-white/10 ring-2 ring-white/30' 
                    : isBelow
                    ? 'bg-green-500/5 border border-green-500/20'
                    : isAbove
                    ? 'bg-red-500/5 border border-red-500/20'
                    : 'bg-secondary/5 border border-border'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: band.color }}
                    />
                    <div>
                      <div className={`font-medium ${isCurrentBand ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {band.name} Band
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {band.range}
                      </div>
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
                    <div className="text-xs text-foreground font-medium">
                      ← CURRENT
                    </div>
                  )}
                </div>
                
                {/* Progress bar for current band */}
                {isCurrentBand && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full">
                    <div 
                      className="h-1 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: band.color,
                        width: `${Math.min(((currentPrice - 105000) / (150000 - 105000)) * 100, 100)}%`
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Historical Cycle Context */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Historical Cycle Context & ALT Season Timing</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-sm font-medium text-purple-400 mb-2">2017-2018 Cycle</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• BTC peaked in Violet band ($20K, Dec 2017)</div>
                  <div>• ALT season exploded 2-4 weeks later</div>
                  <div>• ICO boom drove 800B+ total market cap</div>
                  <div>• BTC dominance fell from 86% to 38%</div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-sm font-medium text-blue-400 mb-2">2020-2021 Cycle</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• BTC peaked in Indigo band ($69K, Nov 2021)</div>
                  <div>• Meme coin supercycle during Blue/Indigo</div>
                  <div>• ALT season lasted exactly 309 days</div>
                  <div>• DOGE, SHIB achieved unprecedented growth</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="text-sm font-medium text-orange-400 mb-2">Current Predictions (2025)</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Currently in Indigo band ($108K)</div>
                  <div>• ALT season may have started Dec 2024</div>
                  <div>• Estimated Violet peak: $150K - $200K</div>
                  <div>• Meme coin peak expected in Violet band</div>
                </div>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-sm font-medium text-green-400 mb-2">ALT/Meme Dynamics</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• ALTs typically lag BTC by 2-8 weeks</div>
                  <div>• Meme coins 5-10x amplify in Indigo/Violet</div>
                  <div>• Peak euphoria occurs in Violet band</div>
                  <div>• Duration: ~310 days (historically consistent)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}