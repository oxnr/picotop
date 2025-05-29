'use client'

import { useState, useEffect } from 'react'
import { fetchEnhancedBitcoinPrice, fetchEnhancedBitcoinDominance, checkAPIHealth, fetchFearGreedIndex } from '@/lib/api/enhanced-bitcoin'

export function APITest() {
  const [results, setResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (test: string, status: 'success' | 'error' | 'info', data: any) => {
    setResults(prev => [...prev, { test, status, data, timestamp: new Date().toISOString() }])
  }

  const testAPIs = async () => {
    setTesting(true)
    setResults([])

    // Test 1: Direct CoinGecko API call
    try {
      addResult('CoinGecko Direct API', 'info', 'Testing...')
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`)
      }
      
      const data = await response.json()
      addResult('CoinGecko Direct API', 'success', { status: response.status, data })
    } catch (error: any) {
      addResult('CoinGecko Direct API', 'error', {
        message: error.message,
        type: error.name,
        stack: error.stack
      })
    }

    // Test 2: Direct Coinpaprika API call
    try {
      addResult('Coinpaprika Direct API', 'info', 'Testing...')
      const response = await fetch('https://api.coinpaprika.com/v1/tickers/btc-bitcoin', {
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`)
      }
      
      const data = await response.json()
      addResult('Coinpaprika Direct API', 'success', { status: response.status, hasData: !!data.quotes })
    } catch (error: any) {
      addResult('Coinpaprika Direct API', 'error', {
        message: error.message,
        type: error.name,
        isCORS: error.message.includes('Failed to fetch') || error.message.includes('NetworkError')
      })
    }

    // Test 3: Direct Fear & Greed API call
    try {
      addResult('Fear & Greed Direct API', 'info', 'Testing...')
      const response = await fetch('https://api.alternative.me/fng/?limit=1', {
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`)
      }
      
      const data = await response.json()
      addResult('Fear & Greed Direct API', 'success', { status: response.status, data })
    } catch (error: any) {
      addResult('Fear & Greed Direct API', 'error', {
        message: error.message,
        type: error.name,
        isCORS: error.message.includes('Failed to fetch') || error.message.includes('NetworkError')
      })
    }

    // Test 4: App's fetchEnhancedBitcoinPrice function
    try {
      addResult('fetchEnhancedBitcoinPrice()', 'info', 'Testing...')
      console.log('Testing fetchEnhancedBitcoinPrice...')
      const data = await fetchEnhancedBitcoinPrice()
      addResult('fetchEnhancedBitcoinPrice()', 'success', data)
    } catch (error: any) {
      addResult('fetchEnhancedBitcoinPrice()', 'error', {
        message: error.message,
        stack: error.stack
      })
    }

    // Test 5: App's fetchEnhancedBitcoinDominance function
    try {
      addResult('fetchEnhancedBitcoinDominance()', 'info', 'Testing...')
      console.log('Testing fetchEnhancedBitcoinDominance...')
      const dominance = await fetchEnhancedBitcoinDominance()
      addResult('fetchEnhancedBitcoinDominance()', 'success', { dominance })
    } catch (error: any) {
      addResult('fetchEnhancedBitcoinDominance()', 'error', {
        message: error.message,
        stack: error.stack
      })
    }

    // Test 6: App's fetchFearGreedIndex function
    try {
      addResult('fetchFearGreedIndex()', 'info', 'Testing...')
      console.log('Testing fetchFearGreedIndex...')
      const fgi = await fetchFearGreedIndex()
      addResult('fetchFearGreedIndex()', 'success', { fearGreedIndex: fgi })
    } catch (error: any) {
      addResult('fetchFearGreedIndex()', 'error', {
        message: error.message,
        stack: error.stack
      })
    }

    // Test 7: Check API Health
    try {
      addResult('checkAPIHealth()', 'info', 'Testing...')
      const health = await checkAPIHealth()
      addResult('checkAPIHealth()', 'success', health)
    } catch (error: any) {
      addResult('checkAPIHealth()', 'error', {
        message: error.message,
        stack: error.stack
      })
    }

    // Test 8: Check console for errors
    addResult('Console Check', 'info', 'Check browser console for detailed error logs')

    setTesting(false)
  }

  useEffect(() => {
    // Check console on mount
    console.log('API Test Component Mounted')
    console.log('Window location:', window.location.href)
    console.log('Protocol:', window.location.protocol)
  }, [])

  return (
    <div className="p-4 bg-card text-foreground rounded-lg border border-border">
      <h2 className="text-xl font-bold mb-4">Bitcoin API Test Suite</h2>
      
      <button
        onClick={testAPIs}
        disabled={testing}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
      >
        {testing ? 'Testing...' : 'Run API Tests'}
      </button>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              result.status === 'success' ? 'bg-green-900' :
              result.status === 'error' ? 'bg-red-900' :
              'bg-gray-800'
            }`}
          >
            <div className="font-semibold">{result.test}</div>
            <pre className="text-xs mt-1 overflow-x-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
            <div className="text-xs text-gray-400 mt-1">{result.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm">
        <p className="text-yellow-400">⚠️ Open browser console (F12) to see detailed logs</p>
        <p className="text-gray-400 mt-2">Common issues:</p>
        <ul className="list-disc list-inside text-gray-400">
          <li>CORS errors: API doesn't allow browser requests</li>
          <li>Rate limiting: Too many requests in short time</li>
          <li>Network errors: API is down or blocked</li>
          <li>Timeout: API response too slow</li>
        </ul>
      </div>
    </div>
  )
}