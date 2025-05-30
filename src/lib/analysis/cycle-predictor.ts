import type { BitcoinMetrics } from '../api/bitcoin.ts'

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
  
  // Calculate months since last halving (April 19, 2024)
  const lastHalving = new Date('2024-04-19')
  const now = new Date()
  const monthsSinceHalving = Math.floor((now.getTime() - lastHalving.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  
  // Dynamic cycle progression based on halving timing and metrics
  // Historical cycles: Peak typically 12-18 months post-halving
  const cycleProgressionRatio = monthsSinceHalving / 15 // Target 15 months as typical peak timing
  
  // Advanced metric analysis with dynamic thresholds
  const cycleAdjustedNuplThreshold = 0.45 + (cycleProgressionRatio * 0.25) // Rising threshold over time
  const cycleAdjustedMvrvThreshold = 1.8 + (cycleProgressionRatio * 1.0) // Rising threshold over time
  
  // Weighted composite score with cycle timing consideration
  let cyclePosition = 0
  let reasoning: string[] = []
  
  // NUPL Analysis (30% weight)
  if (nupl < 0.2) {
    cyclePosition += 0 * 0.3
    reasoning.push(`NUPL at ${nupl.toFixed(2)} indicates capitulation/hope phase`)
  } else if (nupl < cycleAdjustedNuplThreshold) {
    cyclePosition += 25 * 0.3
    reasoning.push(`NUPL at ${nupl.toFixed(2)} shows early optimism phase`)
  } else if (nupl < 0.65) {
    cyclePosition += 55 * 0.3
    reasoning.push(`NUPL at ${nupl.toFixed(2)} indicates belief/optimism phase`)
  } else if (nupl < 0.8) {
    cyclePosition += 80 * 0.3
    reasoning.push(`NUPL at ${nupl.toFixed(2)} approaching euphoria territory`)
  } else {
    cyclePosition += 95 * 0.3
    reasoning.push(`NUPL at ${nupl.toFixed(2)} in extreme euphoria - peak imminent`)
  }
  
  // MVRV Analysis (25% weight)
  if (mvrv < 1.0) {
    cyclePosition += 0 * 0.25
  } else if (mvrv < cycleAdjustedMvrvThreshold) {
    cyclePosition += 30 * 0.25
  } else if (mvrv < 3.2) {
    cyclePosition += 60 * 0.25
    reasoning.push(`MVRV at ${mvrv.toFixed(1)} shows healthy growth but approaching caution zone`)
  } else if (mvrv < 4.5) {
    cyclePosition += 85 * 0.25
    reasoning.push(`MVRV at ${mvrv.toFixed(1)} in historical sell zone`)
  } else {
    cyclePosition += 95 * 0.25
    reasoning.push(`MVRV at ${mvrv.toFixed(1)} at extreme levels - major correction risk`)
  }
  
  // Price Level Analysis (20% weight) - considering $100K+ levels
  const priceScore = currentPrice > 120000 ? 90 : 
                    currentPrice > 100000 ? 70 :
                    currentPrice > 80000 ? 50 :
                    currentPrice > 60000 ? 30 : 10
  cyclePosition += priceScore * 0.2
  
  if (currentPrice > 100000) {
    reasoning.push(`Price at $${(currentPrice/1000).toFixed(0)}K in uncharted territory`)
  }
  
  // Halving Cycle Timing (15% weight) - More aggressive for late cycle
  const halvingScore = monthsSinceHalving < 6 ? 15 :
                      monthsSinceHalving < 9 ? 35 :
                      monthsSinceHalving < 12 ? 65 :
                      monthsSinceHalving < 15 ? 85 :
                      monthsSinceHalving < 18 ? 95 : 98
  cyclePosition += halvingScore * 0.15
  reasoning.push(`${monthsSinceHalving} months post-halving (April 2024)`)
  
  // Fear & Greed and Dominance (10% weight combined)
  const sentimentScore = (fearGreedIndex / 100) * 50 + ((70 - dominance) / 30) * 50
  cyclePosition += Math.min(100, sentimentScore) * 0.1
  
  // CRITICAL REALITY CHECK: If 12+ months post-halving AND price >$100K, force advanced position
  if (monthsSinceHalving >= 12 && currentPrice > 100000) {
    cyclePosition = Math.max(cyclePosition, 65) // Minimum Mid-Late Bull
    reasoning.push('Market maturity forces advanced cycle position')
  }
  
  // Additional boost for being in historical peak window (12-18 months)
  if (monthsSinceHalving >= 12 && monthsSinceHalving <= 18) {
    cyclePosition = Math.min(100, cyclePosition + 10) // Boost by 10 points
    reasoning.push('In historical peak window (12-18mo post-halving)')
  }
  
  // Determine phase and timing based on dynamic cycle position
  let phase: CyclePrediction['currentCyclePhase']
  let timeToTop: string
  let confidence: number
  let targetPrice: number
  let riskLevel: CyclePrediction['riskLevel']
  
  // Adjusted phase determination for more realistic timeframes and higher target prices
  if (cyclePosition < 30) {
    phase = 'Deep Bear'
    timeToTop = '12-18 months'
    confidence = 80
    targetPrice = currentPrice * 2.8
    riskLevel = 'Low'
  } else if (cyclePosition < 50) {
    phase = 'Early Bull'
    timeToTop = '6-9 months'
    confidence = 75
    targetPrice = currentPrice * 1.9
    riskLevel = 'Low'
  } else if (cyclePosition < 75) {
    phase = 'Mid Bull'
    timeToTop = '3-6 months'
    confidence = 70
    // Adjusted to target 170-180k range: 1.63x multiplier for ~108k current price
    targetPrice = currentPrice * 1.63
    riskLevel = 'Medium'
  } else if (cyclePosition < 90) {
    phase = 'Late Bull'
    timeToTop = '2-6 months'
    confidence = 75
    // Slightly higher multiplier for late bull phase
    targetPrice = currentPrice * 1.35
    riskLevel = 'High'
  } else {
    phase = 'Peak'
    timeToTop = '0-2 months'
    confidence = 85
    targetPrice = currentPrice * 1.15
    riskLevel = 'Extreme'
  }
  
  // Additional adjustments based on specific conditions
  if (monthsSinceHalving >= 8 && cyclePosition > 50) {
    // We're in the expected peak window, adjust accordingly
    if (phase === 'Mid Bull') {
      phase = 'Late Bull'
      timeToTop = '2-6 months'
      reasoning.push('Historical patterns suggest transition to late bull phase')
    }
  }
  
  // Confidence adjustments based on metric alignment
  if (nupl > 0.6 && mvrv > 2.5 && fearGreedIndex > 70) {
    confidence = Math.min(90, confidence + 10)
    reasoning.push('Multiple metrics aligned - high confidence in timing')
  }
  
  // Advanced metric-specific adjustments
  if (nupl > 0.75) {
    confidence = Math.min(95, confidence + 10)
    if (phase !== 'Peak') {
      phase = 'Peak'
      timeToTop = '0-2 months'
      riskLevel = 'Extreme'
    }
  }
  
  if (mvrv > 4.0) {
    confidence = Math.min(95, confidence + 8)
    riskLevel = 'Extreme'
    reasoning.push('MVRV in extreme historical sell zone')
  }
  
  if (fearGreedIndex > 85) {
    reasoning.push(`Extreme greed at ${fearGreedIndex} - contrarian signal`)
    confidence = Math.min(95, confidence + 5)
  }
  
  if (dominance < 45) {
    reasoning.push(`BTC dominance at ${dominance.toFixed(1)}% - altcoin season risk`)
    // Adjust timeframe downward for alt euphoria
    if (timeToTop.includes('6-9')) timeToTop = '3-6 months'
    if (timeToTop.includes('2-6')) timeToTop = '2-5 months'
  }
  
  // SOPR analysis for short-term timing
  if (sopr > 1.05 && cyclePosition > 65) {
    reasoning.push(`SOPR at ${sopr.toFixed(3)} shows profit-taking acceleration`)
    confidence = Math.min(95, confidence + 5)
  }
  
  // Final reality check based on current market conditions
  if (monthsSinceHalving >= 8 && currentPrice > 100000) {
    // We're definitively in mid-to-late bull market territory
    if (cyclePosition < 55) cyclePosition = 55 // Floor the position
    
    if (phase === 'Early Bull') phase = 'Mid Bull'
    if (phase === 'Mid Bull' && cyclePosition > 70) {
      phase = 'Late Bull'
      timeToTop = '2-6 months'
    }
    
    reasoning.push('Market maturity suggests advanced cycle position')
  }
  
  return {
    timeToTop,
    confidence: Math.round(confidence),
    targetPrice: Math.round(targetPrice),
    currentCyclePhase: phase,
    riskLevel,
    reasoning: reasoning.slice(0, 5) // Limit to top 5 most relevant reasons
  }
}

// Note: Dynamic cycle prediction now uses real-time halving data and metric analysis
// No static timeframe adjustments needed as all calculations are contextual

export function getCycleHealthScore(metrics: BitcoinMetrics, dominance: number): {
  score: number
  status: 'Healthy' | 'Cautious' | 'Warning' | 'Critical'
  description: string
} {
  const { nupl, sopr, mvrv, fearGreedIndex } = metrics
  
  // Calculate months since halving for dynamic thresholds
  const lastHalving = new Date('2024-04-19')
  const monthsSinceHalving = Math.floor((Date.now() - lastHalving.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  
  // Dynamic health assessment based on cycle progression
  let riskPoints = 0
  let maxRiskPoints = 100
  
  // NUPL risk assessment (30 points max)
  const nuplRiskThreshold = 0.45 + (monthsSinceHalving / 15) * 0.25
  if (nupl > 0.8) riskPoints += 30
  else if (nupl > 0.7) riskPoints += 25
  else if (nupl > nuplRiskThreshold) riskPoints += 15
  else if (nupl > 0.4) riskPoints += 8
  else riskPoints += 2
  
  // MVRV risk assessment (25 points max)
  const mvrvRiskThreshold = 2.0 + (monthsSinceHalving / 15) * 1.5
  if (mvrv > 4.5) riskPoints += 25
  else if (mvrv > 3.5) riskPoints += 20
  else if (mvrv > mvrvRiskThreshold) riskPoints += 12
  else if (mvrv > 1.5) riskPoints += 6
  else riskPoints += 1
  
  // Price momentum risk (20 points max)
  if (sopr > 1.08) riskPoints += 20
  else if (sopr > 1.05) riskPoints += 15
  else if (sopr > 1.02) riskPoints += 8
  else if (sopr > 1.0) riskPoints += 4
  else riskPoints += 10 // Being below 1.0 is also risky (selling at loss)
  
  // Sentiment extremes (15 points max)
  if (fearGreedIndex > 85) riskPoints += 15
  else if (fearGreedIndex > 75) riskPoints += 10
  else if (fearGreedIndex > 65) riskPoints += 6
  else if (fearGreedIndex < 25) riskPoints += 12 // Extreme fear also risky
  else riskPoints += 2
  
  // Dominance risk (10 points max)
  if (dominance < 40) riskPoints += 10 // Alt euphoria
  else if (dominance < 45) riskPoints += 6
  else if (dominance > 65) riskPoints += 8 // Alt capitulation
  else riskPoints += 1
  
  // Time-based risk adjustment
  if (monthsSinceHalving >= 12) {
    riskPoints += 5 // Additional risk for being in typical peak window
  }
  
  const healthScore = Math.max(0, Math.min(100, 100 - riskPoints))
  
  let status: 'Healthy' | 'Cautious' | 'Warning' | 'Critical'
  let description: string
  
  if (healthScore >= 75) {
    status = 'Healthy'
    description = 'Market conditions support continued growth with manageable risk'
  } else if (healthScore >= 55) {
    status = 'Cautious'
    description = 'Some risk factors present - maintain position but monitor closely'
  } else if (healthScore >= 35) {
    status = 'Warning'
    description = 'Multiple warning signs - consider reducing exposure and taking profits'
  } else {
    status = 'Critical'
    description = 'High-risk environment - significant correction probability elevated'
  }
  
  return {
    score: Math.round(healthScore),
    status,
    description
  }
}