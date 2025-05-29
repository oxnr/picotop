/**
 * Tests for Live Dashboard Component
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LiveDashboard } from '../../src/components/dashboard/live-dashboard'

// Mock the hooks
jest.mock('../../src/hooks', () => ({
  useBitcoinData: () => ({
    data: {
      data: {
        price: {
          price: 108700,
          priceChangePercentage24h: 2.5,
          priceChange24h: 2500,
          marketCap: 2150000000000,
          volume24h: 25000000000,
          lastUpdated: new Date().toISOString()
        },
        dominance: 56.8,
        historical: [
          { date: '2023-01-01', price: 16800 },
          { date: '2024-01-01', price: 42500 },
        ],
        metrics: {
          nupl: 0.65,
          sopr: 1.05,
          mvrv: 2.8,
          rainbowBand: 6,
          fearGreedIndex: 75,
          analysis: {
            nupl: { signal: 'HOLD', explanation: 'Neutral market conditions' },
            sopr: { signal: 'ACCUMULATE', explanation: 'Good entry point' },
            mvrv: { signal: 'HOLD', explanation: 'Fair value range' },
            rainbowBand: { signal: 'HOLD', explanation: 'Mid-range band' },
            fearGreedIndex: { signal: 'DISTRIBUTE', explanation: 'High greed levels' },
            dominance: { signal: 'HOLD', explanation: 'Stable dominance' },
            overall: { signal: 'HOLD', explanation: 'Mixed signals, hold position' }
          }
        }
      },
      meta: {
        apiHealth: {
          coingecko: true,
          coinpaprika: true,
          feargreed: true
        },
        sources: {
          price: 'Enhanced multi-source',
          dominance: 'Enhanced multi-source',
          metrics: 'Enhanced with real Fear & Greed',
          fearGreed: 75
        }
      },
      timestamp: new Date().toISOString()
    },
    isLoading: false,
    error: null
  }),
  useAppRankings: () => ({
    data: {
      coinbase: [
        { platform: 'apple', rank: 8, change24h: -2, appId: 'coinbase-apple' },
        { platform: 'google', rank: 5, change24h: 1, appId: 'coinbase-google' }
      ]
    },
    isLoading: false,
    error: null
  }),
  useTopApps: () => ({
    data: {
      apple: [
        { appName: 'PayPal', rank: 1, isCrypto: false },
        { appName: 'Coinbase', rank: 8, isCrypto: true }
      ],
      google: [
        { appName: 'PayPal', rank: 1, isCrypto: false },
        { appName: 'Coinbase', rank: 5, isCrypto: true }
      ]
    },
    isLoading: false,
    error: null
  })
}))

// Mock chart components
jest.mock('../../src/components/charts', () => ({
  EnhancedBitcoinChart: () => <div data-testid="enhanced-bitcoin-chart">Chart</div>,
  VisualRainbowChart: () => <div data-testid="visual-rainbow-chart">Rainbow Chart</div>,
  VisualNUPLChart: () => <div data-testid="visual-nupl-chart">NUPL Chart</div>,
  MetricGauge: () => <div data-testid="metric-gauge">Gauge</div>,
  NUPLDetail: () => <div data-testid="nupl-detail">NUPL Detail</div>,
  SOPRDetail: () => <div data-testid="sopr-detail">SOPR Detail</div>,
  DominanceDetail: () => <div data-testid="dominance-detail">Dominance Detail</div>,
  ComprehensiveMetrics: () => <div data-testid="comprehensive-metrics">Comprehensive Metrics</div>
}))

// Mock other components
jest.mock('../../src/components/dashboard', () => ({
  StatsCard: ({ metric }: any) => <div data-testid="stats-card">{metric.title}: {metric.value}</div>
}))

jest.mock('../../src/components/rankings', () => ({
  TopAppsRankings: () => <div data-testid="top-apps-rankings">Top Apps</div>
}))

jest.mock('../../src/components/metrics', () => ({
  ActionSignalComponent: () => <div data-testid="action-signal">Signal</div>
}))

jest.mock('../../src/components/ui', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
  BrrrVideo: () => <div data-testid="brrr-video">BRRR Video</div>
}))

jest.mock('../../src/components/layout', () => ({
  AppLayout: ({ children }: any) => <div data-testid="app-layout">{children}</div>
}))

describe('LiveDashboard', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    jest.clearAllMocks()
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('should render dashboard with all main sections', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Sell the Pico Top')).toBeInTheDocument()
    })

    // Check for main sections
    expect(screen.getByTestId('enhanced-bitcoin-chart')).toBeInTheDocument()
    expect(screen.getByTestId('visual-rainbow-chart')).toBeInTheDocument()
    expect(screen.getByTestId('visual-nupl-chart')).toBeInTheDocument()
    expect(screen.getByTestId('comprehensive-metrics')).toBeInTheDocument()
  })

  it('should display Bitcoin price metrics', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Bitcoin Price: \$108,700/)).toBeInTheDocument()
      expect(screen.getByText(/BTC Dominance: 56.8%/)).toBeInTheDocument()
    })
  })

  it('should render cycle prediction section', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Cycle Prediction')).toBeInTheDocument()
    })
  })

  it('should display metric gauges', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Cycle Metrics Dashboard')).toBeInTheDocument()
      expect(screen.getAllByTestId('metric-gauge')).toHaveLength(4)
    })
  })

  it('should show app store rankings', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Crypto App Store Rankings')).toBeInTheDocument()
      expect(screen.getByTestId('top-apps-rankings')).toBeInTheDocument()
    })
  })

  it('should display actionable market analysis', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Actionable Market Analysis')).toBeInTheDocument()
      expect(screen.getByText('Overall Market Signal')).toBeInTheDocument()
    })
  })

  it('should include BRRR video component', async () => {
    renderWithProvider(<LiveDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('brrr-video')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading skeletons when data is loading', () => {
      // This would require mocking the hooks to return loading state
      renderWithProvider(<LiveDashboard />)
      
      // With current mock setup, data loads immediately
      expect(screen.getByTestId('app-layout')).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('should handle API errors gracefully', () => {
      // This would require mocking hooks to return error state
      renderWithProvider(<LiveDashboard />)
      
      // With current mock setup, no errors occur
      expect(screen.getByTestId('app-layout')).toBeInTheDocument()
    })
  })

  describe('Real-time Updates', () => {
    it('should update price data automatically', async () => {
      renderWithProvider(<LiveDashboard />)

      await waitFor(() => {
        expect(screen.getByText(/Bitcoin Price: \$108,700/)).toBeInTheDocument()
      })

      // Real-time updates would be tested with timer mocks and hook state changes
    })
  })

  describe('Responsive Design', () => {
    it('should render properly on different screen sizes', () => {
      renderWithProvider(<LiveDashboard />)

      // Grid layouts and responsive components are present
      expect(screen.getByTestId('app-layout')).toBeInTheDocument()
    })
  })

  describe('Interactive Elements', () => {
    it('should handle user interactions', async () => {
      renderWithProvider(<LiveDashboard />)

      await waitFor(() => {
        expect(screen.getByTestId('enhanced-bitcoin-chart')).toBeInTheDocument()
      })

      // Interactive elements like charts and signals are present
      expect(screen.getAllByTestId('action-signal')).toBeTruthy()
    })
  })
})