'use client'

import { useQuery } from '@tanstack/react-query'
import { BitcoinPrice, BitcoinMetrics, BitcoinHistoricalData } from '@/lib/api/bitcoin'

interface BitcoinData {
  price: BitcoinPrice
  dominance: number
  historical: BitcoinHistoricalData[]
  metrics: BitcoinMetrics
}

interface BitcoinResponse {
  success: boolean
  data: BitcoinData
  meta?: {
    apiHealth: {
      coingecko: boolean
      coinpaprika: boolean
      feargreed: boolean
    }
    sources: {
      price: string
      dominance: string
      metrics: string
      fearGreed: number
    }
  }
  timestamp: string
}

export function useBitcoinData() {
  return useQuery<BitcoinResponse>({
    queryKey: ['bitcoin-data'],
    queryFn: async () => {
      const response = await fetch('/api/bitcoin')
      
      if (!response.ok) {
        throw new Error('Failed to fetch Bitcoin data')
      }
      
      const result: BitcoinResponse = await response.json()
      
      if (!result.success) {
        throw new Error('Failed to fetch Bitcoin data')
      }
      
      return result
    },
    refetchInterval: 30000, // Faster refetch for real-time data
    staleTime: 15000, // More aggressive stale time for fresher data
    retry: 3, // Retry failed requests
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}