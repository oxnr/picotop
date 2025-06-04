import { useQuery } from '@tanstack/react-query'
import { MicroStrategyData } from '@/lib/types'

async function fetchMicroStrategy(): Promise<MicroStrategyData> {
  const response = await fetch('/api/microstrategy')
  
  if (!response.ok) {
    throw new Error('Failed to fetch MicroStrategy data')
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch MicroStrategy data')
  }
  
  return result.data
}

export function useMicroStrategy() {
  return useQuery({
    queryKey: ['microstrategy'],
    queryFn: fetchMicroStrategy,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}