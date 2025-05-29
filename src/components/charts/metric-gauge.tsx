'use client'

import React from 'react'
import { ActionSignal } from '@/lib/api/bitcoin'
import { getSignalStyle } from '@/lib/constants/signals'

interface MetricGaugeProps {
  value: number
  minValue: number
  maxValue: number
  signal: ActionSignal
  title: string
  unit?: string
  zones?: {
    min: number
    max: number
    color: string
    label: string
  }[]
}

export function MetricGauge({ 
  value, 
  minValue, 
  maxValue, 
  signal, 
  title, 
  unit = '',
  zones = []
}: MetricGaugeProps) {
  // Calculate angle for needle (180 degree semicircle)
  const percentage = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1)
  const angle = 180 * percentage - 90 // -90 to 90 degrees

  // Default zones if none provided
  const defaultZones = [
    { min: 0, max: 0.25, color: '#22c55e', label: 'ACCUMULATE' },
    { min: 0.25, max: 0.5, color: '#eab308', label: 'HOLD' }, 
    { min: 0.5, max: 0.75, color: '#f97316', label: 'DISTRIBUTE' },
    { min: 0.75, max: 1, color: '#ef4444', label: 'SELL' }
  ]

  const gaugeZones = zones.length > 0 ? zones : defaultZones

  const getSignalColor = () => {
    return getSignalStyle(signal).hex
  }

  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      
      {/* Gauge Container */}
      <div className="relative w-36 h-20 mb-4">
        <svg width="144" height="80" viewBox="0 0 144 80" className="overflow-visible">
          {/* Background Arc */}
          <path
            d="M 16 72 A 56 56 0 0 1 128 72"
            fill="none"
            stroke="#2e2e2e"
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          {/* Colored Zone Arcs */}
          {gaugeZones.map((zone, index) => {
            const startAngle = 180 * zone.min - 90
            const endAngle = 180 * zone.max - 90
            const startX = 72 + 56 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 72 + 56 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 72 + 56 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 72 + 56 * Math.sin((endAngle * Math.PI) / 180)
            
            return (
              <path
                key={index}
                d={`M ${startX} ${startY} A 56 56 0 0 1 ${endX} ${endY}`}
                fill="none"
                stroke={zone.color}
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.7"
              />
            )
          })}
          
          {/* Needle */}
          <g transform={`translate(72, 72) rotate(${angle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-48"
              stroke={getSignalColor()}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle
              cx="0"
              cy="0"
              r="5"
              fill={getSignalColor()}
            />
          </g>
          
          {/* Center dot */}
          <circle
            cx="72"
            cy="72"
            r="3"
            fill="#666"
          />
        </svg>
        
        {/* Value display - moved below gauge for better readability */}
      </div>
      
      {/* Value display */}
      <div className="text-lg font-bold text-foreground mb-1 -mt-2">
        {value.toFixed(2)}{unit}
      </div>
      
      {/* Min/Max labels */}
      <div className="flex justify-between w-full mt-1 text-xs text-muted-foreground">
        <span>{minValue}{unit}</span>
        <span>{maxValue}{unit}</span>
      </div>
      
      {/* Signal indicator - moved down for better readability */}
      <div className="mt-3 flex justify-center">
        <div 
          className={`px-4 py-2 rounded-full text-sm font-bold border ${
            getSignalStyle(signal).bg
          } ${
            getSignalStyle(signal).text  
          } ${
            getSignalStyle(signal).border
          }`}
        >
          {signal}
        </div>
      </div>
    </div>
  )
}