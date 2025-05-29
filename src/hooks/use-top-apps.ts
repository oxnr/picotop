'use client'

import { useQuery } from '@tanstack/react-query'
import { TopAppsRankings } from '@/lib/api/app-store'

export function useTopApps() {
  return useQuery<TopAppsRankings>({
    queryKey: ['top-apps'],
    queryFn: async () => {
      const response = await fetch('/api/app-store/top20')
      
      if (!response.ok) {
        throw new Error('Failed to fetch top apps data')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch top apps data')
      }
      
      return result.data
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  })
}