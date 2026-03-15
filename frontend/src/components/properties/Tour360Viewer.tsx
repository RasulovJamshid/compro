'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw, ZoomIn, ZoomOut, Navigation, Layers, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'

import 'react-photo-sphere-viewer/dist/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'
import '@photo-sphere-viewer/virtual-tour-plugin/index.css'

const ReactPhotoSphereViewer = dynamic(
  () => import('react-photo-sphere-viewer').then((mod) => mod.ReactPhotoSphereViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-secondary-900 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-secondary-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
        </div>
      </div>
    )
  }
)

interface VirtualTourNode {
  id: string
  panorama: string
  name?: string
  caption?: string
  links?: {
    nodeId: string
    position: { pitch: number; yaw: number }
  }[]
  markers?: any[]
}

interface Tour360ViewerProps {
  imageUrl?: string
  title?: string
  tourConfig?: {
    nodes: VirtualTourNode[]
    startNodeId?: string
  }
}

const getMockTourData = (t: any): VirtualTourNode[] => [
  {
    id: 'node-1',
    panorama: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    name: t('lobby'),
    caption: t('lobbyDesc'),
    links: [
      { nodeId: 'node-2', position: { yaw: 0, pitch: 0 } },
      { nodeId: 'node-3', position: { yaw: Math.PI / 2, pitch: 0 } }
    ]
  },
  {
    id: 'node-2',
    panorama: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
    name: t('openSpace'),
    caption: t('openSpaceDesc'),
    links: [
      { nodeId: 'node-1', position: { yaw: Math.PI, pitch: 0 } },
      { nodeId: 'node-4', position: { yaw: -Math.PI / 4, pitch: 0 } }
    ]
  },
  {
    id: 'node-3',
    panorama: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2069&auto=format&fit=crop',
    name: t('meetingRoom'),
    caption: t('meetingRoomDesc'),
    links: [
      { nodeId: 'node-1', position: { yaw: -Math.PI / 2, pitch: 0 } }
    ]
  },
  {
    id: 'node-4',
    panorama: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2069&auto=format&fit=crop',
    name: t('kitchen'),
    caption: t('kitchenDesc'),
    links: [
      { nodeId: 'node-2', position: { yaw: Math.PI * 0.75, pitch: 0 } },
      { nodeId: 'node-5', position: { yaw: 0, pitch: 0 } }
    ]
  },
  {
    id: 'node-5',
    panorama: 'https://images.unsplash.com/photo-1558442074-3c19857bc1dc?q=80&w=2069&auto=format&fit=crop',
    name: t('terrace'),
    caption: t('terraceDesc'),
    links: [
      { nodeId: 'node-4', position: { yaw: Math.PI, pitch: 0 } }
    ]
  }
]

const FALLBACK_360_IMAGE = 'https://cdn.jsdelivr.net/gh/mpetroff/pannellum@2.5.6/examples/examplepano.jpg'

export default function Tour360Viewer({ 
  imageUrl, 
  title, 
  tourConfig
}: Tour360ViewerProps) {
  const tTour = useTranslations('Tour360')
  const MOCK_TOUR_DATA = getMockTourData(tTour)

  const [mounted, setMounted] = useState(false)
  const [VirtualTourPlugin, setVirtualTourPlugin] = useState<any>(null)
  const [MarkersPlugin, setMarkersPlugin] = useState<any>(null)
  const [imageSrc, setImageSrc] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [currentNode, setCurrentNode] = useState<string>('')
  const [showRoomList, setShowRoomList] = useState(false)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef<any>(null)

  // Determine active tour config (use sample if none provided)
  const activeTourConfig = (tourConfig && tourConfig.nodes && tourConfig.nodes.length > 0) 
    ? tourConfig 
    : { nodes: MOCK_TOUR_DATA, startNodeId: 'node-1' }

  const hasTour = activeTourConfig.nodes.length > 1
  const usingSample = !tourConfig || !tourConfig.nodes || tourConfig.nodes.length === 0

  useEffect(() => {
    setMounted(true)
    const startId = activeTourConfig.startNodeId || activeTourConfig.nodes[0]?.id || ''
    setCurrentNode(startId)

    if (hasTour) {
      const initialSrc = activeTourConfig.nodes[0]?.panorama || FALLBACK_360_IMAGE
      setImageSrc(initialSrc)

      Promise.all([
        import('@photo-sphere-viewer/virtual-tour-plugin'),
        import('@photo-sphere-viewer/markers-plugin')
      ]).then(([vtMod, markersMod]) => {
        setVirtualTourPlugin(() => vtMod.VirtualTourPlugin)
        setMarkersPlugin(() => markersMod.MarkersPlugin)
      }).catch(err => {
        console.error('Failed to load tour plugins:', err)
        setImageSrc(imageUrl || FALLBACK_360_IMAGE)
      })
    } else {
      setImageSrc(imageUrl || FALLBACK_360_IMAGE)
    }
  }, [tourConfig, imageUrl])

  const navigateToNode = useCallback((nodeId: string) => {
    setCurrentNode(nodeId)
    setShowRoomList(false)
    if (viewerRef.current) {
      try {
        const vtPlugin = viewerRef.current.getPlugin('virtual-tour')
        if (vtPlugin) {
          vtPlugin.setCurrentNode(nodeId)
        }
      } catch (e) {
        // Fallback: update image directly
        const node = activeTourConfig.nodes.find(n => n.id === nodeId)
        if (node) setImageSrc(node.panorama)
      }
    }
  }, [activeTourConfig])

  const currentNodeData = activeTourConfig.nodes.find(n => n.id === currentNode)
  const currentIndex = activeTourConfig.nodes.findIndex(n => n.id === currentNode)

  const goNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % activeTourConfig.nodes.length
    navigateToNode(activeTourConfig.nodes[nextIdx].id)
  }, [currentIndex, activeTourConfig, navigateToNode])

  const goPrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + activeTourConfig.nodes.length) % activeTourConfig.nodes.length
    navigateToNode(activeTourConfig.nodes[prevIdx].id)
  }, [currentIndex, activeTourConfig, navigateToNode])

  const needsPlugins = hasTour
  const pluginsReady = !needsPlugins || (VirtualTourPlugin && MarkersPlugin)
  
  if (!mounted || !pluginsReady) {
    return (
      <div className="w-full h-full bg-secondary-900 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-secondary-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-400">{tTour('initTour')}</p>
        </div>
      </div>
    )
  }

  const plugins = needsPlugins && VirtualTourPlugin && MarkersPlugin ? [
    [MarkersPlugin, {}],
    [VirtualTourPlugin, {
      positionMode: 'manual',
      renderMode: '3d',
      nodes: activeTourConfig.nodes,
      startNodeId: activeTourConfig.startNodeId || activeTourConfig.nodes[0]?.id,
      linksOnCompass: true,
    }]
  ] : []

  return (
    <div className="relative w-full h-full bg-secondary-950 select-none">
      {/* Sample tour badge */}
      {usingSample && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
          <Eye className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium">{tTour('demoTour')}</span>
        </div>
      )}

      {/* Room navigation sidebar (desktop) / bottom sheet (mobile) */}
      {hasTour && showRoomList && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-20 sm:hidden" onClick={() => setShowRoomList(false)} />
          
          {/* Room list panel */}
          <div className="absolute z-30 bottom-16 left-3 right-3 sm:bottom-auto sm:top-3 sm:left-3 sm:right-auto sm:w-64 bg-secondary-950/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-400" />
                {tTour('rooms')} ({activeTourConfig.nodes.length})
              </h4>
            </div>
            <div className="max-h-[240px] sm:max-h-[320px] overflow-y-auto">
              {activeTourConfig.nodes.map((node, idx) => (
                <button
                  key={node.id}
                  onClick={() => navigateToNode(node.id)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                    currentNode === node.id 
                      ? 'bg-primary-600/20 text-primary-300' 
                      : 'text-secondary-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    currentNode === node.id ? 'bg-primary-600 text-white' : 'bg-white/10 text-secondary-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{node.name || `${tTour('room')} ${idx + 1}`}</p>
                    {node.caption && (
                      <p className="text-[11px] text-secondary-500 truncate">{node.caption}</p>
                    )}
                  </div>
                  {currentNode === node.id && (
                    <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 360 Viewer */}
      <ReactPhotoSphereViewer
        src={imageSrc}
        height="100%"
        width="100%"
        container=""
        plugins={plugins as any}
        navbar={false}
        defaultZoomLvl={50}
        fisheye={false}
        mousewheel={true}
        mousemove={true}
        keyboard={true}
        loadingTxt=""
        touchmoveTwoFingers={false}
        moveSpeed={1.2}
        zoomSpeed={1.5}
        onReady={(instance: any) => {
          viewerRef.current = instance
          setLoading(false)
        }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 bg-secondary-950/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-900 border-t-primary-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-secondary-400">{tTour('initTour')}</p>
          </div>
        </div>
      )}

      {/* Bottom controls bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Current room indicator + nav arrows */}
        {hasTour && (
          <div className="flex items-center justify-center gap-2 px-3 pb-2">
            <button
              onClick={goPrev}
              className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full transition-all active:scale-90 touch-manipulation"
              aria-label={tTour('prevRoom')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 min-w-0">
              <Navigation className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium truncate max-w-[160px] sm:max-w-[240px]">
                {currentNodeData?.name || tTour('room')}
              </span>
              <span className="text-secondary-400 text-xs flex-shrink-0">
                {currentIndex + 1}/{activeTourConfig.nodes.length}
              </span>
            </div>

            <button
              onClick={goNext}
              className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full transition-all active:scale-90 touch-manipulation"
              aria-label={tTour('nextRoom')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          {/* Left: room list toggle */}
          <div className="flex items-center gap-1.5">
            {hasTour && (
              <button
                onClick={() => setShowRoomList(!showRoomList)}
                className={`p-2 rounded-xl transition-all active:scale-90 touch-manipulation ${
                  showRoomList ? 'bg-primary-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label={tTour('roomList')}
              >
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Center: caption */}
          {currentNodeData?.caption && (
            <p className="text-secondary-300 text-xs sm:text-sm hidden sm:block truncate max-w-xs">
              {currentNodeData.caption}
            </p>
          )}

          {/* Right: zoom + fullscreen */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => viewerRef.current?.zoom(viewerRef.current.getZoomLevel() + 20)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-90 touch-manipulation"
              aria-label={tTour('zoomIn')}
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => viewerRef.current?.zoom(viewerRef.current.getZoomLevel() - 20)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-90 touch-manipulation"
              aria-label={tTour('zoomOut')}
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => viewerRef.current?.toggleFullscreen()}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-90 touch-manipulation"
              aria-label={tTour('fullscreen')}
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile touch hint (shown briefly) */}
      <MobileTouchHint t={tTour} />
    </div>
  )
}

function MobileTouchHint({ t }: { t: any }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none sm:hidden">
      <div className="bg-black/70 backdrop-blur-sm text-white px-5 py-3 rounded-2xl text-center animate-pulse">
        <div className="flex justify-center mb-2">
          <RotateCcw className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">{t('swipeForView')}</p>
        <p className="text-xs text-secondary-400 mt-1">{t('pinchToZoom')}</p>
      </div>
    </div>
  )
}
