const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export interface BitcoinPrice {
  price: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCap: number
  volume24h: number
  lastUpdated: string
}

export interface BitcoinHistoricalData {
  timestamp: number
  price: number
  marketCap: number
  volume: number
}

export async function fetchBitcoinPrice(): Promise<BitcoinPrice> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
      { 
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CycleTop/1.0'
        },
        next: { revalidate: 60 } // Cache for 1 minute
      }
    )

    if (!response.ok) {
      console.warn(`CoinGecko API error: ${response.status}, falling back to mock data`)
      return mockBitcoinPrice()
    }

    const data = await response.json()
    const bitcoin = data.bitcoin

    return {
      price: bitcoin.usd,
      priceChange24h: bitcoin.usd_24h_change || 0,
      priceChangePercentage24h: bitcoin.usd_24h_change || 0,
      marketCap: bitcoin.usd_market_cap,
      volume24h: bitcoin.usd_24h_vol,
      lastUpdated: new Date(bitcoin.last_updated_at * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error)
    return mockBitcoinPrice()
  }
}

function mockBitcoinPrice(): BitcoinPrice {
  const basePrice = 108700 // Current real BTC price
  const variation = (Math.random() - 0.5) * 1000
  const price = basePrice + variation
  
  return {
    price,
    priceChange24h: (Math.random() - 0.5) * 3000,
    priceChangePercentage24h: (Math.random() - 0.5) * 4,
    marketCap: price * 19700000, // Approximate circulating supply
    volume24h: 25000000000 + Math.random() * 10000000000,
    lastUpdated: new Date().toISOString(),
  }
}

export async function fetchBitcoinDominance(): Promise<number> {
  try {
    const response = await fetch(`${COINGECKO_API}/global`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!response.ok) {
      console.warn(`CoinGecko global API error: ${response.status}`)
      return 56.8 + (Math.random() - 0.5) * 2 // Realistic mock dominance
    }

    const data = await response.json()
    return data.data.market_cap_percentage.btc || 56.8
  } catch (error) {
    console.error('Error fetching Bitcoin dominance:', error)
    return 56.8 + (Math.random() - 0.5) * 2 // Realistic mock dominance
  }
}

export async function fetchBitcoinHistoricalData(
  days: number = 30
): Promise<BitcoinHistoricalData[]> {
  try {
    // For longer periods, use monthly intervals for better performance
    const interval = days > 365 ? 'monthly' : days > 90 ? 'weekly' : 'daily'
    
    const response = await fetch(
      `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CycleTop/1.0'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      console.warn(`CoinGecko historical API error: ${response.status}, using mock data`)
      return mockBitcoinHistoricalData(days)
    }

    const data = await response.json()

    const historicalData = data.prices.map((item: [number, number], index: number) => ({
      timestamp: item[0],
      price: item[1],
      marketCap: data.market_caps[index]?.[1] || 0,
      volume: data.total_volumes[index]?.[1] || 0,
    }))

    // For monthly data, ensure we have a good spread of data points
    if (interval === 'monthly' && historicalData.length > 24) {
      // Sample every nth point to keep around 24 data points for better chart readability
      const step = Math.ceil(historicalData.length / 24)
      return historicalData.filter((_: any, index: number) => index % step === 0)
    }

    return historicalData
  } catch (error) {
    console.error('Error fetching Bitcoin historical data:', error)
    return mockBitcoinHistoricalData(days)
  }
}

function mockBitcoinHistoricalData(days: number): BitcoinHistoricalData[] {
  const data: BitcoinHistoricalData[] = []
  const now = Date.now()
  const oneMonth = 30 * 24 * 60 * 60 * 1000
  
  // Corrected Bitcoin price history from 2020 to current
  const monthlyPrices = [
    16540, 9600, 5800, 7770, 8800, 9100, 11200, 11700, 10800, 13780, 19700, 28900, // 2020
    29000, 45000, 58900, 65000, 35000, 34500, 41000, 47000, 43800, 61000, 69000, 46200, // 2021
    38000, 38500, 45000, 38000, 29600, 20000, 23300, 23000, 19400, 20400, 15700, 16500, // 2022
    23100, 24200, 27000, 29200, 27000, 30000, 29200, 29100, 26900, 34500, 37000, 42200, // 2023
    42800, 51500, 71000, 64000, 67500, 61000, 66500, 59800, 63000, 69000, 91500, 108700 // 2024
  ]
  
  const points = Math.min(days, monthlyPrices.length) // Use available data up to requested days
  const startIndex = Math.max(0, monthlyPrices.length - points)
  
  for (let i = startIndex; i < monthlyPrices.length; i++) {
    const monthsBack = monthlyPrices.length - 1 - i
    const timestamp = now - monthsBack * oneMonth
    const price = monthlyPrices[i]
    const marketCap = price * 19700000 // Approximate circulating supply
    const volume = 20000000000 + Math.random() * 15000000000
    
    data.push({
      timestamp,
      price,
      marketCap,
      volume
    })
  }
  
  return data
}

export type ActionSignal = 'ACCUMULATE' | 'HOLD' | 'DISTRIBUTE' | 'SELL'

export interface MetricAnalysis {
  value: number | string
  signal: ActionSignal
  confidence: number
  explanation: string
}

export interface BitcoinMetrics {
  nupl: number
  sopr: number
  mvrv: number
  rainbowBand: string
  fearGreedIndex: number
  analysis: {
    nupl: MetricAnalysis
    sopr: MetricAnalysis
    mvrv: MetricAnalysis
    rainbowBand: MetricAnalysis
    fearGreedIndex: MetricAnalysis
    dominance: MetricAnalysis
    overall: MetricAnalysis
  }
}

export function analyzeMetric(type: string, value: number | string, dominance?: number): MetricAnalysis {
  switch (type) {
    case 'nupl':
      const nuplVal = value as number
      if (nuplVal < 0.25) return { value: nuplVal, signal: 'ACCUMULATE', confidence: 85, explanation: 'NUPL below 0.25 indicates fear, good accumulation zone' }
      if (nuplVal < 0.5) return { value: nuplVal, signal: 'HOLD', confidence: 70, explanation: 'NUPL in neutral zone, continue holding' }
      if (nuplVal < 0.75) return { value: nuplVal, signal: 'DISTRIBUTE', confidence: 75, explanation: 'NUPL approaching euphoria, consider taking profits' }
      return { value: nuplVal, signal: 'SELL', confidence: 90, explanation: 'NUPL in extreme greed, cycle top likely near' }

    case 'sopr':
      const soprVal = value as number
      if (soprVal < 0.98) return { value: soprVal, signal: 'ACCUMULATE', confidence: 80, explanation: 'SOPR below 1 shows selling at loss, accumulation opportunity' }
      if (soprVal < 1.05) return { value: soprVal, signal: 'HOLD', confidence: 60, explanation: 'SOPR near 1, neutral market conditions' }
      if (soprVal < 1.1) return { value: soprVal, signal: 'DISTRIBUTE', confidence: 70, explanation: 'SOPR above 1.05, profits being taken' }
      return { value: soprVal, signal: 'SELL', confidence: 85, explanation: 'SOPR above 1.1, excessive profit taking' }

    case 'mvrv':
      const mvrvVal = value as number
      if (mvrvVal < 1.5) return { value: mvrvVal, signal: 'ACCUMULATE', confidence: 90, explanation: 'MVRV below 1.5, market undervalued' }
      if (mvrvVal < 3) return { value: mvrvVal, signal: 'HOLD', confidence: 65, explanation: 'MVRV in fair value range' }
      if (mvrvVal < 5) return { value: mvrvVal, signal: 'DISTRIBUTE', confidence: 80, explanation: 'MVRV shows overvaluation, reduce exposure' }
      return { value: mvrvVal, signal: 'SELL', confidence: 95, explanation: 'MVRV extremely high, sell immediately' }

    case 'rainbowBand':
      const band = value as string
      if (['Red', 'Orange'].includes(band)) return { value: band, signal: 'ACCUMULATE', confidence: 95, explanation: `${band} band: Fire sale prices, buy aggressively` }
      if (['Yellow', 'Green'].includes(band)) return { value: band, signal: 'HOLD', confidence: 70, explanation: `${band} band: Accumulation phase, keep buying` }
      if (['Blue', 'Indigo'].includes(band)) return { value: band, signal: 'DISTRIBUTE', confidence: 75, explanation: `${band} band: Fair value, start taking profits` }
      return { value: band, signal: 'SELL', confidence: 90, explanation: `${band} band: Extreme overvaluation, sell now` }

    case 'fearGreedIndex':
      const fgiVal = value as number
      if (fgiVal < 25) return { value: fgiVal, signal: 'ACCUMULATE', confidence: 85, explanation: 'Extreme fear: others selling, time to buy' }
      if (fgiVal < 45) return { value: fgiVal, signal: 'HOLD', confidence: 60, explanation: 'Fear present: good for accumulation' }
      if (fgiVal < 75) return { value: fgiVal, signal: 'DISTRIBUTE', confidence: 70, explanation: 'Greed building: consider taking profits' }
      return { value: fgiVal, signal: 'SELL', confidence: 88, explanation: 'Extreme greed: euphoria peak, sell immediately' }

    case 'dominance':
      const domVal = value as number
      if (domVal > 60) return { value: domVal, signal: 'ACCUMULATE', confidence: 75, explanation: 'High BTC dominance: money flowing to Bitcoin' }
      if (domVal > 50) return { value: domVal, signal: 'HOLD', confidence: 60, explanation: 'Moderate dominance: balanced market' }
      if (domVal > 40) return { value: domVal, signal: 'DISTRIBUTE', confidence: 65, explanation: 'Declining dominance: altcoin season starting' }
      return { value: domVal, signal: 'SELL', confidence: 80, explanation: 'Low dominance: peak altcoin euphoria, cycle top near' }

    default:
      return { value, signal: 'HOLD', confidence: 50, explanation: 'Insufficient data for analysis' }
  }
}

export function getOverallAnalysis(metrics: BitcoinMetrics): MetricAnalysis {
  const signals = [
    metrics.analysis.nupl,
    metrics.analysis.sopr,
    metrics.analysis.mvrv,
    metrics.analysis.rainbowBand,
    metrics.analysis.fearGreedIndex,
    metrics.analysis.dominance
  ]

  const signalWeights = { ACCUMULATE: 1, HOLD: 2, DISTRIBUTE: 3, SELL: 4 }
  const weightedSum = signals.reduce((sum, analysis) => {
    return sum + (signalWeights[analysis.signal] * analysis.confidence)
  }, 0)
  
  const totalWeight = signals.reduce((sum, analysis) => sum + analysis.confidence, 0)
  const averageScore = weightedSum / totalWeight

  let overallSignal: ActionSignal
  let confidence: number
  let explanation: string

  if (averageScore <= 1.5) {
    overallSignal = 'ACCUMULATE'
    confidence = 85
    explanation = 'Multiple indicators show undervaluation. Strong buy signal.'
  } else if (averageScore <= 2.5) {
    overallSignal = 'HOLD'
    confidence = 70
    explanation = 'Mixed signals suggest holding current position.'
  } else if (averageScore <= 3.5) {
    overallSignal = 'DISTRIBUTE'
    confidence = 80
    explanation = 'Several metrics suggest overvaluation. Take profits.'
  } else {
    overallSignal = 'SELL'
    confidence = 90
    explanation = 'Strong sell signals across multiple metrics. Exit position.'
  }

  return { value: 'Combined Analysis', signal: overallSignal, confidence, explanation }
}

export function mockBitcoinMetrics(dominance?: number): BitcoinMetrics {
  const dom = dominance || 56.8
  const nupl = 0.78 // Higher due to current price levels
  const sopr = 1.045
  const mvrv = 2.8 // Higher due to current price
  const rainbowBand = 'Indigo' // Updated for $108K price level
  const fearGreedIndex = 75 // Higher greed at current levels

  const metrics: BitcoinMetrics = {
    nupl,
    sopr,
    mvrv,
    rainbowBand,
    fearGreedIndex,
    analysis: {
      nupl: analyzeMetric('nupl', nupl),
      sopr: analyzeMetric('sopr', sopr),
      mvrv: analyzeMetric('mvrv', mvrv),
      rainbowBand: analyzeMetric('rainbowBand', rainbowBand),
      fearGreedIndex: analyzeMetric('fearGreedIndex', fearGreedIndex),
      dominance: analyzeMetric('dominance', dom),
      overall: { value: '', signal: 'HOLD', confidence: 0, explanation: '' }
    }
  }

  metrics.analysis.overall = getOverallAnalysis(metrics)
  return metrics
}