'use client'

import { useQuery } from '@tanstack/react-query'
import { RealAppStoreRankings } from '@/lib/api/real-app-store'

export function useAppRankings() {
  return useQuery<RealAppStoreRankings>({
    queryKey: ['app-rankings'],
    queryFn: async () => {
      const response = await fetch('/api/rankings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch app rankings')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch app rankings')
      }
      
      return result.data
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000, // Consider data stale after 4 minutes
  })
}