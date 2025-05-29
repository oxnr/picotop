'use client'

import React from 'react'
import { MetricDetail } from './metric-detail'
import { ActionSignal } from '@/lib/api/bitcoin'
import { CurrencyBtc } from '@phosphor-icons/react'

interface DominanceDetailProps {
  value: number
  signal: ActionSignal
}

export function DominanceDetail({ value, signal }: DominanceDetailProps) {
  const thresholds = [
    {
      label: 'ALT SEASON',
      value: 0,
      color: '#ef4444',
      description: 'Extreme altcoin outperformance, late-cycle euphoria. Bitcoin losing market share to speculative assets.'
    },
    {
      label: 'BALANCED MARKET',
      value: 45,
      color: '#f97316',
      description: 'Healthy competition between Bitcoin and altcoins. Balanced risk-on sentiment across crypto markets.'
    },
    {
      label: 'BTC STRENGTH',
      value: 55,
      color: '#eab308',
      description: 'Bitcoin showing relative strength, flight to quality. Institutional and conservative capital flowing to BTC.'
    },
    {
      label: 'BTC DOMINANCE',
      value: 65,
      color: '#22c55e',
      description: 'Strong Bitcoin dominance, bear market or early recovery. Safe haven behavior during market stress.'
    }
  ]

  const historicalData = [
    {
      period: '2017 Alt Season',
      value: 37.2,
      significance: 'Extreme altcoin euphoria marked cycle peak'
    },
    {
      period: '2018 Bear Market',
      value: 68.5,
      significance: 'Flight to Bitcoin quality during crypto winter'
    },
    {
      period: '2021 Peak',
      value: 41.8,
      significance: 'Altcoin mania preceded market correction'
    },
    {
      period: '2023 Recovery',
      value: 56.2,
      significance: 'Bitcoin leadership in institutional adoption'
    }
  ]

  const interpretation = {
    bullish: 'High Bitcoin dominance (>60%) indicates market maturity and institutional focus. Often precedes major Bitcoin rallies as smart money accumulates.',
    neutral: 'Balanced dominance (45-60%) shows healthy market dynamics. Both Bitcoin and altcoins attracting capital with moderate risk appetite.',
    bearish: 'Low Bitcoin dominance (<45%) signals speculative excess and altcoin euphoria. Late-cycle behavior with high probability of correction.'
  }

  return (
    <MetricDetail
      title="BTC Dominance"
      currentValue={value}
      signal={signal}
      description="Bitcoin's market capitalization as a percentage of total cryptocurrency market cap. Indicates risk appetite and cycle positioning."
      thresholds={thresholds}
      historicalData={historicalData}
      interpretation={interpretation}
      unit="%"
      icon={<CurrencyBtc className="h-5 w-5 text-orange-500" />}
    />
  )
}