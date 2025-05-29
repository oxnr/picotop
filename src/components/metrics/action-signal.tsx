'use client'

import { ActionSignal, MetricAnalysis } from '@/lib/api/bitcoin'
import { TrendUp, TrendDown, Minus, Warning } from '@phosphor-icons/react'
import { getSignalStyle } from '@/lib/constants/signals'

interface ActionSignalProps {
  analysis: MetricAnalysis
  compact?: boolean
}

function getSignalColor(signal: ActionSignal): string {
  const style = getSignalStyle(signal)
  return `${style.text} ${style.bg} ${style.border}`
}

function getSignalIcon(signal: ActionSignal) {
  switch (signal) {
    case 'ACCUMULATE': return <TrendUp className="h-4 w-4" />
    case 'HOLD': return <Minus className="h-4 w-4" />
    case 'DISTRIBUTE': return <TrendDown className="h-4 w-4" />
    case 'SELL': return <Warning className="h-4 w-4" />
  }
}

export function ActionSignalComponent({ analysis, compact = false }: ActionSignalProps) {
  const colorClass = getSignalColor(analysis.signal)
  
  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded border text-xs font-medium ${colorClass}`}>
        {getSignalIcon(analysis.signal)}
        <span>{analysis.signal}</span>
        <span className="text-muted-foreground">({analysis.confidence}%)</span>
      </div>
    )
  }

  return (
    <div className={`p-3 rounded-lg border ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getSignalIcon(analysis.signal)}
          <span className="font-bold text-sm">{analysis.signal}</span>
        </div>
        <div className="text-xs">
          <span className="font-medium">{analysis.confidence}%</span>
          <span className="text-muted-foreground ml-1">confidence</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {analysis.explanation}
      </p>
    </div>
  )
}