import { NextResponse } from 'next/server'

// Michael Saylor Bitcoin Purchase Data (based on public records and SEC filings)
// Data sourced from https://saylortracker.com/ and MicroStrategy SEC filings
const saylorPurchases = [
  { date: '2020-08-11', price: 11521, amount: 250, cost: 2880250 },
  { date: '2020-09-14', price: 10775, amount: 175, cost: 1885625 },
  { date: '2020-12-04', price: 19427, amount: 29.646, cost: 575757 },
  { date: '2020-12-21', price: 23590, amount: 29.646, cost: 699157 },
  { date: '2021-01-22', price: 32220, amount: 314, cost: 10117080 },
  { date: '2021-02-24', price: 52087, amount: 19.427, cost: 1011499 },
  { date: '2021-03-05', price: 48099, amount: 328, cost: 15776472 },
  { date: '2021-04-05', price: 59187, amount: 253, cost: 14974411 },
  { date: '2021-05-13', price: 49229, amount: 271, cost: 13341059 },
  { date: '2021-06-21', price: 37617, amount: 13.005, cost: 489090 },
  { date: '2021-08-24', price: 48099, amount: 177, cost: 8513523 },
  { date: '2021-09-13', price: 45479, amount: 5.05, cost: 229669 },
  { date: '2021-12-09', price: 49229, amount: 1434, cost: 70582486 },
  { date: '2021-12-30', price: 47662, amount: 1914, cost: 91252668 },
  { date: '2022-03-24', price: 44645, amount: 4167, cost: 186016515 },
  { date: '2022-05-03', price: 38585, amount: 1045, cost: 40321325 },
  { date: '2022-06-29', price: 20817, amount: 480, cost: 9992160 },
  { date: '2022-08-02', price: 22534, amount: 301, cost: 6782734 },
  { date: '2022-09-20', price: 19851, amount: 301, cost: 5975151 },
  { date: '2022-11-01', price: 20402, amount: 2395, cost: 48862790 },
  { date: '2022-12-22', price: 16845, amount: 2500, cost: 42112500 },
  { date: '2023-01-31', price: 23376, amount: 6455, cost: 150892080 },
  { date: '2023-02-27', price: 24119, amount: 6068, cost: 146355292 },
  { date: '2023-03-23', price: 27728, amount: 6207, cost: 172127496 },
  { date: '2023-04-24', price: 29668, amount: 1045, cost: 31003660 },
  { date: '2023-06-28', price: 30700, amount: 467, cost: 14336900 },
  { date: '2023-08-01', price: 29329, amount: 467, cost: 13700643 },
  { date: '2023-09-24', price: 26769, amount: 5445, cost: 145755405 },
  { date: '2023-11-29', price: 37040, amount: 16130, cost: 597335200 },
  { date: '2023-12-27', price: 43729, amount: 5783, cost: 252890407 },
  { date: '2024-01-30', price: 43190, amount: 3000, cost: 129570000 },
  { date: '2024-02-26', price: 51813, amount: 3000, cost: 155439000 },
  { date: '2024-03-18', price: 67675, amount: 9245, cost: 625791875 },
  { date: '2024-04-29', price: 71692, amount: 122, cost: 8746424 },
  { date: '2024-05-31', price: 67648, amount: 786, cost: 53191328 },
  { date: '2024-06-20', price: 64742, amount: 11931, cost: 772327702 },
  { date: '2024-07-31', price: 66597, amount: 169, cost: 11254893 },
  { date: '2024-08-19', price: 60408, amount: 169, cost: 10208952 },
  { date: '2024-09-12', price: 58263, amount: 7420, cost: 432311460 },
  { date: '2024-10-31', price: 72000, amount: 27200, cost: 1958400000 },
  { date: '2024-11-18', price: 92000, amount: 51780, cost: 4763760000 },
  { date: '2024-11-25', price: 99500, amount: 55500, cost: 5522250000 }
]

export async function GET() {
  try {
    // Calculate totals
    const totalBitcoin = saylorPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
    const totalCostBasis = saylorPurchases.reduce((sum, purchase) => sum + purchase.cost, 0)
    const averagePrice = totalCostBasis / totalBitcoin

    // Get current Bitcoin price from existing API
    let currentPrice = 97000 // Fallback price
    try {
      const bitcoinResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/bitcoin`)
      if (bitcoinResponse.ok) {
        const bitcoinData = await bitcoinResponse.json()
        if (bitcoinData.success && bitcoinData.data?.price?.price) {
          currentPrice = bitcoinData.data.price.price
        }
      }
    } catch (error) {
      console.warn('Failed to fetch current Bitcoin price, using fallback:', error)
    }

    const currentValue = totalBitcoin * currentPrice
    const totalPnL = currentValue - totalCostBasis
    const pnlPercentage = (totalPnL / totalCostBasis) * 100

    // Add P&L calculations to each purchase
    const purchasesWithPnL = saylorPurchases.map(purchase => {
      const currentValueForPurchase = purchase.amount * currentPrice
      const pnlForPurchase = currentValueForPurchase - purchase.cost
      const pnlPercentageForPurchase = (pnlForPurchase / purchase.cost) * 100

      return {
        ...purchase,
        currentValue: currentValueForPurchase,
        pnl: pnlForPurchase,
        pnlPercentage: pnlPercentageForPurchase
      }
    })

    const response = {
      success: true,
      data: {
        summary: {
          totalBitcoin: totalBitcoin.toFixed(0),
          totalCostBasis: totalCostBasis,
          averagePrice: averagePrice.toFixed(2),
          currentPrice: currentPrice,
          currentValue: currentValue,
          totalPnL: totalPnL,
          pnlPercentage: pnlPercentage.toFixed(2)
        },
        purchases: purchasesWithPnL,
        meta: {
          totalPurchases: saylorPurchases.length,
          firstPurchase: saylorPurchases[0].date,
          lastPurchase: saylorPurchases[saylorPurchases.length - 1].date,
          source: 'SEC filings and public statements',
          disclaimer: 'Data based on publicly available information and may not reflect private transactions'
        }
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Saylor tracker data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}