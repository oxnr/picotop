import { NextRequest, NextResponse } from 'next/server'
import { fetchBitcoinHistoricalData } from '@/lib/api/bitcoin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const daysParam = searchParams.get('days')
    const days = daysParam ? parseInt(daysParam, 10) : 365

    // Validate days parameter
    if (days < 1 || days > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Days parameter must be between 1 and 2000',
        },
        { status: 400 }
      )
    }

    const historical = await fetchBitcoinHistoricalData(days)

    return NextResponse.json({
      success: true,
      data: historical,
      period: `${days} days`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Bitcoin Historical API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Bitcoin historical data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}