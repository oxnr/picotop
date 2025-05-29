'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SimpleBitcoinChartProps {
  data?: any[]
}

export function SimpleBitcoinChart({ data }: SimpleBitcoinChartProps) {
  // Generate realistic monthly Bitcoin price data
  const generateData = () => {
    const now = Date.now()
    const oneMonth = 30 * 24 * 60 * 60 * 1000
    const points = 27 // 27 months to include current price
    
    // Updated Bitcoin price history to current levels
    const priceHistory = [
      { month: 27, price: 15500 }, // Jan 2023 - Bear market bottom
      { month: 26, price: 16800 }, // Feb 2023
      { month: 25, price: 23000 }, // Mar 2023
      { month: 24, price: 28000 }, // Apr 2023
      { month: 23, price: 27200 }, // May 2023
      { month: 22, price: 30000 }, // Jun 2023
      { month: 21, price: 29500 }, // Jul 2023
      { month: 20, price: 26200 }, // Aug 2023
      { month: 19, price: 26900 }, // Sep 2023
      { month: 18, price: 34500 }, // Oct 2023 - ETF hype starts
      { month: 17, price: 37000 }, // Nov 2023
      { month: 16, price: 42500 }, // Dec 2023
      { month: 15, price: 42800 }, // Jan 2024
      { month: 14, price: 51500 }, // Feb 2024
      { month: 13, price: 71000 }, // Mar 2024 - ATH run
      { month: 12, price: 64000 }, // Apr 2024
      { month: 11, price: 67500 }, // May 2024
      { month: 10, price: 61000 }, // Jun 2024
      { month: 9, price: 57200 },  // Jul 2024
      { month: 8, price: 63500 },  // Aug 2024
      { month: 7, price: 65000 },  // Sep 2024
      { month: 6, price: 69000 },  // Oct 2024
      { month: 5, price: 91500 },  // Nov 2024 - Election pump
      { month: 4, price: 95800 },  // Dec 2024
      { month: 3, price: 99200 },  // Jan 2025
      { month: 2, price: 104500 }, // Feb 2025
      { month: 1, price: 108700 }, // Mar 2025 - Current price
    ]
    
    return priceHistory.map((item, i) => {
      const timestamp = now - (item.month - 1) * oneMonth
      const date = new Date(timestamp)
      
      return {
        date: date.toLocaleDateString('en-US', { 
          year: 'numeric',
          month: 'short'
        }),
        price: item.price,
        timestamp
      }
    }).reverse() // Reverse so oldest is first
  }

  const chartData = data && data.length > 0 
    ? data.map((item, i) => ({
        date: new Date(item.timestamp || Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          year: 'numeric',
          month: 'short'
        }),
        price: item.price || 95000,
        timestamp: item.timestamp || Date.now()
      }))
    : generateData()

  console.log('SimpleBitcoinChart rendering with', chartData.length, 'data points')

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-primary">
            Price: <span className="font-bold">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2f49d0" />
              <stop offset="100%" stopColor="#8e76ef" />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2e2e2e" 
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a0a0', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a0a0', fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
              return `$${value.toFixed(0)}`
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="url(#priceGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, stroke: '#2f49d0', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}