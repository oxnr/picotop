// App Store Rankings Types
export interface AppRanking {
  id: string
  appName: string
  bundleId: string
  rank: number
  category: string
  platform: 'ios' | 'android'
  timestamp: Date
  change?: number
}

export interface AppStoreMetrics {
  coinbase: AppRanking[]
  phantom: AppRanking[]
  metamask?: AppRanking[]
  trust?: AppRanking[]
}

// Bitcoin Metrics Types
export interface BitcoinMetric {
  timestamp: Date
  value: number
  normalized?: number
}

export interface NUPLData extends BitcoinMetric {
  type: 'nupl'
  category: 'euphoria' | 'greed' | 'optimism' | 'hope' | 'fear' | 'capitulation'
}

export interface SOPRData extends BitcoinMetric {
  type: 'sopr'
  trend: 'bullish' | 'bearish' | 'neutral'
}

export interface MVRVData extends BitcoinMetric {
  type: 'mvrv'
  zScore: number
}

export interface RainbowData extends BitcoinMetric {
  type: 'rainbow'
  band: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet'
}

export type BitcoinMetrics = {
  nupl: NUPLData[]
  sopr: SOPRData[]
  mvrv: MVRVData[]
  rainbow: RainbowData[]
}

// Cycle Prediction Types
export interface CyclePrediction {
  id: string
  timestamp: Date
  cycleTopDate: Date | null
  confidenceScore: number
  factors: {
    appStoreRankings: number
    onChainMetrics: number
    technicalIndicators: number
    marketSentiment: number
  }
  stage: 'accumulation' | 'markup' | 'distribution' | 'markdown'
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
}

// Chart Types
export interface ChartData {
  timestamp: Date
  value: number
  label?: string
  color?: string
}

export interface ChartConfig {
  title: string
  type: 'line' | 'area' | 'bar' | 'scatter'
  xAxis: {
    label: string
    type: 'time' | 'number' | 'category'
  }
  yAxis: {
    label: string
    format?: 'number' | 'currency' | 'percentage'
  }
  colors?: string[]
  animations?: boolean
}

// Dashboard Types
export interface DashboardMetric {
  id: string
  title: string
  value: string | number
  change?: {
    value: number
    period: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: string
  color?: string
  trend?: ChartData[]
}

export interface DashboardState {
  metrics: DashboardMetric[]
  predictions: CyclePrediction[]
  isLoading: boolean
  lastUpdated: Date | null
  error?: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: Date
  pagination?: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: Date
}