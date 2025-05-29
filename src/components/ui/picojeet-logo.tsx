'use client'

import React from 'react'

interface PicojeetLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'mono'
}

export function PicojeetLogo({ 
  className = '', 
  size = 'md',
  variant = 'default'
}: PicojeetLogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }

  const colors = variant === 'mono' 
    ? {
        primary: 'currentColor',
        secondary: 'currentColor', 
        accent: 'currentColor'
      }
    : {
        primary: '#8b5cf6', // Purple primary
        secondary: '#f97316', // Orange accent
        accent: '#22c55e'     // Green for gains
      }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.1" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="pGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          fill="url(#bgGradient)" 
          stroke={colors.primary}
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* Main P letter - bold and angular for degen vibes */}
        <path
          d="M12 10 L12 30 M12 10 L25 10 Q28 10 28 15 Q28 20 25 20 L12 20"
          stroke="url(#pGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Degen chart line going up (for gains) */}
        <path
          d="M28 25 L30 23 L32 21 L34 18 L36 15"
          stroke={colors.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        
        {/* Small dots for data points */}
        <circle cx="30" cy="23" r="1" fill={colors.accent} />
        <circle cx="34" cy="18" r="1" fill={colors.accent} />
        <circle cx="36" cy="15" r="1" fill={colors.accent} />
        
        {/* Subtle jeet arrow (down trend) */}
        <path
          d="M8 15 L6 17 L4 19"
          stroke={colors.secondary}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

export function PicojeetWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <PicojeetLogo size="md" />
      <span className="font-bold text-xl text-foreground">
        Picojeet
      </span>
    </div>
  )
}