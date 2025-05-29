import { NextResponse } from 'next/server'
import { fetchAppStoreRankings } from '@/lib/api/app-store'

export async function GET() {
  try {
    const rankings = await fetchAppStoreRankings()

    return NextResponse.json({
      success: true,
      data: rankings,
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