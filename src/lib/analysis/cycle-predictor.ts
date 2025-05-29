import { BitcoinMetrics, ActionSignal } from '../api/bitcoin'

export interface CyclePrediction {
  timeToTop: string // e.g., "3-6 months"
  confidence: number // 0-100
  targetPrice: number
  currentCyclePhase: 'Early Bull' | 'Mid Bull' | 'Late Bull' | 'Peak' | 'Early Bear' | 'Deep Bear'
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme'
  reasoning: string[]
}

export function predictCycleTiming(
  currentPrice: number,
  dominance: number,
  metrics: BitcoinMetrics
): CyclePrediction {
  const { nupl, sopr, mvrv, fearGreedIndex } = metrics
  
  // Calculate composite cycle score (0-100)
  const nuplScore = nupl * 100 // 0-100
  const soprScore = Math.max(0, Math.min(100, (sopr - 0.8) * 250)) // normalize 0.8-1.2 to 0-100
  const mvrvScore = Math.max(0, Math.min(100, (mvrv / 5) * 100)) // normalize 0-5 to 0-100
  const fearScore = fearGreedIndex // already 0-100
  const domScore = Math.max(0, Math.min(100, ((70 - dominance) / 40) * 100)) // Higher when dominance drops
  
  const compositeScore = (nuplScore * 0.3 + soprScore * 0.25 + mvrvScore * 0.25 + fearScore * 0.15 + domScore * 0.05)
  
  // Determine cycle phase
  let phase: CyclePrediction['currentCyclePhase']
  let timeToTop: string
  let confidence: number
  let targetPrice: number
  let riskLevel: CyclePrediction['riskLevel']
  let reasoning: string[] = []
  
  if (compositeScore < 20) {
    phase = 'Deep Bear'
    timeToTop = '12-24 months'
    confidence = 85
    targetPrice = currentPrice * 3.5
    riskLevel = 'Low'
    reasoning = [
      'All metrics indicate deep bear market conditions',
      'Excellent accumulation opportunity',
      'Historical cycles suggest 12-24 months to next peak'
    ]
  } else if (compositeScore < 40) {
    phase = 'Early Bear'
    timeToTop = '6-18 months'
    confidence = 75
    targetPrice = currentPrice * 2.5
    riskLevel = 'Low'
    reasoning = [
      'Bear market conditions with early recovery signs',
      'Good time to start accumulating',
      'Cycle typically extends 6-18 months from here'
    ]
  } else if (compositeScore < 55) {
    phase = 'Early Bull'
    timeToTop = '6-12 months'
    confidence = 70
    targetPrice = currentPrice * 1.8
    riskLevel = 'Medium'
    reasoning = [
      'Early bull market phase confirmed',
      'Strong momentum building',
      'Peak likely in 6-12 months based on current trajectory'
    ]
  } else if (compositeScore < 70) {
    phase = 'Mid Bull'
    timeToTop = '3-9 months'
    confidence = 65
    targetPrice = currentPrice * 1.4
    riskLevel = 'Medium'
    reasoning = [
      'Mid-cycle bull market conditions',
      'Some metrics approaching elevated levels',
      'Peak expected within 3-9 months'
    ]
  } else if (compositeScore < 85) {
    phase = 'Late Bull'
    timeToTop = '1-6 months'
    confidence = 80
    targetPrice = currentPrice * 1.2
    riskLevel = 'High'
    reasoning = [
      'Late-stage bull market indicators present',
      'Multiple metrics in distribution zones',
      'Cycle top likely within 1-6 months'
    ]
  } else {
    phase = 'Peak'
    timeToTop = '0-3 months'
    confidence = 90
    targetPrice = currentPrice * 1.1
    riskLevel = 'Extreme'
    reasoning = [
      'Peak cycle conditions detected',
      'All major metrics in euphoria/sell zones',
      'Immediate distribution recommended'
    ]
  }
  
  // Adjust for specific metric readings
  if (nupl > 0.75) {
    reasoning.push(`NUPL at ${nupl.toFixed(2)} indicates euphoria phase`)
    confidence = Math.min(95, confidence + 10)
  }
  
  if (mvrv > 3.5) {
    reasoning.push(`MVRV Z-Score at ${mvrv} suggests significant overvaluation`)
    confidence = Math.min(95, confidence + 8)
  }
  
  if (fearGreedIndex > 80) {
    reasoning.push(`Fear & Greed at ${fearGreedIndex} shows extreme greed`)
    confidence = Math.min(95, confidence + 5)
  }
  
  if (dominance < 45) {
    reasoning.push(`BTC dominance at ${dominance.toFixed(1)}% suggests altcoin euphoria`)
    timeToTop = adjustTimeframe(timeToTop, -0.2) // Shorten timeframe
  }
  
  // Current price context (at $108K+)
  if (currentPrice > 100000) {
    reasoning.push(`Price above $100K entering psychological resistance zone`)
    confidence = Math.min(95, confidence + 5)
    riskLevel = riskLevel === 'Low' ? 'Medium' : riskLevel === 'Medium' ? 'High' : 'Extreme'
  }
  
  return {
    timeToTop,
    confidence,
    targetPrice: Math.round(targetPrice),
    currentCyclePhase: phase,
    riskLevel,
    reasoning
  }
}

function adjustTimeframe(timeframe: string, factor: number): string {
  // Simple timeframe adjustment logic
  if (factor < 0) {
    // Shorten timeframes
    if (timeframe.includes('12-24')) return '6-18 months'
    if (timeframe.includes('6-18')) return '3-12 months'
    if (timeframe.includes('6-12')) return '3-9 months'
    if (timeframe.includes('3-9')) return '1-6 months'
    if (timeframe.includes('1-6')) return '0-3 months'
  }
  return timeframe
}

export function getCycleHealthScore(metrics: BitcoinMetrics, dominance: number): {
  score: number
  status: 'Healthy' | 'Cautious' | 'Warning' | 'Critical'
  description: string
} {
  const { nupl, sopr, mvrv, fearGreedIndex } = metrics
  
  // Health scoring (lower is healthier for longevity)
  let healthScore = 0
  
  // NUPL contribution (0-40 points)
  healthScore += nupl * 40
  
  // SOPR contribution (0-25 points)
  healthScore += Math.max(0, (sopr - 0.8) / 0.4) * 25
  
  // MVRV contribution (0-25 points)  
  healthScore += Math.min(25, (mvrv / 5) * 25)
  
  // Fear & Greed contribution (0-10 points)
  healthScore += (fearGreedIndex / 100) * 10
  
  const finalScore = 100 - healthScore // Invert so higher is better
  
  let status: 'Healthy' | 'Cautious' | 'Warning' | 'Critical'
  let description: string
  
  if (finalScore >= 70) {
    status = 'Healthy'
    description = 'Market conditions are sustainable for continued growth'
  } else if (finalScore >= 50) {
    status = 'Cautious'
    description = 'Some metrics elevated but still within reasonable ranges'
  } else if (finalScore >= 30) {
    status = 'Warning'
    description = 'Multiple indicators suggest caution and risk management'
  } else {
    status = 'Critical'
    description = 'Extreme readings across metrics - high probability of reversal'
  }
  
  return {
    score: Math.round(finalScore),
    status,
    description
  }
}