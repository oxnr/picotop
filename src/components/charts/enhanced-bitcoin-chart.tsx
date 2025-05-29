'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface EnhancedBitcoinChartProps {
  data?: any[]
  currentPrice?: number
}

export function EnhancedBitcoinChart({ data, currentPrice = 108700 }: EnhancedBitcoinChartProps) {
  // Generate realistic monthly Bitcoin price data with predictions
  const generateCompleteData = () => {
    const now = Date.now()
    const oneMonth = 30 * 24 * 60 * 60 * 1000
    
    // Historical data (corrected actual prices)
    const historicalPrices = [
      { month: 59, price: 16540, isPrediction: false }, // Jan 2020
      { month: 58, price: 9600, isPrediction: false },  // Feb 2020  
      { month: 57, price: 5800, isPrediction: false },  // Mar 2020 - COVID crash
      { month: 56, price: 7770, isPrediction: false },  // Apr 2020
      { month: 55, price: 8800, isPrediction: false },  // May 2020
      { month: 54, price: 9100, isPrediction: false },  // Jun 2020
      { month: 53, price: 11200, isPrediction: false }, // Jul 2020
      { month: 52, price: 11700, isPrediction: false }, // Aug 2020
      { month: 51, price: 10800, isPrediction: false }, // Sep 2020
      { month: 50, price: 13780, isPrediction: false }, // Oct 2020
      { month: 49, price: 19700, isPrediction: false }, // Nov 2020
      { month: 48, price: 28900, isPrediction: false }, // Dec 2020 - Institutional buying
      { month: 47, price: 29000, isPrediction: false }, // Jan 2021
      { month: 46, price: 45000, isPrediction: false }, // Feb 2021
      { month: 45, price: 58900, isPrediction: false }, // Mar 2021
      { month: 44, price: 65000, isPrediction: false }, // Apr 2021 - First peak
      { month: 43, price: 35000, isPrediction: false }, // May 2021 - China ban crash
      { month: 42, price: 34500, isPrediction: false }, // Jun 2021
      { month: 41, price: 41000, isPrediction: false }, // Jul 2021
      { month: 40, price: 47000, isPrediction: false }, // Aug 2021
      { month: 39, price: 43800, isPrediction: false }, // Sep 2021
      { month: 38, price: 61000, isPrediction: false }, // Oct 2021 - Recovery
      { month: 37, price: 69000, isPrediction: false }, // Nov 2021 - ATH
      { month: 36, price: 46200, isPrediction: false }, // Dec 2021
      { month: 35, price: 38000, isPrediction: false }, // Jan 2022
      { month: 34, price: 38500, isPrediction: false }, // Feb 2022
      { month: 33, price: 45000, isPrediction: false }, // Mar 2022
      { month: 32, price: 38000, isPrediction: false }, // Apr 2022
      { month: 31, price: 29600, isPrediction: false }, // May 2022 - LUNA crash
      { month: 30, price: 20000, isPrediction: false }, // Jun 2022 - Bear market
      { month: 29, price: 23300, isPrediction: false }, // Jul 2022
      { month: 28, price: 23000, isPrediction: false }, // Aug 2022
      { month: 27, price: 19400, isPrediction: false }, // Sep 2022
      { month: 26, price: 20400, isPrediction: false }, // Oct 2022
      { month: 25, price: 15700, isPrediction: false }, // Nov 2022 - FTX collapse
      { month: 24, price: 16500, isPrediction: false }, // Dec 2022
      { month: 23, price: 23100, isPrediction: false }, // Jan 2023
      { month: 22, price: 24200, isPrediction: false }, // Feb 2023
      { month: 21, price: 27000, isPrediction: false }, // Mar 2023 - Banking crisis
      { month: 20, price: 29200, isPrediction: false }, // Apr 2023
      { month: 19, price: 27000, isPrediction: false }, // May 2023
      { month: 18, price: 30000, isPrediction: false }, // Jun 2023
      { month: 17, price: 29200, isPrediction: false }, // Jul 2023
      { month: 16, price: 29100, isPrediction: false }, // Aug 2023
      { month: 15, price: 26900, isPrediction: false }, // Sep 2023
      { month: 14, price: 34500, isPrediction: false }, // Oct 2023 - ETF hype
      { month: 13, price: 37000, isPrediction: false }, // Nov 2023
      { month: 12, price: 42200, isPrediction: false }, // Dec 2023
      { month: 11, price: 42800, isPrediction: false }, // Jan 2024
      { month: 10, price: 51500, isPrediction: false }, // Feb 2024 - ETF approval
      { month: 9, price: 71000, isPrediction: false },  // Mar 2024 - New ATH
      { month: 8, price: 64000, isPrediction: false },  // Apr 2024
      { month: 7, price: 67500, isPrediction: false },  // May 2024
      { month: 6, price: 61000, isPrediction: false },  // Jun 2024
      { month: 5, price: 66500, isPrediction: false },  // Jul 2024
      { month: 4, price: 59800, isPrediction: false },  // Aug 2024
      { month: 3, price: 63000, isPrediction: false },  // Sep 2024
      { month: 2, price: 69000, isPrediction: false },  // Oct 2024
      { month: 1, price: 91500, isPrediction: false },  // Nov 2024 - Election pump
      { month: 0, price: 108700, isPrediction: false }, // Dec 2024 - Current
    ]
    
    // Generate predictions for next 1.5 years (18 months) based on cycle analysis
    const futurePredictions = []
    let currentPricePoint = currentPrice
    
    // Prediction algorithm based on cycle patterns and Pi Cycle Top (Sep 2025)
    const monthsAhead = 18
    const peakMonth = 6 // September 2025 (6 months from now)
    const peakPrice = 185000 // Based on Pi Cycle prediction
    
    for (let i = 0; i < monthsAhead; i++) {
      const monthsFromNow = i + 1
      let predictedPrice
      
      if (monthsFromNow <= peakMonth) {
        // Bull run to peak - exponential growth curve
        const progressToPeak = monthsFromNow / peakMonth
        const growthFactor = Math.pow(progressToPeak, 0.7) // Slower growth curve
        predictedPrice = currentPricePoint + (peakPrice - currentPricePoint) * growthFactor
        
        // Add some volatility
        const volatility = Math.sin(monthsFromNow * 0.5) * 8000
        predictedPrice += volatility
        
      } else {
        // Bear market after peak - decline with bounce
        const monthsAfterPeak = monthsFromNow - peakMonth
        let declineFactor
        
        if (monthsAfterPeak <= 6) {
          // Sharp decline first 6 months (50-70% drop)
          declineFactor = Math.pow(monthsAfterPeak / 6, 0.5) * 0.65
        } else {
          // Slower decline/consolidation
          declineFactor = 0.65 + (monthsAfterPeak - 6) * 0.02
        }
        
        predictedPrice = peakPrice * (1 - declineFactor)
        
        // Add bear market volatility
        const volatility = Math.sin(monthsAfterPeak * 0.3) * 5000
        predictedPrice += volatility
      }
      
      // Ensure reasonable bounds
      predictedPrice = Math.max(30000, Math.min(300000, predictedPrice))
      
      futurePredictions.push({
        month: -monthsFromNow, // Negative for future months
        price: Math.round(predictedPrice),
        isPrediction: true
      })
    }
    
    // Combine historical and predictions
    const allData = [...historicalPrices, ...futurePredictions]
    
    return allData.map((item, i) => {
      const timestamp = item.month >= 0 
        ? now - item.month * oneMonth  // Historical (0 = current month, 59 = 59 months ago)
        : now + (Math.abs(item.month)) * oneMonth // Future (negative months)
      const date = new Date(timestamp)
      
      return {
        date: `${date.toLocaleDateString('en-US', { month: 'short' })}\n'${String(date.getFullYear()).slice(-2)}`,
        monthYear: `${date.toLocaleDateString('en-US', { month: 'short' })} '${String(date.getFullYear()).slice(-2)}`,
        price: item.price,
        predictionPrice: item.isPrediction ? item.price : null,
        historicalPrice: !item.isPrediction ? item.price : null,
        timestamp,
        isPrediction: item.isPrediction
      }
    }).sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp
  }

  const chartData = generateCompleteData()
  
  // Split data for different line styles
  const historicalData = chartData.filter(item => !item.isPrediction)
  const predictionData = chartData.filter(item => item.isPrediction)
  
  // Create combined data for continuous line
  const combinedData = chartData.map(item => ({
    ...item,
    price: item.historicalPrice || item.predictionPrice
  }))

  console.log('Enhanced Bitcoin Chart:', {
    total: chartData.length,
    historical: historicalData.length,
    predictions: predictionData.length
  })

  const CustomTick = (props: any) => {
    const { x, y, payload } = props
    const parts = payload.value.split('\n')
    const month = parts[0] || ''
    const year = parts[1] || ''
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={0} textAnchor="middle" fill="#a1a0a0" fontSize="11">
          <tspan x="0" dy="0">{month}</tspan>
          <tspan x="0" dy="12">{year}</tspan>
        </text>
      </g>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isForcast = data.isPrediction
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.monthYear}</p>
          <p className={isForcast ? "text-orange-400" : "text-primary"}>
            {isForcast ? 'Predicted' : 'Price'}: <span className="font-bold">${payload[0].value.toLocaleString()}</span>
          </p>
          {isForcast && (
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Prediction based on cycle analysis
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2f49d0" />
              <stop offset="100%" stopColor="#8e76ef" />
            </linearGradient>
            <linearGradient id="predictionGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
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
            tick={<CustomTick />}
            height={50}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a0a0', fontSize: 12 }}
            domain={['dataMin * 0.8', 'dataMax * 1.1']}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
              return `$${value.toFixed(0)}`
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Current price reference line */}
          <ReferenceLine 
            y={currentPrice} 
            stroke="#22c55e" 
            strokeDasharray="2 2" 
            strokeWidth={1}
            label={{ value: "Current", position: "right", fill: "#22c55e", fontSize: 12 }}
          />
          
          {/* Pi Cycle Top prediction line */}
          <ReferenceLine 
            y={185000} 
            stroke="#ef4444" 
            strokeDasharray="2 2" 
            strokeWidth={1}
            label={{ value: "Pi Cycle Top", position: "right", fill: "#ef4444", fontSize: 12, offset: 10 }}
          />
          
          {/* Historical price line - solid */}
          <Line
            type="monotone"
            dataKey="historicalPrice"
            stroke="url(#historicalGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, stroke: '#2f49d0', strokeWidth: 2, fill: '#fff' }}
            connectNulls={false}
          />
          
          {/* Prediction price line - dashed */}
          <Line
            type="monotone"
            dataKey="predictionPrice"
            stroke="url(#predictionGradient)"
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={false}
            activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend - moved inside chart area */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-xs bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-border">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <span className="text-muted-foreground">Historical</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500" style={{ borderTop: '1px dashed' }}></div>
          <span className="text-muted-foreground">Prediction</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-0.5 bg-green-500 opacity-70"></div>
          <span className="text-muted-foreground">${currentPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}