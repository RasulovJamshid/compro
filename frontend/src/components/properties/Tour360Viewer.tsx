'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import '@photo-sphere-viewer/virtual-tour-plugin/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'

const ReactPhotoSphereViewer = dynamic(
  () => import('react-photo-sphere-viewer').then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false }
)

interface VirtualTourNode {
  id: string
  panorama: string
  name?: string
  links?: {
    nodeId: string
    position: { pitch: number; yaw: number }
  }[]
  markers?: any[]
}

interface Tour360ViewerProps {
  imageUrl?: string // For single image mode
  title?: string
  tourConfig?: {
    nodes: VirtualTourNode[]
    startNodeId?: string
  }
}

export default function Tour360Viewer({ 
  imageUrl, 
  title = '360° Тур', 
  tourConfig
}: Tour360ViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [VirtualTourPlugin, setVirtualTourPlugin] = useState<any>(null)
  const [MarkersPlugin, setMarkersPlugin] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    if (tourConfig) {
      Promise.all([
        import('@photo-sphere-viewer/virtual-tour-plugin'),
        import('@photo-sphere-viewer/markers-plugin')
      ]).then(([vtMod, markersMod]) => {
        setVirtualTourPlugin(() => vtMod.VirtualTourPlugin)
        setMarkersPlugin(() => markersMod.MarkersPlugin)
      })
    }
  }, [tourConfig])

  if (!mounted || (tourConfig && (!VirtualTourPlugin || !MarkersPlugin))) {
    return (
      <div className="w-full h-full min-h-[400px] bg-secondary-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-500">Загрузка 360° тура...</p>
        </div>
      </div>
    )
  }

  const plugins = tourConfig && VirtualTourPlugin && MarkersPlugin ? [
    [MarkersPlugin, {}],
    [VirtualTourPlugin, {
      positionMode: 'manual',
      renderMode: '3d',
      nodes: tourConfig.nodes,
      startNodeId: tourConfig.startNodeId || tourConfig.nodes[0]?.id
    }]
  ] : []

  // Ensure we have either a tour config or a single image
  const src = tourConfig ? tourConfig.nodes[0]?.panorama : (imageUrl || '')
  if (!src && !tourConfig) return null

  return (
    <div className="relative w-full h-full">
      {/* 360 Viewer - Optimized for Mobile */}
      <ReactPhotoSphereViewer
        src={src}
        height="100%"
        width="100%"
        container=""
        plugins={plugins as any}
        navbar={[
          'zoom',
          'fullscreen',
        ]}
        defaultZoomLvl={50}
        fisheye={false}
        mousewheel={true}
        mousemove={true}
        keyboard={true}
        loadingTxt="Загрузка..."
        touchmoveTwoFingers={false}
      />
    </div>
  )
}
