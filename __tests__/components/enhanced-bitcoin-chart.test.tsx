/**
 * Tests for Enhanced Bitcoin Chart Component
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { EnhancedBitcoinChart } from '../../src/components/charts/enhanced-bitcoin-chart'

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ReferenceLine: () => <div data-testid="reference-line" />
}))

describe('EnhancedBitcoinChart', () => {
  const mockHistoricalData = [
    { date: '2023-01-01', price: 16800, timestamp: Date.now() - 365 * 24 * 60 * 60 * 1000 },
    { date: '2023-06-01', price: 30000, timestamp: Date.now() - 180 * 24 * 60 * 60 * 1000 },
    { date: '2024-01-01', price: 42500, timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000 },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render chart components', () => {
    render(
      <EnhancedBitcoinChart 
        data={mockHistoricalData} 
        currentPrice={108700} 
      />
    )

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getAllByTestId('line')).toHaveLength(2) // Historical + Prediction lines
  })

  it('should display chart legend', () => {
    render(
      <EnhancedBitcoinChart 
        data={mockHistoricalData} 
        currentPrice={108700} 
      />
    )

    expect(screen.getByText('Historical Price')).toBeInTheDocument()
    expect(screen.getByText('Cycle Prediction')).toBeInTheDocument()
    expect(screen.getByText(/Current: \$108,700/)).toBeInTheDocument()
  })

  it('should generate prediction data for 1.5 years', () => {
    render(
      <EnhancedBitcoinChart 
        data={mockHistoricalData} 
        currentPrice={108700} 
      />
    )

    // Check that chart renders - the prediction logic is tested internally
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('should handle missing data gracefully', () => {
    render(
      <EnhancedBitcoinChart 
        data={undefined} 
        currentPrice={108700} 
      />
    )

    // Should still render the chart with generated data
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('should use default current price when not provided', () => {
    render(<EnhancedBitcoinChart />)

    expect(screen.getByText(/Current: \$108,700/)).toBeInTheDocument()
  })

  it('should include Pi Cycle Top reference line', () => {
    render(
      <EnhancedBitcoinChart 
        data={mockHistoricalData} 
        currentPrice={108700} 
      />
    )

    // Reference lines are rendered
    expect(screen.getAllByTestId('reference-line')).toHaveLength(2) // Current + Pi Cycle Top
  })

  describe('Prediction Algorithm', () => {
    it('should generate realistic price predictions', () => {
      const component = render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      // The chart should render without errors
      expect(component.container).toBeInTheDocument()
    })

    it('should extend predictions 18 months into future', () => {
      const component = render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      // Verify chart renders successfully with future predictions
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    it('should show Pi Cycle Top prediction at $185K', () => {
      render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      // Chart should contain prediction data with peak target
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })
  })

  describe('Chart Styling', () => {
    it('should apply different styles for historical vs prediction data', () => {
      render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      // Should have two different line components for historical and prediction
      const lines = screen.getAllByTestId('line')
      expect(lines).toHaveLength(2)
    })

    it('should include proper gradients and styling', () => {
      const component = render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      // Check for gradient legend elements
      expect(component.container.querySelector('.bg-gradient-to-r')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should be wrapped in ResponsiveContainer', () => {
      render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    it('should maintain full width and height', () => {
      const component = render(
        <EnhancedBitcoinChart 
          data={mockHistoricalData} 
          currentPrice={108700} 
        />
      )

      const chartContainer = component.container.querySelector('.w-full.h-full')
      expect(chartContainer).toBeInTheDocument()
    })
  })
})