'use client'

import { DashboardLayout, MetricCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { DashboardMetric } from '@/lib/types'
import { Bitcoin, TrendUp, ChartLine, Ranking } from '@phosphor-icons/react'

// Mock data for initial dashboard
const mockMetrics: DashboardMetric[] = [
  {
    id: '1',
    title: 'Bitcoin Price',
    value: '$42,350',
    change: {
      value: 2.4,
      period: 'last 24h',
      direction: 'up'
    },
    icon: 'bitcoin',
    color: 'orange'
  },
  {
    id: '2',
    title: 'NUPL Score',
    value: '0.72',
    change: {
      value: -1.2,
      period: 'last week',
      direction: 'down'
    },
    icon: 'chart',
    color: 'blue'
  },
  {
    id: '3',
    title: 'SOPR',
    value: '1.034',
    change: {
      value: 0.8,
      period: 'last 30d',
      direction: 'up'
    },
    icon: 'trend',
    color: 'green'
  },
  {
    id: '4',
    title: 'Coinbase Rank',
    value: '#12',
    change: {
      value: -2,
      period: 'this week',
      direction: 'down'
    },
    icon: 'ranking',
    color: 'purple'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout 
        title="CycleTop Dashboard"
        description="Bitcoin cycle prediction through comprehensive market analysis"
      >
        {/* Hero Section */}
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Bitcoin size={48} className="text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Welcome to CycleTop</CardTitle>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced Bitcoin cycle prediction platform combining app store rankings, 
              on-chain metrics, and proprietary algorithms to predict market cycle tops.
            </p>
          </CardHeader>
        </Card>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mockMetrics.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Ranking className="h-6 w-6 text-blue-500" />
                <CardTitle>App Store Rankings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track crypto app rankings as market sentiment indicators. 
                Monitor Coinbase, Phantom, and other major crypto apps across iOS and Android.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ChartLine className="h-6 w-6 text-green-500" />
                <CardTitle>Bitcoin Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis of NUPL, SOPR, MVRV Z-Score, and Rainbow Chart 
                to understand market cycles and investor behavior.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendUp className="h-6 w-6 text-purple-500" />
                <CardTitle>Cycle Prediction</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Proprietary algorithms combine multiple data sources to predict 
                Bitcoin cycle tops with confidence scores and timing estimates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <Card>
          <CardHeader>
            <CardTitle>🚧 Under Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Current Phase: Foundation</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✅ Project setup and architecture</li>
                  <li>✅ Core UI components</li>
                  <li>🔄 Dashboard implementation</li>
                  <li>⏳ Data integration pipeline</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Next Steps</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>⏳ App store rankings API</li>
                  <li>⏳ Bitcoin metrics integration</li>
                  <li>⏳ Real-time data streaming</li>
                  <li>⏳ Prediction algorithms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </div>
  )
}