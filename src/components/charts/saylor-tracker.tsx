'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { SaylorTrackerData } from '@/lib/types'
import { CurrencyBtc, TrendUp, TrendDown, Trophy, Target } from '@phosphor-icons/react'

interface SaylorTrackerProps {
  data: SaylorTrackerData
  currentBitcoinPrice: number
}

export function SaylorTracker({ data, currentBitcoinPrice }: SaylorTrackerProps) {
  const { summary, purchases } = data
  
  // Calculate total P&L color
  const pnlColor = parseFloat(summary.pnlPercentage) >= 0 ? 'text-green-400' : 'text-red-400'
  const pnlIcon = parseFloat(summary.pnlPercentage) >= 0 ? TrendUp : TrendDown
  const PnLIcon = pnlIcon

  // Recent purchases for timeline (last 10)
  const recentPurchases = purchases.slice(-10).reverse()

  // Generate cumulative Bitcoin holdings chart data
  const cumulativeData = []
  let runningTotal = 0
  let runningCost = 0

  purchases.forEach((purchase, index) => {
    runningTotal += purchase.amount
    runningCost += purchase.cost
    cumulativeData.push({
      date: purchase.date,
      totalBitcoin: runningTotal,
      totalCost: runningCost,
      averagePrice: runningCost / runningTotal,
      purchasePrice: purchase.price,
      index
    })
  })

  // Chart dimensions
  const chartHeight = 200
  const chartWidth = 800 // SVG coordinate width

  const maxBitcoin = Math.max(...cumulativeData.map(d => d.totalBitcoin))
  const maxPrice = Math.max(...cumulativeData.map(d => d.averagePrice), currentBitcoinPrice)
  const minPrice = Math.min(...cumulativeData.map(d => d.averagePrice))

  return (
    <Card className="border-0 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CurrencyBtc className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-foreground">Michael Saylor Bitcoin Tracker</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            MicroStrategy Holdings
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Track Michael Saylor's Bitcoin purchases, average price, and real-time P&L
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-secondary/10 rounded-lg"
          >
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {parseInt(summary.totalBitcoin).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Bitcoin</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 bg-secondary/10 rounded-lg"
          >
            <div className="text-2xl font-bold text-blue-500 mb-1">
              ${parseFloat(summary.averagePrice).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Average Price</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 bg-secondary/10 rounded-lg"
          >
            <div className={`text-2xl font-bold mb-1 ${pnlColor}`}>
              ${(summary.totalPnL / 1000000000).toFixed(1)}B
            </div>
            <div className="text-sm text-muted-foreground">Total P&L</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-secondary/10 rounded-lg"
          >
            <div className={`text-2xl font-bold mb-1 flex items-center justify-center space-x-1 ${pnlColor}`}>
              <PnLIcon className="h-6 w-6" />
              <span>{summary.pnlPercentage}%</span>
            </div>
            <div className="text-sm text-muted-foreground">Return</div>
          </motion.div>
        </div>

        {/* Current vs Average Price Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Comparison */}
          <div className="p-6 bg-secondary/10 rounded-lg">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <span>Price Analysis</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current BTC Price</span>
                <span className="text-xl font-bold text-foreground">
                  ${currentBitcoinPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Saylor's Avg Price</span>
                <span className="text-xl font-bold text-blue-500">
                  ${parseFloat(summary.averagePrice).toLocaleString()}
                </span>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price Difference</span>
                  <div className={`text-lg font-bold flex items-center space-x-1 ${
                    currentBitcoinPrice > parseFloat(summary.averagePrice) ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {currentBitcoinPrice > parseFloat(summary.averagePrice) ? 
                      <TrendUp className="h-5 w-5" /> : 
                      <TrendDown className="h-5 w-5" />
                    }
                    <span>
                      ${Math.abs(currentBitcoinPrice - parseFloat(summary.averagePrice)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="p-6 bg-secondary/10 rounded-lg">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Portfolio Value</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Investment</span>
                <span className="text-xl font-bold text-foreground">
                  ${(summary.totalCostBasis / 1000000000).toFixed(1)}B
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Value</span>
                <span className="text-xl font-bold text-green-500">
                  ${(summary.currentValue / 1000000000).toFixed(1)}B
                </span>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="w-full bg-muted rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${
                      parseFloat(summary.pnlPercentage) >= 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(parseFloat(summary.pnlPercentage)), 100)}%` 
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${pnlColor}`}>
                    {parseFloat(summary.pnlPercentage) >= 0 ? '+' : ''}{summary.pnlPercentage}% Return
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cumulative Bitcoin Holdings Chart */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Bitcoin Accumulation Timeline</h3>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <div className="relative" style={{ height: `${chartHeight}px` }}>
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                <defs>
                  <linearGradient id="bitcoinGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f7931a" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f7931a" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* Bitcoin accumulation area */}
                <path
                  d={`M 0 ${chartHeight} ${cumulativeData
                    .map((d, i) => {
                      const x = (i / (cumulativeData.length - 1)) * chartWidth
                      const y = chartHeight - (d.totalBitcoin / maxBitcoin) * chartHeight
                      return `L ${x} ${y}`
                    })
                    .join(' ')} L ${chartWidth} ${chartHeight} Z`}
                  fill="url(#bitcoinGradient)"
                />
                
                {/* Bitcoin accumulation line */}
                <path
                  d={cumulativeData
                    .map((d, i) => {
                      const x = (i / (cumulativeData.length - 1)) * chartWidth
                      const y = chartHeight - (d.totalBitcoin / maxBitcoin) * chartHeight
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f7931a"
                  strokeWidth="2"
                />
                
                {/* Purchase points */}
                {cumulativeData.map((d, i) => {
                  const x = (i / (cumulativeData.length - 1)) * chartWidth
                  const y = chartHeight - (d.totalBitcoin / maxBitcoin) * chartHeight
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#f7931a"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  )
                })}
              </svg>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Aug 2020</span>
              <span>Present</span>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">
                Accumulated {parseInt(summary.totalBitcoin).toLocaleString()} BTC 
                across {data.meta.totalPurchases} purchases since {data.meta.firstPurchase}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchases Timeline */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Purchases (Last 10)</h3>
          <div className="space-y-3">
            {recentPurchases.slice(0, 5).map((purchase, index) => (
              <motion.div
                key={purchase.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground w-20">
                    {new Date(purchase.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {purchase.amount.toLocaleString()} BTC
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @ ${purchase.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    ${(purchase.cost / 1000000).toFixed(1)}M
                  </div>
                  {purchase.pnlPercentage && (
                    <div className={`text-xs ${
                      purchase.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {purchase.pnlPercentage >= 0 ? '+' : ''}{purchase.pnlPercentage.toFixed(1)}%
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {recentPurchases.length > 5 && (
            <div className="text-center mt-4">
              <div className="text-sm text-muted-foreground">
                + {recentPurchases.length - 5} more purchases
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Disclaimer:</strong> {data.meta.disclaimer}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}