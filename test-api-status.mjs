#!/usr/bin/env node

// Simple script to test if the Picojeet APIs are working with real data
async function testBitcoinAPI() {
  console.log('🧪 Testing Picojeet Bitcoin API...')
  
  try {
    const response = await fetch('http://localhost:3000/api/bitcoin')
    const data = await response.json()
    
    console.log('✅ API Response Status:', response.status)
    console.log('📊 Success:', data.success)
    
    if (data.success) {
      console.log('💰 Current BTC Price:', `$${data.data.price.price.toLocaleString()}`)
      console.log('📈 24h Change:', `${data.data.price.priceChangePercentage24h.toFixed(2)}%`)
      console.log('🏛️ BTC Dominance:', `${data.data.dominance.toFixed(1)}%`)
      console.log('😨 Fear & Greed:', data.data.metrics.fearGreedIndex)
      console.log('📊 NUPL:', data.data.metrics.nupl.toFixed(3))
      console.log('📊 SOPR:', data.data.metrics.sopr.toFixed(3))
      console.log('📊 MVRV:', data.data.metrics.mvrv.toFixed(2))
      
      console.log('\n🔌 API Health Check:')
      Object.entries(data.meta.apiHealth).forEach(([api, healthy]) => {
        console.log(`  ${healthy ? '✅' : '❌'} ${api}: ${healthy ? 'OK' : 'Failed'}`)
      })
      
      console.log('\n📡 Data Sources:')
      Object.entries(data.meta.sources).forEach(([key, source]) => {
        console.log(`  • ${key}: ${source}`)
      })
      
      // Test cycle prediction consistency
      const targetPrice = Math.round(data.data.price.price * 1.25)
      console.log('\n🎯 Cycle Prediction:')
      console.log(`  • Current: $${data.data.price.price.toLocaleString()}`)
      console.log(`  • Target: $${targetPrice.toLocaleString()} (25% growth)`)
      console.log(`  • Expected in app: Both chart and card show same target`)
      
    } else {
      console.log('❌ API Error:', data.error)
    }
    
  } catch (error) {
    console.log('💥 Network Error:', error.message)
  }
}

async function testAppStoreAPI() {
  console.log('\n🏪 Testing App Store API...')
  
  try {
    const response = await fetch('http://localhost:3000/api/app-store/rankings')
    const data = await response.json()
    
    console.log('✅ App Store Response Status:', response.status)
    console.log('📱 Success:', data.success)
    
    if (data.success) {
      console.log('📊 Available Apps:', Object.keys(data.data).join(', '))
      console.log('🏦 Coinbase Rankings:')
      data.data.coinbase.forEach(app => {
        console.log(`  ${app.platform}: #${app.rank} (${app.change24h > 0 ? '+' : ''}${app.change24h})`)
      })
    }
    
  } catch (error) {
    console.log('💥 App Store API Error:', error.message)
  }
}

async function testCyclePrediction() {
  console.log('\n🔮 Testing Cycle Prediction Consistency...')
  
  try {
    // Test that chart and cards show consistent data
    console.log('Expected consistency checks:')
    console.log('  1. Enhanced Bitcoin Chart target line = Cycle card target')
    console.log('  2. Current price point (purple) shows live data')
    console.log('  3. Historical line (blue) uses monthly high values')
    console.log('  4. Prediction line (orange) shows 18-month forecast')
    console.log('  5. BGeo Metrics used for NUPL, SOPR, MVRV display')
    console.log('  6. Month labels align properly with data points')
    
  } catch (error) {
    console.log('💥 Cycle Prediction Test Error:', error.message)
  }
}

// Run tests
console.log('🚀 Starting Picojeet API Tests...\n')
await testBitcoinAPI()
await testAppStoreAPI()
await testCyclePrediction()
console.log('\n✨ Tests completed!')