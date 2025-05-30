'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { TopAppData } from '@/lib/api/app-store'
import { TrendUp, TrendDown, Star, Crown } from '@phosphor-icons/react'

interface TopAppsRankingsProps {
  appleApps: TopAppData[]
  googleApps: TopAppData[]
  isLoading?: boolean
}

function AppRow({ app, index }: { app: TopAppData; index: number }) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />
    if (rank <= 3) return <Star className="h-4 w-4 text-yellow-400" />
    return null
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400'
    if (change < 0) return 'text-red-400'
    return 'text-muted-foreground'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendUp className="h-3 w-3" />
    if (change < 0) return <TrendDown className="h-3 w-3" />
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center p-3 rounded-lg border transition-all hover:bg-secondary/20 ${
        app.isCrypto 
          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
          : 'border-border bg-secondary/5'
      }`}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8 text-lg font-bold text-foreground mr-3">
        #{app.rank}
        {getRankIcon(app.rank)}
      </div>
      
      {/* App Icon */}
      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
        {app.icon && app.icon.startsWith('http') ? (
          <img 
            src={app.icon} 
            alt={app.appName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling!.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold flex items-center justify-center rounded-lg text-foreground ${app.icon && app.icon.startsWith('http') ? 'hidden' : ''}`}>
          {app.icon && !app.icon.startsWith('http') ? app.icon : app.appName.charAt(0).toUpperCase()}
        </div>
      </div>
      
      {/* App Name & Publisher */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className={`font-medium truncate ${app.isCrypto ? 'text-primary' : 'text-foreground'}`}>
            {app.appName}
          </span>
          {app.isCrypto && (
            <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full whitespace-nowrap">
              Crypto
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground truncate">{app.publisher}</div>
      </div>
      
      {/* App Store Rank & Score */}
      <div className="text-right mr-3">
        <div className="text-sm font-medium text-foreground">#{app.categoryRank}</div>
        <div className="text-xs text-muted-foreground">App Store</div>
        <div className="text-xs font-medium text-primary mt-1">{app.score}</div>
      </div>
      
      {/* Change */}
      <div className="text-right w-12">
        {app.categoryChange24h !== 0 && !isNaN(app.categoryChange24h) && (
          <div className={`flex items-center justify-end space-x-1 text-xs ${getChangeColor(app.categoryChange24h)}`}>
            {getChangeIcon(app.categoryChange24h)}
            <span>{Math.abs(app.categoryChange24h)}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function PlatformRankings({ title, apps, platform }: { 
  title: string
  apps: TopAppData[]
  platform: 'apple' | 'google'
}) {
  const cryptoApps = apps.filter(app => app.isCrypto)
  
  const getPlatformIcon = () => {
    if (platform === 'apple') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
          <path d="M3.609 1.814L13.792 12.001 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a.996.996 0 0 1 0 1.73l-2.808 1.626L15.698 12l2-2.491zM5.864 2.658L16.803 8.99l-2.302 2.302-8.637-8.634z"/>
        </svg>
      )
    }
  }
  
  return (
    <Card className="border-0 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getPlatformIcon()}
              <span>{title}</span>
            </div>
            <div className="text-xs text-muted-foreground font-normal">
              Finance Category | US Region
            </div>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {cryptoApps.length} crypto apps
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {apps.slice(0, 25).map((app, index) => (
            <AppRow key={app.appId} app={app} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TopAppsRankings({ appleApps, googleApps, isLoading }: TopAppsRankingsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((index) => (
          <Card key={index} className="border-0 bg-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                <div className="w-32 h-6 bg-muted rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                    <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-muted rounded animate-pulse mb-1" />
                      <div className="w-32 h-3 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <PlatformRankings 
        title="App Store" 
        apps={appleApps} 
        platform="apple"
      />
      <PlatformRankings 
        title="Google Play" 
        apps={googleApps} 
        platform="google"
      />
    </div>
  )
}