'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import { CircleNotch, TrendUp } from '@phosphor-icons/react'
import { getSignalStyle } from '@/lib/constants/signals'

interface VisualNUPLChartProps {
  currentValue: number
  signal: 'ACCUMULATE' | 'HOLD' | 'DISTRIBUTE' | 'SELL'
}

// Historical NUPL data with cycle context
const historicalNUPLData = [
  { date: '2017-01', value: 0.15, phase: 'Accumulation', event: 'Pre-Bull Run' },
  { date: '2017-06', value: 0.45, phase: 'Optimism', event: 'Bull Run Start' },
  { date: '2017-12', value: 0.92, phase: 'Euphoria', event: 'BTC Peak $20K' },
  { date: '2018-01', value: 0.85, phase: 'Anxiety', event: 'ALT Season Peak' },
  { date: '2018-12', value: 0.08, phase: 'Capitulation', event: 'Bear Bottom' },
  { date: '2020-03', value: 0.12, phase: 'Capitulation', event: 'COVID Crash' },
  { date: '2020-12', value: 0.65, phase: 'Optimism', event: 'Bull Run 2.0' },
  { date: '2021-04', value: 0.75, phase: 'Anxiety', event: 'BTC $65K Peak' },
  { date: '2021-11', value: 0.71, phase: 'Anxiety', event: 'BTC $69K ATH' },
  { date: '2022-06', value: 0.18, phase: 'Fear', event: 'Bear Market' },
  { date: '2023-01', value: 0.25, phase: 'Hope', event: 'Recovery Start' },
  { date: '2024-03', value: 0.68, phase: 'Optimism', event: 'New ATH $73K' },
  { date: '2025-01', value: 0.78, phase: 'Anxiety', event: 'Current $108K' },
]

const nuplZones = [
  { min: 0, max: 0.25, color: '#22c55e', label: 'CAPITULATION/HOPE', description: 'Historic buying opportunities' },
  { min: 0.25, max: 0.5, color: '#eab308', label: 'OPTIMISM/ANXIETY', description: 'Bull market progression' },
  { min: 0.5, max: 0.75, color: '#f97316', label: 'BELIEF/DENIAL', description: 'Late stage, take profits' },
  { min: 0.75, max: 1, color: '#ef4444', label: 'EUPHORIA/GREED', description: 'Cycle tops, distribute' }
]

export function VisualNUPLChart({ currentValue, signal }: VisualNUPLChartProps) {
  const getCurrentZone = () => {
    return nuplZones.find(zone => currentValue >= zone.min && currentValue < zone.max) || nuplZones[nuplZones.length - 1]
  }

  const currentZone = getCurrentZone()

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CircleNotch className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-foreground">NUPL Historical Analysis</CardTitle>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
            getSignalStyle(signal).bg
          } ${
            getSignalStyle(signal).text
          } ${
            getSignalStyle(signal).border
          }`}>
            {signal}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Net Unrealized Profit/Loss across market cycles with cycle timing insights
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-secondary/10 rounded-lg border-l-4" style={{ borderColor: currentZone.color }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-foreground">
              {currentValue.toFixed(3)}
            </div>
            <div className="text-sm font-medium" style={{ color: currentZone.color }}>
              {currentZone.label}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentZone.description}
          </p>
        </div>

        {/* Historical Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalNUPLData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                {nuplZones.map((zone, index) => (
                  <linearGradient key={index} id={`nuplGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={zone.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={zone.color} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                domain={[0, 1]}
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              
              {/* Zone backgrounds */}
              {nuplZones.map((zone, index) => (
                <ReferenceLine
                  key={index}
                  y={zone.max}
                  stroke={zone.color}
                  strokeOpacity={0.3}
                  strokeDasharray="2 2"
                />
              ))}
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#nuplGradient1)"
              />
              
              {/* Current value indicator */}
              <ReferenceLine 
                y={currentValue} 
                stroke="#ffffff" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "Current", position: "right", fill: "#22c55e", fontSize: 12 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Insights */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Key Historical Patterns</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-sm font-medium text-red-400 mb-1">2017-2018 Cycle</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• BTC peaked Dec 2017 at NUPL 0.92</div>
                  <div>• ALTs peaked Jan 2018 at NUPL 0.85</div>
                  <div>• 30-day lag between BTC and ALT peaks</div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-sm font-medium text-blue-400 mb-1">2020-2021 Cycle</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• BTC peaked Apr & Nov 2021 at NUPL 0.75</div>
                  <div>• Meme coins exploded during NUPL 0.7+</div>
                  <div>• ALT season lasted 309 days</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-sm font-medium text-yellow-400 mb-1">Current Cycle (2024-2025)</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• NUPL at 0.78 suggests late-stage bull</div>
                  <div>• ALT season may have started Dec 2024</div>
                  <div>• Estimated to run ~310 days to Oct 2025</div>
                </div>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-sm font-medium text-green-400 mb-1">ALT/Meme Coin Timing</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• ALTs typically peak 2-8 weeks after BTC</div>
                  <div>• Meme coins amplify 5-10x during NUPL 0.7+</div>
                  <div>• Peak euphoria occurs above NUPL 0.85</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Legend */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">NUPL Zones</h4>
          <div className="grid grid-cols-2 gap-2">
            {nuplZones.map((zone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: zone.color }}
                />
                <div className="text-xs">
                  <div className="text-foreground font-medium">{zone.label}</div>
                  <div className="text-muted-foreground">{zone.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}