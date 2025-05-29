'use client'

import { useEffect, useRef, useState } from 'react'

interface BrrrVideoProps {
  trigger?: boolean
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export function BrrrVideo({ trigger = false, className = '', size = 'medium' }: BrrrVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  }

  useEffect(() => {
    // Start playing immediately when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, that's ok
      })
    }
  }, [])

  useEffect(() => {
    // Pulse effect when triggered
    if (trigger) {
      setIsVisible(false)
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [trigger])

  const handleClick = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-300 hover:scale-110 ${isVisible ? 'opacity-100' : 'opacity-50'} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg opacity-80"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        style={{ 
          mixBlendMode: 'multiply',
          filter: 'brightness(1.2) contrast(1.1)'
        }}
      >
        <source src="/videos/go-brr.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
      </video>
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-yellow-400/10 rounded-lg pointer-events-none" />
    </div>
  )
}