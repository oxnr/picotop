'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ActionSignal } from '@/lib/api/bitcoin'
import { TrendUp, TrendDown, Minus, Info } from '@phosphor-icons/react'

interface MetricDetailProps {
  title: string
  currentValue: number
  signal: ActionSignal
  description: string
  thresholds: {
    label: string
    value: number
    color: string
    description: string
  }[]
  historicalData?: {
    period: string
    value: number
    significance: string
  }[]
  interpretation: {
    bullish: string
    bearish: string
    neutral: string
  }
  unit?: string
  icon?: React.ReactNode
}

export function MetricDetail({
  title,
  currentValue,
  signal,
  description,
  thresholds,
  historicalData = [],
  interpretation,
  unit = '',
  icon
}: MetricDetailProps) {
  const getSignalColor = () => {
    switch (signal) {
      case 'ACCUMULATE': return 'text-green-400'
      case 'HOLD': return 'text-yellow-400'
      case 'DISTRIBUTE': return 'text-orange-400'
      case 'SELL': return 'text-red-400'
    }
  }

  const getSignalIcon = () => {
    switch (signal) {
      case 'ACCUMULATE': return <TrendUp className="h-4 w-4" />
      case 'HOLD': return <Minus className="h-4 w-4" />
      case 'DISTRIBUTE': return <TrendDown className="h-4 w-4" />
      case 'SELL': return <TrendDown className="h-4 w-4" />
    }
  }

  const getCurrentThreshold = () => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (currentValue >= thresholds[i].value) {
        return thresholds[i]
      }
    }
    return thresholds[0]
  }

  const currentThreshold = getCurrentThreshold()

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-foreground">{title}</CardTitle>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-opacity-20 ${getSignalColor()}`}>
            {getSignalIcon()}
            <span className={`font-bold text-sm ${getSignalColor()}`}>
              {signal}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Value Display */}
        <div className="text-center p-4 bg-secondary/10 rounded-lg border-l-4 border-primary">
          <div className="text-3xl font-bold text-foreground mb-2">
            {currentValue.toFixed(3)}{unit}
          </div>
          <div className="text-sm text-muted-foreground">
            Current {title} reading
          </div>
          <div 
            className="text-sm font-medium mt-2"
            style={{ color: currentThreshold.color }}
          >
            {currentThreshold.label}
          </div>
        </div>

        {/* Threshold Analysis */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Info className="h-4 w-4 mr-2 text-primary" />
            Threshold Analysis
          </h4>
          <div className="space-y-3">
            {thresholds.map((threshold, index) => {
              const isActive = currentValue >= threshold.value
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border transition-all ${
                    isActive && threshold === currentThreshold
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : isActive
                      ? 'border-green-400/30 bg-green-400/5'
                      : 'border-border bg-secondary/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: threshold.color }}
                      />
                      <span className={`font-medium ${
                        isActive && threshold === currentThreshold ? 'text-primary' : 'text-foreground'
                      }`}>
                        {threshold.label}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ≥ {threshold.value.toFixed(3)}{unit}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {threshold.description}
                  </p>
                  {isActive && threshold === currentThreshold && (
                    <div className="mt-2 text-xs text-primary font-medium">
                      ← CURRENT ZONE
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Historical Context */}
        {historicalData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Historical Context</h4>
            <div className="space-y-2">
              {historicalData.map((data, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-secondary/5 rounded">
                  <div>
                    <div className="text-sm text-foreground">{data.period}</div>
                    <div className="text-xs text-muted-foreground">{data.significance}</div>
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {data.value.toFixed(3)}{unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interpretation Guide */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Interpretation Guide</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg h-20 flex flex-col">
              <div className="text-sm font-medium text-green-400 mb-1">Bullish Signal</div>
              <div className="text-xs text-muted-foreground flex-1">{interpretation.bullish}</div>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg h-20 flex flex-col">
              <div className="text-sm font-medium text-yellow-400 mb-1">Neutral/Hold</div>
              <div className="text-xs text-muted-foreground flex-1">{interpretation.neutral}</div>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg h-20 flex flex-col">
              <div className="text-sm font-medium text-red-400 mb-1">Bearish Signal</div>
              <div className="text-xs text-muted-foreground flex-1">{interpretation.bearish}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}