'use client'

import React from 'react'
import { MetricDetail } from './metric-detail'
import { ActionSignal } from '@/lib/api/bitcoin'
import { TrendUp } from '@phosphor-icons/react'

interface SOPRDetailProps {
  value: number
  signal: ActionSignal
}

export function SOPRDetail({ value, signal }: SOPRDetailProps) {
  const thresholds = [
    {
      label: 'LOSS SELLING',
      value: 0,
      color: '#22c55e',
      description: 'Heavy loss realization, market capitulation. Strong accumulation zone with high upside potential.'
    },
    {
      label: 'BREAKEVEN',
      value: 0.98,
      color: '#eab308',
      description: 'Minimal profit taking, breakeven selling. Neutral conditions with potential for continuation.'
    },
    {
      label: 'PROFIT TAKING',
      value: 1.05,
      color: '#f97316',
      description: 'Moderate profit realization, healthy distribution. Normal bull market behavior, monitor closely.'
    },
    {
      label: 'EXCESS PROFIT',
      value: 1.15,
      color: '#dc2626',
      description: 'Excessive profit taking, euphoric selling. High probability of trend reversal or major correction.'
    }
  ]

  const historicalData = [
    {
      period: '2017 Bull Run',
      value: 1.25,
      significance: 'Extreme profit taking preceded major correction'
    },
    {
      period: '2018 Bear Market',
      value: 0.85,
      significance: 'Sustained loss selling marked capitulation'
    },
    {
      period: '2021 Peak',
      value: 1.18,
      significance: 'High profit realization signaled cycle top'
    },
    {
      period: '2022 Recovery',
      value: 0.95,
      significance: 'Breakeven levels supported price floor'
    }
  ]

  const interpretation = {
    bullish: 'SOPR below 1.0 indicates loss realization and potential market bottoms. Sellers are capitulating, creating accumulation opportunities for patient buyers.',
    neutral: 'SOPR around 1.0-1.05 shows balanced profit/loss taking. Market in equilibrium with healthy price discovery and sustainable trend continuation.',
    bearish: 'SOPR above 1.10 signals excessive profit taking and euphoric behavior. High probability of trend reversal as early adopters distribute to late buyers.'
  }

  return (
    <MetricDetail
      title="SOPR (Spent Output Profit Ratio)"
      currentValue={value}
      signal={signal}
      description="Measures the profit ratio of spent Bitcoin outputs. Values above 1 indicate profit taking, below 1 indicate loss realization."
      thresholds={thresholds}
      historicalData={historicalData}
      interpretation={interpretation}
      icon={<TrendUp className="h-5 w-5 text-green-500" />}
    />
  )
}