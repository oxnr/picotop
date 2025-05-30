import { NextResponse } from 'next/server'
import { fetchRealAppStoreRankings } from '@/lib/api/real-app-store'

export async function GET() {
  try {
    const rankings = await fetchRealAppStoreRankings()

    return NextResponse.json({
      success: true,
      data: rankings,
      meta: {
        source: 'Real-time iTunes RSS API + Enhanced mock data for other apps',
        lastUpdated: new Date().toISOString(),
        realApiAvailable: true, // iTunes RSS API now integrated for Coinbase
        coinbaseRankingSource: 'iTunes RSS API (real-time)'
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('App Store rankings API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch app store rankings',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}