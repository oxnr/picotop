import { NextResponse } from 'next/server'
import { fetchTop20Rankings } from '@/lib/api/app-store'

export async function GET() {
  try {
    const rankings = await fetchTop20Rankings()

    return NextResponse.json({
      success: true,
      data: rankings,
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