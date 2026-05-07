'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2,
  RotateCcw, ZoomIn, ZoomOut, Navigation, Layers, Eye,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin'
import { resolvePublicAssetUrl } from '@/lib/utils/resolvePublicAssetUrl'

import 'react-photo-sphere-viewer/dist/index.css'
import '@photo-sphere-viewer/virtual-tour-plugin/index.css'

const ReactPhotoSphereViewer = dynamic(
  () => import('react-photo-sphere-viewer').then((mod) => mod.ReactPhotoSphereViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-secondary-900 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-3 border-secondary-700 border-t-primary-500 rounded-full animate-spin mx-auto" />
      </div>
    ),
  }
)

/** Hotspot link to another tour node (angles in degrees, stored in API JSON). */
export interface TourLink {
  nodeId: string
  yawDeg: number
  pitchDeg: number
}

export interface TourNode {
  id: string
  /** Absolute or API-relative URL to the equirectangular panorama image */
  panorama: string
  name?: string
  caption?: string
  /** In-scene navigation arrows (VirtualTourPlugin). */
  links?: TourLink[]
}

export interface PanoramaTileConfig {
  id: string
  width: number
  height: number
  tileSize: number
  cols: number
  rows: number
  baseUrl: string
  basePanorama: string
}

interface Tour360ViewerProps {
  imageUrl?: string
  title?: string
  /** Multi-room tour — each node has a panorama URL already resolved */
  tourConfig?: { nodes: TourNode[]; startNodeId?: string }
  /** Single-room tiled panorama */
  tileConfig?: PanoramaTileConfig
}

// ─── mock data ────────────────────────────────────────────────────────────────

const getMockNodes = (t: any): TourNode[] => [
  {
    id: 'node-1',
    panorama: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    name: t('lobby'), caption: t('lobbyDesc'),
    links: [{ nodeId: 'node-2', yawDeg: 35, pitchDeg: 0 }],
  },
  {
    id: 'node-2',
    panorama: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
    name: t('openSpace'), caption: t('openSpaceDesc'),
    links: [
      { nodeId: 'node-1', yawDeg: -120, pitchDeg: 0 },
      { nodeId: 'node-3', yawDeg: 55, pitchDeg: -5 },
    ],
  },
  {
    id: 'node-3',
    panorama: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2069&auto=format&fit=crop',
    name: t('meetingRoom'), caption: t('meetingRoomDesc'),
    links: [
      { nodeId: 'node-2', yawDeg: -80, pitchDeg: 0 },
      { nodeId: 'node-4', yawDeg: 40, pitchDeg: 0 },
    ],
  },
  {
    id: 'node-4',
    panorama: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2069&auto=format&fit=crop',
    name: t('kitchen'), caption: t('kitchenDesc'),
    links: [
      { nodeId: 'node-3', yawDeg: -95, pitchDeg: 0 },
      { nodeId: 'node-5', yawDeg: 70, pitchDeg: -8 },
    ],
  },
  {
    id: 'node-5',
    panorama: 'https://images.unsplash.com/photo-1558442074-3c19857bc1dc?q=80&w=2069&auto=format&fit=crop',
    name: t('terrace'), caption: t('terraceDesc'),
    links: [{ nodeId: 'node-4', yawDeg: -60, pitchDeg: 5 }],
  },
]

const FALLBACK = 'https://cdn.jsdelivr.net/gh/mpetroff/pannellum@2.5.6/examples/examplepano.jpg'
const HIDE_DELAY = 4000

function resolveUrl(path: string): string {
  return resolvePublicAssetUrl(path)
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** PSV VirtualTour nodes with spherical link positions in radians. */
function buildVirtualTourPluginNodes(nodes: TourNode[]) {
  const ids = new Set(nodes.map((n) => n.id))
  return nodes.map((n) => ({
    id: n.id,
    panorama: resolveUrl(n.panorama),
    name: n.name,
    caption: n.caption,
    links: (n.links ?? [])
      .filter((l) => ids.has(l.nodeId))
      .map((l) => {
        const yaw = degToRad(l.yawDeg)
        const pitch = degToRad(l.pitchDeg)
        return {
          nodeId: l.nodeId,
          /** Top-level + position — VirtualTourLink extends ExtendedPosition */
          yaw,
          pitch,
          position: { yaw, pitch },
        }
      }),
  }))
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Tour360Viewer({ imageUrl, tourConfig, tileConfig }: Tour360ViewerProps) {
  const t = useTranslations('Tour360')

  // Resolve the active node list
  const hasRealTour = !!(tourConfig?.nodes && tourConfig.nodes.length > 0)
  const hasRealContent = !!tileConfig || !!imageUrl || hasRealTour
  const usingSample = !hasRealContent

  const nodes: TourNode[] = hasRealTour
    ? tourConfig!.nodes
    : usingSample
    ? getMockNodes(t)
    : []

  const hasTour = nodes.length > 1
  const vtPluginNodes = useMemo(() => buildVirtualTourPluginNodes(nodes), [nodes])
  const useVirtualTourPlugin = hasTour

  const viewerPlugins = useMemo(() => {
    if (!useVirtualTourPlugin) return []
    const startId =
      tourConfig?.startNodeId && vtPluginNodes.some((n) => n.id === tourConfig.startNodeId)
        ? tourConfig.startNodeId
        : vtPluginNodes[0]!.id
    return [
      [
        VirtualTourPlugin,
        {
          nodes: vtPluginNodes,
          startNodeId: startId,
          positionMode: 'manual',
          renderMode: '3d',
          /** Default minPitch (~17°) hides arrows placed near the horizon (e.g. pitch 10°). */
          arrowsPosition: {
            minPitch: 0,
            maxPitch: Math.PI / 2 - 0.02,
            linkOverlapAngle: Math.PI / 4,
          },
          showLinkTooltip: true,
          transitionOptions: {
            showLoader: false,
            speed: '20rpm',
            effect: 'fade',
            rotation: true,
          },
        },
      ],
    ] as [typeof VirtualTourPlugin, Record<string, unknown>][]
  }, [useVirtualTourPlugin, vtPluginNodes, tourConfig?.startNodeId])

  // ─── state ──────────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [currentNodeId, setCurrentNodeId] = useState('')
  const [showRoomList, setShowRoomList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)

  const viewerRef = useRef<any>(null)
  const viewerReadyRef = useRef(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── controls auto-hide ─────────────────────────────────────────────────────
  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setControlsVisible(false), HIDE_DELAY)
  }, [])

  const revealControls = useCallback(() => {
    setControlsVisible(true)
    scheduleHide()
  }, [scheduleHide])

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current) }, [])

  // ─── fullscreen ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => {
      const fs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
      setIsFullscreen(fs)
      if (fs) {
        document.body.classList.add('tour-fullscreen')
        setShowRoomList(false)
        revealControls()
      } else {
        document.body.classList.remove('tour-fullscreen')
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
      document.body.classList.remove('tour-fullscreen')
    }
  }, [revealControls])

  // ─── initialise panorama source ─────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let src = ''
    let startId = ''

    if (hasTour) {
      startId =
        tourConfig?.startNodeId && nodes.some((n) => n.id === tourConfig.startNodeId)
          ? tourConfig.startNodeId
          : nodes[0]?.id || ''
      src = resolveUrl(nodes.find((n) => n.id === startId)?.panorama || nodes[0]?.panorama || FALLBACK)
    } else if (tileConfig) {
      src = resolveUrl(tileConfig.basePanorama)
    } else if (imageUrl) {
      src = resolveUrl(imageUrl)
    } else {
      src = FALLBACK
    }

    setImageSrc(src)
    setCurrentNodeId(startId || nodes[0]?.id || '')
    setLoading(true)
    viewerReadyRef.current = false
  }, [mounted, hasTour, tileConfig, imageUrl, tourConfig?.startNodeId, nodes])

  // ─── navigation ─────────────────────────────────────────────────────────────
  const navigateToNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      setCurrentNodeId(nodeId)
      setShowRoomList(false)
      revealControls()
      const viewer = viewerRef.current
      if (viewer && viewerReadyRef.current && useVirtualTourPlugin) {
        const vt = viewer.getPlugin(VirtualTourPlugin) as InstanceType<typeof VirtualTourPlugin> | undefined
        if (vt) {
          void vt.setCurrentNode(nodeId, { showLoader: false })
          return
        }
      }
      const url = resolveUrl(node.panorama)
      if (viewer && viewerReadyRef.current) {
        viewer.setPanorama(url, { showLoader: false, transition: 1500 }).catch(() => {})
      } else {
        setImageSrc(url)
      }
    },
    [nodes, revealControls, useVirtualTourPlugin],
  )

  const currentIndex = nodes.findIndex(n => n.id === currentNodeId)
  const currentNode = nodes[currentIndex]

  const goNext = useCallback(() => {
    const next = nodes[(currentIndex + 1) % nodes.length]
    if (next) navigateToNode(next.id)
  }, [currentIndex, nodes, navigateToNode])

  const goPrev = useCallback(() => {
    const prev = nodes[(currentIndex - 1 + nodes.length) % nodes.length]
    if (prev) navigateToNode(prev.id)
  }, [currentIndex, nodes, navigateToNode])

  // ─── zoom / fullscreen ──────────────────────────────────────────────────────
  const handleZoom = useCallback((delta: number) => {
    if (!viewerRef.current) return
    try {
      const cur = viewerRef.current.getZoomLevel?.() ?? 50
      viewerRef.current.zoom(Math.max(0, Math.min(100, cur + delta)))
    } catch {}
  }, [])

  const handleFullscreen = useCallback(() => {
    try { viewerRef.current?.toggleFullscreen() } catch {}
  }, [])

  // Remount when tour graph or panoramas change so VirtualTourPlugin picks up new nodes.
  const viewerKey = useMemo(() => {
    if (hasTour) {
      return `tour-${vtPluginNodes.map((n) => `${n.id}:${n.panorama}:${JSON.stringify(n.links)}`).join('|')}`
    }
    return imageSrc || 'single'
  }, [hasTour, vtPluginNodes, imageSrc])

  // ─── loading gate ────────────────────────────────────────────────────────────
  if (!mounted || !imageSrc) {
    return (
      <div className="w-full h-full bg-secondary-900 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-secondary-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-secondary-400">{t('initTour')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-secondary-950 select-none" onPointerDown={revealControls}>

      {/* Demo badge */}
      {usingSample && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
          <span className="text-xs font-medium">{t('demoTour')}</span>
        </div>
      )}

      {/* Room list panel */}
      {hasTour && showRoomList && (
        <>
          <div className="absolute inset-0 z-20" onClick={() => setShowRoomList(false)} />
          <div className="absolute z-30 bottom-[4.5rem] left-3 right-3 sm:bottom-auto sm:top-3 sm:left-3 sm:right-auto sm:w-64 bg-secondary-950/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-400" />
                {t('rooms')} ({nodes.length})
              </h4>
            </div>
            <div className="max-h-[50vh] sm:max-h-[340px] overflow-y-auto overscroll-contain">
              {nodes.map((node, idx) => (
                <button
                  key={node.id}
                  onClick={() => navigateToNode(node.id)}
                  className={`w-full text-left px-3 py-3 flex items-center gap-3 transition-colors active:bg-white/10 ${
                    currentNodeId === node.id
                      ? 'bg-primary-600/20 text-primary-300'
                      : 'text-secondary-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    currentNodeId === node.id ? 'bg-primary-600 text-white' : 'bg-white/10 text-secondary-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{node.name || `${t('room')} ${idx + 1}`}</p>
                    {node.caption && (
                      <p className="text-[11px] text-secondary-500 truncate">{node.caption}</p>
                    )}
                  </div>
                  {currentNodeId === node.id && (
                    <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PSV viewer */}
      <ReactPhotoSphereViewer
        key={viewerKey}
        src={imageSrc as any}
        height="100%"
        width="100%"
        container=""
        plugins={viewerPlugins}
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
          viewerReadyRef.current = true
          setLoading(false)
          scheduleHide()
          if (useVirtualTourPlugin) {
            const vt = instance.getPlugin(VirtualTourPlugin) as InstanceType<typeof VirtualTourPlugin> | undefined
            vt?.addEventListener('node-changed', (e: { node: { id: string } }) => {
              setCurrentNodeId(e.node.id)
            })
          }
        }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 bg-secondary-950/80 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-900 border-t-primary-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-secondary-400">{t('initTour')}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 safe-area-bottom ${
        controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>

        {/* Room nav row */}
        {hasTour && (
          <div className="flex items-center justify-center gap-2 px-3 pb-1.5">
            <button
              onClick={goPrev}
              className="p-2.5 bg-black/60 backdrop-blur-sm text-white rounded-full transition-all active:scale-90 touch-manipulation"
              aria-label={t('prevRoom')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 min-w-0 max-w-[200px] sm:max-w-sm">
              <Navigation className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium truncate">
                {currentNode?.name || `${t('room')} ${currentIndex + 1}`}
              </span>
              <span className="text-secondary-400 text-xs flex-shrink-0">
                {currentIndex + 1}/{nodes.length}
              </span>
            </div>

            <button
              onClick={goNext}
              className="p-2.5 bg-black/60 backdrop-blur-sm text-white rounded-full transition-all active:scale-90 touch-manipulation"
              aria-label={t('nextRoom')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          {/* Left */}
          <div className="flex items-center gap-1.5">
            {hasTour && (
              <button
                onClick={() => setShowRoomList(v => !v)}
                className={`p-2.5 rounded-xl transition-all active:scale-90 touch-manipulation ${
                  showRoomList ? 'bg-primary-600 text-white' : 'bg-white/10 text-white'
                }`}
                aria-label={t('roomList')}
              >
                <Layers className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Center caption — desktop only */}
          {currentNode?.caption && (
            <p className="text-secondary-300 text-xs hidden sm:block truncate max-w-xs px-2">
              {currentNode.caption}
            </p>
          )}

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleZoom(20)}
              className="hidden sm:flex p-2.5 bg-white/10 text-white rounded-xl transition-all active:scale-90 touch-manipulation items-center justify-center"
              aria-label={t('zoomIn')}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom(-20)}
              className="hidden sm:flex p-2.5 bg-white/10 text-white rounded-xl transition-all active:scale-90 touch-manipulation items-center justify-center"
              aria-label={t('zoomOut')}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2.5 bg-white/10 text-white rounded-xl transition-all active:scale-90 touch-manipulation"
              aria-label={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile swipe hint */}
      <MobileTouchHint t={t} />
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
      <div className="bg-black/70 backdrop-blur-sm text-white px-5 py-3 rounded-2xl text-center">
        <div className="flex justify-center mb-2">
          <RotateCcw className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">{t('swipeForView')}</p>
        <p className="text-xs text-secondary-400 mt-1">{t('pinchToZoom')}</p>
      </div>
    </div>
  )
}
