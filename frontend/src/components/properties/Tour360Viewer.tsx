'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { X, Maximize2, Minimize2 } from 'lucide-react'

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
  onClose?: () => void
  isFullscreen?: boolean
  tourConfig?: {
    nodes: VirtualTourNode[]
    startNodeId?: string
  }
}

export default function Tour360Viewer({ 
  imageUrl, 
  title = '360° Тур', 
  onClose,
  isFullscreen = false,
  tourConfig
}: Tour360ViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [fullscreen, setFullscreen] = useState(isFullscreen)
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

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

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
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'}`}>
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
              title={fullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
            >
              {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 360 Viewer */}
      <ReactPhotoSphereViewer
        src={src}
        height={fullscreen ? '100vh' : '600px'}
        width="100%"
        container=""
        plugins={plugins as any}
        navbar={[
          'zoom',
          'move',
          'download',
          'description',
          'caption',
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

      {/* Instructions Overlay (only show initially) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm pointer-events-none">
        Используйте мышь или сенсорный экран для навигации
      </div>
    </div>
  )
}
