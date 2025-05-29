'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  metric: DashboardMetric
  index?: number
}

export function StatsCard({ metric, index = 0 }: StatsCardProps) {
  const isPositive = metric.change?.direction === 'up'
  const isNegative = metric.change?.direction === 'down'

  // Calculate progress percentage based on metric type
  const getProgressPercentage = () => {
    const title = metric.title.toLowerCase()
    const value = metric.value
    
    if (title.includes('nupl')) {
      // NUPL ranges from 0 to 1, extract number from value like "0.780"
      const nuplValue = parseFloat(value)
      return Math.min(Math.max(nuplValue * 100, 0), 100)
    }
    
    if (title.includes('dominance')) {
      // BTC Dominance ranges from ~30% to ~70%, normalize to 0-100%
      const domValue = parseFloat(value.replace('%', ''))
      return Math.min(Math.max(((domValue - 30) / 40) * 100, 0), 100)
    }
    
    if (title.includes('bitcoin price')) {
      // Bitcoin price - use a logarithmic scale relative to cycle ranges
      const priceValue = parseFloat(value.replace(/[$,]/g, ''))
      // Scale based on current cycle range (e.g., $15K to $200K)
      const minPrice = 15000
      const maxPrice = 200000
      return Math.min(Math.max(((priceValue - minPrice) / (maxPrice - minPrice)) * 100, 0), 100)
    }
    
    if (title.includes('sopr')) {
      // SOPR typically ranges from 0.8 to 1.2, normalize to 0-100%
      const soprValue = parseFloat(value)
      return Math.min(Math.max(((soprValue - 0.8) / 0.4) * 100, 0), 100)
    }
    
    if (title.includes('rank')) {
      // App rankings - inverse scale (lower rank = higher percentage)
      const rankValue = parseFloat(value.replace('#', ''))
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
                    {isPositive ? '+' : ''}{metric.change.value}% vs {metric.change.period}
                  </span>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Progress bar reflecting actual metric value */}
          <div className="mt-4 w-full bg-muted rounded-full h-1">
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