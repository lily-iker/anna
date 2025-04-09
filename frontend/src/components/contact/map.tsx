'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface MapProps {
  address: string
  height?: string
}

export default function Map({ address, height = '400px' }: MapProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // This would be where you'd initialize a map library like Google Maps or Leaflet
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="overflow-hidden">
      {!isLoaded ? (
        <div className="w-full bg-gray-200 flex items-center justify-center" style={{ height }}>
          <div className="animate-pulse">Đang tải bản đồ...</div>
        </div>
      ) : (
        <div className="w-full bg-gray-200 flex items-center justify-center" style={{ height }}>
          <p className="text-xl font-bold text-gray-800">Bản đồ: {address}</p>
          {/* In a real implementation, you would render your map here */}
        </div>
      )}
    </Card>
  )
}
