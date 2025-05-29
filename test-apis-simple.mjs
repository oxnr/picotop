#!/usr/bin/env node

// Simple test script for Bitcoin APIs
console.log('Testing Bitcoin APIs...\n');

const APIS = {
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
    console.log(`Headers:`, Object.fromEntries(response.headers));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Sample data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
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
  console.log('- If you see ENOTFOUND or network errors: APIs might be blocked');
  console.log('- If you see 403/429 errors: Rate limiting or authentication required');
  console.log('- If you see 200 OK: APIs are working, issue is likely CORS in browser');
}

runTests().catch(console.error);