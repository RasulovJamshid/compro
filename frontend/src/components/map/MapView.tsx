'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Property } from '@/lib/types'

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import('./Map'), { ssr: false })

interface MapViewProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (property: Property) => void
  onBoundsChange?: (bounds: any, center: [number, number], zoom: number) => void
  selectedPropertyId?: string
}

export default function MapView({ 
  properties, 
  center = [41.2995, 69.2401], // Tashkent center
  zoom = 12,
  onMarkerClick,
  onBoundsChange,
  selectedPropertyId
}: MapViewProps) {
  const [mounted, setMounted] = useState(false)
  // We don't freeze props anymore, we pass them through.
  // If parent component maintains state, it will pass correct values.
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Загрузка карты...</p>
      </div>
    )
  }

  return (
    <Map 
      properties={properties}
      center={center}
      zoom={zoom}
      onMarkerClick={onMarkerClick}
      onBoundsChange={onBoundsChange}
      selectedPropertyId={selectedPropertyId}
    />
  )
}
