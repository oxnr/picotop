import { NextResponse } from 'next/server'
import { fetchBitcoinHistoricalData } from '@/lib/api/bitcoin'
import { 
  fetchEnhancedBitcoinPrice, 
  fetchEnhancedBitcoinDominance, 
  fetchEnhancedBitcoinMetrics,
  checkAPIHealth 
} from '@/lib/api/enhanced-bitcoin'

export async function GET() {
  try {
    // Fetch enhanced data with multiple API sources and real-time features
    const [price, dominance, historical, apiHealth] = await Promise.all([
      fetchEnhancedBitcoinPrice(),
      fetchEnhancedBitcoinDominance(),
      fetchBitcoinHistoricalData(730), // Last 2 years for monthly chart view
      checkAPIHealth()
    ])

    const metrics = await fetchEnhancedBitcoinMetrics(dominance)

    return NextResponse.json({
      success: true,
      data: {
        price,
        dominance,
        historical,
        metrics,
      },
      meta: {
        apiHealth,
        sources: {
          price: 'Enhanced multi-source',
          dominance: 'Enhanced multi-source',
          metrics: 'Enhanced with real Fear & Greed',
          fearGreed: metrics.fearGreedIndex
        }
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Bitcoin API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Bitcoin data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}