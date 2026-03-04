'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Import CSS for photo-sphere-viewer and plugins
import 'react-photo-sphere-viewer/dist/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import '@photo-sphere-viewer/virtual-tour-plugin/index.css'

const ReactPhotoSphereViewer = dynamic(
  () => import('react-photo-sphere-viewer').then((mod) => mod.ReactPhotoSphereViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-secondary-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-500">Загрузка компонента...</p>
        </div>
      </div>
    )
  }
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
    console.log('Tour360Viewer mounted', { hasImageUrl: !!imageUrl, hasTourConfig: !!tourConfig })
    setMounted(true)
    
    // Only load plugins if we have a valid tour config with nodes
    if (tourConfig && tourConfig.nodes && tourConfig.nodes.length > 0) {
      console.log('Loading tour plugins for', tourConfig.nodes.length, 'nodes')
      Promise.all([
        import('@photo-sphere-viewer/virtual-tour-plugin'),
        import('@photo-sphere-viewer/markers-plugin')
      ]).then(([vtMod, markersMod]) => {
        console.log('Tour plugins loaded successfully')
        setVirtualTourPlugin(() => vtMod.VirtualTourPlugin)
        setMarkersPlugin(() => markersMod.MarkersPlugin)
      }).catch(err => {
        console.error('Failed to load tour plugins:', err)
      })
    } else {
      console.log('No tour config, using simple image mode')
    }
  }, [tourConfig, imageUrl])

  // Show loading only if not mounted yet, or if we need plugins but they're not loaded
  const needsPlugins = tourConfig && tourConfig.nodes && tourConfig.nodes.length > 0
  const pluginsReady = !needsPlugins || (VirtualTourPlugin && MarkersPlugin)
  
  console.log('Render state:', { mounted, needsPlugins, pluginsReady, hasVT: !!VirtualTourPlugin, hasMarkers: !!MarkersPlugin })
  
  if (!mounted) {
    console.log('Waiting for mount...')
    return (
      <div className="w-full h-full min-h-[400px] bg-secondary-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-500">Инициализация...</p>
        </div>
      </div>
    )
  }
  
  if (!pluginsReady) {
    console.log('Waiting for plugins...')
    return (
      <div className="w-full h-full min-h-[400px] bg-secondary-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-500">Загрузка плагинов...</p>
        </div>
      </div>
    )
  }

  const plugins = needsPlugins && VirtualTourPlugin && MarkersPlugin ? [
    [MarkersPlugin, {}],
    [VirtualTourPlugin, {
      positionMode: 'manual',
      renderMode: '3d',
      nodes: tourConfig.nodes,
      startNodeId: tourConfig.startNodeId || tourConfig.nodes[0]?.id
    }]
  ] : []

  // Determine the source: use tour config if available, otherwise use imageUrl
  const src = (tourConfig && tourConfig.nodes && tourConfig.nodes.length > 0) 
    ? tourConfig.nodes[0]?.panorama 
    : (imageUrl || '')
  
  console.log('Source determined:', src)
    
  if (!src) {
    console.error('No source available for 360 viewer')
    return (
      <div className="w-full h-full min-h-[400px] bg-secondary-100 rounded-xl flex items-center justify-center">
        <p className="text-sm text-secondary-500">Нет доступного изображения для просмотра</p>
      </div>
    )
  }
  
  console.log('Rendering ReactPhotoSphereViewer with src:', src)

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
