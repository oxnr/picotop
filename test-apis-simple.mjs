#!/usr/bin/env node

// Simple test script for Picojeet APIs
console.log('Testing Picojeet APIs...\n');

const APIS = {
  bgeometrics: 'https://api.bgeometrics.com/bitcoin',
  coingecko: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
  coinpaprika: 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin',
  feargreed: 'https://api.alternative.me/fng/?limit=1'
};

async function testAPI(name, url) {
  console.log(`\nTesting ${name}:`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Sample data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
      
      // Specific checks for each API
      if (name === 'bgeometrics') {
        console.log('📊 BGeo Metrics data includes:', Object.keys(data).join(', '));
      } else if (name === 'coingecko') {
        console.log('💰 CoinGecko BTC price:', data.bitcoin?.usd);
      } else if (name === 'coinpaprika') {
        console.log('💰 Coinpaprika BTC price:', data.quotes?.USD?.price);
      } else if (name === 'feargreed') {
        console.log('😨 Fear & Greed Index:', data.data?.[0]?.value);
      }
    } else {
      const text = await response.text();
      console.log('❌ Error response:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
    console.log('Error type:', error.constructor.name);
  }
}

// Run tests
async function runTests() {
  for (const [name, url] of Object.entries(APIS)) {
    await testAPI(name, url);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between requests
  }
  
  console.log('\n\nSummary:');
  console.log('- BGeo Metrics: Primary source for NUPL, SOPR, MVRV, dominance');
  console.log('- CoinGecko/Coinpaprika: Backup price sources');
  console.log('- Fear & Greed: Market sentiment indicator');
  console.log('- If APIs fail: Check network connectivity and rate limits');
}

runTests().catch(console.error);