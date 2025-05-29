// Test script for Bitcoin APIs
// Run with: node test-bitcoin-apis.js

const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const COINPAPRIKA_API = 'https://api.coinpaprika.com/v1'
const FEAR_GREED_API = 'https://api.alternative.me/fng/'

async function testCoinGeckoPrice() {
  console.log('\n=== Testing CoinGecko Price API ===')
  try {
    const url = `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
    console.log('URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers))
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }
    
    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))
    
    // Test data parsing
    if (data.bitcoin) {
      console.log('\nParsed data:')
      console.log('- Price:', data.bitcoin.usd)
      console.log('- 24h Change:', data.bitcoin.usd_24h_change)
      console.log('- Market Cap:', data.bitcoin.usd_market_cap)
      console.log('- Volume:', data.bitcoin.usd_24h_vol)
      console.log('- Last Updated:', new Date(data.bitcoin.last_updated_at * 1000))
    }
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

async function testCoinGeckoDominance() {
  console.log('\n=== Testing CoinGecko Dominance API ===')
  try {
    const url = `${COINGECKO_API}/global`
    console.log('URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
    })
    
    console.log('Status:', response.status)
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }
    
    const data = await response.json()
    console.log('Bitcoin dominance:', data.data?.market_cap_percentage?.btc)
    console.log('Full market cap percentages:', data.data?.market_cap_percentage)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function testCoinpaprikaPrice() {
  console.log('\n=== Testing Coinpaprika Price API ===')
  try {
    const url = `${COINPAPRIKA_API}/tickers/btc-bitcoin`
    console.log('URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers))
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }
    
    const data = await response.json()
    console.log('Response data (truncated):', {
      id: data.id,
      name: data.name,
      quotes: {
        USD: data.quotes?.USD
      }
    })
    
    // Test data parsing
    if (data.quotes?.USD) {
      console.log('\nParsed data:')
      console.log('- Price:', data.quotes.USD.price)
      console.log('- 24h Change %:', data.quotes.USD.percent_change_24h)
      console.log('- Market Cap:', data.quotes.USD.market_cap)
      console.log('- Volume:', data.quotes.USD.volume_24h)
      console.log('- Last Updated:', data.last_updated)
    }
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

async function testCoinpaprikaDominance() {
  console.log('\n=== Testing Coinpaprika Dominance API ===')
  try {
    const url = `${COINPAPRIKA_API}/global`
    console.log('URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
    })
    
    console.log('Status:', response.status)
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }
    
    const data = await response.json()
    console.log('Bitcoin dominance:', data.bitcoin_dominance_percentage)
    console.log('Market cap USD:', data.market_cap_usd)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function testFearGreedAPI() {
  console.log('\n=== Testing Fear & Greed API ===')
  try {
    const url = `${FEAR_GREED_API}?limit=1`
    console.log('URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers))
    
    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }
    
    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))
    
    // Test data parsing
    if (data.data && data.data[0]) {
      console.log('\nParsed data:')
      console.log('- Value:', data.data[0].value)
      console.log('- Classification:', data.data[0].value_classification)
      console.log('- Timestamp:', data.data[0].timestamp)
      console.log('- Time Until Update:', data.data[0].time_until_update)
    }
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

async function testHealthChecks() {
  console.log('\n=== Testing Health Check Endpoints ===')
  
  // CoinGecko ping
  try {
    const response = await fetch(`${COINGECKO_API}/ping`)
    console.log('CoinGecko ping status:', response.status)
    if (response.ok) {
      const data = await response.json()
      console.log('CoinGecko ping response:', data)
    }
  } catch (error) {
    console.error('CoinGecko ping error:', error.message)
  }
  
  // Coinpaprika coins endpoint
  try {
    const response = await fetch(`${COINPAPRIKA_API}/coins`, {
      headers: { 'Accept': 'application/json' }
    })
    console.log('Coinpaprika coins status:', response.status)
  } catch (error) {
    console.error('Coinpaprika coins error:', error.message)
  }
}

async function testWithTimeout() {
  console.log('\n=== Testing with AbortSignal.timeout ===')
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CycleTop/1.0',
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    console.log('Request completed, status:', response.status)
  } catch (error) {
    console.error('Timeout test error:', error.message)
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting Bitcoin API tests...')
  console.log('Node version:', process.version)
  console.log('Date:', new Date().toISOString())
  
  await testHealthChecks()
  await testCoinGeckoPrice()
  await testCoinGeckoDominance()
  await testCoinpaprikaPrice()
  await testCoinpaprikaDominance()
  await testFearGreedAPI()
  await testWithTimeout()
  
  console.log('\n=== Tests Complete ===')
}

runAllTests().catch(console.error)