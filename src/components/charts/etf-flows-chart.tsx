'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TrendUp, TrendDown, CurrencyDollar } from '@phosphor-icons/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts'

interface ETFFlowData {
  date: string
  netFlow: number
  btcPrice: number
  etfFlows: { [key: string]: number }
}

interface ETFFlowsChartProps {
  data: ETFFlowData[]
  totalAUM: number
  netFlows24h: number
  netFlows7d: number
  netFlows30d: number
}

export function ETFFlowsChart({ 
  data, 
  totalAUM, 
  netFlows24h, 
  netFlows7d, 
  netFlows30d 
}: ETFFlowsChartProps) {
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            BTC Price: ${data.btcPrice?.toLocaleString()}
          </p>
          <p className={`text-sm font-medium ${
            data.netFlow >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            Net Flow: {data.netFlow >= 0 ? '+' : ''}${(data.netFlow / 1000000).toFixed(1)}M
          </p>
        </div>
      )
    }
    return null
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Format chart data
  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
    flowInMillions: item.netFlow / 1000000
  }))

  // Calculate cumulative flows
  let cumulativeFlow = 0
  const chartDataWithCumulative = chartData.map(item => {
    cumulativeFlow += item.netFlow
    return {
      ...item,
      cumulativeFlow: cumulativeFlow / 1000000 // Convert to millions
    }
  })

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CurrencyDollar className="h-6 w-6 text-green-500" />
            <CardTitle className="text-foreground">Bitcoin ETF Daily Flows</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            Last 30 days
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Daily net inflows and outflows across major Bitcoin ETFs
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className="text-2xl font-bold text-green-500 mb-1">
              ${(totalAUM / 1000000000).toFixed(1)}B
            </div>
            <div className="text-sm text-muted-foreground">Total AUM</div>
          </div>
          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className={`text-2xl font-bold mb-1 ${
              netFlows24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {netFlows24h >= 0 ? '+' : ''}${(netFlows24h / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-muted-foreground">24h Flow</div>
          </div>
          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className={`text-2xl font-bold mb-1 ${
              netFlows7d >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {netFlows7d >= 0 ? '+' : ''}${(netFlows7d / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-muted-foreground">7d Flow</div>
          </div>
          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className={`text-2xl font-bold mb-1 ${
              netFlows30d >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {netFlows30d >= 0 ? '+' : ''}${(netFlows30d / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-muted-foreground">30d Flow</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartDataWithCumulative} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="flows"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}M`}
              />
              <YAxis 
                yAxisId="cumulative"
                orientation="right"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Daily flows as bars */}
              <Bar 
                yAxisId="flows"
                dataKey="flowInMillions" 
                fill="#22c55e"
                stroke="none"
                radius={[2, 2, 0, 0]}
              />
              
              {/* Cumulative flows as line */}
              <Line
                yAxisId="cumulative"
                type="monotone"
                dataKey="cumulativeFlow"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-muted-foreground">Daily Inflows</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-muted-foreground">Daily Outflows</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-purple-500 rounded"></div>
            <span className="text-muted-foreground">Cumulative Flow</span>
          </div>
        </div>

        {/* Flow Analysis */}
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Flow Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Average Daily Flow (30d): </span>
              <span className={`font-medium ${
                (netFlows30d / 30) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(netFlows30d / 30) >= 0 ? '+' : ''}${((netFlows30d / 30) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Flow Trend: </span>
              <span className={`font-medium ${
                netFlows7d > (netFlows30d / 30 * 7) ? 'text-green-400' : 'text-red-400'
              }`}>
                {netFlows7d > (netFlows30d / 30 * 7) ? 'Accelerating Inflows' : 'Slowing Inflows'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}