import { NextResponse } from 'next/server'
import { fetchRealTop20Rankings } from '@/lib/api/real-app-store'

export async function GET() {
  try {
    const rankings = await fetchRealTop20Rankings()

    return NextResponse.json({
      success: true,
      data: rankings,
      meta: {
        source: 'Real-time iTunes RSS API + Enhanced mock data for non-crypto apps',
        lastUpdated: new Date().toISOString(),
        realApiAvailable: true, // iTunes RSS API now integrated for Coinbase
        cryptoAppsHighlighted: true,
        coinbaseRankingSource: 'iTunes RSS API (real-time)'
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Top Apps API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top apps rankings',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}