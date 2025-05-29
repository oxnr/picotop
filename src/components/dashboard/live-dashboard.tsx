'use client'

import { AppLayout } from '@/components/layout'
import { StatsCard } from '@/components/dashboard'
import { SimpleBitcoinChart, RainbowChart } from '@/components/charts'
import { TopAppsRankings } from '@/components/rankings'
import { ActionSignalComponent } from '@/components/metrics'
import { Card, CardContent, CardHeader, CardTitle, BrrrVideo } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { CurrencyBtc, TrendUp, ChartLine, Ranking, Warning, Clock, CircleNotch, Trophy, Target } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useBitcoinData, useAppRankings, useTopApps } from '@/hooks'
import { getAverageRanking } from '@/lib/api/app-store'
import { useState, useEffect } from 'react'

export function LiveDashboard() {
  const { data: bitcoinData, isLoading: bitcoinLoading, error: bitcoinError } = useBitcoinData()
  const { data: rankingsData, isLoading: rankingsLoading, error: rankingsError } = useAppRankings()
  const { data: topAppsData, isLoading: topAppsLoading, error: topAppsError } = useTopApps()
  const [brrrTrigger, setBrrrTrigger] = useState(false)

  // Trigger BRRR video when price goes up significantly
  useEffect(() => {
    if (bitcoinData?.price?.priceChangePercentage24h > 5) {
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
        color: 'orange'
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
          color: 'blue'
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
        color: 'purple'
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
        color: 'green'
      })
    }

    if (rankingsData) {
      const coinbaseAvgRank = getAverageRanking(rankingsData.coinbase)
      metrics.push({
        id: '5',
        title: 'Coinbase Rank',
        value: `#${coinbaseAvgRank}`,
        change: {
          value: -2,
          period: 'this week',
          direction: 'down'
        },
        icon: 'ranking',
        color: 'orange'
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
              <h3 className="text-lg font-semibold text-white mb-2">
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
    phantom: '👻',
    metamask: '🦊',
    trust: '🛡️'
  }

  return (
    <AppLayout>
      <div className="py-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                CycleTop
              </h1>
              <p className="text-muted-foreground text-lg">
                Sell the Pico Top 📈💸
              </p>
            </div>
          </div>
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
            Array.from({ length: 5 }).map((_, index) => (
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartLine className="h-5 w-5 text-primary" />
                    <CardTitle className="text-white">Bitcoin Price Chart</CardTitle>
                  </div>
                  <div className="text-sm text-muted-foreground">Interactive timeframes 📈</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <SimpleBitcoinChart data={bitcoinData?.historical} />
                </div>
                {/* Debug info */}
                <div className="mt-2 text-xs text-muted-foreground">
                  Data points: {bitcoinData?.historical?.length || 0} | 
                  Price: ${bitcoinData?.price?.price?.toLocaleString() || 'Loading...'}
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
                  <CardTitle className="text-white">Cycle Prediction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    Q2 2025
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Estimated cycle top
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="text-sm font-medium text-white">72%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                {bitcoinData && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span className="font-medium text-white">
                        ${(bitcoinData.price.marketCap / 1e12).toFixed(2)}T
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">24h Volume</span>
                      <span className="font-medium text-white">
                        ${(bitcoinData.price.volume24h / 1e9).toFixed(1)}B
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rainbow Band</span>
                      <span className="font-medium text-primary">{bitcoinData.metrics.rainbowBand}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-sm text-premium-yellow">
                    <Warning className="h-4 w-4" />
                    <span>Live market data</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Rainbow Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {bitcoinData?.price && bitcoinData?.metrics ? (
            <RainbowChart 
              currentPrice={bitcoinData.price.price}
              rainbowBand={bitcoinData.metrics.rainbowBand}
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

        {/* App Rankings Section */}
        {rankingsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ranking className="h-5 w-5 text-accent-purple" />
                    <CardTitle className="text-white">Crypto App Store Rankings</CardTitle>
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
                          <div className="font-bold text-white text-lg capitalize mb-1">
                            {appName}
                          </div>
                          <div className="text-xs text-muted-foreground">Finance App</div>
                        </div>
                        <div className="space-y-3">
                          {rankings.map((ranking) => (
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
                              <span className="font-bold text-white bg-primary/20 px-2 py-1 rounded">
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
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-accent-purple" />
                  <CardTitle className="text-white">Actionable Market Analysis</CardTitle>
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
                      <h3 className="font-bold text-white">Overall Market Signal</h3>
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
                          <div className="font-medium text-white">NUPL Score</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.nupl.toFixed(2)}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.nupl} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.nupl.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">SOPR</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.sopr.toFixed(3)}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.sopr} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.sopr.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">MVRV Z-Score</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.mvrv}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.mvrv} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.mvrv.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Rainbow Band</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.rainbowBand}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.rainbowBand} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.rainbowBand.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Fear & Greed</div>
                          <div className="text-lg font-bold text-primary">{bitcoinData.metrics.fearGreedIndex}</div>
                        </div>
                        <ActionSignalComponent analysis={bitcoinData.metrics.analysis.fearGreedIndex} compact />
                      </div>
                      <p className="text-xs text-muted-foreground">{bitcoinData.metrics.analysis.fearGreedIndex.explanation}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">BTC Dominance</div>
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
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-accent-yellow" />
                  <CardTitle className="text-white">Top 20 Finance Apps</CardTitle>
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

        {/* Floating BRRR Video */}
        <div className="fixed bottom-6 right-6 z-50">
          <BrrrVideo 
            trigger={brrrTrigger} 
            size="medium"
            className="animate-bounce"
          />
        </div>
      </div>
    </AppLayout>
  )
}