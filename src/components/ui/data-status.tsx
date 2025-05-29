'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui'
import { WifiHigh, WifiMedium, WifiLow, WifiSlash, Clock, CheckCircle, Warning } from '@phosphor-icons/react'

interface DataStatusProps {
  apiHealth?: {
    coingecko: boolean
    coinpaprika: boolean
    feargreed: boolean
  }
  lastUpdated?: string
  sources?: {
    price: string
    dominance: string
    metrics: string
    fearGreed: number
  }
  updateInterval?: number // in seconds
}

export function DataStatus({ 
  apiHealth, 
  lastUpdated, 
  sources, 
  updateInterval = 60 
}: DataStatusProps) {
  if (!apiHealth && !lastUpdated) return null

  const getConnectionIcon = () => {
    if (!apiHealth) return <WifiSlash className="h-4 w-4 text-red-400" />
    
    const healthyAPIs = Object.values(apiHealth).filter(Boolean).length
    const totalAPIs = Object.keys(apiHealth).length
    
    if (healthyAPIs === totalAPIs) return <WifiHigh className="h-4 w-4 text-green-400" />
    if (healthyAPIs >= totalAPIs * 0.7) return <WifiMedium className="h-4 w-4 text-yellow-400" />
    if (healthyAPIs > 0) return <WifiLow className="h-4 w-4 text-orange-400" />
    return <WifiSlash className="h-4 w-4 text-red-400" />
  }

  const getStatusText = () => {
    if (!apiHealth) return 'Connection Status Unknown'
    
    const healthyAPIs = Object.values(apiHealth).filter(Boolean).length
    const totalAPIs = Object.keys(apiHealth).length
    
    if (healthyAPIs === totalAPIs) return 'All APIs Operational'
    if (healthyAPIs >= totalAPIs * 0.7) return 'Mostly Operational'
    if (healthyAPIs > 0) return 'Limited Connectivity'
    return 'APIs Unavailable'
  }

  const getStatusColor = () => {
    if (!apiHealth) return 'text-gray-400'
    
    const healthyAPIs = Object.values(apiHealth).filter(Boolean).length
    const totalAPIs = Object.keys(apiHealth).length
    
    if (healthyAPIs === totalAPIs) return 'text-green-400'
    if (healthyAPIs >= totalAPIs * 0.7) return 'text-yellow-400'
    if (healthyAPIs > 0) return 'text-orange-400'
    return 'text-red-400'
  }

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date()
    const updated = new Date(timestamp)
    const diffMs = now.getTime() - updated.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getConnectionIcon()}
              <div>
                <div className={`text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
                {lastUpdated && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {formatLastUpdated(lastUpdated)}
                  </div>
                )}
              </div>
            </div>
            
            {/* API Status Indicators */}
            {apiHealth && (
              <div className="flex items-center space-x-2">
                <div className="text-xs text-muted-foreground">Sources:</div>
                <div className="flex space-x-1">
                  {Object.entries(apiHealth).map(([api, status]) => (
                    <div key={api} className="relative group">
                      {status ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <Warning className="h-3 w-3 text-red-400" />
                      )}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border text-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        {api}: {status ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Real-time features */}
          {sources && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Price Source:</div>
                  <div className="text-foreground font-medium">{sources.price}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Fear & Greed:</div>
                  <div className="text-foreground font-medium">
                    {sources.fearGreed} (Real-time)
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Update frequency indicator */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Auto-refresh: {updateInterval}s</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}