// Mock App Store Rankings API
// In production, this would integrate with app store ranking services

export interface AppRankingData {
  appId: string
  appName: string
  rank: number
  category: string
  platform: 'apple' | 'google'
  change24h: number
  lastUpdated: string
}

export interface AppStoreRankings {
  coinbase: AppRankingData[]
  phantom: AppRankingData[]
  metamask: AppRankingData[]
  trust: AppRankingData[]
}

export interface TopAppData {
  appId: string
  appName: string
  rank: number
  globalRank: number
  categoryRank: number
  category: string
  platform: 'apple' | 'google'
  change24h: number
  globalChange24h: number
  categoryChange24h: number
  isCrypto: boolean
  icon: string
  publisher: string
  score: number // Combined ranking score
  lastUpdated: string
}

export interface TopAppsRankings {
  apple: TopAppData[]
  google: TopAppData[]
}

// Mock data for app store rankings
export function mockAppStoreRankings(): AppStoreRankings {
  const generateMockRanking = (
    appName: string,
    appleRank: number,
    googleRank: number
  ): AppRankingData[] => [
    {
      appId: `${appName.toLowerCase()}-apple`,
      appName,
      rank: appleRank,
      category: 'Finance',
      platform: 'apple',
      change24h: Math.floor(Math.random() * 20) - 10, // Random change between -10 and +10
      lastUpdated: new Date().toISOString(),
    },
    {
      appId: `${appName.toLowerCase()}-google`,
      appName,
      rank: googleRank,
      category: 'Finance',
      platform: 'google',
      change24h: Math.floor(Math.random() * 20) - 10,
      lastUpdated: new Date().toISOString(),
    },
  ]

  return {
    coinbase: generateMockRanking('Coinbase', 24, 27),
    phantom: generateMockRanking('Phantom', 42, 38),
    metamask: generateMockRanking('MetaMask', 35, 31),
    trust: generateMockRanking('Trust Wallet', 16, 19),
  }
}

export async function fetchAppStoreRankings(): Promise<AppStoreRankings> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock data for now
  return mockAppStoreRankings()
}

// Function to get specific app ranking
export function getAppRanking(
  rankings: AppStoreRankings,
  appName: keyof AppStoreRankings,
  platform?: 'apple' | 'google'
): AppRankingData | AppRankingData[] {
  const appRankings = rankings[appName]
  
  if (platform) {
    return appRankings.find(ranking => ranking.platform === platform) || appRankings[0]
  }
  
  return appRankings
}

// Calculate average ranking across platforms
export function getAverageRanking(rankings: AppRankingData[]): number {
  const totalRank = rankings.reduce((sum, ranking) => sum + ranking.rank, 0)
  return Math.round(totalRank / rankings.length)
}

// Calculate app score based on multiple ranking factors
function calculateAppScore(categoryRank: number, globalRank: number, isCrypto: boolean): number {
  // Lower ranks are better, so invert the calculation
  const categoryScore = Math.max(0, 100 - categoryRank * 2) // Category ranking weight
  const globalScore = Math.max(0, 200 - globalRank) // Global ranking weight
  const cryptoBonus = isCrypto ? 15 : 0 // Crypto apps get bonus points for relevance
  
  return Math.min(100, categoryScore + globalScore * 0.3 + cryptoBonus)
}

// Mock top 20 app rankings with global and category data
export function mockTop20Rankings(): TopAppsRankings {
  const generateTopApps = (platform: 'apple' | 'google'): TopAppData[] => {
    // Google Play specific rankings based on 2025 research data
    const cryptoApps = platform === 'google' ? [
      { name: 'Coinbase', categoryRank: 30, globalRank: 45, icon: '', publisher: 'Coinbase Inc.' },
      { name: 'Trust Wallet', categoryRank: 45, globalRank: 156, icon: '', publisher: 'Six Days LLC' },
      { name: 'MetaMask', categoryRank: 52, globalRank: 203, icon: '', publisher: 'ConsenSys' },
      { name: 'Binance.US', categoryRank: 38, globalRank: 89, icon: '', publisher: 'BAM Trading Services' },
      { name: 'Phantom', categoryRank: 2, globalRank: 334, icon: '', publisher: 'Phantom Technologies' }, // Ranked #2 on Google Play
      { name: 'Kraken Pro', categoryRank: 67, globalRank: 412, icon: '', publisher: 'Payward Inc.' },
    ] : [
      // Apple App Store rankings
      { name: 'Coinbase', categoryRank: 62, globalRank: 45, icon: '', publisher: 'Coinbase Inc.' },
      { name: 'Trust Wallet', categoryRank: 28, globalRank: 156, icon: '', publisher: 'Six Days LLC' },
      { name: 'MetaMask', categoryRank: 35, globalRank: 203, icon: '', publisher: 'ConsenSys' },
      { name: 'Binance.US', categoryRank: 41, globalRank: 89, icon: '', publisher: 'BAM Trading Services' },
      { name: 'Phantom', categoryRank: 24, globalRank: 334, icon: '', publisher: 'Phantom Technologies' },
      { name: 'Kraken Pro', categoryRank: 58, globalRank: 412, icon: '', publisher: 'Payward Inc.' },
    ]

    const regularApps = [
      { name: 'Cash App', categoryRank: 1, globalRank: 23, icon: '', publisher: 'Block Inc.' }, // Leading app based on research
      { name: 'Venmo', categoryRank: 2, globalRank: 67, icon: '', publisher: 'PayPal Inc.' }, // Strong #2 position
      { name: 'PayPal', categoryRank: 3, globalRank: 8, icon: '', publisher: 'PayPal Inc.' }, // Top 3 based on research
      { name: 'Wells Fargo Mobile', categoryRank: 4, globalRank: 123, icon: '', publisher: 'Wells Fargo' },
      { name: 'Chase Mobile', categoryRank: 5, globalRank: 98, icon: '', publisher: 'JPMorgan Chase' },
      { name: 'Bank of America', categoryRank: 6, globalRank: 145, icon: '', publisher: 'Bank of America' },
      { name: 'Zelle', categoryRank: 7, globalRank: 234, icon: '', publisher: 'Early Warning Services' },
      { name: 'Credit Karma', categoryRank: 8, globalRank: 167, icon: '', publisher: 'Credit Karma Inc.' },
      { name: 'Mint', categoryRank: 9, globalRank: 189, icon: '', publisher: 'Intuit Inc.' },
      { name: 'Robinhood', categoryRank: 10, globalRank: 76, icon: '', publisher: 'Robinhood Markets' },
      { name: 'Fidelity Investments', categoryRank: 11, globalRank: 245, icon: '', publisher: 'Fidelity' },
      { name: 'Capital One Mobile', categoryRank: 12, globalRank: 198, icon: '', publisher: 'Capital One' },
      { name: 'E*TRADE', categoryRank: 13, globalRank: 289, icon: '', publisher: 'Morgan Stanley' },
      { name: 'Charles Schwab', categoryRank: 14, globalRank: 356, icon: '', publisher: 'Charles Schwab' },
      { name: 'Webull', categoryRank: 15, globalRank: 234, icon: '', publisher: 'Webull Corporation' },
      { name: 'Chime', categoryRank: 16, globalRank: 178, icon: '', publisher: 'Chime Financial Inc.' },
      { name: 'TD Ameritrade', categoryRank: 17, globalRank: 445, icon: '', publisher: 'Charles Schwab' },
      { name: 'SoFi', categoryRank: 18, globalRank: 267, icon: '', publisher: 'SoFi Technologies' },
      { name: 'Acorns', categoryRank: 19, globalRank: 398, icon: '', publisher: 'Acorns Grow Inc.' },
      { name: 'USAA Mobile', categoryRank: 20, globalRank: 387, icon: '', publisher: 'USAA' },
      { name: 'Ally Mobile', categoryRank: 21, globalRank: 523, icon: '', publisher: 'Ally Bank' },
      { name: 'Stash', categoryRank: 22, globalRank: 456, icon: '', publisher: 'Stash101 Inc.' },
      { name: 'PNC Mobile', categoryRank: 23, globalRank: 412, icon: '', publisher: 'PNC Bank' },
      { name: 'Navy Federal CU', categoryRank: 25, globalRank: 567, icon: '', publisher: 'Navy Federal Credit Union' },
    ]

    const allApps = [...cryptoApps, ...regularApps]
      .sort((a, b) => a.categoryRank - b.categoryRank)
      .map((app, index) => {
        const isCrypto = cryptoApps.some(crypto => crypto.name === app.name)
        const score = calculateAppScore(app.categoryRank, app.globalRank, isCrypto)
        
        return {
          appId: `${app.name.toLowerCase().replace(/\s+/g, '-')}-${platform}`,
          appName: app.name,
          rank: index + 1,
          globalRank: app.globalRank,
          categoryRank: app.categoryRank,
          category: 'Finance',
          platform,
          change24h: Math.floor(Math.random() * 20) - 10,
          globalChange24h: Math.floor(Math.random() * 30) - 15,
          categoryChange24h: Math.floor(Math.random() * 15) - 7,
          isCrypto,
          icon: app.icon,
          publisher: app.publisher,
          score: Math.round(score),
          lastUpdated: new Date().toISOString(),
        }
      })

    return allApps
  }

  return {
    apple: generateTopApps('apple'),
    google: generateTopApps('google'),
  }
}

export async function fetchTop20Rankings(): Promise<TopAppsRankings> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Return mock data for now
  return mockTop20Rankings()
}