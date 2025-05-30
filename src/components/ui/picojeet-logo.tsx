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
        accent: 'currentColor',
        sell: 'currentColor'
      }
    : {
        primary: '#8b5cf6', // Purple primary
        secondary: '#f97316', // Orange accent
        accent: '#22c55e',    // Green for gains
        sell: '#ef4444'       // Red for sell indicator
      }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="chartGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        
        <path 
          d="M 6 32 L 10 28 L 12 30 L 16 24 L 18 26 L 22 18 L 24 20 L 28 10 L 30 12 L 34 22 L 36 28" 
          stroke="url(#chartGradient)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />
        
        <g>
          <circle cx="28" cy="10" r="6" fill="black" opacity="0.1" transform="translate(0.5, 0.5)" />
          <circle cx="28" cy="10" r="6" fill="#ef4b89" />
          <circle cx="28" cy="10" r="5.2" fill="none" stroke="#8b5cf6" strokeWidth="0.7" opacity="0.7" />
          <text 
            x="28" 
            y="13" 
            textAnchor="middle" 
            fontSize="8" 
            fontWeight="600" 
            fill="white" 
            fontFamily="Outfit, sans-serif"
          >
            S
          </text>
        </g>
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