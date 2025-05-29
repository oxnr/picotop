'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ActionSignal } from '@/lib/api/bitcoin'
import { getSignalStyle } from '@/lib/constants/signals'
import { TrendUp, TrendDown, CircleNotch } from '@phosphor-icons/react'

interface VisualSOPRChartProps {
  currentValue: number
  signal: ActionSignal
}

export function VisualSOPRChart({ currentValue, signal }: VisualSOPRChartProps) {
  const zones = [
    { min: 0.8, max: 0.95, color: '#22c55e', label: 'DEEP VALUE', description: 'Heavy accumulation zone' },
    { min: 0.95, max: 1.0, color: '#84cc16', label: 'VALUE', description: 'Good buying opportunity' },
    { min: 1.0, max: 1.05, color: '#eab308', label: 'NEUTRAL', description: 'Balanced market conditions' },
    { min: 1.05, max: 1.15, color: '#f97316', label: 'ELEVATED', description: 'Moderate profit taking' },
    { min: 1.15, max: 1.3, color: '#ef4444', label: 'EXTREME', description: 'Heavy profit taking phase' }
  ]

  const generateSOPRData = () => {
    const data = []
    const now = Date.now()
    const oneMonth = 30 * 24 * 60 * 60 * 1000

    for (let i = 12; i >= 0; i--) {
      const timestamp = now - i * oneMonth
      const cyclePosition = (12 - i) / 24
      
      let baseValue = 0.98 + Math.sin(cyclePosition * Math.PI) * 0.15
      baseValue += (Math.random() - 0.5) * 0.08
      
      data.push({
        date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: Math.max(0.85, Math.min(1.25, baseValue)),
        isPrediction: false,
        timestamp
      })
    }

    data[data.length - 1].value = currentValue

    for (let i = 1; i <= 18; i++) {
      const timestamp = now + i * oneMonth
      
      let predictedValue = currentValue
      if (i <= 6) {
        predictedValue = currentValue + (i * 0.02) + Math.sin(i * 0.5) * 0.03
      } else if (i <= 12) {
        predictedValue = 1.15 + Math.sin(i * 0.8) * 0.08
      } else {
        const decline = (i - 12) * 0.04
        predictedValue = 1.15 - decline + Math.sin(i * 0.3) * 0.02
      }
      
      data.push({
        date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: Math.max(0.85, Math.min(1.3, predictedValue)),
        isPrediction: true,
        timestamp
      })
    }

    return data
  }

  const data = generateSOPRData()
  const currentZone = zones.find(zone => currentValue >= zone.min && currentValue < zone.max) || zones[2]

  return (
    <Card className="border-0 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendUp className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-foreground">SOPR Analysis</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">Spent Output Profit Ratio</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-foreground mb-2">
            {currentValue.toFixed(3)}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div 
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                getSignalStyle(signal).bg
              } ${
                getSignalStyle(signal).text
              } ${
                getSignalStyle(signal).border
              } border`}
            >
              {signal}
            </div>
            <div 
              className="px-3 py-1 rounded-full text-sm font-medium text-foreground border"
              style={{ 
                backgroundColor: `${currentZone.color}20`,
                borderColor: currentZone.color 
              }}
            >
              {currentZone.label}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative h-24 bg-secondary/20 rounded-lg overflow-hidden">
            {zones.map((zone, index) => {
              const width = ((zone.max - zone.min) / (1.3 - 0.8)) * 100
              const left = ((zone.min - 0.8) / (1.3 - 0.8)) * 100
              
              return (
                <div
                  key={index}
                  className="absolute top-0 h-full flex items-center justify-center"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: `${zone.color}40`
                  }}
                >
                  <div className="text-xs font-medium text-foreground text-center">
                    <div>{zone.label}</div>
                    <div className="text-muted-foreground">{zone.min}-{zone.max}</div>
                  </div>
                </div>
              )
            })}
            
            <div
              className="absolute top-0 h-full w-1 bg-white shadow-lg"
              style={{
                left: `${((currentValue - 0.8) / (1.3 - 0.8)) * 100}%`
              }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-white"></div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-32 relative">
            <svg width="100%" height="128" className="overflow-visible">
              <defs>
                <linearGradient id="soprHistorical" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="soprPrediction" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              
              <path
                d={data
                  .filter(d => !d.isPrediction)
                  .map((d, i, arr) => {
                    const x = (i / (arr.length - 1)) * 60
                    const y = 128 - ((d.value - 0.8) / (1.3 - 0.8)) * 128
                    return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`
                  })
                  .join(' ')}
                fill="none"
                stroke="url(#soprHistorical)"
                strokeWidth="2"
              />
              
              <path
                d={data
                  .filter(d => d.isPrediction)
                  .map((d, i, arr) => {
                    const x = 60 + (i / (arr.length - 1)) * 40
                    const y = 128 - ((d.value - 0.8) / (1.3 - 0.8)) * 128
                    return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`
                  })
                  .join(' ')}
                fill="none"
                stroke="url(#soprPrediction)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              
              <line
                x1="0%"
                y1={128 - ((1.0 - 0.8) / (1.3 - 0.8)) * 128}
                x2="100%"
                y2={128 - ((1.0 - 0.8) / (1.3 - 0.8)) * 128}
                stroke="#666"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1Y Ago</span>
            <span>Now</span>
            <span>1.5Y Future</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-secondary/10 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Current Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {currentZone.description}. SOPR above 1.0 indicates profit-taking, while below 1.0 suggests loss realization and potential accumulation opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-green-500/10 rounded">
              <div className="text-green-400 font-medium">&lt; 0.98</div>
              <div className="text-muted-foreground">Accumulate</div>
            </div>
            <div className="text-center p-2 bg-yellow-500/10 rounded">
              <div className="text-yellow-400 font-medium">0.98-1.05</div>
              <div className="text-muted-foreground">Hold</div>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded">
              <div className="text-red-400 font-medium">&gt; 1.15</div>
              <div className="text-muted-foreground">Distribute</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}