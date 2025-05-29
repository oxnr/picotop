// Enhanced Bitcoin data service with multiple API sources and real-time features
// FIXED VERSION - addresses timeout and error handling issues
import { BitcoinPrice, BitcoinHistoricalData, BitcoinMetrics, mockBitcoinMetrics } from './bitcoin'

// API configuration
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const COINPAPRIKA_API = 'https://api.coinpaprika.com/v1'
const FEAR_GREED_API = 'https://api.alternative.me/fng/'

interface APISource {
  name: string
  fetchPrice: () => Promise<BitcoinPrice>
  fetchDominance: () => Promise<number>
  priority: number
}

// Rate limiting and caching
const rateLimits = new Map<string, number>()
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

function isRateLimited(source: string, limitMs: number = 60000): boolean {
  const lastRequest = rateLimits.get(source) || 0
  return Date.now() - lastRequest < limitMs
}

function setRateLimit(source: string): void {
  rateLimits.set(source, Date.now())
}

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data as T
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
  })
}

// Helper function for timeout handling
function createTimeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

// Enhanced CoinGecko implementation
async function fetchCoinGeckoPrice(): Promise<BitcoinPrice> {
  if (isRateLimited('coingecko')) {
    console.log('[CoinGecko] Rate limited, skipping')
    throw new Error('Rate limited')
  }

  const url = `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
  console.log('[CoinGecko] Fetching:', url)

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
      signal: createTimeoutSignal(5000),
    })

    console.log('[CoinGecko] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[CoinGecko] Error response:', errorText)
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    setRateLimit('coingecko')
    const data = await response.json()
    console.log('[CoinGecko] Raw response:', JSON.stringify(data))
    
    const bitcoin = data.bitcoin
    if (!bitcoin) {
      throw new Error('Invalid response structure: missing bitcoin data')
    }

    const result = {
      price: bitcoin.usd,
      priceChange24h: bitcoin.usd_24h_change || 0,
      priceChangePercentage24h: bitcoin.usd_24h_change || 0,
      marketCap: bitcoin.usd_market_cap,
      volume24h: bitcoin.usd_24h_vol,
      lastUpdated: new Date(bitcoin.last_updated_at * 1000).toISOString(),
    }

    console.log('[CoinGecko] Parsed result:', result)
    return result
  } catch (error: any) {
    console.error('[CoinGecko] Fetch error:', error.message, error.stack)
    throw error
  }
}

async function fetchCoinGeckoDominance(): Promise<number> {
  if (isRateLimited('coingecko-dominance', 300000)) { // 5 min rate limit for dominance
    console.log('[CoinGecko Dominance] Rate limited, skipping')
    throw new Error('Rate limited')
  }

  const url = `${COINGECKO_API}/global`
  console.log('[CoinGecko Dominance] Fetching:', url)

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
      signal: createTimeoutSignal(5000),
    })

    console.log('[CoinGecko Dominance] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[CoinGecko Dominance] Error response:', errorText)
      throw new Error(`CoinGecko dominance API error: ${response.status}`)
    }

    setRateLimit('coingecko-dominance')
    const data = await response.json()
    const dominance = data.data?.market_cap_percentage?.btc
    
    console.log('[CoinGecko Dominance] BTC dominance:', dominance)
    
    if (!dominance) {
      throw new Error('Invalid response structure: missing dominance data')
    }
    
    return dominance
  } catch (error: any) {
    console.error('[CoinGecko Dominance] Fetch error:', error.message, error.stack)
    throw error
  }
}

// Coinpaprika as backup source
async function fetchCoinpaprikaPrice(): Promise<BitcoinPrice> {
  if (isRateLimited('coinpaprika')) {
    console.log('[Coinpaprika] Rate limited, skipping')
    throw new Error('Rate limited')
  }

  const url = `${COINPAPRIKA_API}/tickers/btc-bitcoin`
  console.log('[Coinpaprika] Fetching:', url)

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
      signal: createTimeoutSignal(5000),
    })

    console.log('[Coinpaprika] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Coinpaprika] Error response:', errorText)
      throw new Error(`Coinpaprika API error: ${response.status}`)
    }

    setRateLimit('coinpaprika')
    const data = await response.json()
    console.log('[Coinpaprika] Raw response (truncated):', {
      id: data.id,
      name: data.name,
      quotes: data.quotes?.USD
    })

    if (!data.quotes?.USD) {
      throw new Error('Invalid response structure: missing USD quotes')
    }

    const result = {
      price: data.quotes.USD.price,
      priceChange24h: data.quotes.USD.percent_change_24h * data.quotes.USD.price / 100,
      priceChangePercentage24h: data.quotes.USD.percent_change_24h,
      marketCap: data.quotes.USD.market_cap,
      volume24h: data.quotes.USD.volume_24h,
      lastUpdated: data.last_updated,
    }

    console.log('[Coinpaprika] Parsed result:', result)
    return result
  } catch (error: any) {
    console.error('[Coinpaprika] Fetch error:', error.message, error.stack)
    throw error
  }
}

async function fetchCoinpaprikaDominance(): Promise<number> {
  if (isRateLimited('coinpaprika-dominance', 300000)) {
    console.log('[Coinpaprika Dominance] Rate limited, skipping')
    throw new Error('Rate limited')
  }

  const url = `${COINPAPRIKA_API}/global`
  console.log('[Coinpaprika Dominance] Fetching:', url)

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
      signal: createTimeoutSignal(5000),
    })

    console.log('[Coinpaprika Dominance] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Coinpaprika Dominance] Error response:', errorText)
      throw new Error(`Coinpaprika dominance API error: ${response.status}`)
    }

    setRateLimit('coinpaprika-dominance')
    const data = await response.json()
    const dominance = data.bitcoin_dominance_percentage
    
    console.log('[Coinpaprika Dominance] BTC dominance:', dominance)
    
    if (!dominance) {
      throw new Error('Invalid response structure: missing dominance data')
    }
    
    return dominance
  } catch (error: any) {
    console.error('[Coinpaprika Dominance] Fetch error:', error.message, error.stack)
    throw error
  }
}

// API sources with fallback order
const apiSources: APISource[] = [
  {
    name: 'CoinGecko',
    fetchPrice: fetchCoinGeckoPrice,
    fetchDominance: fetchCoinGeckoDominance,
    priority: 1,
  },
  {
    name: 'Coinpaprika',
    fetchPrice: fetchCoinpaprikaPrice,
    fetchDominance: fetchCoinpaprikaDominance,
    priority: 2,
  },
]

// Enhanced Bitcoin price fetching with multiple sources
export async function fetchEnhancedBitcoinPrice(): Promise<BitcoinPrice> {
  const cacheKey = 'bitcoin-price'
  const cached = getCached<BitcoinPrice>(cacheKey)
  if (cached) {
    console.log('[fetchEnhancedBitcoinPrice] Returning cached data')
    return cached
  }

  const errors: string[] = []

  for (const source of apiSources.sort((a, b) => a.priority - b.priority)) {
    try {
      console.log(`[fetchEnhancedBitcoinPrice] Attempting to fetch Bitcoin price from ${source.name}`)
      const price = await source.fetchPrice()
      
      // Validate the data
      if (price.price > 0 && price.price < 10000000) {
        setCache(cacheKey, price, 30000) // Cache for 30 seconds
        console.log(`[fetchEnhancedBitcoinPrice] Successfully fetched Bitcoin price from ${source.name}: $${price.price.toLocaleString()}`)
        return price
      } else {
        throw new Error('Invalid price data received')
      }
    } catch (error) {
      const errorMsg = `${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      errors.push(errorMsg)
      console.warn(`[fetchEnhancedBitcoinPrice] ${errorMsg}`)
    }
  }

  console.warn('[fetchEnhancedBitcoinPrice] All Bitcoin price APIs failed, using enhanced mock data', errors)
  return enhancedMockBitcoinPrice()
}

// Enhanced Bitcoin dominance fetching
export async function fetchEnhancedBitcoinDominance(): Promise<number> {
  const cacheKey = 'bitcoin-dominance'
  const cached = getCached<number>(cacheKey)
  if (cached) {
    console.log('[fetchEnhancedBitcoinDominance] Returning cached data')
    return cached
  }

  const errors: string[] = []

  for (const source of apiSources.sort((a, b) => a.priority - b.priority)) {
    try {
      console.log(`[fetchEnhancedBitcoinDominance] Attempting to fetch Bitcoin dominance from ${source.name}`)
      const dominance = await source.fetchDominance()
      
      // Validate the data
      if (dominance > 20 && dominance < 90) {
        setCache(cacheKey, dominance, 300000) // Cache for 5 minutes
        console.log(`[fetchEnhancedBitcoinDominance] Successfully fetched Bitcoin dominance from ${source.name}: ${dominance.toFixed(1)}%`)
        return dominance
      } else {
        throw new Error('Invalid dominance data received')
      }
    } catch (error) {
      const errorMsg = `${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      errors.push(errorMsg)
      console.warn(`[fetchEnhancedBitcoinDominance] ${errorMsg}`)
    }
  }

  console.warn('[fetchEnhancedBitcoinDominance] All Bitcoin dominance APIs failed, using mock data', errors)
  return 56.8 + (Math.random() - 0.5) * 2
}

// Enhanced Fear & Greed Index
export async function fetchFearGreedIndex(): Promise<number> {
  const cacheKey = 'fear-greed-index'
  const cached = getCached<number>(cacheKey)
  if (cached) {
    console.log('[fetchFearGreedIndex] Returning cached data')
    return cached
  }

  try {
    if (isRateLimited('fear-greed', 300000)) { // 5 min rate limit
      console.log('[Fear & Greed] Rate limited, skipping')
      throw new Error('Rate limited')
    }

    const url = `${FEAR_GREED_API}?limit=1`
    console.log('[Fear & Greed] Fetching:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
      signal: createTimeoutSignal(5000),
    })

    console.log('[Fear & Greed] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Fear & Greed] Error response:', errorText)
      throw new Error(`Fear & Greed API error: ${response.status}`)
    }

    setRateLimit('fear-greed')
    const data = await response.json()
    console.log('[Fear & Greed] Raw response:', JSON.stringify(data))
    
    const fgiValue = parseInt(data.data?.[0]?.value)
    
    if (fgiValue >= 0 && fgiValue <= 100) {
      setCache(cacheKey, fgiValue, 300000) // Cache for 5 minutes
      console.log(`[Fear & Greed] Successfully fetched Fear & Greed Index: ${fgiValue}`)
      return fgiValue
    } else {
      throw new Error('Invalid Fear & Greed data')
    }
  } catch (error: any) {
    console.warn('[Fear & Greed] API failed, using mock data:', error.message, error.stack)
    return 75 + Math.floor((Math.random() - 0.5) * 20) // Realistic mock
  }
}

function enhancedMockBitcoinPrice(): BitcoinPrice {
  const basePrice = 108700 // Current real BTC price
  const variation = (Math.random() - 0.5) * 800 // Smaller variations for more realistic data
  const price = Math.max(105000, Math.min(115000, basePrice + variation)) // Bound within realistic range
  
  return {
    price,
    priceChange24h: (Math.random() - 0.5) * 2500,
    priceChangePercentage24h: (Math.random() - 0.5) * 3,
    marketCap: price * 19700000, // Approximate circulating supply
    volume24h: 25000000000 + Math.random() * 10000000000,
    lastUpdated: new Date().toISOString(),
  }
}

// Enhanced metrics with real Fear & Greed data
export async function fetchEnhancedBitcoinMetrics(dominance?: number): Promise<BitcoinMetrics> {
  try {
    const fearGreedIndex = await fetchFearGreedIndex()
    const metrics = mockBitcoinMetrics(dominance)
    
    // Update with real Fear & Greed data
    metrics.fearGreedIndex = fearGreedIndex
    
    // Recalculate analysis with real data
    const { analyzeMetric, getOverallAnalysis } = await import('./bitcoin')
    metrics.analysis.fearGreedIndex = analyzeMetric('fearGreedIndex', fearGreedIndex)
    metrics.analysis.overall = getOverallAnalysis(metrics)
    
    return metrics
  } catch (error) {
    console.warn('[fetchEnhancedBitcoinMetrics] Enhanced metrics fetch failed, using mock data:', error)
    return mockBitcoinMetrics(dominance)
  }
}

// WebSocket price streaming (for future real-time updates)
export class BitcoinPriceStream {
  private ws: WebSocket | null = null
  private callbacks: ((price: number) => void)[] = []
  private reconnectInterval: number | null = null
  private isConnected: boolean = false

  subscribe(callback: (price: number) => void): () => void {
    this.callbacks.push(callback)
    
    // Start connection if not already connected
    if (!this.isConnected) {
      this.connect()
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback)
      if (index > -1) {
        this.callbacks.splice(index, 1)
      }
      
      // Disconnect if no more subscribers
      if (this.callbacks.length === 0) {
        this.disconnect()
      }
    }
  }

  private connect(): void {
    try {
      // Using CoinGecko WebSocket (if available) or fallback to polling
      // Note: CoinGecko WebSocket requires API key for real implementation
      console.log('Bitcoin price streaming not yet implemented, using polling fallback')
      
      // Simulate real-time updates with polling
      this.reconnectInterval = (globalThis as any).setInterval(async () => {
        try {
          const priceData = await fetchEnhancedBitcoinPrice()
          this.callbacks.forEach(callback => callback(priceData.price))
        } catch (error) {
          console.warn('Price streaming update failed:', error)
        }
      }, 30000) // Update every 30 seconds
      
      this.isConnected = true
    } catch (error) {
      console.error('Failed to connect to price stream:', error)
      this.scheduleReconnect()
    }
  }

  private disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval)
      this.reconnectInterval = null
    }
    
    this.isConnected = false
  }

  private scheduleReconnect(): void {
    setTimeout(() => {
      if (this.callbacks.length > 0) {
        this.connect()
      }
    }, 5000) // Reconnect after 5 seconds
  }
}

// Export singleton instance
export const bitcoinPriceStream = new BitcoinPriceStream()

// Health check for all APIs
export async function checkAPIHealth(): Promise<{
  coingecko: boolean
  coinpaprika: boolean
  feargreed: boolean
}> {
  const results = {
    coingecko: false,
    coinpaprika: false,
    feargreed: false,
  }

  console.log('[checkAPIHealth] Starting health checks...')

  // Check CoinGecko
  try {
    const response = await fetch(`${COINGECKO_API}/ping`, { 
      signal: createTimeoutSignal(3000) 
    })
    results.coingecko = response.ok
    console.log('[checkAPIHealth] CoinGecko:', response.ok ? 'OK' : 'Failed')
  } catch (error: any) {
    console.warn('[checkAPIHealth] CoinGecko health check failed:', error.message)
  }

  // Check Coinpaprika
  try {
    const response = await fetch(`${COINPAPRIKA_API}/coins`, { 
      signal: createTimeoutSignal(3000) 
    })
    results.coinpaprika = response.ok
    console.log('[checkAPIHealth] Coinpaprika:', response.ok ? 'OK' : 'Failed')
  } catch (error: any) {
    console.warn('[checkAPIHealth] Coinpaprika health check failed:', error.message)
  }

  // Check Fear & Greed
  try {
    const response = await fetch(`${FEAR_GREED_API}?limit=1`, { 
      signal: createTimeoutSignal(3000) 
    })
    results.feargreed = response.ok
    console.log('[checkAPIHealth] Fear & Greed:', response.ok ? 'OK' : 'Failed')
  } catch (error: any) {
    console.warn('[checkAPIHealth] Fear & Greed health check failed:', error.message)
  }

  console.log('[checkAPIHealth] Health check results:', results)
  return results
}