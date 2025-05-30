'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface EnhancedBitcoinChartProps {
  data?: any[]
  currentPrice?: number
  targetPrice?: number
}

export function EnhancedBitcoinChart({ data, currentPrice = 108700, targetPrice }: EnhancedBitcoinChartProps) {
  // Stable timestamp for consistent predictions (5-minute intervals)
  const getStableTimestamp = () => {
    return Math.floor(Date.now() / (5 * 60 * 1000)) * (5 * 60 * 1000)
  }

  // Generate realistic monthly Bitcoin price data with predictions
  const generateCompleteData = () => {
    const stableTime = getStableTimestamp()
    const now = stableTime
    const currentDate = new Date(stableTime)
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // 1-12
    const oneMonth = 30 * 24 * 60 * 60 * 1000
    
    // Bitcoin price high values extracted from provided CoinMarketCap data
    const historicalPrices = [
      // 2013 data (starting from April 2013)
      { month: 144, price: 147.49, isPrediction: false },  // Apr 2013
      { month: 143, price: 139.89, isPrediction: false },  // May 2013 
      { month: 142, price: 129.78, isPrediction: false },  // Jun 2013
      { month: 141, price: 111.34, isPrediction: false },  // Jul 2013
      { month: 140, price: 140.89, isPrediction: false },  // Aug 2013
      { month: 139, price: 146.50, isPrediction: false },  // Sep 2013
      { month: 138, price: 217.42, isPrediction: false },  // Oct 2013
      { month: 137, price: 1156.14, isPrediction: false }, // Nov 2013 - First major rally
      { month: 136, price: 1156.12, isPrediction: false }, // Dec 2013
      // 2014 data
      { month: 135, price: 1017.12, isPrediction: false }, // Jan 2014
      { month: 134, price: 853.52, isPrediction: false },  // Feb 2014
      { month: 133, price: 702.91, isPrediction: false },  // Mar 2014
      { month: 132, price: 542.38, isPrediction: false },  // Apr 2014
      { month: 131, price: 624.72, isPrediction: false },  // May 2014
      { month: 130, price: 674.11, isPrediction: false },  // Jun 2014
      { month: 129, price: 657.86, isPrediction: false },  // Jul 2014
      { month: 128, price: 598.12, isPrediction: false },  // Aug 2014
      { month: 127, price: 493.93, isPrediction: false },  // Sep 2014
      { month: 126, price: 411.70, isPrediction: false },  // Oct 2014
      { month: 125, price: 457.09, isPrediction: false },  // Nov 2014
      { month: 124, price: 384.04, isPrediction: false },  // Dec 2014
      // 2015 data
      { month: 123, price: 320.43, isPrediction: false },  // Jan 2015
      { month: 122, price: 265.61, isPrediction: false },  // Feb 2015
      { month: 121, price: 300.04, isPrediction: false },  // Mar 2015
      { month: 120, price: 261.80, isPrediction: false },  // Apr 2015
      { month: 119, price: 247.80, isPrediction: false },  // May 2015
      { month: 118, price: 267.87, isPrediction: false },  // Jun 2015
      { month: 117, price: 314.39, isPrediction: false },  // Jul 2015
      { month: 116, price: 285.71, isPrediction: false },  // Aug 2015
      { month: 115, price: 259.18, isPrediction: false },  // Sep 2015
      { month: 114, price: 334.17, isPrediction: false },  // Oct 2015
      { month: 113, price: 495.56, isPrediction: false },  // Nov 2015
      { month: 112, price: 469.10, isPrediction: false },  // Dec 2015
      // 2016 data
      { month: 111, price: 462.93, isPrediction: false },  // Jan 2016
      { month: 110, price: 448.05, isPrediction: false },  // Feb 2016
      { month: 109, price: 439.65, isPrediction: false },  // Mar 2016
      { month: 108, price: 467.96, isPrediction: false },  // Apr 2016
      { month: 107, price: 553.96, isPrediction: false },  // May 2016
      { month: 106, price: 777.99, isPrediction: false },  // Jun 2016
      { month: 105, price: 704.97, isPrediction: false },  // Jul 2016
      { month: 104, price: 626.12, isPrediction: false },  // Aug 2016
      { month: 103, price: 628.82, isPrediction: false },  // Sep 2016
      { month: 102, price: 720.40, isPrediction: false },  // Oct 2016
      { month: 101, price: 756.24, isPrediction: false },  // Nov 2016
      { month: 100, price: 979.40, isPrediction: false },  // Dec 2016
      // 2017 data
      { month: 99, price: 1191.10, isPrediction: false },  // Jan 2017
      { month: 98, price: 1200.39, isPrediction: false },  // Feb 2017
      { month: 97, price: 1280.31, isPrediction: false },  // Mar 2017
      { month: 96, price: 1347.91, isPrediction: false },  // Apr 2017
      { month: 95, price: 2763.71, isPrediction: false },  // May 2017
      { month: 94, price: 2999.91, isPrediction: false },  // Jun 2017
      { month: 93, price: 2916.14, isPrediction: false },  // Jul 2017
      { month: 92, price: 4736.05, isPrediction: false },  // Aug 2017
      { month: 91, price: 4975.04, isPrediction: false },  // Sep 2017
      { month: 90, price: 6470.43, isPrediction: false },  // Oct 2017
      { month: 89, price: 11517.40, isPrediction: false }, // Nov 2017
      { month: 88, price: 20089.00, isPrediction: false }, // Dec 2017 - First major peak
      // 2018 data
      { month: 87, price: 17712.40, isPrediction: false }, // Jan 2018
      { month: 86, price: 11958.50, isPrediction: false }, // Feb 2018
      { month: 85, price: 11704.10, isPrediction: false }, // Mar 2018
      { month: 84, price: 9745.32, isPrediction: false },  // Apr 2018
      { month: 83, price: 9964.50, isPrediction: false },  // May 2018
      { month: 82, price: 7754.89, isPrediction: false },  // Jun 2018
      { month: 81, price: 8424.27, isPrediction: false },  // Jul 2018
      { month: 80, price: 7769.04, isPrediction: false },  // Aug 2018
      { month: 79, price: 7388.43, isPrediction: false },  // Sep 2018
      { month: 78, price: 6965.06, isPrediction: false },  // Oct 2018
      { month: 77, price: 6552.16, isPrediction: false },  // Nov 2018
      { month: 76, price: 4309.38, isPrediction: false },  // Dec 2018
      // 2019 data
      { month: 75, price: 4109.02, isPrediction: false },  // Jan 2019
      { month: 74, price: 4210.64, isPrediction: false },  // Feb 2019
      { month: 73, price: 4296.81, isPrediction: false },  // Mar 2019
      { month: 72, price: 5642.04, isPrediction: false },  // Apr 2019
      { month: 71, price: 9008.31, isPrediction: false },  // May 2019
      { month: 70, price: 13796.49, isPrediction: false }, // Jun 2019
      { month: 69, price: 13129.53, isPrediction: false }, // Jul 2019
      { month: 68, price: 12273.82, isPrediction: false }, // Aug 2019
      { month: 67, price: 10898.76, isPrediction: false }, // Sep 2019
      { month: 66, price: 10021.74, isPrediction: false }, // Oct 2019
      { month: 65, price: 9505.05, isPrediction: false },  // Nov 2019
      { month: 64, price: 7743.43, isPrediction: false },  // Dec 2019
      // 2020 data
      { month: 63, price: 9553.13, isPrediction: false },  // Jan 2020
      { month: 62, price: 10457.63, isPrediction: false }, // Feb 2020
      { month: 61, price: 9167.70, isPrediction: false },  // Mar 2020 - COVID crash
      { month: 60, price: 9440.65, isPrediction: false },  // Apr 2020
      { month: 59, price: 9996.74, isPrediction: false },  // May 2020
      { month: 58, price: 10199.56, isPrediction: false }, // Jun 2020
      { month: 57, price: 11415.86, isPrediction: false }, // Jul 2020
      { month: 56, price: 13149.69, isPrediction: false }, // Aug 2020
      { month: 55, price: 12059.87, isPrediction: false }, // Sep 2020
      { month: 54, price: 14028.21, isPrediction: false }, // Oct 2020
      { month: 53, price: 19749.26, isPrediction: false }, // Nov 2020
      { month: 52, price: 29244.88, isPrediction: false }, // Dec 2020 - Institutional buying
      // 2021 data
      { month: 51, price: 41946.74, isPrediction: false }, // Jan 2021
      { month: 50, price: 58330.57, isPrediction: false }, // Feb 2021
      { month: 49, price: 61683.86, isPrediction: false }, // Mar 2021
      { month: 48, price: 64863.10, isPrediction: false }, // Apr 2021
      { month: 47, price: 59519.35, isPrediction: false }, // May 2021 - China ban crash
      { month: 46, price: 41295.27, isPrediction: false }, // Jun 2021
      { month: 45, price: 42235.55, isPrediction: false }, // Jul 2021
      { month: 44, price: 50482.08, isPrediction: false }, // Aug 2021
      { month: 43, price: 52853.76, isPrediction: false }, // Sep 2021
      { month: 42, price: 66930.39, isPrediction: false }, // Oct 2021 - Recovery
      { month: 41, price: 68789.63, isPrediction: false }, // Nov 2021 - ATH
      { month: 40, price: 59041.69, isPrediction: false }, // Dec 2021
      // 2022 data
      { month: 39, price: 47881.41, isPrediction: false }, // Jan 2022
      { month: 38, price: 45661.17, isPrediction: false }, // Feb 2022
      { month: 37, price: 48086.84, isPrediction: false }, // Mar 2022
      { month: 36, price: 47313.48, isPrediction: false }, // Apr 2022
      { month: 35, price: 39902.95, isPrediction: false }, // May 2022 - LUNA crash
      { month: 34, price: 31957.28, isPrediction: false }, // Jun 2022 - Bear market
      { month: 33, price: 24572.58, isPrediction: false }, // Jul 2022
      { month: 32, price: 25135.59, isPrediction: false }, // Aug 2022
      { month: 31, price: 22673.82, isPrediction: false }, // Sep 2022
      { month: 30, price: 20988.39, isPrediction: false }, // Oct 2022
      { month: 29, price: 21446.89, isPrediction: false }, // Nov 2022 - FTX collapse
      { month: 28, price: 18318.53, isPrediction: false }, // Dec 2022
      // 2023 data
      { month: 27, price: 23919.89, isPrediction: false }, // Jan 2023
      { month: 26, price: 25134.12, isPrediction: false }, // Feb 2023
      { month: 25, price: 29159.90, isPrediction: false }, // Mar 2023 - Banking crisis
      { month: 24, price: 31005.61, isPrediction: false }, // Apr 2023
      { month: 23, price: 29820.13, isPrediction: false }, // May 2023
      { month: 22, price: 31389.54, isPrediction: false }, // Jun 2023
      { month: 21, price: 31814.51, isPrediction: false }, // Jul 2023
      { month: 20, price: 30176.80, isPrediction: false }, // Aug 2023
      { month: 19, price: 27488.76, isPrediction: false }, // Sep 2023
      { month: 18, price: 35150.43, isPrediction: false }, // Oct 2023 - ETF hype
      { month: 17, price: 38415.34, isPrediction: false }, // Nov 2023
      { month: 16, price: 44705.52, isPrediction: false }, // Dec 2023
      // 2024 data
      { month: 15, price: 48969.37, isPrediction: false }, // Jan 2024
      { month: 14, price: 63913.13, isPrediction: false }, // Feb 2024 - ETF approval
      { month: 13, price: 73750.07, isPrediction: false }, // Mar 2024 - New ATH
      { month: 12, price: 72715.36, isPrediction: false }, // Apr 2024 - Halving
      { month: 11, price: 71946.46, isPrediction: false }, // May 2024
      { month: 10, price: 71907.85, isPrediction: false }, // Jun 2024
      { month: 9, price: 69987.54, isPrediction: false },  // Jul 2024
      { month: 8, price: 65593.24, isPrediction: false },  // Aug 2024
      { month: 7, price: 66480.69, isPrediction: false },  // Sep 2024
      { month: 6, price: 73577.21, isPrediction: false },  // Oct 2024
      { month: 5, price: 99655.50, isPrediction: false },  // Nov 2024 - Election pump
      { month: 4, price: 108268.45, isPrediction: false }, // Dec 2024
      { month: 3, price: 109114.88, isPrediction: false }, // Jan 2025
      { month: 2, price: 102755.73, isPrediction: false }, // Feb 2025
      { month: 1, price: 95043.44, isPrediction: false },  // Mar 2025
      { month: 0, price: 95768.39, isPrediction: false },  // Apr 2025 (high)
      { month: -1, price: currentPrice, isPrediction: false }, // May 2025 (current)
    ]
    
    // Generate predictions for next 1.5 years (18 months) based on cycle analysis
    const futurePredictions = []
    let currentPricePoint = currentPrice
    
    // Prediction algorithm based on cycle patterns and dynamic target price
    const monthsAhead = 18
    const peakMonth = 6 // Estimated 6 months from now based on cycle analysis
    const peakPrice = targetPrice || currentPrice * 1.25 // Use dynamic target price
    
    for (let i = 0; i < monthsAhead; i++) {
      const monthsFromNow = i + 2  // Start from June (month -2)
      let predictedPrice
      
      if (monthsFromNow <= peakMonth) {
        // Bull run to peak - exponential growth curve
        const progressToPeak = monthsFromNow / peakMonth
        const growthFactor = Math.pow(progressToPeak, 0.7) // Slower growth curve
        predictedPrice = currentPricePoint + (peakPrice - currentPricePoint) * growthFactor
        
        // Add some volatility using stable timestamp
        const volatility = Math.sin((stableTime / 1000000) + (monthsFromNow * 0.5)) * 8000
        predictedPrice += volatility
        
      } else {
        // Bear market after peak - realistic decline with bounces
        const monthsAfterPeak = monthsFromNow - peakMonth
        const previousCycleHigh = 68000 // 2021 ATH as major support
        const bearMarketBottom = 45000 // Absolute floor
        
        // More realistic bear market progression
        let baseDecline
        if (monthsAfterPeak <= 3) {
          // Initial crash - 35% drop in first 3 months
          baseDecline = Math.pow(monthsAfterPeak / 3, 0.8) * 0.35
        } else if (monthsAfterPeak <= 8) {
          // Continued decline to previous cycle high level
          const progress = (monthsAfterPeak - 3) / 5
          baseDecline = 0.35 + progress * 0.25 // Total 60% max decline
        } else {
          // Consolidation phase around previous cycle high
          baseDecline = 0.60 + Math.sin((stableTime / 2000000) + ((monthsAfterPeak - 8) * 0.5)) * 0.1
        }
        
        predictedPrice = peakPrice * (1 - baseDecline)
        
        // Add realistic volatility with dead cat bounces using stable timestamp
        const volatilityPhase = Math.sin((stableTime / 1500000) + (monthsAfterPeak * 0.8)) * 0.15 // 15% volatility
        const deadCatBounce = Math.sin((stableTime / 1200000) + (monthsAfterPeak * 1.2)) * 0.08 // 8% bounces
        const combinedVolatility = (volatilityPhase + deadCatBounce) * predictedPrice
        
        predictedPrice += combinedVolatility
        
        // Ensure we don't go below previous cycle high for too long
        if (monthsAfterPeak > 6 && predictedPrice < previousCycleHigh) {
          const stableRandomSeed = Math.sin(stableTime / 1000000 + monthsAfterPeak) * 0.5 + 0.5 // 0-1 range
          predictedPrice = Math.max(predictedPrice, bearMarketBottom + stableRandomSeed * (previousCycleHigh - bearMarketBottom))
        }
      }
      
      // Ensure realistic bounds: don't go below 45K or above 300K
      predictedPrice = Math.max(45000, Math.min(300000, predictedPrice))
      
      futurePredictions.push({
        month: -monthsFromNow, // Start from -2 (June 2025)
        price: Math.round(predictedPrice),
        isPrediction: true
      })
    }
    
    // Combine historical and predictions
    const allData = [...historicalPrices, ...futurePredictions]
    
    // Create explicit date mapping for historical data to ensure accuracy
    const monthYearMap = {
      144: { year: 2013, month: 4 },  // Apr 2013
      143: { year: 2013, month: 5 },  // May 2013
      142: { year: 2013, month: 6 },  // Jun 2013
      141: { year: 2013, month: 7 },  // Jul 2013
      140: { year: 2013, month: 8 },  // Aug 2013
      139: { year: 2013, month: 9 },  // Sep 2013
      138: { year: 2013, month: 10 }, // Oct 2013
      137: { year: 2013, month: 11 }, // Nov 2013
      136: { year: 2013, month: 12 }, // Dec 2013
      135: { year: 2014, month: 1 },  // Jan 2014
      134: { year: 2014, month: 2 },  // Feb 2014
      133: { year: 2014, month: 3 },  // Mar 2014
      132: { year: 2014, month: 4 },  // Apr 2014
      131: { year: 2014, month: 5 },  // May 2014
      130: { year: 2014, month: 6 },  // Jun 2014
      129: { year: 2014, month: 7 },  // Jul 2014
      128: { year: 2014, month: 8 },  // Aug 2014
      127: { year: 2014, month: 9 },  // Sep 2014
      126: { year: 2014, month: 10 }, // Oct 2014
      125: { year: 2014, month: 11 }, // Nov 2014
      124: { year: 2014, month: 12 }, // Dec 2014
      123: { year: 2015, month: 1 },  // Jan 2015
      122: { year: 2015, month: 2 },  // Feb 2015
      121: { year: 2015, month: 3 },  // Mar 2015
      120: { year: 2015, month: 4 },  // Apr 2015
      119: { year: 2015, month: 5 },  // May 2015
      118: { year: 2015, month: 6 },  // Jun 2015
      117: { year: 2015, month: 7 },  // Jul 2015
      116: { year: 2015, month: 8 },  // Aug 2015
      115: { year: 2015, month: 9 },  // Sep 2015
      114: { year: 2015, month: 10 }, // Oct 2015
      113: { year: 2015, month: 11 }, // Nov 2015
      112: { year: 2015, month: 12 }, // Dec 2015
      111: { year: 2016, month: 1 },  // Jan 2016
      110: { year: 2016, month: 2 },  // Feb 2016
      109: { year: 2016, month: 3 },  // Mar 2016
      108: { year: 2016, month: 4 },  // Apr 2016
      107: { year: 2016, month: 5 },  // May 2016
      106: { year: 2016, month: 6 },  // Jun 2016
      105: { year: 2016, month: 7 },  // Jul 2016
      104: { year: 2016, month: 8 },  // Aug 2016
      103: { year: 2016, month: 9 },  // Sep 2016
      102: { year: 2016, month: 10 }, // Oct 2016
      101: { year: 2016, month: 11 }, // Nov 2016
      100: { year: 2016, month: 12 }, // Dec 2016
      99: { year: 2017, month: 1 },   // Jan 2017
      98: { year: 2017, month: 2 },   // Feb 2017
      97: { year: 2017, month: 3 },   // Mar 2017
      96: { year: 2017, month: 4 },   // Apr 2017
      95: { year: 2017, month: 5 },   // May 2017
      94: { year: 2017, month: 6 },   // Jun 2017
      93: { year: 2017, month: 7 },   // Jul 2017
      92: { year: 2017, month: 8 },   // Aug 2017
      91: { year: 2017, month: 9 },   // Sep 2017
      90: { year: 2017, month: 10 },  // Oct 2017
      89: { year: 2017, month: 11 },  // Nov 2017
      88: { year: 2017, month: 12 },  // Dec 2017
      87: { year: 2018, month: 1 },   // Jan 2018
      86: { year: 2018, month: 2 },   // Feb 2018
      85: { year: 2018, month: 3 },   // Mar 2018
      84: { year: 2018, month: 4 },   // Apr 2018
      83: { year: 2018, month: 5 },   // May 2018
      82: { year: 2018, month: 6 },   // Jun 2018
      81: { year: 2018, month: 7 },   // Jul 2018
      80: { year: 2018, month: 8 },   // Aug 2018
      79: { year: 2018, month: 9 },   // Sep 2018
      78: { year: 2018, month: 10 },  // Oct 2018
      77: { year: 2018, month: 11 },  // Nov 2018
      76: { year: 2018, month: 12 },  // Dec 2018
      75: { year: 2019, month: 1 },   // Jan 2019
      74: { year: 2019, month: 2 },   // Feb 2019
      73: { year: 2019, month: 3 },   // Mar 2019
      72: { year: 2019, month: 4 },   // Apr 2019
      71: { year: 2019, month: 5 },   // May 2019
      70: { year: 2019, month: 6 },   // Jun 2019
      69: { year: 2019, month: 7 },   // Jul 2019
      68: { year: 2019, month: 8 },   // Aug 2019
      67: { year: 2019, month: 9 },   // Sep 2019
      66: { year: 2019, month: 10 },  // Oct 2019
      65: { year: 2019, month: 11 },  // Nov 2019
      64: { year: 2019, month: 12 },  // Dec 2019
      63: { year: 2020, month: 1 },   // Jan 2020
      62: { year: 2020, month: 2 },   // Feb 2020
      61: { year: 2020, month: 3 },   // Mar 2020
      60: { year: 2020, month: 4 },   // Apr 2020
      59: { year: 2020, month: 5 },   // May 2020
      58: { year: 2020, month: 6 },   // Jun 2020
      57: { year: 2020, month: 7 },   // Jul 2020
      56: { year: 2020, month: 8 },   // Aug 2020
      55: { year: 2020, month: 9 },   // Sep 2020
      54: { year: 2020, month: 10 },  // Oct 2020
      53: { year: 2020, month: 11 },  // Nov 2020
      52: { year: 2020, month: 12 },  // Dec 2020
      51: { year: 2021, month: 1 },   // Jan 2021
      50: { year: 2021, month: 2 },   // Feb 2021
      49: { year: 2021, month: 3 },   // Mar 2021
      48: { year: 2021, month: 4 },   // Apr 2021
      47: { year: 2021, month: 5 },   // May 2021
      46: { year: 2021, month: 6 },   // Jun 2021
      45: { year: 2021, month: 7 },   // Jul 2021
      44: { year: 2021, month: 8 },   // Aug 2021
      43: { year: 2021, month: 9 },   // Sep 2021
      42: { year: 2021, month: 10 },  // Oct 2021
      41: { year: 2021, month: 11 },  // Nov 2021
      40: { year: 2021, month: 12 },  // Dec 2021
      39: { year: 2022, month: 1 },   // Jan 2022
      38: { year: 2022, month: 2 },   // Feb 2022
      37: { year: 2022, month: 3 },   // Mar 2022
      36: { year: 2022, month: 4 },   // Apr 2022
      35: { year: 2022, month: 5 },   // May 2022
      34: { year: 2022, month: 6 },   // Jun 2022
      33: { year: 2022, month: 7 },   // Jul 2022
      32: { year: 2022, month: 8 },   // Aug 2022
      31: { year: 2022, month: 9 },   // Sep 2022
      30: { year: 2022, month: 10 },  // Oct 2022
      29: { year: 2022, month: 11 },  // Nov 2022
      28: { year: 2022, month: 12 },  // Dec 2022
      27: { year: 2023, month: 1 },   // Jan 2023
      26: { year: 2023, month: 2 },   // Feb 2023
      25: { year: 2023, month: 3 },   // Mar 2023
      24: { year: 2023, month: 4 },   // Apr 2023
      23: { year: 2023, month: 5 },   // May 2023
      22: { year: 2023, month: 6 },   // Jun 2023
      21: { year: 2023, month: 7 },   // Jul 2023
      20: { year: 2023, month: 8 },   // Aug 2023
      19: { year: 2023, month: 9 },   // Sep 2023
      18: { year: 2023, month: 10 },  // Oct 2023
      17: { year: 2023, month: 11 },  // Nov 2023
      16: { year: 2023, month: 12 },  // Dec 2023
      15: { year: 2024, month: 1 },   // Jan 2024
      14: { year: 2024, month: 2 },   // Feb 2024
      13: { year: 2024, month: 3 },   // Mar 2024
      12: { year: 2024, month: 4 },   // Apr 2024
      11: { year: 2024, month: 5 },   // May 2024
      10: { year: 2024, month: 6 },   // Jun 2024
      9: { year: 2024, month: 7 },    // Jul 2024
      8: { year: 2024, month: 8 },    // Aug 2024
      7: { year: 2024, month: 9 },    // Sep 2024
      6: { year: 2024, month: 10 },   // Oct 2024
      5: { year: 2024, month: 11 },   // Nov 2024
      4: { year: 2024, month: 12 },   // Dec 2024
      3: { year: 2025, month: 1 },    // Jan 2025
      2: { year: 2025, month: 2 },    // Feb 2025
      1: { year: 2025, month: 3 },    // Mar 2025
      0: { year: 2025, month: 4 },    // Apr 2025
      [-1]: { year: currentYear, month: currentMonth }  // Current month (dynamic)
    }

    return allData.map((item, i) => {
      let timestamp, date
      
      if (item.isPrediction) {
        // Future predictions use calculated dates from current month
        const currentDate = new Date()
        const monthOffset = Math.abs(item.month) // Direct offset since predictions start from -2
        date = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1)
        timestamp = date.getTime()
      } else {
        // Historical and current data uses explicit date mapping
        const dateInfo = monthYearMap[item.month as keyof typeof monthYearMap] || monthYearMap[-1]
        if (dateInfo) {
          date = new Date(dateInfo.year, dateInfo.month - 1, 1) // Month is 0-indexed
          timestamp = date.getTime()
        } else {
          // Fallback for current price
          timestamp = now
          date = new Date(timestamp)
        }
      }
      
      return {
        date: `${date.toLocaleDateString('en-US', { month: 'short' })}\n'${String(date.getFullYear()).slice(-2)}`,
        monthYear: `${date.toLocaleDateString('en-US', { month: 'short' })} '${String(date.getFullYear()).slice(-2)}`,
        price: item.price,
        predictionPrice: item.isPrediction ? item.price : null,
        historicalPrice: !item.isPrediction && item.month !== -1 ? item.price : null,
        currentPrice: item.month === -1 ? item.price : null,
        timestamp,
        isPrediction: item.isPrediction,
        isCurrent: item.month === -1 && !item.isPrediction
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
    price: item.historicalPrice || item.currentPrice || item.predictionPrice
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
    const fullLabel = `${month} ${year}`
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={12} 
          textAnchor="middle" 
          fill="#a1a0a0" 
          fontSize="10"
          transform="rotate(-45)"
        >
          {fullLabel}
        </text>
      </g>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isForcast = data.isPrediction
      const isCurrent = data.isCurrent
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.monthYear}</p>
          <p className={isForcast ? "text-orange-400" : isCurrent ? "text-purple-400" : "text-primary"}>
            {isForcast ? 'Predicted' : isCurrent ? 'Current' : 'Price'}: <span className="font-bold">${payload[0].value.toLocaleString()}</span>
          </p>
          {isForcast && (
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Prediction based on cycle analysis
            </p>
          )}
          {isCurrent && (
            <p className="text-xs text-muted-foreground mt-1">
              📍 Live price data
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
        <LineChart data={combinedData} margin={{ top: 20, right: 80, left: 20, bottom: 40 }}>
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
            dataKey="monthYear" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a0a0', fontSize: 10, textAnchor: 'end' }}
            height={80}
            interval={6}
            angle={-45}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a0a0', fontSize: 12 }}
            domain={['dataMin * 0.8', 'dataMax * 1.1']}
            ticks={(() => {
              // Generate custom ticks to include current price and target
              const minPrice = Math.min(...chartData.map(d => d.price)) * 0.8
              const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.1
              const targetPrice = currentPrice * 1.25
              
              // Create a set of key price levels
              const keyLevels = new Set([
                Math.round(minPrice / 10000) * 10000, // Round to nearest 10K
                20000, // 2017 cycle top
                50000, // Previous cycle support
                70000, // Previous cycle high (2021 ATH)
                Math.round(currentPrice / 5000) * 5000, // Current price rounded to 5K
                Math.round(targetPrice / 5000) * 5000, // Target price rounded to 5K
                Math.round(maxPrice / 10000) * 10000 // Max rounded to 10K
              ])
              
              // Convert to sorted array and filter within range
              return Array.from(keyLevels)
                .filter(price => price >= minPrice && price <= maxPrice)
                .sort((a, b) => a - b)
            })()}
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
            strokeWidth={2}
          />
          
          {/* Cycle Target prediction line */}
          {targetPrice && (
            <ReferenceLine 
              y={targetPrice} 
              stroke="#ef4444" 
              strokeDasharray="2 2" 
              strokeWidth={1}
              label={{ 
                value: "Cycle Target", 
                position: "insideTopRight", 
                fill: "#ffffff", 
                fontSize: 12,
                offset: -60,
                textAnchor: "middle"
              }}
            />
          )}
          
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
          
          {/* Current price point - purple dot */}
          <Line
            type="monotone"
            dataKey="currentPrice"
            stroke="#8e76ef"
            strokeWidth={0}
            dot={{ r: 8, stroke: '#8e76ef', strokeWidth: 3, fill: '#fff' }}
            activeDot={{ r: 10, stroke: '#8e76ef', strokeWidth: 3, fill: '#fff' }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
    </div>
  )
}