'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { X, Maximize2, Minimize2 } from 'lucide-react'

const ReactPhotoSphereViewer = dynamic(
  () => import('react-photo-sphere-viewer').then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false }
)

interface Tour360ViewerProps {
  imageUrl: string
  title?: string
  onClose?: () => void
  isFullscreen?: boolean
}

export default function Tour360Viewer({ 
  imageUrl, 
  title = '360° Тур', 
  onClose,
  isFullscreen = false 
}: Tour360ViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [fullscreen, setFullscreen] = useState(isFullscreen)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  if (!mounted) {
    return (
      <div className="w-full h-full bg-secondary-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-500">Загрузка 360° тура...</p>
        </div>
      </div>
    )
  }

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
        src={imageUrl}
        height={fullscreen ? '100vh' : '600px'}
        width="100%"
        container=""
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
