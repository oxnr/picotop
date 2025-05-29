#!/usr/bin/env node

// Simple script to test if the Bitcoin API is working with real data
async function testBitcoinAPI() {
  console.log('🧪 Testing Bitcoin API...')
  
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
      
      console.log('\n🔌 API Health Check:')
      Object.entries(data.meta.apiHealth).forEach(([api, healthy]) => {
        console.log(`  ${healthy ? '✅' : '❌'} ${api}: ${healthy ? 'OK' : 'Failed'}`)
      })
      
      console.log('\n📡 Data Sources:')
      Object.entries(data.meta.sources).forEach(([key, source]) => {
        console.log(`  • ${key}: ${source}`)
      })
      
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

// Run tests
console.log('🚀 Starting API Tests...\n')
await testBitcoinAPI()
await testAppStoreAPI()
console.log('\n✨ Tests completed!')