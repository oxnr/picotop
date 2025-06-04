import { useQuery } from '@tanstack/react-query'
import { SaylorTrackerData } from '@/lib/types'

async function fetchSaylorTracker(): Promise<SaylorTrackerData> {
  const response = await fetch('/api/saylor-tracker')
  
  if (!response.ok) {
    throw new Error('Failed to fetch Saylor tracker data')
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch Saylor tracker data')
  }
  
  return result.data
}

export function useSaylorTracker() {
  return useQuery({
    queryKey: ['saylor-tracker'],
    queryFn: fetchSaylorTracker,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}