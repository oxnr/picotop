'use client'

import { useQuery } from '@tanstack/react-query'
import { BitcoinPrice, BitcoinMetrics, BitcoinHistoricalData } from '@/lib/api/bitcoin'

interface BitcoinData {
  price: BitcoinPrice
  dominance: number
  historical: BitcoinHistoricalData[]
  metrics: BitcoinMetrics
}

export function useBitcoinData() {
  return useQuery<BitcoinData>({
    queryKey: ['bitcoin-data'],
    queryFn: async () => {
      const response = await fetch('/api/bitcoin')
      
      if (!response.ok) {
        throw new Error('Failed to fetch Bitcoin data')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch Bitcoin data')
      }
      
      return result.data
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}