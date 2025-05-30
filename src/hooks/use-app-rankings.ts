'use client'

import { useQuery } from '@tanstack/react-query'
import { RealAppStoreRankings } from '@/lib/api/real-app-store'

export function useAppRankings() {
  return useQuery<RealAppStoreRankings>({
    queryKey: ['app-rankings'],
    queryFn: async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout for API calls
      
      try {
        const response = await fetch('/api/rankings', {
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error('Failed to fetch app rankings')
        }
        
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch app rankings')
        }
        
        return result.data
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    },
    refetchInterval: 600000, // Refetch every 10 minutes (reduced frequency)
    staleTime: 480000, // Consider data stale after 8 minutes
    retry: 2, // Only retry twice on failure
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Progressive backoff
    gcTime: 900000, // Keep in cache for 15 minutes
  })
}