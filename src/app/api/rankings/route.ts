import { NextResponse } from 'next/server'
import { fetchRealAppStoreRankings } from '@/lib/api/real-app-store'

export async function GET() {
  try {
    const rankings = await fetchRealAppStoreRankings()

    return NextResponse.json({
      success: true,
      data: rankings,
      meta: {
        source: 'Enhanced mock data based on real 2025 rankings',
        lastUpdated: new Date().toISOString(),
        realApiAvailable: false // Set to true when real APIs are integrated
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