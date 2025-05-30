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
      bgeo: boolean
      applestore: boolean
      googleplay: boolean
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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout
      
      try {
        const response = await fetch('/api/bitcoin', {
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin data')
        }
        
        const result: BitcoinResponse = await response.json()
        
        if (!result.success) {
          throw new Error('Failed to fetch Bitcoin data')
        }
        
        return result
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    },
    refetchInterval: 60000, // Reduced from 30s to 60s to prevent server overload
    staleTime: 45000, // Consider data stale after 45 seconds
    retry: 2, // Reduced retries
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Shorter max delay
    gcTime: 300000, // Keep in cache for 5 minutes
  })
}