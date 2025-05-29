import { NextResponse } from 'next/server'
import { fetchBitcoinPrice, fetchBitcoinDominance, fetchBitcoinHistoricalData, mockBitcoinMetrics } from '@/lib/api/bitcoin'

export async function GET() {
  try {
    const [price, dominance, historical] = await Promise.all([
      fetchBitcoinPrice(),
      fetchBitcoinDominance(),
      fetchBitcoinHistoricalData(730) // Last 2 years for monthly chart view
    ])

    const metrics = mockBitcoinMetrics(dominance)

    return NextResponse.json({
      success: true,
      data: {
        price,
        dominance,
        historical,
        metrics,
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