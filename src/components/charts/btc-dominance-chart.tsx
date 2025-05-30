'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendUp, Crown, Warning } from '@phosphor-icons/react'
import { getSignalStyle } from '@/lib/constants/signals'

interface BTCDominanceChartProps {
  currentValue: number
  signal: 'ACCUMULATE' | 'HOLD' | 'DISTRIBUTE' | 'SELL'
}

// Historical BTC dominance data with key market events
const historicalDominanceData = [
  { date: 'Jan\n\'17', value: 87.2, event: 'Pre-ALT Season', phase: 'BTC Dominance Peak' },
  { date: 'Jun\n\'17', value: 42.8, event: 'ICO Boom Start', phase: 'ALT Season Beginning' },
  { date: 'Dec\n\'17', value: 38.1, event: 'BTC Peak $20K', phase: 'ALT Season Peak' },
  { date: 'Jan\n\'18', value: 33.2, event: 'Peak ALT Euphoria', phase: 'Cycle Top' },
  { date: 'Dec\n\'18', value: 52.6, event: 'Bear Market', phase: 'Flight to BTC' },
  { date: 'Jun\n\'19', value: 59.8, event: 'BTC Recovery', phase: 'BTC Dominance Recovery' },
  { date: 'Mar\n\'20', value: 63.1, event: 'COVID Crash', phase: 'Flight to Safety' },
  { date: 'Dec\n\'20', value: 68.9, event: 'Institutional BTC', phase: 'BTC Season' },
  { date: 'Jan\n\'21', value: 71.2, event: 'Tesla/MicroStrategy', phase: 'Peak BTC Dominance' },
  { date: 'May\n\'21', value: 42.5, event: 'ALT Season 2.0', phase: 'ALT Explosion' },
  { date: 'Oct\n\'21', value: 45.8, event: 'Meme Coin Mania', phase: 'ALT Peak' },
  { date: 'Jun\n\'22', value: 46.2, event: 'Bear Market Start', phase: 'Market Crash' },
  { date: 'Jan\n\'23', value: 41.8, event: 'Bear Bottom', phase: 'ALT Bleeding' },
  { date: 'Jan\n\'24', value: 51.2, event: 'ETF Anticipation', phase: 'BTC Recovery' },
  { date: 'Mar\n\'24', value: 54.7, event: 'ETF Approval', phase: 'BTC Strength' },
  { date: 'Nov\n\'24', value: 59.8, event: 'Election Pump', phase: 'BTC Dominance Rise' },
  { date: 'Jan\n\'25', value: 60.9, event: 'Current Cycle', phase: 'Late Bull Market' },
]

// Dominance zones with market psychology
const dominanceZones = [
  { min: 70, max: 100, color: '#3b82f6', label: 'BTC SEASON', description: 'Money flowing into Bitcoin, ALTs bleeding' },
  { min: 50, max: 70, color: '#eab308', label: 'BALANCED MARKET', description: 'Mixed flows, select ALT opportunities' },
  { min: 35, max: 50, color: '#f97316', label: 'ALT SEASON', description: 'Money rotating to altcoins' },
  { min: 0, max: 35, color: '#ef4444', label: 'ALT EUPHORIA', description: 'Peak altcoin mania, cycle top warning' }
]

export function BTCDominanceChart({ currentValue, signal }: BTCDominanceChartProps) {
  const getCurrentZone = () => {
    return dominanceZones.find(zone => currentValue >= zone.min && currentValue < zone.max) || dominanceZones[1]
  }

  const currentZone = getCurrentZone()

  // Market psychology insights
  const getMarketInsights = () => {
    if (currentValue > 65) {
      return {
        title: 'Bitcoin Season',
        description: 'Strong BTC dominance suggests institutional and retail focus on Bitcoin. ALTs typically underperform.',
        recommendation: 'Focus on Bitcoin, wait for dominance decline to rotate to ALTs'
      }
    } else if (currentValue > 50) {
      return {
        title: 'Balanced Market',
        description: 'Moderate dominance indicates healthy market with selective ALT opportunities.',
        recommendation: 'Balanced portfolio, cherry-pick strong ALT projects'
      }
    } else if (currentValue > 35) {
      return {
        title: 'ALT Season Active',
        description: 'Declining dominance as money rotates from BTC to altcoins. ALT season in progress.',
        recommendation: 'Rotate profits from BTC to quality ALTs, manage risk'
      }
    } else {
      return {
        title: 'ALT Euphoria',
        description: 'Extremely low dominance indicates peak ALT mania. Historically precedes cycle tops.',
        recommendation: 'High alert: Consider taking profits, cycle top may be near'
      }
    }
  }

  const insights = getMarketInsights()

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-foreground">Bitcoin Dominance Analysis</CardTitle>
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
          Bitcoin market cap percentage vs total crypto market - key indicator for ALT season timing
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-secondary/10 rounded-lg border-l-4" style={{ borderColor: currentZone.color }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-3xl font-bold text-foreground">
              {currentValue.toFixed(1)}%
            </div>
            <div className="text-sm font-medium" style={{ color: currentZone.color }}>
              {currentZone.label}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">{insights.title}</div>
            <p className="text-xs text-muted-foreground">{insights.description}</p>
            <div className="flex items-start space-x-2 mt-2">
              <TrendUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-primary font-medium">{insights.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Historical Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalDominanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="dominanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={10}
                tick={{ fill: '#9CA3AF', textAnchor: 'end' }}
                height={80}
                interval={1}
                angle={-45}
              />
              <YAxis 
                domain={[30, 75]}
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => `${value}%`}
              />
              
              {/* Zone reference lines */}
              <ReferenceLine y={70} stroke="#3b82f6" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={50} stroke="#eab308" strokeOpacity={0.5} strokeDasharray="2 2" />
              <ReferenceLine y={35} stroke="#f97316" strokeOpacity={0.5} strokeDasharray="2 2" />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#dominanceGradient)"
              />
              
              {/* Current value indicator */}
              <ReferenceLine 
                y={currentValue} 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Patterns */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Historical ALT Season Patterns</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-sm font-medium text-blue-400 mb-1">2017-2018 Cycle</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Dominance dropped from 87% → 33%</div>
                  <div>• ALT season lasted 390 days</div>
                  <div>• Peak ALT euphoria at 33% dominance</div>
                </div>
              </div>
              
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="text-sm font-medium text-purple-400 mb-1">2020-2021 Cycle</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Dominance: 71% → 43% → 46%</div>
                  <div>• Two ALT seasons (DeFi + Meme coins)</div>
                  <div>• Total ALT season: ~310 days</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-sm font-medium text-yellow-400 mb-1">Current Cycle (2024-2025)</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Dominance at 60.9% (moderate high)</div>
                  <div>• ALT season may begin when &lt; 55%</div>
                  <div>• Peak ALT euphoria expected &lt; 40%</div>
                </div>
              </div>
              
              {currentValue < 45 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Warning className="h-4 w-4 text-red-400" />
                    <div className="text-sm font-medium text-red-400">Cycle Top Warning</div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Dominance below 45% historically signals</div>
                    <div>• Late-stage ALT euphoria</div>
                    <div>• Consider profit-taking strategy</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zone Legend */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Dominance Zones</h4>
          <div className="grid grid-cols-2 gap-2">
            {dominanceZones.map((zone, index) => (
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