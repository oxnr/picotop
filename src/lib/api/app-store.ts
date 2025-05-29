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
    coinbase: generateMockRanking('Coinbase', 12, 8),
    phantom: generateMockRanking('Phantom', 28, 35),
    metamask: generateMockRanking('MetaMask', 45, 42),
    trust: generateMockRanking('Trust Wallet', 18, 15),
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
    const cryptoApps = [
      { name: 'Coinbase', categoryRank: 3, globalRank: 45, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/b8/6f/9d/b86f9d6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Coinbase Inc.' },
      { name: 'Trust Wallet', categoryRank: 8, globalRank: 156, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f7/7c/ac/f77cacac-a8f0-4b8f-8b0e-6b0e-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Six Days LLC' },
      { name: 'MetaMask', categoryRank: 12, globalRank: 203, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8e/76/ef/8e76ef6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'ConsenSys' },
      { name: 'Binance', categoryRank: 15, globalRank: 89, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f7/b9/1c/f7b91c6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Binance LTD' },
      { name: 'Phantom', categoryRank: 18, globalRank: 334, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8e/76/ef/8e76ef6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Phantom Technologies' },
    ]

    const regularApps = [
      { name: 'PayPal', categoryRank: 1, globalRank: 8, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2f/49/d0/2f49d06f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'PayPal Inc.' },
      { name: 'Cash App', categoryRank: 2, globalRank: 23, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/00/ff/00/00ff006f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Block Inc.' },
      { name: 'Venmo', categoryRank: 4, globalRank: 67, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/00/80/ff/0080ff6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'PayPal Inc.' },
      { name: 'Wells Fargo Mobile', categoryRank: 5, globalRank: 123, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/00/00/ff00006f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Wells Fargo' },
      { name: 'Chase Mobile', categoryRank: 6, globalRank: 98, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/00/00/ff/0000ff6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'JPMorgan Chase' },
      { name: 'Bank of America', categoryRank: 7, globalRank: 145, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/80/00/ff/8000ff6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Bank of America' },
      { name: 'Zelle', categoryRank: 9, globalRank: 234, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/ff/00/ffff006f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Early Warning Services' },
      { name: 'Credit Karma', categoryRank: 10, globalRank: 167, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/80/00/ff80006f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Credit Karma Inc.' },
      { name: 'Mint', categoryRank: 11, globalRank: 189, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/00/ff/80/00ff806f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Intuit Inc.' },
      { name: 'Robinhood', categoryRank: 13, globalRank: 76, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/00/80/ff00806f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Robinhood Markets' },
      { name: 'Fidelity Investments', categoryRank: 14, globalRank: 245, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/80/ff/00/80ff006f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Fidelity' },
      { name: 'E*TRADE', categoryRank: 16, globalRank: 289, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/00/80/ff/0080ff6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Morgan Stanley' },
      { name: 'Charles Schwab', categoryRank: 17, globalRank: 356, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/80/00/ff/8000ff6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Charles Schwab' },
      { name: 'TD Ameritrade', categoryRank: 19, globalRank: 445, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ff/80/80/ff80806f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'Charles Schwab' },
      { name: 'SoFi', categoryRank: 20, globalRank: 267, icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/80/80/ff/8080ff6f-6b0e-86d0-0e1f-7e5b68b3d88c/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/60x60bb.jpg', publisher: 'SoFi Technologies' },
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