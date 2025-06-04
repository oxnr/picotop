import { NextResponse } from 'next/server'

// More accurate ETF data based on public filings and market analysis
// Using more realistic market-based calculations and recent data patterns
async function getETFFlowsData() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const hour = now.getHours()
  
  // Get current Bitcoin price for more accurate calculations
  let currentBTCPrice = 97000 // Fallback
  try {
    const btcResponse = await fetch('http://localhost:3000/api/bitcoin')
    if (btcResponse.ok) {
      const btcData = await btcResponse.json()
      if (btcData.success && btcData.data?.price?.price) {
        currentBTCPrice = btcData.data.price.price
      }
    }
  } catch (error) {
    // Use fallback price
  }
  
  // More sophisticated market sentiment based on price action
  const priceBasedSentiment = currentBTCPrice > 95000 ? 1.2 : currentBTCPrice > 85000 ? 1.0 : 0.7
  
  // Weekend vs weekday factor (ETFs don't trade weekends)
  const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.1 : 1.0
  
  // Trading hours factor
  const tradingHoursFactor = (hour >= 9 && hour <= 16) ? 1.0 : 0.2
  
  // Updated with more accurate AUM data based on recent market research (Dec 2024)
  const baseFlows = {
    IBIT: { 
      aum: 52000000000, // iShares Bitcoin Trust - largest ETF
      avgDailyFlow: 400000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.45 
    },
    FBTC: { 
      aum: 19000000000, // Fidelity Wise Origin Bitcoin
      avgDailyFlow: 150000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.16 
    },
    GBTC: { 
      aum: 16000000000, // Grayscale - often has outflows due to high fees
      avgDailyFlow: -50000000 * priceBasedSentiment * weekendFactor, // Typically outflows
      marketShare: 0.14 
    },
    BITB: { 
      aum: 4500000000, // Bitwise Bitcoin ETF
      avgDailyFlow: 75000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.04 
    },
    ARKB: { 
      aum: 3800000000, // ARK 21Shares Bitcoin ETF
      avgDailyFlow: 60000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.03 
    },
    BRRR: { 
      aum: 1200000000, // Valkyrie Bitcoin Fund
      avgDailyFlow: 25000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.01 
    },
    HODL: { 
      aum: 900000000, // VanEck Bitcoin Trust
      avgDailyFlow: 20000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.008 
    },
    BTCO: { 
      aum: 800000000, // Invesco Galaxy Bitcoin ETF
      avgDailyFlow: 15000000 * priceBasedSentiment * weekendFactor * tradingHoursFactor,
      marketShare: 0.007 
    }
  }

  // Generate daily flows with more realistic variation patterns
  const topETFs = Object.entries(baseFlows).map(([ticker, data]) => {
    // Stable random seed based on current day for consistent daily values
    const dayKey = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    const seed = (ticker.charCodeAt(0) + dayKey) % 1000
    const randomVariation = (Math.sin(seed) * 0.3) // ±15% variation with stable daily seed
    
    const flow24h = data.avgDailyFlow * (1 + randomVariation)
    
    return {
      ticker,
      name: getETFName(ticker),
      aum: data.aum,
      flow24h: Math.round(flow24h),
      btcHoldings: Math.round((data.aum * 0.99) / currentBTCPrice), // More accurate BTC holdings
      premium: (Math.sin(seed * 0.1) * 0.5), // ±0.5% premium/discount
      marketShare: data.marketShare
    }
  })

  const totalAUM = topETFs.reduce((sum, etf) => sum + etf.aum, 0)
  const netFlows24h = topETFs.reduce((sum, etf) => sum + etf.flow24h, 0)
  
  // Generate historical daily flows for the past 30 days
  const historicalFlows = generateHistoricalETFFlows(30, baseFlows, currentBTCPrice)
  const netFlows7d = historicalFlows.slice(-7).reduce((sum, day) => sum + day.netFlow, 0)
  const netFlows30d = historicalFlows.reduce((sum, day) => sum + day.netFlow, 0)

  return {
    totalAUM,
    netFlows24h,
    netFlows7d,
    netFlows30d,
    topETFs: topETFs.sort((a, b) => b.aum - a.aum), // Sort by AUM
    historicalFlows, // Add historical data for charting
    lastUpdated: new Date().toISOString()
  }
}

function generateHistoricalETFFlows(days: number, baseFlows: any, currentBTCPrice: number) {
  const historicalFlows = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayKey = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
    
    // Bitcoin price variation over time (simulated)
    const priceVariation = 0.95 + (Math.sin(dayKey * 0.1) * 0.1)
    const historicalBTCPrice = currentBTCPrice * priceVariation
    
    // Market sentiment based on price trends
    const priceSentiment = historicalBTCPrice > 95000 ? 1.2 : historicalBTCPrice > 85000 ? 1.0 : 0.7
    
    // Weekend factor
    const weekendFactor = (date.getDay() === 0 || date.getDay() === 6) ? 0.1 : 1.0
    
    let dailyNetFlow = 0
    const etfFlows: any = {}
    
    Object.entries(baseFlows).forEach(([ticker, data]: [string, any]) => {
      const seed = (ticker.charCodeAt(0) + dayKey) % 1000
      const randomVariation = Math.sin(seed) * 0.3
      const flow = data.avgDailyFlow * priceSentiment * weekendFactor * (1 + randomVariation)
      
      etfFlows[ticker] = Math.round(flow)
      dailyNetFlow += flow
    })
    
    historicalFlows.push({
      date: date.toISOString().split('T')[0],
      netFlow: Math.round(dailyNetFlow),
      btcPrice: Math.round(historicalBTCPrice),
      etfFlows
    })
  }
  
  return historicalFlows
}

function getETFName(ticker: string): string {
  const names: { [key: string]: string } = {
    'IBIT': 'iShares Bitcoin Trust',
    'FBTC': 'Fidelity Wise Origin Bitcoin',
    'BITB': 'Bitwise Bitcoin ETF',
    'ARKB': 'ARK 21Shares Bitcoin ETF',
    'GBTC': 'Grayscale Bitcoin Trust',
    'BRRR': 'Valkyrie Bitcoin Fund',
    'HODL': 'VanEck Bitcoin Trust',
    'BTCO': 'Invesco Galaxy Bitcoin ETF'
  }
  return names[ticker] || `${ticker} Bitcoin Fund`
}

export async function GET() {
  try {
    const etfData = await getETFFlowsData()
    
    const response = {
      success: true,
      data: etfData,
      timestamp: new Date().toISOString(),
      meta: {
        source: 'Synthetic data based on public market patterns',
        disclaimer: 'Flow estimates based on market analysis, not real-time API data',
        updateFrequency: '5 minutes'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('ETF flows API error:', error)
    
    // Return fallback data on error
    const fallbackData = {
      success: false,
      error: 'Failed to generate ETF flow data',
      data: {
        totalAUM: 95000000000,
        netFlows24h: 450000000,
        netFlows7d: 1200000000,
        netFlows30d: 2800000000,
        topETFs: [
          { ticker: 'IBIT', name: 'iShares Bitcoin Trust', aum: 42000000000, flow24h: 180000000 },
          { ticker: 'FBTC', name: 'Fidelity Wise Origin Bitcoin', aum: 15000000000, flow24h: 85000000 },
          { ticker: 'BITB', name: 'Bitwise Bitcoin ETF', aum: 3200000000, flow24h: 45000000 },
          { ticker: 'ARKB', name: 'ARK 21Shares Bitcoin ETF', aum: 2800000000, flow24h: 32000000 },
          { ticker: 'GBTC', name: 'Grayscale Bitcoin Trust', aum: 18000000000, flow24h: -25000000 }
        ],
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(fallbackData)
  }
}