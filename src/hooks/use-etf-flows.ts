import { useQuery } from '@tanstack/react-query'
import { ETFFlowsData } from '@/lib/types'

async function fetchETFFlows(): Promise<ETFFlowsData> {
  const response = await fetch('/api/etf-flows')
  
  if (!response.ok) {
    throw new Error('Failed to fetch ETF flows data')
  }
  
  const result = await response.json()
  
  if (!result.success) {
    // ETF API might return success: false but still have data
    if (result.data) {
      return result.data
    }
    throw new Error(result.error || 'Failed to fetch ETF flows data')
  }
  
  return result.data
}

export function useETFFlows() {
  return useQuery({
    queryKey: ['etf-flows'],
    queryFn: fetchETFFlows,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}