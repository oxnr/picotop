'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DataPoint {
  date: Date
  value: number
}

interface MiniChartProps {
  data: DataPoint[]
  color?: string
  height?: number
  showAxes?: boolean
  formatValue?: (value: number) => string
  isRainbow?: boolean // Special handling for rainbow band
  invertValues?: boolean // For metrics where lower is better (like rankings)
}

export function MiniChart({ 
  data, 
  color = '#8b5cf6',
  height = 60,
  showAxes = true,
  formatValue,
  isRainbow = false,
  invertValues = false
}: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate data bounds
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1

    // Chart dimensions
    const padding = showAxes ? 20 : 5
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Draw axes if needed
    if (showAxes) {
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)' // text-gray-400 with opacity
      ctx.lineWidth = 1
      
      // X-axis
      ctx.beginPath()
      ctx.moveTo(padding, rect.height - padding)
      ctx.lineTo(rect.width - padding, rect.height - padding)
      ctx.stroke()
      
      // Y-axis
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, rect.height - padding)
      ctx.stroke()
    }

    // Draw the line chart
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      // Invert Y calculation if invertValues is true (for rankings where lower is better)
      const normalizedValue = (point.value - minValue) / valueRange
      const y = invertValues 
        ? padding + normalizedValue * chartHeight  // For rankings: lower values go to top
        : padding + (1 - normalizedValue) * chartHeight  // Normal: higher values go to top
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding)
    gradient.addColorStop(0, color + '40') // 25% opacity
    gradient.addColorStop(1, color + '00') // 0% opacity
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      const normalizedValue = (point.value - minValue) / valueRange
      const y = invertValues 
        ? padding + normalizedValue * chartHeight  
        : padding + (1 - normalizedValue) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw value labels
    if (formatValue && showAxes) {
      ctx.fillStyle = 'rgba(156, 163, 175, 0.8)'
      ctx.font = '10px system-ui'
      
      // Min value
      ctx.textAlign = 'right'
      ctx.fillText(formatValue(minValue), padding - 3, rect.height - padding + 3)
      
      // Max value
      ctx.fillText(formatValue(maxValue), padding - 3, padding + 3)
    }

  }, [data, color, height, showAxes, formatValue])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </motion.div>
  )
}