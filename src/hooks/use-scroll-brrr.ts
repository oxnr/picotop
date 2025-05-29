'use client'

import { useState, useEffect, useRef } from 'react'

interface BrrrVideo {
  id: string
  side: 'left' | 'right'
  position: number // percentage from top
  visible: boolean
}

export function useScrollBrrr() {
  const [videos, setVideos] = useState<BrrrVideo[]>([])
  const lastScrollY = useRef(0)
  const videoCounter = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)
      
      // Trigger video spawn on significant scroll movement
      if (scrollDelta > 200) {
        // Random chance to spawn a video (30% chance)
        if (Math.random() < 0.3) {
          const newVideo: BrrrVideo = {
            id: `brrr-${videoCounter.current++}`,
            side: Math.random() > 0.5 ? 'left' : 'right',
            position: Math.random() * 70 + 15, // 15% to 85% from top
            visible: true
          }
          
          setVideos(prev => [...prev, newVideo])
          
          // Remove video after 3 seconds
          setTimeout(() => {
            setVideos(prev => prev.filter(v => v.id !== newVideo.id))
          }, 3000)
        }
        
        lastScrollY.current = currentScrollY
      }
      
      // Cleanup old videos periodically
      setVideos(prev => prev.filter(v => v.visible))
    }

    // Throttle scroll events
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  return videos
}