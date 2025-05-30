'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, MiniChart } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface StatsCardProps {
  metric: DashboardMetric
  index?: number
}

export function StatsCard({ metric, index = 0 }: StatsCardProps) {
  const isPositive = metric.change?.direction === 'up'
  const isNegative = metric.change?.direction === 'down'

  // Get chart color based on metric type
  const getChartColor = () => {
    switch (metric.color) {
      case 'orange': return '#f97316'
      case 'blue': return '#3b82f6'
      case 'purple': return '#8b5cf6'
      case 'green': return '#22c55e'
      case 'red': return '#ef4444'
      case 'yellow': return '#eab308'
      default: return '#8b5cf6'
    }
  }

  // Format value for chart labels
  const formatChartValue = useMemo(() => {
    const title = metric.title.toLowerCase()
    
    if (title.includes('price')) {
      return (value: number) => `$${(value / 1000).toFixed(0)}K`
    }
    if (title.includes('dominance')) {
      return (value: number) => `${value.toFixed(1)}%`
    }
    if (title.includes('nupl') || title.includes('sopr') || title.includes('mvrv')) {
      return (value: number) => value.toFixed(2)
    }
    if (title.includes('fear') || title.includes('greed')) {
      return (value: number) => value.toFixed(0)
    }
    if (title.includes('pi cycle')) {
      return (value: number) => `${value.toFixed(0)}%`
    }
    if (title.includes('rhodl')) {
      return (value: number) => `${value.toFixed(0)}K`
    }
    if (title.includes('rainbow')) {
      const bands = ['', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']
      return (value: number) => bands[Math.round(value)] || 'Unknown'
    }
    
    return (value: number) => value.toString()
  }, [metric.title])

  // Calculate progress percentage based on metric type
  const getProgressPercentage = () => {
    const title = metric.title.toLowerCase()
    const value = metric.value
    
    if (title.includes('nupl')) {
      // NUPL ranges from 0 to 1, extract number from value like "0.780"
      const nuplValue = parseFloat(String(value))
      return Math.min(Math.max(nuplValue * 100, 0), 100)
    }
    
    if (title.includes('dominance')) {
      // BTC Dominance ranges from ~30% to ~70%, normalize to 0-100%
      const domValue = parseFloat(String(value).replace('%', ''))
      return Math.min(Math.max(((domValue - 30) / 40) * 100, 0), 100)
    }
    
    if (title.includes('bitcoin price')) {
      // Bitcoin price - use a logarithmic scale relative to cycle ranges
      const priceValue = parseFloat(String(value).replace(/[$,]/g, ''))
      // Scale based on current cycle range (e.g., $15K to $200K)
      const minPrice = 15000
      const maxPrice = 200000
      return Math.min(Math.max(((priceValue - minPrice) / (maxPrice - minPrice)) * 100, 0), 100)
    }
    
    if (title.includes('sopr')) {
      // SOPR typically ranges from 0.8 to 1.2, normalize to 0-100%
      const soprValue = parseFloat(String(value))
      return Math.min(Math.max(((soprValue - 0.8) / 0.4) * 100, 0), 100)
    }
    
    if (title.includes('mvrv')) {
      // MVRV cycle positioning: higher values = closer to cycle top
      // 0.5-1.5 = early cycle, 1.5-2.5 = mid cycle, 2.5+ = late cycle/top warning
      const mvrvValue = parseFloat(String(value))
      const cyclePosition = Math.min(Math.max(((mvrvValue - 0.5) / 3.0) * 100, 0), 100) // 0.5 to 3.5 range
      return cyclePosition
    }
    
    if (title.includes('rainbow')) {
      // Rainbow band - show cycle timing progress instead of color position
      // Historical peaks: ~18 months post-halving
      const lastHalving = new Date('2024-04-19') // Last halving date
      const now = new Date()
      const monthsSinceHalving = Math.floor((now.getTime() - lastHalving.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
      
      // Typical cycle to peak is ~18 months
      const typicalPeakMonths = 18
      const cycleProgress = Math.min(Math.max((monthsSinceHalving / typicalPeakMonths) * 100, 0), 100)
      
      return cycleProgress // Shows how far through the cycle we are
    }
    
    if (title.includes('fear & greed')) {
      // Fear & Greed index 0-100
      const fgiValue = parseFloat(String(value))
      return Math.min(Math.max(fgiValue, 0), 100)
    }
    
    if (title.includes('pi cycle')) {
      // Pi Cycle Top - percentage distance between MAs, closer = more risky
      const piValue = parseFloat(String(value).replace('%', ''))
      return Math.min(Math.max((30 - piValue) / 30 * 100, 0), 100)
    }
    
    if (title.includes('rhodl')) {
      // RHODL Ratio cycle positioning: higher values = closer to cycle top
      // 1K-2K = early cycle, 3K-4K = mid cycle, 5K+ = late cycle/top warning
      const rhodlValue = parseFloat(String(value).replace('K', '')) * 1000
      const cyclePosition = Math.min(Math.max(((rhodlValue - 1000) / 6000) * 100, 0), 100) // 1K to 7K range
      return cyclePosition
    }
    
    if (title.includes('rank')) {
      // App rankings - inverse scale (lower rank = higher percentage)
      const rankValue = parseFloat(String(value).replace('#', ''))
      return Math.min(Math.max((100 - rankValue), 0), 100)
    }
    
    // Default fallback for other metrics
    return Math.min(Math.abs(metric.change?.value || 50), 100)
  }

  const progressPercentage = getProgressPercentage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="relative overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-foreground mb-3">
                {metric.value}
              </p>
              {metric.change && (
                <div className={cn(
                  "flex items-center text-sm",
                  isPositive && "text-green-400",
                  isNegative && "text-red-400",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}>
                  {isPositive && <TrendUp className="h-4 w-4 mr-1" />}
                  {isNegative && <TrendDown className="h-4 w-4 mr-1" />}
                  <span className="font-medium">
                    {metric.title.toLowerCase().includes('rainbow') ? 
                      metric.change.period : // Just show "13mo post-halving" for Rainbow Band
                      `${isPositive ? '+' : ''}${metric.change.value}% vs ${metric.change.period}` // Normal display for other metrics
                    }
                  </span>
                </div>
              )}
            </div>
            
          </div>
          
          
          {/* Progress bar reflecting actual metric value */}
          <div className="mt-3 w-full bg-muted rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-primary to-purple-600 h-1 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${progressPercentage}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
          </div>
        </CardContent>
        
        {/* Subtle gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </Card>
    </motion.div>
  )
}