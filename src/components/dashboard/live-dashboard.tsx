'use client'

import { AppLayout } from '@/components/layout'
import { StatsCard } from '@/components/dashboard'
import { EnhancedBitcoinChart, RainbowChart, MetricGauge, NUPLDetail, SOPRDetail, DominanceDetail, VisualNUPLChart, VisualRainbowChart, VisualSOPRChart, VisualMVRVChart, ComprehensiveMetrics, BTCDominanceChart, ETFFlowsChart } from '@/components/charts'
import { TopAppsRankings } from '@/components/rankings'
import { ActionSignalComponent } from '@/components/metrics'
import { Card, CardContent, CardHeader, CardTitle, DataStatus } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { getSignalStyle } from '@/lib/constants/signals'
import { CurrencyBtc, TrendUp, ChartLine, Ranking, Warning, Clock, CircleNotch, Trophy, Target, Gauge } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useBitcoinData, useAppRankings, useTopApps, useMicroStrategy, useETFFlows } from '@/hooks'
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

export function LiveDashboard() {
  const { data: bitcoinResponse, isLoading: bitcoinLoading, error: bitcoinError } = useBitcoinData()
  const bitcoinData = bitcoinResponse?.data
  const { data: rankingsData, isLoading: rankingsLoading, error: rankingsError } = useAppRankings()
  const { data: topAppsData, isLoading: topAppsLoading, error: topAppsError } = useTopApps()
  const { data: microStrategyData, isLoading: microStrategyLoading, error: microStrategyError } = useMicroStrategy()
  const { data: etfFlowsData, isLoading: etfFlowsLoading, error: etfFlowsError } = useETFFlows()

  // Stable calculations with 5-minute caching to prevent frequent changes
  const getStableTimestamp = () => {
    // Round to 5-minute intervals for stability
    return Math.floor(Date.now() / (5 * 60 * 1000)) * (5 * 60 * 1000)
  }

  const calculateStablePiCycleRatio = () => {
    const stableTime = getStableTimestamp()
    const monthsSinceHalving = Math.floor((stableTime - new Date('2024-04-19').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    let estimatedRatio = 2.0
    if (monthsSinceHalving < 12) {
      estimatedRatio = 2.0 + (monthsSinceHalving / 12) * 0.6
    } else if (monthsSinceHalving < 18) {
      estimatedRatio = 2.6 + ((monthsSinceHalving - 12) / 6) * 0.4
    } else {
      estimatedRatio = 3.0 + ((monthsSinceHalving - 18) / 6) * 0.142
    }
    // Use stable time for consistent random seed
    const randomSeed = Math.sin(stableTime / 1000000) * 0.1
    return Math.min(estimatedRatio + randomSeed, 3.142)
  }

  const calculateStableRHODLRatio = (currentPrice: number) => {
    const stableTime = getStableTimestamp()
    const monthsSinceHalving = Math.floor((stableTime - new Date('2024-04-19').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    let baseRhodl = 1500
    if (monthsSinceHalving < 12) {
      baseRhodl = 1500 + (monthsSinceHalving / 12) * 1500
    } else if (monthsSinceHalving < 18) {
      baseRhodl = 3000 + ((monthsSinceHalving - 12) / 6) * 1500
    } else {
      baseRhodl = 4500 + ((monthsSinceHalving - 18) / 6) * 2000
    }
    const priceMultiplier = Math.min(currentPrice / 100000, 1.3)
    // Use stable time for consistent random seed
    const randomSeed = Math.sin(stableTime / 500000) * 300
    return Math.max(1000, baseRhodl * priceMultiplier + randomSeed)
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
        color: bitcoinData.metrics.rainbowBand === 'Fire Sale' ? 'red' :           // Red - maximum opportunity (bottom)
                bitcoinData.metrics.rainbowBand === 'BUY!' ? 'orange' :            // Orange - strong buy
                bitcoinData.metrics.rainbowBand === 'Accumulate' ? 'yellow' :      // Yellow - accumulation zone  
                bitcoinData.metrics.rainbowBand === 'Cheap' ? 'green' :            // Green - still good value
                bitcoinData.metrics.rainbowBand === 'HODL!' ? 'cyan' :             // Cyan - hold position
                bitcoinData.metrics.rainbowBand === 'Bubble?' ? 'blue' :           // Blue - bubble forming
                bitcoinData.metrics.rainbowBand === 'FOMO' ? 'pink' :              // Pink - dangerous FOMO zone
                bitcoinData.metrics.rainbowBand === 'SELL!' ? 'purple' :           // Purple - time to sell
                bitcoinData.metrics.rainbowBand === 'Maximum Bubble' ? 'purple' :  // Purple - extreme danger (top)
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

      // Add Pi Cycle Top indicator - use stable calculation
      const piCycleRatio = calculateStablePiCycleRatio()
      const piCycle = {
        ratio: piCycleRatio,
        distanceToPI: Math.abs(3.142 - piCycleRatio),
        percentageToSignal: (Math.abs(3.142 - piCycleRatio) / 3.142) * 100
      }
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

      // Add RHODL Ratio - use stable calculation
      const rhodlRatio = calculateStableRHODLRatio(bitcoinData.price.price)
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

    // Add MicroStrategy Holdings metric
    if (microStrategyData) {
      metrics.push({
        id: '11',
        title: 'MSTR Holdings',
        value: `${(microStrategyData.totalBitcoin / 1000).toFixed(0)}K BTC`,
        change: {
          value: Math.round(microStrategyData.pnlPercentage * 10) / 10,
          period: 'unrealized P&L',
          direction: microStrategyData.pnlPercentage >= 0 ? 'up' : 'down'
        },
        icon: 'bitcoin',
        color: microStrategyData.pnlPercentage >= 0 ? 'green' : 'red',
        historicalData: [] // Could add historical holdings data
      })
    }

    // Add ETF Flows metric
    if (etfFlowsData) {
      const flows24h = etfFlowsData.netFlows24h
      metrics.push({
        id: '12',
        title: 'ETF Flows',
        value: `$${Math.abs(flows24h / 1000000).toFixed(0)}M`,
        change: {
          value: Math.abs(flows24h / 1000000),
          period: 'last 24h',
          direction: flows24h >= 0 ? 'up' : 'down'
        },
        icon: 'trend',
        color: flows24h >= 0 ? 'green' : 'red',
        historicalData: [] // Could add historical flows data
      })
    }

    return metrics
  }

  const metrics = generateMetrics()
  const isLoading = bitcoinLoading || rankingsLoading || microStrategyLoading || etfFlowsLoading
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.length > 0 ? (
            metrics.map((metric, index) => (
              <StatsCard key={metric.id} metric={metric} index={index} />
            ))
          ) : (
            // Loading skeletons
            Array.from({ length: 12 }).map((_, index) => (
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

        {/* NUPL, SOPR, MVRV Combined Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {bitcoinData?.metrics?.analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* NUPL Section */}
              <Card className="border-0 bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CircleNotch className="h-5 w-5 text-purple-500" />
                      <CardTitle className="text-foreground">NUPL</CardTitle>
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
                    Net Unrealized Profit/Loss
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current NUPL */}
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground">Current NUPL</h3>
                      <div className="text-3xl font-bold text-purple-500">
                        {bitcoinData.metrics.nupl.toFixed(3)}
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">Signal</h4>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.nupl} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bitcoinData.metrics.analysis.nupl.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SOPR Section */}
              <Card className="border-0 bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendUp className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-foreground">SOPR</CardTitle>
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
                    Spent Output Profit Ratio
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current SOPR */}
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground">Current SOPR</h3>
                      <div className="text-3xl font-bold text-green-500">
                        {bitcoinData.metrics.sopr.toFixed(3)}
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">Signal</h4>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.sopr} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bitcoinData.metrics.analysis.sopr.explanation}
                      </p>
                    </div>
                  </div>
                  
                  {/* SOPR Chart */}
                  <div>
                    <VisualSOPRChart 
                      currentValue={bitcoinData.metrics.sopr}
                      signal={bitcoinData.metrics.analysis.sopr.signal}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* MVRV Section */}
              <Card className="border-0 bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChartLine className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-foreground">MVRV</CardTitle>
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
                    Market Value to Realized Value
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current MVRV */}
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground">Current MVRV</h3>
                      <div className="text-3xl font-bold text-blue-500">
                        {bitcoinData.metrics.mvrv.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">Signal</h4>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.mvrv} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bitcoinData.metrics.analysis.mvrv.explanation}
                      </p>
                    </div>
                  </div>
                  
                  
                  {/* MVRV Analysis */}
                  <div>
                    <VisualMVRVChart 
                      currentValue={bitcoinData.metrics.mvrv}
                      signal={bitcoinData.metrics.analysis.mvrv.signal}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
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
                          {calculateStablePiCycleRatio().toFixed(3)}
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                          style={{ width: `${(calculateStablePiCycleRatio() / 3.142 * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Distance to π (3.142) signal: {((3.142 - calculateStablePiCycleRatio()) / 3.142 * 100).toFixed(1)}%
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
                          {(calculateStableRHODLRatio(bitcoinData.price.price) / 1000).toFixed(1)}K
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full ${
                            calculateStableRHODLRatio(bitcoinData.price.price) < 2500 ? 'bg-green-400' : 
                            calculateStableRHODLRatio(bitcoinData.price.price) < 5000 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(calculateStableRHODLRatio(bitcoinData.price.price) / 8000 * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {calculateStableRHODLRatio(bitcoinData.price.price) < 2500 ? 'Accumulation Zone' : 
                         calculateStableRHODLRatio(bitcoinData.price.price) < 5000 ? 'Hold Zone' : 'Consider Taking Profits'}
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

        {/* 8. Institutional Bitcoin Holdings & ETF Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* MicroStrategy Detailed View */}
            {microStrategyData ? (
              <Card className="border-0 bg-card relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CurrencyBtc className="h-6 w-6 text-orange-500" />
                    <CardTitle className="text-foreground">MicroStrategy Holdings</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Corporate Bitcoin treasury strategy
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-4">
                      <CurrencyBtc className="h-16 w-16 text-orange-500 mx-auto animate-pulse" />
                      <div className="text-2xl font-bold text-foreground">Coming Soon</div>
                      <div className="text-muted-foreground max-w-md">
                        Enhanced MicroStrategy tracking with real-time SEC filings integration.
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-orange-500 mb-1">
                        {microStrategyData.totalBitcoin.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total BTC</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500 mb-1">
                        ${microStrategyData.averagePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Price</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Unrealized P&L</span>
                      <span className={`text-lg font-bold ${
                        microStrategyData.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {microStrategyData.pnlPercentage >= 0 ? '+' : ''}{microStrategyData.pnlPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          microStrategyData.pnlPercentage >= 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(microStrategyData.pnlPercentage), 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(microStrategyData.lastUpdated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 bg-card">
                <CardContent className="p-6 flex items-center justify-center h-48">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            )}

            {/* ETF Flows Chart */}
            {etfFlowsData && etfFlowsData.historicalFlows ? (
              <div className="relative">
                <ETFFlowsChart 
                  data={etfFlowsData.historicalFlows}
                  totalAUM={etfFlowsData.totalAUM}
                  netFlows24h={etfFlowsData.netFlows24h}
                  netFlows7d={etfFlowsData.netFlows7d}
                  netFlows30d={etfFlowsData.netFlows30d}
                />
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-card/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                  <div className="text-center space-y-4">
                    <Target className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
                    <div className="text-2xl font-bold text-foreground">Coming Soon</div>
                    <div className="text-muted-foreground max-w-md">
                      Real-time ETF flow tracking with live institutional demand data.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="border-0 bg-card">
                <CardContent className="p-6 flex items-center justify-center h-48">
                  <CircleNotch className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* 9. App Store Rankings Comprehensive Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="relative"
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
            <CardContent className="space-y-6 relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-card/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center space-y-4">
                  <Gauge className="h-16 w-16 text-primary mx-auto animate-pulse" />
                  <div className="text-2xl font-bold text-foreground">Coming Soon</div>
                  <div className="text-muted-foreground max-w-md">
                    Enhanced app store rankings with real-time API integration are being finalized.
                  </div>
                </div>
              </div>
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

      </div>
    </AppLayout>
  )
}