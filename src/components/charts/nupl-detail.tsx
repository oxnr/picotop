'use client'

import React from 'react'
import { MetricDetail } from './metric-detail'
import { ActionSignal } from '@/lib/api/bitcoin'
import { CircleNotch } from '@phosphor-icons/react'

interface NUPLDetailProps {
  value: number
  signal: ActionSignal
}

export function NUPLDetail({ value, signal }: NUPLDetailProps) {
  const thresholds = [
    {
      label: 'CAPITULATION',
      value: 0,
      color: '#22c55e',
      description: 'Market bottom conditions, extreme fear and capitulation. Historic buying opportunity.'
    },
    {
      label: 'HOPE/FEAR',
      value: 0.25,
      color: '#eab308',
      description: 'Recovery phase beginning, transitioning from fear to hope. Accumulation recommended.'
    },
    {
      label: 'OPTIMISM',
      value: 0.5,
      color: '#f97316',
      description: 'Bull market in progress, optimism building. Monitor for distribution opportunities.'
    },
    {
      label: 'ANXIETY',
      value: 0.75,
      color: '#dc2626',
      description: 'Late-stage bull market, anxiety about sustainability. High probability of peak.'
    },
    {
      label: 'EUPHORIA',
      value: 0.9,
      color: '#7c2d12',
      description: 'Extreme euphoria, market top conditions. Immediate distribution recommended.'
    }
  ]

  const historicalData = [
    {
      period: '2017 Peak',
      value: 0.95,
      significance: 'Bitcoin reached $20K during extreme euphoria'
    },
    {
      period: '2018 Bottom',
      value: 0.05,
      significance: 'Capitulation at $3.2K provided generational opportunity'
    },
    {
      period: '2021 Peak',
      value: 0.88,
      significance: 'High anxiety marked the $69K top'
    },
    {
      period: '2022 Bottom',
      value: 0.12,
      significance: 'Fear dominated at $15.7K bottom'
    }
  ]

  const interpretation = {
    bullish: 'NUPL below 0.5 indicates market bottoms and early bull phases. Network participants hold unrealized losses or minimal gains, creating buying opportunities.',
    neutral: 'NUPL between 0.5-0.75 shows healthy bull market progression. Balance between optimism and caution suggests sustainable price appreciation.',
    bearish: 'NUPL above 0.75 signals euphoric conditions with extreme unrealized gains. Historical tops occur above 0.85, indicating imminent distribution phase.'
  }

  return (
    <MetricDetail
      title="NUPL (Net Unrealized Profit/Loss)"
      currentValue={value}
      signal={signal}
      description="Measures the difference between unrealized profit and loss across all Bitcoin holders. Key indicator for cycle timing and market psychology."
      thresholds={thresholds}
      historicalData={historicalData}
      interpretation={interpretation}
      icon={<CircleNotch className="h-5 w-5 text-purple-500" />}
    />
  )
}