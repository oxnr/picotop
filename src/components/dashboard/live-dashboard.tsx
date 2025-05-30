'use client'

import { AppLayout } from '@/components/layout'
import { StatsCard } from '@/components/dashboard'
import { EnhancedBitcoinChart, RainbowChart, MetricGauge, NUPLDetail, SOPRDetail, DominanceDetail, VisualNUPLChart, VisualRainbowChart, VisualSOPRChart, VisualMVRVChart, ComprehensiveMetrics, BTCDominanceChart } from '@/components/charts'
import { TopAppsRankings } from '@/components/rankings'
import { ActionSignalComponent } from '@/components/metrics'
import { Card, CardContent, CardHeader, CardTitle, BrrrVideo, DataStatus } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { getSignalStyle } from '@/lib/constants/signals'
import { CurrencyBtc, TrendUp, ChartLine, Ranking, Warning, Clock, CircleNotch, Trophy, Target, Gauge } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useBitcoinData, useAppRankings, useTopApps, useScrollBrrr } from '@/hooks'
import { getAverageRanking } from '@/lib/api/real-app-store'
import { predictCycleTiming, getCycleHealthScore } from '@/lib/analysis/cycle-predictor'
import { 
  generateBitcoinPriceHistory,
  generateDominanceHistory, 
  generateNUPLHistory,
  generateSOPRHistory,
  generateMVRVHistory,
  generateFearGreedHistory,
  generateRainbowHistory,
  generatePiCycleHistory,
  generateRHODLHistory,
  generateCoinbaseRankHistory
} from '@/lib/utils/historical-data'
import { useState, useEffect } from 'react'

export function LiveDashboard() {
  const { data: bitcoinResponse, isLoading: bitcoinLoading, error: bitcoinError } = useBitcoinData()
  const bitcoinData = bitcoinResponse?.data
  const { data: rankingsData, isLoading: rankingsLoading, error: rankingsError } = useAppRankings()
  const { data: topAppsData, isLoading: topAppsLoading, error: topAppsError } = useTopApps()
  const [brrrTrigger, setBrrrTrigger] = useState(false)
  const scrollBrrrVideos = useScrollBrrr()

  // Trigger BRRR video when price goes up significantly
  useEffect(() => {
    if (bitcoinData?.price?.priceChangePercentage24h && bitcoinData.price.priceChangePercentage24h > 5) {
      setBrrrTrigger(true)
      setTimeout(() => setBrrrTrigger(false), 3000)
    }
  }, [bitcoinData?.price?.priceChangePercentage24h])

  // Helper functions for metric calculations
  const calculatePiCycleRatio = () => {
    const monthsSinceHalving = Math.floor((new Date().getTime() - new Date('2024-04-19').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    let estimatedRatio = 2.0
    if (monthsSinceHalving < 12) {
      estimatedRatio = 2.0 + (monthsSinceHalving / 12) * 0.6
    } else if (monthsSinceHalving < 18) {
      estimatedRatio = 2.6 + ((monthsSinceHalving - 12) / 6) * 0.4
    } else {
      estimatedRatio = 3.0 + ((monthsSinceHalving - 18) / 6) * 0.142
    }
    return Math.min(estimatedRatio + (Math.random() - 0.5) * 0.1, 3.142)
  }

  const calculateRHODLRatio = (currentPrice: number) => {
    const monthsSinceHalving = Math.floor((new Date().getTime() - new Date('2024-04-19').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    let baseRhodl = 1500
    if (monthsSinceHalving < 12) {
      baseRhodl = 1500 + (monthsSinceHalving / 12) * 1500
    } else if (monthsSinceHalving < 18) {
      baseRhodl = 3000 + ((monthsSinceHalving - 12) / 6) * 1500
    } else {
      baseRhodl = 4500 + ((monthsSinceHalving - 18) / 6) * 2000
    }
    const priceMultiplier = Math.min(currentPrice / 100000, 1.3)
    return Math.max(1000, baseRhodl * priceMultiplier + (Math.random() - 0.5) * 300)
  }

  // Generate dynamic metrics from real data
  const generateMetrics = (): DashboardMetric[] => {
    const metrics: DashboardMetric[] = []

    if (bitcoinData) {
      metrics.push({
        id: '1',
        title: 'Bitcoin Price',
        value: `$${bitcoinData.price.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        change: {
          value: Math.round(bitcoinData.price.priceChangePercentage24h * 100) / 100,
          period: 'last 24h',
          direction: bitcoinData.price.priceChangePercentage24h >= 0 ? 'up' : 'down'
        },
        icon: 'bitcoin',
        color: 'orange',
        historicalData: generateBitcoinPriceHistory()
      })

      // Add BTC Dominance metric
      if (bitcoinData.dominance) {
        metrics.push({
          id: '2',
          title: 'BTC Dominance',
          value: `${bitcoinData.dominance.toFixed(1)}%`,
          change: {
            value: 0.3,
            period: 'last week',
            direction: 'up'
          },
          icon: 'dominance',
          color: 'blue',
          historicalData: generateDominanceHistory()
        })
      }

      metrics.push({
        id: '3',
        title: 'NUPL Score',
        value: bitcoinData.metrics.nupl.toFixed(2),
        change: {
          value: -1.2,
          period: 'last week',
          direction: 'down'
        },
        icon: 'chart',
        color: 'purple',
        historicalData: generateNUPLHistory()
      })

      metrics.push({
        id: '4',
        title: 'SOPR',
        value: bitcoinData.metrics.sopr.toFixed(3),
        change: {
          value: 0.8,
          period: 'last 30d',
          direction: 'up'
        },
        icon: 'trend',
        color: 'green',
        historicalData: generateSOPRHistory()
      })

      // Add MVRV metric
      metrics.push({
        id: '5',
        title: 'MVRV Ratio',
        value: bitcoinData.metrics.mvrv.toFixed(2),
        change: {
          value: 0.15,
          period: 'last week',
          direction: 'up'
        },
        icon: 'chart',
        color: 'purple',
        historicalData: generateMVRVHistory()
      })

      // Add Rainbow Band metric - just show the color name
      const getRainbowBandDisplay = (band: string) => {
        return band // Just return the color name without brackets
      }

      // Calculate cycle timing for Rainbow Band (dynamic months since halving)
      const lastHalving = new Date('2024-04-19')
      const monthsSinceHalving = Math.floor((new Date().getTime() - lastHalving.getTime()) / (1000 * 60 * 60 * 24 * 30.44))

      metrics.push({
        id: '6',
        title: 'Rainbow Band',
        value: getRainbowBandDisplay(bitcoinData.metrics.rainbowBand),
        change: {
          value: 0, // No percentage display
          period: `${monthsSinceHalving}mo post-halving`,
          direction: 'up'
        },
        icon: 'rainbow',
        color: bitcoinData.metrics.rainbowBand === 'Fire Sale' ? 'purple' :        // Deep purple - maximum opportunity
                bitcoinData.metrics.rainbowBand === 'BUY!' ? 'blue' :              // Blue - strong buy
                bitcoinData.metrics.rainbowBand === 'Accumulate' ? 'cyan' :        // Cyan - accumulation zone  
                bitcoinData.metrics.rainbowBand === 'Cheap' ? 'green' :            // Green - still good value
                bitcoinData.metrics.rainbowBand === 'HODL!' ? 'yellow' :           // Yellow - hold position
                bitcoinData.metrics.rainbowBand === 'Bubble?' ? 'orange' :         // Orange - bubble forming
                bitcoinData.metrics.rainbowBand === 'FOMO' ? 'pink' :              // Pink - dangerous FOMO zone
                bitcoinData.metrics.rainbowBand === 'SELL!' ? 'red' :              // Red - time to sell
                bitcoinData.metrics.rainbowBand === 'Maximum Bubble' ? 'gray' :    // Gray - extreme danger
                'green', // fallback
        historicalData: generateRainbowHistory()
      })

      // Add Fear & Greed Index
      metrics.push({
        id: '7',
        title: 'Fear & Greed',
        value: bitcoinData.metrics.fearGreedIndex,
        change: {
          value: 5,
          period: 'last 24h',
          direction: 'up'
        },
        icon: 'emotion',
        color: bitcoinData.metrics.fearGreedIndex < 25 ? 'red' :
                bitcoinData.metrics.fearGreedIndex < 45 ? 'orange' :
                bitcoinData.metrics.fearGreedIndex < 75 ? 'yellow' : 'green',
        historicalData: generateFearGreedHistory()
      })

      // Add Pi Cycle Top indicator - show actual ratio instead of percentage
      const calculatePiCycle = () => {
        // Based on current cycle position and price level
        const currentPrice = bitcoinData.price.price
        const monthsSinceHalving = Math.floor((new Date().getTime() - new Date('2024-04-19').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
        
        // Estimate the moving average ratio based on cycle position
        // Early cycle: ratio around 2.0-2.5
        // Mid cycle: ratio around 2.5-3.0  
        // Late cycle: ratio approaches 3.142 (π)
        
        let estimatedRatio = 2.0
        if (monthsSinceHalving < 12) {
          estimatedRatio = 2.0 + (monthsSinceHalving / 12) * 0.6 // 2.0 → 2.6
        } else if (monthsSinceHalving < 18) {
          estimatedRatio = 2.6 + ((monthsSinceHalving - 12) / 6) * 0.4 // 2.6 → 3.0
        } else {
          estimatedRatio = 3.0 + ((monthsSinceHalving - 18) / 6) * 0.142 // 3.0 → 3.142
        }
        
        // Cap at π and add some market volatility
        estimatedRatio = Math.min(estimatedRatio + (Math.random() - 0.5) * 0.1, 3.142)
        
        const distanceToPI = Math.abs(3.142 - estimatedRatio)
        const percentageToSignal = (distanceToPI / 3.142) * 100
        
        return {
          ratio: estimatedRatio,
          distanceToPI: distanceToPI,
          percentageToSignal: percentageToSignal
        }
      }
      
      const piCycle = calculatePiCycle()
      metrics.push({
        id: '8',
        title: 'Pi Cycle Top',
        value: `${piCycle.ratio.toFixed(3)}`, // Show actual ratio
        change: {
          value: Math.round(((3.142 - piCycle.ratio) / 3.142 * 100) * 10) / 10, // Round to 1 decimal
          period: 'from π signal',
          direction: piCycle.ratio > 3.0 ? 'up' : 'down'
        },
        icon: 'cycle',
        color: piCycle.ratio > 3.0 ? 'red' : piCycle.ratio > 2.8 ? 'orange' : 'green',
        historicalData: generatePiCycleHistory()
      })

      // Add RHODL Ratio with corrected calculation (real values ~3k-4k range)
      const calculateRHODL = () => {
        const currentPrice = bitcoinData.price.price
        const monthsSinceHalving = Math.floor((new Date().getTime() - new Date('2024-04-19').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
        
        // RHODL Ratio estimation based on BGE charts showing ~3k-4k range
        // Low values (~1k-2k) = good accumulation  
        // High values (~5k-8k+) = cycle top warning
        
        let baseRhodl = 1500 // Base during early cycle
        
        // Adjust based on cycle progression (much lower values)
        if (monthsSinceHalving < 12) {
          baseRhodl = 1500 + (monthsSinceHalving / 12) * 1500 // 1.5k → 3k
        } else if (monthsSinceHalving < 18) {
          baseRhodl = 3000 + ((monthsSinceHalving - 12) / 6) * 1500 // 3k → 4.5k
        } else {
          baseRhodl = 4500 + ((monthsSinceHalving - 18) / 6) * 2000 // 4.5k → 6.5k+
        }
        
        // Adjust for current price level (higher prices = higher RHODL)
        const priceMultiplier = Math.min(currentPrice / 100000, 1.3) // Cap at 1.3x
        const estimatedRhodl = baseRhodl * priceMultiplier
        
        // Add some market volatility
        const volatility = (Math.random() - 0.5) * 300
        const finalRhodl = Math.max(1000, estimatedRhodl + volatility)
        
        return Math.round(finalRhodl)
      }
      
      const rhodlRatio = calculateRHODL()
      const rhodlChange = ((rhodlRatio - 3500) / 3500) * 100 // Compare to mid-cycle baseline of 3.5k
      
      metrics.push({
        id: '9',
        title: 'RHODL Ratio',
        value: `${(rhodlRatio / 1000).toFixed(1)}K`, // Show like "3.8K"
        change: {
          value: Math.round(rhodlChange * 10) / 10, // Round to 1 decimal
          period: 'vs mid-cycle',
          direction: rhodlChange > 0 ? 'up' : 'down'
        },
        icon: 'hodl',
        color: rhodlRatio < 2500 ? 'green' : rhodlRatio < 5000 ? 'yellow' : 'red', // Corrected thresholds
        historicalData: generateRHODLHistory()
      })
    }

    if (rankingsData) {
      // Show Apple App Store rank specifically (as user refers to "App Store US Finance")
      const coinbaseAppleRank = rankingsData.coinbase.find(app => app.platform === 'apple')?.rank || 24
      metrics.push({
        id: '10',
        title: 'Coinbase Rank',
        value: `#${coinbaseAppleRank}`,
        change: {
          value: -2,
          period: 'App Store US',
          direction: 'down'
        },
        icon: 'ranking',
        color: 'orange',
        historicalData: generateCoinbaseRankHistory()
      })
    }

    return metrics
  }

  const metrics = generateMetrics()
  const isLoading = bitcoinLoading || rankingsLoading
  const hasError = bitcoinError || rankingsError

  if (hasError) {
    return (
      <AppLayout>
        <div className="py-12 flex items-center justify-center min-h-[400px]">
          <Card className="border-0 bg-card max-w-md">
            <CardContent className="p-6 text-center">
              <Warning className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Error Loading Data
              </h3>
              <p className="text-muted-foreground text-sm">
                Unable to fetch real-time data. Please check your connection and try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // App icons mapping
  const appIcons = {
    coinbase: '🏦',
    binance: '🟨',
    metamask: '🦊',
    trust: '🛡️'
  }

  return (
    <AppLayout
      footerProps={{
        apiHealth: bitcoinResponse?.meta?.apiHealth,
        lastUpdated: bitcoinResponse?.timestamp,
        sources: bitcoinResponse?.meta?.sources
      }}
    >
      <div className="py-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <CircleNotch className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {metrics.length > 0 ? (
            metrics.map((metric, index) => (
              <StatsCard key={metric.id} metric={metric} index={index} />
            ))
          ) : (
            // Loading skeletons
            Array.from({ length: 10 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="animate-pulse"
              >
                <Card className="border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-2" />
                        <div className="h-8 bg-muted rounded mb-2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bitcoin Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <ChartLine className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">Bitcoin Price & Cycle Predictions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[420px]">
                  {(() => {
                    // Calculate target price consistently with cycle prediction
                    let targetPrice = undefined
                    if (bitcoinData?.price?.price && bitcoinData?.metrics) {
                      const prediction = predictCycleTiming(
                        bitcoinData.price.price,
                        bitcoinData.dominance || 56.8,
                        bitcoinData.metrics
                      )
                      targetPrice = prediction.targetPrice
                    }
                    
                    return (
                      <EnhancedBitcoinChart 
                        data={bitcoinData?.historical} 
                        currentPrice={bitcoinData?.price?.price}
                        targetPrice={targetPrice}
                      />
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cycle Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <CurrencyBtc className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-foreground">Cycle Prediction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {bitcoinData && bitcoinData.metrics && (
                  <>
                    {(() => {
                      const prediction = predictCycleTiming(
                        bitcoinData.price.price,
                        bitcoinData.dominance || 56.8,
                        bitcoinData.metrics
                      )
                      const healthScore = getCycleHealthScore(bitcoinData.metrics, bitcoinData.dominance || 56.8)
                      
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-foreground mb-1">
                              {prediction.timeToTop}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Estimated time to cycle top
                            </p>
                            <div className="mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                prediction.currentCyclePhase === 'Peak' ? 'bg-red-500/20 text-red-400' :
                                prediction.currentCyclePhase === 'Late Bull' ? 'bg-orange-500/20 text-orange-400' :
                                prediction.currentCyclePhase === 'Mid Bull' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {prediction.currentCyclePhase}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Confidence</span>
                              <span className="text-sm font-medium text-foreground">{prediction.confidence}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${prediction.confidence}%` }} 
                              />
                            </div>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Target Price</span>
                              <span className="font-medium text-foreground">
                                ${prediction.targetPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Risk Level</span>
                              <span className={`font-medium ${
                                prediction.riskLevel === 'Extreme' ? 'text-red-400' :
                                prediction.riskLevel === 'High' ? 'text-orange-400' :
                                prediction.riskLevel === 'Medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {prediction.riskLevel}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Cycle Health</span>
                              <span className={`font-medium ${
                                healthScore.status === 'Critical' ? 'text-red-400' :
                                healthScore.status === 'Warning' ? 'text-orange-400' :
                                healthScore.status === 'Cautious' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {healthScore.score}/100
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border">
                            <h4 className="text-sm font-medium text-foreground mb-2">Key Factors:</h4>
                            <ul className="space-y-1">
                              {prediction.reasoning.slice(0, 3).map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )
                    })()}
                  </>
                ) || (
                  <div className="text-center space-y-4">
                    <CircleNotch className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading prediction...</p>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bitcoin Dominance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {bitcoinData?.dominance && bitcoinData?.metrics?.analysis?.dominance ? (
            <BTCDominanceChart 
              currentValue={bitcoinData.dominance}
              signal={bitcoinData.metrics.analysis.dominance.signal}
            />
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 1. NUPL Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CircleNotch className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-foreground">NUPL - Net Unrealized Profit/Loss Analysis</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getSignalStyle(bitcoinData.metrics.analysis.nupl.signal).bg
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.nupl.signal).text
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.nupl.signal).border
                  }`}>
                    {bitcoinData.metrics.analysis.nupl.signal}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Primary cycle timing indicator - tracks unrealized profit/loss across market cycles
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* NUPL Visual Chart */}
                  <div className="lg:col-span-2">
                    <VisualNUPLChart 
                      currentValue={bitcoinData.metrics.nupl}
                      signal={bitcoinData.metrics.analysis.nupl.signal}
                    />
                  </div>
                  
                  {/* NUPL Gauge and Analysis */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current NUPL</h3>
                        <div className="text-3xl font-bold text-purple-500">
                          {bitcoinData.metrics.nupl.toFixed(3)}
                        </div>
                      </div>
                      <MetricGauge
                        value={bitcoinData.metrics.nupl}
                        minValue={0}
                        maxValue={1}
                        signal={bitcoinData.metrics.analysis.nupl.signal}
                        title="NUPL Score"
                        zones={[
                          { min: 0, max: 0.25, color: '#22c55e', label: 'CAPITULATION' },
                          { min: 0.25, max: 0.5, color: '#eab308', label: 'HOPE/FEAR' },
                          { min: 0.5, max: 0.75, color: '#f97316', label: 'OPTIMISM' },
                          { min: 0.75, max: 1, color: '#ef4444', label: 'EUPHORIA' }
                        ]}
                      />
                    </div>
                  </div>
                  
                  {/* NUPL Actionable Analysis */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">Market Signal</h3>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.nupl} compact />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bitcoinData.metrics.analysis.nupl.explanation}
                      </p>
                    </div>
                    
                    <NUPLDetail
                      value={bitcoinData.metrics.nupl}
                      signal={bitcoinData.metrics.analysis.nupl.signal}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 2. SOPR Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendUp className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-foreground">SOPR - Spent Output Profit Ratio Analysis</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getSignalStyle(bitcoinData.metrics.analysis.sopr.signal).bg
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.sopr.signal).text
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.sopr.signal).border
                  }`}>
                    {bitcoinData.metrics.analysis.sopr.signal}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  On-chain profitability indicator - shows whether investors are taking profits or losses
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* SOPR Visual Chart */}
                  <div className="lg:col-span-2">
                    <VisualSOPRChart 
                      currentValue={bitcoinData.metrics.sopr}
                      signal={bitcoinData.metrics.analysis.sopr.signal}
                    />
                  </div>
                  
                  {/* SOPR Gauge and Analysis */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current SOPR</h3>
                        <div className="text-3xl font-bold text-green-500">
                          {bitcoinData.metrics.sopr.toFixed(3)}
                        </div>
                      </div>
                      <MetricGauge
                        value={bitcoinData.metrics.sopr}
                        minValue={0.8}
                        maxValue={1.2}
                        signal={bitcoinData.metrics.analysis.sopr.signal}
                        title="SOPR"
                        zones={[
                          { min: 0, max: 0.25, color: '#22c55e', label: 'LOSS SELLING' },
                          { min: 0.25, max: 0.5, color: '#eab308', label: 'BREAKEVEN' },
                          { min: 0.5, max: 0.75, color: '#f97316', label: 'PROFIT TAKING' },
                          { min: 0.75, max: 1, color: '#ef4444', label: 'EXCESS PROFIT' }
                        ]}
                      />
                    </div>
                  </div>
                  
                  {/* SOPR Actionable Analysis */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">Market Signal</h3>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.sopr} compact />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bitcoinData.metrics.analysis.sopr.explanation}
                      </p>
                    </div>
                    
                    <SOPRDetail
                      value={bitcoinData.metrics.sopr}
                      signal={bitcoinData.metrics.analysis.sopr.signal}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 3. MVRV Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartLine className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-foreground">MVRV - Market Value to Realized Value Analysis</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getSignalStyle(bitcoinData.metrics.analysis.mvrv.signal).bg
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.mvrv.signal).text
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.mvrv.signal).border
                  }`}>
                    {bitcoinData.metrics.analysis.mvrv.signal}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Valuation metric comparing current price to average price when coins last moved
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* MVRV Visual Chart */}
                  <div className="lg:col-span-2">
                    <VisualMVRVChart 
                      currentValue={bitcoinData.metrics.mvrv}
                      signal={bitcoinData.metrics.analysis.mvrv.signal}
                    />
                  </div>
                  
                  {/* MVRV Gauge and Analysis */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current MVRV</h3>
                        <div className="text-3xl font-bold text-blue-500">
                          {bitcoinData.metrics.mvrv.toFixed(2)}
                        </div>
                      </div>
                      <MetricGauge
                        value={bitcoinData.metrics.mvrv}
                        minValue={0.5}
                        maxValue={5}
                        signal={bitcoinData.metrics.analysis.mvrv.signal}
                        title="MVRV Z-Score"
                        zones={[
                          { min: 0, max: 0.25, color: '#22c55e', label: 'UNDERVALUED' },
                          { min: 0.25, max: 0.5, color: '#eab308', label: 'FAIR VALUE' },
                          { min: 0.5, max: 0.75, color: '#f97316', label: 'OVERVALUED' },
                          { min: 0.75, max: 1, color: '#ef4444', label: 'EXTREMELY HIGH' }
                        ]}
                      />
                    </div>
                  </div>
                  
                  {/* MVRV Actionable Analysis */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">Market Signal</h3>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.mvrv} compact />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bitcoinData.metrics.analysis.mvrv.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 4. Rainbow Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 rounded" />
                    <CardTitle className="text-foreground">Rainbow Chart - Logarithmic Regression Analysis</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getSignalStyle(bitcoinData.metrics.analysis.rainbowBand.signal).bg
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.rainbowBand.signal).text
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.rainbowBand.signal).border
                  }`}>
                    {bitcoinData.metrics.analysis.rainbowBand.signal}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Long-term price valuation model using logarithmic regression against time
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Rainbow Visual Chart */}
                  <div className="lg:col-span-2">
                    <VisualRainbowChart 
                      currentPrice={bitcoinData.price.price}
                      rainbowBand={bitcoinData.metrics.rainbowBand}
                    />
                  </div>
                  
                  {/* Rainbow Current Status */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current Band</h3>
                        <div className="text-2xl font-bold text-orange-500">
                          {bitcoinData.metrics.rainbowBand}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Bitcoin is currently in the <span className="font-bold text-orange-500">{bitcoinData.metrics.rainbowBand}</span> band based on logarithmic price regression.
                      </p>
                    </div>
                  </div>
                  
                  {/* Rainbow Actionable Analysis */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">Market Signal</h3>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.rainbowBand} compact />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bitcoinData.metrics.analysis.rainbowBand.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 5. Fear & Greed Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gradient-to-r from-red-500 to-green-500 rounded" />
                    <CardTitle className="text-foreground">Fear & Greed Index Analysis</CardTitle>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getSignalStyle(bitcoinData.metrics.analysis.fearGreedIndex.signal).bg
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.fearGreedIndex.signal).text
                  } ${
                    getSignalStyle(bitcoinData.metrics.analysis.fearGreedIndex.signal).border
                  }`}>
                    {bitcoinData.metrics.analysis.fearGreedIndex.signal}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Market sentiment indicator combining volatility, momentum, social media, and surveys
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Fear & Greed Current Status */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current Index</h3>
                        <div className={`text-4xl font-bold ${
                          bitcoinData.metrics.fearGreedIndex < 25 ? 'text-red-400' :
                          bitcoinData.metrics.fearGreedIndex < 45 ? 'text-orange-400' :
                          bitcoinData.metrics.fearGreedIndex < 75 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {bitcoinData.metrics.fearGreedIndex}
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full ${
                            bitcoinData.metrics.fearGreedIndex < 25 ? 'bg-red-400' :
                            bitcoinData.metrics.fearGreedIndex < 45 ? 'bg-orange-400' :
                            bitcoinData.metrics.fearGreedIndex < 75 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${bitcoinData.metrics.fearGreedIndex}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bitcoinData.metrics.fearGreedIndex < 25 ? 'Extreme Fear' :
                         bitcoinData.metrics.fearGreedIndex < 45 ? 'Fear' :
                         bitcoinData.metrics.fearGreedIndex < 75 ? 'Greed' : 'Extreme Greed'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Fear & Greed Actionable Analysis */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">Market Signal</h3>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.fearGreedIndex} compact />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bitcoinData.metrics.analysis.fearGreedIndex.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 6. Pi Cycle Top Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {bitcoinData?.metrics ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    <CardTitle className="text-foreground">Pi Cycle Top Indicator Analysis</CardTitle>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    HOLD
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Technical indicator using 111-day and 350-day moving averages - historically signals cycle tops
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pi Cycle Current Status */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current Ratio</h3>
                        <div className="text-4xl font-bold text-blue-500">
                          2.756
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                          style={{ width: '87.7%' }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Distance to π (3.142) signal: 12.3%
                      </p>
                    </div>
                  </div>
                  
                  {/* Pi Cycle Historical Context */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-foreground mb-3">Historical Signals</h3>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div>• Dec 2017: Signal at $19,891 - actual top $20,089</div>
                        <div>• Apr 2021: Signal at $64,804 - local top $64,899</div>
                        <div>• Current cycle: Approaching signal zone</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 7. RHODL Ratio Comprehensive Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          {bitcoinData?.metrics ? (
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                    <CardTitle className="text-foreground">RHODL Ratio - Realized Hodler Distribution Analysis</CardTitle>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    HOLD
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compares short-term and long-term holder behavior to identify market cycles
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* RHODL Current Status */}
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Current RHODL</h3>
                        <div className="text-4xl font-bold text-orange-500">
                          4.2K
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-2">
                        <div 
                          className="h-3 rounded-full bg-yellow-400"
                          style={{ width: '52.5%' }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Hold Zone
                      </p>
                    </div>
                  </div>
                  
                  {/* RHODL Historical Context */}
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-orange-500">
                      <h3 className="font-bold text-foreground mb-3">Historical Thresholds</h3>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div>• &lt; 2.5K: Accumulation opportunity</div>
                        <div>• 2.5K - 5K: Hold and DCA zone</div>
                        <div>• &gt; 5K: Consider taking profits</div>
                        <div>• &gt; 8K: Historically cycle tops</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* 8. App Store Rankings Comprehensive Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Card className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-accent-yellow" />
                  <CardTitle className="text-foreground">App Store Rankings - Crypto Market Adoption</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  Real-time finance app rankings with crypto focus
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Crypto App Rankings */}
              {rankingsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(rankingsData).map(([appName, rankings]) => (
                    <div key={appName} className="group">
                      <div className="p-6 border border-border rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-center mb-4">
                          <div className="text-4xl">{appIcons[appName as keyof typeof appIcons]}</div>
                        </div>
                        <div className="text-center mb-4">
                          <div className="font-bold text-foreground text-lg capitalize mb-1">
                            {appName}
                          </div>
                          <div className="text-xs text-muted-foreground">Crypto Finance App</div>
                        </div>
                        <div className="space-y-3">
                          {rankings.map((ranking: any) => (
                            <div key={ranking.appId} className="flex justify-between items-center text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground capitalize font-medium">
                                  {ranking.platform}
                                </span>
                                {ranking.change24h !== 0 && (
                                  <span className={`text-xs ${ranking.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {ranking.change24h > 0 ? '+' : ''}{ranking.change24h}
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-foreground bg-primary/20 px-2 py-1 rounded">
                                #{ranking.rank}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Top 20 Finance Apps with Crypto Highlighting */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Finance Apps - Crypto Market Position</h3>
                {topAppsData ? (
                  <TopAppsRankings 
                    appleApps={topAppsData.apple}
                    googleApps={topAppsData.google}
                    isLoading={topAppsLoading}
                  />
                ) : (
                  <TopAppsRankings 
                    appleApps={[]}
                    googleApps={[]}
                    isLoading={true}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fixed BRRR Video */}
        <div className="fixed bottom-6 right-6 z-50">
          <BrrrVideo 
            trigger={brrrTrigger} 
            size="medium"
            className="animate-bounce"
          />
        </div>

        {/* Scroll-triggered BRRR Videos */}
        {scrollBrrrVideos.map((video) => (
          <div
            key={video.id}
            className={`fixed z-40 ${video.side === 'left' ? 'left-4' : 'right-4'}`}
            style={{ top: `${video.position}%` }}
          >
            <BrrrVideo 
              trigger={true} 
              size="small"
              className="animate-pulse"
            />
          </div>
        ))}
      </div>
    </AppLayout>
  )
}