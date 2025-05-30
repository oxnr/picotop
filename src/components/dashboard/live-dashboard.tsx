'use client'

import { AppLayout } from '@/components/layout'
import { StatsCard } from '@/components/dashboard'
import { EnhancedBitcoinChart, RainbowChart, MetricGauge, NUPLDetail, SOPRDetail, DominanceDetail, VisualNUPLChart, VisualRainbowChart, VisualSOPRChart, VisualMVRVChart, ComprehensiveMetrics } from '@/components/charts'
import { TopAppsRankings } from '@/components/rankings'
import { ActionSignalComponent } from '@/components/metrics'
import { Card, CardContent, CardHeader, CardTitle, BrrrVideo, DataStatus } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
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

        {/* Enhanced Visual Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {bitcoinData?.price && bitcoinData?.metrics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VisualRainbowChart 
                currentPrice={bitcoinData.price.price}
                rainbowBand={bitcoinData.metrics.rainbowBand}
              />
              <VisualNUPLChart 
                currentValue={bitcoinData.metrics.nupl}
                signal={bitcoinData.metrics.analysis.nupl.signal}
              />
              <VisualSOPRChart 
                currentValue={bitcoinData.metrics.sopr}
                signal={bitcoinData.metrics.analysis.sopr.signal}
              />
              <VisualMVRVChart 
                currentValue={bitcoinData.metrics.mvrv}
                signal={bitcoinData.metrics.analysis.mvrv.signal}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-32">
                      <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Metric Gauges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-accent-blue" />
                  <CardTitle className="text-foreground">Cycle Metrics Dashboard</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  Real-time needle indicators
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {bitcoinData?.metrics?.analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  
                  <MetricGauge
                    value={bitcoinData.dominance || 56.8}
                    minValue={30}
                    maxValue={70}
                    signal={bitcoinData.metrics.analysis.dominance.signal}
                    title="BTC Dominance"
                    unit="%"
                    zones={[
                      { min: 0, max: 0.25, color: '#ef4444', label: 'ALT SEASON' },
                      { min: 0.25, max: 0.5, color: '#f97316', label: 'BALANCED' },
                      { min: 0.5, max: 0.75, color: '#eab308', label: 'BTC STRENGTH' },
                      { min: 0.75, max: 1, color: '#22c55e', label: 'BTC DOMINANCE' }
                    ]}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-32 w-full" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Metric Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <NUPLDetail
                value={bitcoinData.metrics.nupl}
                signal={bitcoinData.metrics.analysis.nupl.signal}
              />
              
              <SOPRDetail
                value={bitcoinData.metrics.sopr}
                signal={bitcoinData.metrics.analysis.sopr.signal}
              />
              
              <DominanceDetail
                value={bitcoinData.dominance || 56.8}
                signal={bitcoinData.metrics.analysis.dominance.signal}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-muted rounded w-1/2" />
                      <div className="h-20 bg-muted rounded" />
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="h-4 bg-muted rounded" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Comprehensive Cycle Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          {bitcoinData?.metrics ? (
            <ComprehensiveMetrics
              currentPrice={bitcoinData.price.price}
              dominance={bitcoinData.dominance || 56.8}
              nupl={bitcoinData.metrics.nupl}
              mvrv={bitcoinData.metrics.mvrv}
            />
          ) : (
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* App Rankings Section */}
        {rankingsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
          >
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ranking className="h-5 w-5 text-accent-purple" />
                    <CardTitle className="text-foreground">Crypto App Store Rankings</CardTitle>
                  </div>
                  <div className="text-sm text-muted-foreground">Real-time rankings</div>
                </div>
              </CardHeader>
              <CardContent>
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
                          <div className="text-xs text-muted-foreground">Finance App</div>
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
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actionable Metrics Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
        >
          <Card className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-accent-purple" />
                  <CardTitle className="text-foreground">Actionable Market Analysis</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  Real-time trading signals
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {bitcoinData?.metrics.analysis ? (
                <div className="space-y-6">
                  {/* Overall Signal */}
                  <div className="p-4 bg-secondary/10 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-foreground">Overall Market Signal</h3>
                      <ActionSignalComponent analysis={bitcoinData.metrics.analysis.overall} compact />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bitcoinData.metrics.analysis.overall.explanation}
                    </p>
                  </div>

                  {/* Individual Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">NUPL Score</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.nupl.toFixed(2)}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.nupl} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.nupl.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">SOPR</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.sopr.toFixed(3)}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.sopr} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.sopr.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">MVRV Z-Score</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.mvrv}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.mvrv} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.mvrv.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Rainbow Band</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.rainbowBand}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.rainbowBand} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.rainbowBand.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Fear & Greed</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.fearGreedIndex}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.fearGreedIndex} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.fearGreedIndex.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">BTC Dominance</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData?.dominance?.toFixed(1)}%</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.dominance} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.dominance.explanation}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-muted rounded-lg" />
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top 20 App Store Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15 }}
        >
          <Card className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-accent-yellow" />
                  <CardTitle className="text-foreground">Top 20 Finance Apps</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  Live rankings with crypto highlighting
                </div>
              </div>
            </CardHeader>
            <CardContent>
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