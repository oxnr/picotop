// Generate historical data for metrics starting from July 2020
// This provides consistent timeframes for comparison and verification

interface HistoricalDataPoint {
  date: Date
  value: number
}

// Helper to generate dates from July 2020 to present
function generateDateRange(): Date[] {
  const dates: Date[] = []
  const startDate = new Date('2020-07-01')
  const endDate = new Date()
  
  // Generate monthly data points
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  
  return dates
}

export function generateBitcoinPriceHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // Bitcoin price history from July 2020 to present (monthly averages)
  const priceHistory = [
    // 2020
    9200, 11000, 12000, 10800, 13800, 19200, 29000,
    // 2021
    33000, 45000, 58000, 47000, 35000, 31000, 47000, 43000, 61000, 69000, 56000, 46000,
    // 2022
    38000, 38500, 45000, 38000, 29600, 20000, 23300, 23000, 19400, 20400, 15700, 16500,
    // 2023
    23100, 24200, 27000, 29200, 27000, 30000, 29200, 29100, 26900, 34500, 37000, 42200,
    // 2024 - 2025
    42800, 51500, 71000, 64000, 67500, 61000, 66500, 59800, 63000, 69000, 91500, 108700, 108700
  ]
  
  return dates.map((date, index) => ({
    date,
    value: priceHistory[index] || priceHistory[priceHistory.length - 1]
  }))
}

export function generateDominanceHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // BTC Dominance history (roughly following market cycles)
  const dominanceHistory = [
    // 2020 - DeFi summer, dominance drops
    64, 59, 57, 60, 62, 68, 70,
    // 2021 - Alt season
    73, 61, 45, 48, 42, 45, 47, 41, 43, 39, 42, 38,
    // 2022 - Bear market, dominance rises
    42, 42, 46, 40, 46, 48, 39, 39, 39, 38, 38, 40,
    // 2023 - Recovery
    42, 45, 46, 48, 50, 50, 49, 52, 52, 54, 52, 51,
    // 2024 - 2025 - Current cycle
    50, 52, 54, 70, 56, 55, 58, 56, 58, 59, 60, 61, 60.7
  ]
  
  return dates.map((date, index) => ({
    date,
    value: dominanceHistory[index] || dominanceHistory[dominanceHistory.length - 1]
  }))
}

export function generateNUPLHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // NUPL history following market psychology
  const nuplHistory = [
    // 2020
    0.45, 0.52, 0.55, 0.48, 0.62, 0.75, 0.82,
    // 2021 - Bull market euphoria
    0.85, 0.71, 0.58, 0.65, 0.42, 0.38, 0.65, 0.62, 0.78, 0.88, 0.73, 0.45,
    // 2022 - Bear market
    0.35, 0.32, 0.42, 0.28, 0.15, -0.15, 0.12, 0.08, -0.22, -0.05, -0.35, -0.28,
    // 2023 - Recovery
    0.05, 0.12, 0.18, 0.25, 0.22, 0.28, 0.25, 0.24, 0.20, 0.38, 0.42, 0.48,
    // 2024 - 2025
    0.52, 0.58, 0.72, 0.65, 0.68, 0.62, 0.66, 0.58, 0.61, 0.65, 0.75, 0.78, 0.58
  ]
  
  return dates.map((date, index) => ({
    date,
    value: nuplHistory[index] || nuplHistory[nuplHistory.length - 1]
  }))
}

export function generateSOPRHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // SOPR history (Spent Output Profit Ratio)
  const soprHistory = [
    // 2020
    1.02, 1.04, 1.05, 1.02, 1.08, 1.15, 1.18,
    // 2021 - Bull market
    1.20, 1.12, 1.06, 1.10, 0.98, 0.95, 1.10, 1.08, 1.14, 1.22, 1.15, 1.02,
    // 2022 - Bear market
    0.98, 0.96, 1.02, 0.94, 0.89, 0.82, 0.95, 0.92, 0.78, 0.85, 0.75, 0.80,
    // 2023 - Recovery
    0.88, 0.92, 0.95, 0.98, 0.96, 1.01, 0.98, 0.97, 0.94, 1.02, 1.04, 1.06,
    // 2024 - 2025
    1.08, 1.12, 1.18, 1.14, 1.16, 1.10, 1.13, 1.08, 1.11, 1.14, 1.20, 1.25, 1.045
  ]
  
  return dates.map((date, index) => ({
    date,
    value: soprHistory[index] || soprHistory[soprHistory.length - 1]
  }))
}

export function generateMVRVHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // MVRV ratio history (adjusted to match CryptoQuant/CoinGlass data)
  const mvrvHistory = [
    // 2020
    1.2, 1.5, 1.6, 1.4, 1.8, 2.2, 2.6,
    // 2021 - Bull market peaks
    2.8, 2.1, 1.8, 2.0, 1.3, 1.2, 2.0, 1.9, 2.4, 3.0, 2.5, 1.6,
    // 2022 - Bear market
    1.4, 1.3, 1.6, 1.2, 0.9, 0.5, 0.8, 0.7, 0.4, 0.6, 0.4, 0.5,
    // 2023 - Recovery
    0.7, 0.8, 0.9, 1.0, 1.0, 1.1, 1.0, 1.0, 0.9, 1.3, 1.4, 1.6,
    // 2024 - 2025
    1.7, 2.0, 2.6, 2.3, 2.4, 2.1, 2.3, 1.9, 2.0, 2.2, 2.8, 3.1, 2.1
  ]
  
  return dates.map((date, index) => ({
    date,
    value: mvrvHistory[index] || mvrvHistory[mvrvHistory.length - 1]
  }))
}

export function generateFearGreedHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // Fear & Greed Index history
  const fearGreedHistory = [
    // 2020
    45, 52, 58, 42, 68, 78, 85,
    // 2021 - Market euphoria
    88, 74, 65, 72, 35, 28, 72, 68, 82, 94, 85, 52,
    // 2022 - Fear dominates
    38, 35, 48, 32, 22, 8, 25, 20, 6, 15, 5, 12,
    // 2023 - Recovery
    28, 35, 42, 48, 45, 52, 48, 46, 42, 62, 68, 72,
    // 2024 - 2025
    75, 78, 88, 82, 85, 78, 82, 74, 78, 82, 92, 95, 75
  ]
  
  return dates.map((date, index) => ({
    date,
    value: fearGreedHistory[index] || fearGreedHistory[fearGreedHistory.length - 1]
  }))
}

// Rainbow band history (using numeric values for easier charting)
export function generateRainbowHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // Rainbow bands as numbers: 1=Red, 2=Orange, 3=Yellow, 4=Green, 5=Blue, 6=Indigo, 7=Violet
  const rainbowHistory = [
    // 2020
    3, 4, 4, 3, 5, 6, 7,
    // 2021 - Peak territory
    7, 6, 5, 6, 4, 4, 6, 5, 7, 8, 7, 5,
    // 2022 - Lower bands
    4, 4, 5, 3, 2, 1, 2, 2, 1, 1, 1, 1,
    // 2023 - Recovery
    2, 2, 3, 3, 3, 3, 3, 3, 2, 4, 4, 5,
    // 2024 - 2025
    5, 6, 7, 6, 7, 6, 6, 5, 6, 6, 7, 7, 6
  ]
  
  return dates.map((date, index) => ({
    date,
    value: rainbowHistory[index] || rainbowHistory[rainbowHistory.length - 1]
  }))
}

export function generatePiCycleHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // Pi Cycle Top indicator (percentage distance between moving averages)
  const piCycleHistory = [
    // 2020
    25, 22, 20, 24, 18, 12, 8,
    // 2021 - Approaching signals
    5, 15, 20, 16, 28, 32, 16, 18, 10, 3, 8, 22,
    // 2022 - Divergence
    28, 30, 25, 32, 38, 45, 35, 38, 48, 42, 52, 48,
    // 2023 - Normalizing
    35, 32, 28, 25, 28, 24, 26, 28, 32, 20, 18, 16,
    // 2024 - 2025
    14, 12, 8, 12, 10, 14, 12, 16, 14, 12, 8, 5, 15
  ]
  
  return dates.map((date, index) => ({
    date,
    value: piCycleHistory[index] || piCycleHistory[piCycleHistory.length - 1]
  }))
}

export function generateRHODLHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // RHODL Ratio history (in thousands)
  const rhodlHistory = [
    // 2020
    25, 28, 30, 26, 35, 42, 48,
    // 2021 - Peak values
    52, 38, 32, 36, 22, 20, 36, 34, 44, 58, 48, 28,
    // 2022 - Lower values
    24, 22, 28, 20, 16, 8, 14, 12, 6, 10, 4, 6,
    // 2023 - Recovery
    12, 14, 16, 18, 16, 20, 18, 17, 14, 24, 26, 30,
    // 2024 - 2025
    32, 38, 52, 46, 48, 42, 46, 38, 40, 44, 58, 65, 45
  ]
  
  return dates.map((date, index) => ({
    date,
    value: rhodlHistory[index] || rhodlHistory[rhodlHistory.length - 1]
  }))
}

export function generateCoinbaseRankHistory(): HistoricalDataPoint[] {
  const dates = generateDateRange()
  
  // Coinbase App Store ranking history (lower is better)
  // During crypto booms, Coinbase ranks higher (lower numbers)
  const coinbaseRankHistory = [
    // 2020 - Early crypto interest
    45, 35, 38, 42, 28, 15, 8,
    // 2021 - Massive crypto adoption
    5, 12, 18, 15, 25, 32, 12, 18, 8, 3, 6, 22,
    // 2022 - Crypto winter
    35, 38, 28, 42, 55, 85, 65, 75, 95, 82, 105, 98,
    // 2023 - Recovery and renewed interest
    68, 55, 45, 38, 42, 35, 38, 42, 52, 25, 22, 18,
    // 2024 - 2025 - Bull market returns
    15, 12, 8, 12, 10, 15, 12, 18, 15, 12, 8, 5, 14
  ]
  
  return dates.map((date, index) => ({
    date,
    value: coinbaseRankHistory[index] || coinbaseRankHistory[coinbaseRankHistory.length - 1]
  }))
}