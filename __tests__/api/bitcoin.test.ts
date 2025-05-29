/**
 * Tests for Bitcoin API Route
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET } from '../../src/app/api/bitcoin/route'

// Mock the enhanced Bitcoin service
jest.mock('../../src/lib/api/enhanced-bitcoin', () => ({
  fetchEnhancedBitcoinPrice: jest.fn(),
  fetchEnhancedBitcoinDominance: jest.fn(),
  fetchEnhancedBitcoinMetrics: jest.fn(),
  checkAPIHealth: jest.fn()
}))

jest.mock('../../src/lib/api/bitcoin', () => ({
  fetchBitcoinHistoricalData: jest.fn()
}))

import { 
  fetchEnhancedBitcoinPrice, 
  fetchEnhancedBitcoinDominance,
  fetchEnhancedBitcoinMetrics,
  checkAPIHealth 
} from '../../src/lib/api/enhanced-bitcoin'
import { fetchBitcoinHistoricalData } from '../../src/lib/api/bitcoin'

describe('/api/bitcoin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return successful response with real data', async () => {
    // Mock successful API responses
    const mockPrice = {
      price: 108700,
      priceChangePercentage24h: 2.5,
      priceChange24h: 2500,
      marketCap: 2150000000000,
      volume24h: 25000000000,
      lastUpdated: new Date().toISOString()
    }

    const mockDominance = 56.8
    const mockHistorical = [
      { date: '2024-01-01', price: 42500 },
      { date: '2024-02-01', price: 48000 }
    ]

    const mockMetrics = {
      nupl: 0.65,
      sopr: 1.05,
      mvrv: 2.8,
      rainbowBand: 6,
      fearGreedIndex: 75,
      analysis: {
        overall: { signal: 'HOLD', explanation: 'Mixed signals' }
      }
    }

    const mockApiHealth = {
      coingecko: true,
      coinpaprika: true,
      feargreed: true
    }

    ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
      .mockResolvedValue(mockPrice)
    ;(fetchEnhancedBitcoinDominance as jest.MockedFunction<typeof fetchEnhancedBitcoinDominance>)
      .mockResolvedValue(mockDominance)
    ;(fetchBitcoinHistoricalData as jest.MockedFunction<typeof fetchBitcoinHistoricalData>)
      .mockResolvedValue(mockHistorical)
    ;(fetchEnhancedBitcoinMetrics as jest.MockedFunction<typeof fetchEnhancedBitcoinMetrics>)
      .mockResolvedValue(mockMetrics)
    ;(checkAPIHealth as jest.MockedFunction<typeof checkAPIHealth>)
      .mockResolvedValue(mockApiHealth)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.price).toEqual(mockPrice)
    expect(data.data.dominance).toBe(mockDominance)
    expect(data.data.historical).toEqual(mockHistorical)
    expect(data.data.metrics).toEqual(mockMetrics)
    expect(data.meta.apiHealth).toEqual(mockApiHealth)
  })

  it('should include proper metadata in response', async () => {
    // Mock successful responses
    ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
      .mockResolvedValue({
        price: 108700,
        priceChangePercentage24h: 2.5,
        priceChange24h: 2500,
        marketCap: 2150000000000,
        volume24h: 25000000000,
        lastUpdated: new Date().toISOString()
      })
    ;(fetchEnhancedBitcoinDominance as jest.MockedFunction<typeof fetchEnhancedBitcoinDominance>)
      .mockResolvedValue(56.8)
    ;(fetchBitcoinHistoricalData as jest.MockedFunction<typeof fetchBitcoinHistoricalData>)
      .mockResolvedValue([])
    ;(fetchEnhancedBitcoinMetrics as jest.MockedFunction<typeof fetchEnhancedBitcoinMetrics>)
      .mockResolvedValue({ fearGreedIndex: 75 } as any)
    ;(checkAPIHealth as jest.MockedFunction<typeof checkAPIHealth>)
      .mockResolvedValue({ coingecko: true, coinpaprika: true, feargreed: true })

    const response = await GET()
    const data = await response.json()

    expect(data.meta).toHaveProperty('apiHealth')
    expect(data.meta).toHaveProperty('sources')
    expect(data.meta.sources).toHaveProperty('price')
    expect(data.meta.sources).toHaveProperty('dominance')
    expect(data.meta.sources).toHaveProperty('metrics')
    expect(data).toHaveProperty('timestamp')
  })

  it('should handle API failures gracefully', async () => {
    // Mock API failures
    ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
      .mockRejectedValue(new Error('API Error'))
    ;(fetchEnhancedBitcoinDominance as jest.MockedFunction<typeof fetchEnhancedBitcoinDominance>)
      .mockRejectedValue(new Error('API Error'))
    ;(fetchBitcoinHistoricalData as jest.MockedFunction<typeof fetchBitcoinHistoricalData>)
      .mockRejectedValue(new Error('API Error'))
    ;(fetchEnhancedBitcoinMetrics as jest.MockedFunction<typeof fetchEnhancedBitcoinMetrics>)
      .mockRejectedValue(new Error('API Error'))
    ;(checkAPIHealth as jest.MockedFunction<typeof checkAPIHealth>)
      .mockRejectedValue(new Error('Health Check Failed'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Failed to fetch Bitcoin data')
    expect(data).toHaveProperty('timestamp')
  })

  it('should fetch historical data for 2 years', async () => {
    ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
      .mockResolvedValue({} as any)
    ;(fetchEnhancedBitcoinDominance as jest.MockedFunction<typeof fetchEnhancedBitcoinDominance>)
      .mockResolvedValue(56.8)
    ;(fetchBitcoinHistoricalData as jest.MockedFunction<typeof fetchBitcoinHistoricalData>)
      .mockResolvedValue([])
    ;(fetchEnhancedBitcoinMetrics as jest.MockedFunction<typeof fetchEnhancedBitcoinMetrics>)
      .mockResolvedValue({} as any)
    ;(checkAPIHealth as jest.MockedFunction<typeof checkAPIHealth>)
      .mockResolvedValue({} as any)

    await GET()

    expect(fetchBitcoinHistoricalData).toHaveBeenCalledWith(730) // 2 years
  })

  it('should pass dominance to metrics function', async () => {
    const mockDominance = 58.2

    ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
      .mockResolvedValue({} as any)
    ;(fetchEnhancedBitcoinDominance as jest.MockedFunction<typeof fetchEnhancedBitcoinDominance>)
      .mockResolvedValue(mockDominance)
    ;(fetchBitcoinHistoricalData as jest.MockedFunction<typeof fetchBitcoinHistoricalData>)
      .mockResolvedValue([])
    ;(fetchEnhancedBitcoinMetrics as jest.MockedFunction<typeof fetchEnhancedBitcoinMetrics>)
      .mockResolvedValue({} as any)
    ;(checkAPIHealth as jest.MockedFunction<typeof checkAPIHealth>)
      .mockResolvedValue({} as any)

    await GET()

    expect(fetchEnhancedBitcoinMetrics).toHaveBeenCalledWith(mockDominance)
  })

  describe('Response Structure', () => {
    beforeEach(async () => {
      // Setup successful mocks
      ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
        .mockResolvedValue({
          price: 108700,
          priceChangePercentage24h: 2.5,
          priceChange24h: 2500,
          marketCap: 2150000000000,
          volume24h: 25000000000,
          lastUpdated: new Date().toISOString()
        })
      ;(fetchEnhancedBitcoinDominance as jest.MockedFunction<typeof fetchEnhancedBitcoinDominance>)
        .mockResolvedValue(56.8)
      ;(fetchBitcoinHistoricalData as jest.MockedFunction<typeof fetchBitcoinHistoricalData>)
        .mockResolvedValue([])
      ;(fetchEnhancedBitcoinMetrics as jest.MockedFunction<typeof fetchEnhancedBitcoinMetrics>)
        .mockResolvedValue({ fearGreedIndex: 75 } as any)
      ;(checkAPIHealth as jest.MockedFunction<typeof checkAPIHealth>)
        .mockResolvedValue({ coingecko: true, coinpaprika: true, feargreed: true })
    })

    it('should have consistent response structure', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data).toHaveProperty('success')
      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('meta')
      expect(data).toHaveProperty('timestamp')
      
      expect(data.data).toHaveProperty('price')
      expect(data.data).toHaveProperty('dominance')
      expect(data.data).toHaveProperty('historical')
      expect(data.data).toHaveProperty('metrics')
    })

    it('should include Fear & Greed index in sources', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.meta.sources).toHaveProperty('fearGreed')
      expect(data.meta.sources.fearGreed).toBe(75)
    })
  })

  describe('Error Logging', () => {
    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      ;(fetchEnhancedBitcoinPrice as jest.MockedFunction<typeof fetchEnhancedBitcoinPrice>)
        .mockRejectedValue(new Error('Test Error'))

      await GET()

      expect(consoleSpy).toHaveBeenCalledWith('Bitcoin API error:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})