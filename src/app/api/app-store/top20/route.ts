import { NextResponse } from 'next/server'
import { fetchRealTop20Rankings } from '@/lib/api/real-app-store'

export async function GET() {
  try {
    const rankings = await fetchRealTop20Rankings()

    return NextResponse.json({
      success: true,
      data: rankings,
      meta: {
        source: 'Enhanced mock data based on real 2025 top 20 finance app rankings',
        lastUpdated: new Date().toISOString(),
        realApiAvailable: false, // Set to true when real APIs are integrated
        cryptoAppsHighlighted: true
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