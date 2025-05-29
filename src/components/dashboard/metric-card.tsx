'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'

interface MetricCardProps {
  metric: DashboardMetric
  index?: number
}

export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const getTrendIcon = () => {
    if (!metric.change) return null
    
    switch (metric.change.direction) {
      case 'up':
        return <TrendUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    if (!metric.change) return 'text-muted-foreground'
    
    switch (metric.change.direction) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

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
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {metric.title}
          </CardTitle>
          {getTrendIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metric.value}</div>
          {metric.change && (
            <p className={`text-xs ${getTrendColor()}`}>
              {metric.change.direction === 'up' ? '+' : ''}
              {metric.change.value}% from {metric.change.period}
            </p>
          )}
        </CardContent>
        
        {/* Subtle gradient overlay for visual appeal */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent to-background/5 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  )
}