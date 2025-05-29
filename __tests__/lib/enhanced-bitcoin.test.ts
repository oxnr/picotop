/**
 * Tests for Enhanced Bitcoin API Service
 */
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { 
  fetchEnhancedBitcoinPrice, 
  fetchEnhancedBitcoinDominance,
  fetchFearGreedIndex,
  checkAPIHealth 
} from '../../src/lib/api/enhanced-bitcoin'

// Mock fetch globally
global.fetch = jest.fn()

describe('Enhanced Bitcoin API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear any cached data between tests
    jest.resetModules()
  })

  describe('fetchEnhancedBitcoinPrice', () => {
    it('should fetch price from CoinGecko successfully', async () => {
      const mockResponse = {
        bitcoin: {
          usd: 108700,
          usd_24h_change: 2.5,
          usd_market_cap: 2150000000000,
          usd_24h_vol: 25000000000,
          last_updated_at: Math.floor(Date.now() / 1000)
        }
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchEnhancedBitcoinPrice()

      expect(result).toEqual({
        price: 108700,
        priceChange24h: 2.5,
        priceChangePercentage24h: 2.5,
        marketCap: 2150000000000,
        volume24h: 25000000000,
        lastUpdated: expect.any(String)
      })
    })

    it('should fallback to Coinpaprika when CoinGecko fails', async () => {
      const mockCoinpaprikaResponse = {
        quotes: {
          USD: {
            price: 108500,
            percent_change_24h: 1.8,
            market_cap: 2140000000000,
            volume_24h: 24000000000
          }
        },
        last_updated: new Date().toISOString()
      }

      // Mock CoinGecko failure
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockRejectedValueOnce(new Error('CoinGecko API error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCoinpaprikaResponse,
        } as Response)

      const result = await fetchEnhancedBitcoinPrice()

      expect(result.price).toBe(108500)
      expect(result.priceChangePercentage24h).toBe(1.8)
    })

    it('should return mock data when all APIs fail', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockRejectedValueOnce(new Error('CoinGecko failed'))
        .mockRejectedValueOnce(new Error('Coinpaprika failed'))

      const result = await fetchEnhancedBitcoinPrice()

      expect(result.price).toBeGreaterThan(100000)
      expect(result.price).toBeLessThan(120000)
      expect(result).toHaveProperty('marketCap')
      expect(result).toHaveProperty('volume24h')
    })

    it('should validate price data within reasonable bounds', async () => {
      const invalidResponse = {
        bitcoin: {
          usd: 50000000, // Unreasonably high price
          usd_24h_change: 2.5,
          usd_market_cap: 2150000000000,
          usd_24h_vol: 25000000000,
          last_updated_at: Math.floor(Date.now() / 1000)
        }
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      } as Response)

      const result = await fetchEnhancedBitcoinPrice()

      // Should fallback to mock data for invalid prices
      expect(result.price).toBeLessThan(200000)
    })
  })

  describe('fetchEnhancedBitcoinDominance', () => {
    it('should fetch dominance from CoinGecko successfully', async () => {
      const mockResponse = {
        data: {
          market_cap_percentage: {
            btc: 56.8
          }
        }
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchEnhancedBitcoinDominance()
      expect(result).toBe(56.8)
    })

    it('should validate dominance within reasonable bounds', async () => {
      const invalidResponse = {
        data: {
          market_cap_percentage: {
            btc: 150 // Invalid dominance > 100%
          }
        }
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      } as Response)

      const result = await fetchEnhancedBitcoinDominance()
      
      // Should fallback to reasonable mock data
      expect(result).toBeGreaterThan(20)
      expect(result).toBeLessThan(90)
    })
  })

  describe('fetchFearGreedIndex', () => {
    it('should fetch Fear & Greed Index successfully', async () => {
      const mockResponse = {
        data: [
          {
            value: '75',
            value_classification: 'Greed'
          }
        ]
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await fetchFearGreedIndex()
      expect(result).toBe(75)
    })

    it('should return valid index between 0-100', async () => {
      const result = await fetchFearGreedIndex()
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(100)
    })
  })

  describe('checkAPIHealth', () => {
    it('should check health of all APIs', async () => {
      // Mock successful responses for all APIs
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({ ok: true } as Response) // CoinGecko
        .mockResolvedValueOnce({ ok: true } as Response) // Coinpaprika  
        .mockResolvedValueOnce({ ok: true } as Response) // Fear & Greed

      const result = await checkAPIHealth()

      expect(result).toEqual({
        coingecko: true,
        coinpaprika: true,
        feargreed: true
      })
    })

    it('should handle API failures gracefully', async () => {
      // Mock failures for all APIs
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))

      const result = await checkAPIHealth()

      expect(result).toEqual({
        coingecko: false,
        coinpaprika: false,
        feargreed: false
      })
    })
  })

  describe('Error Handling & Rate Limiting', () => {
    it('should handle network timeouts gracefully', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>)
        .mockImplementationOnce(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 100)
          )
        )

      const result = await fetchEnhancedBitcoinPrice()
      
      // Should fallback to mock data on timeout
      expect(result).toHaveProperty('price')
      expect(typeof result.price).toBe('number')
    })

    it('should respect rate limiting', async () => {
      // First call should work
      const mockResponse = {
        bitcoin: {
          usd: 108700,
          usd_24h_change: 2.5,
          usd_market_cap: 2150000000000,
          usd_24h_vol: 25000000000,
          last_updated_at: Math.floor(Date.now() / 1000)
        }
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result1 = await fetchEnhancedBitcoinPrice()
      const result2 = await fetchEnhancedBitcoinPrice()

      // Second call should use cached data
      expect(result1).toEqual(result2)
    })
  })
})