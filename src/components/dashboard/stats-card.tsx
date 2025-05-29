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
              <p className="text-2xl font-bold text-white mb-3">
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
                    {isPositive ? '+' : ''}{metric.change.value}%
                  </span>
                  <span className="text-muted-foreground ml-1">
                    vs {metric.change.period}
                  </span>
                </div>
              )}
            </div>
            
            {/* Icon with gradient background */}
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br from-primary/20 to-purple-600/20 group-hover:from-primary/30 group-hover:to-purple-600/30"
            )}>
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded-md opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          {/* Progress bar for visual appeal */}
          <div className="mt-4 w-full bg-muted rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-primary to-purple-600 h-1 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${Math.min(Math.abs(metric.change?.value || 50), 100)}%`,
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