'use client'

import { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Crosshair, X } from 'lucide-react'

import 'react-photo-sphere-viewer/dist/index.css'

const ReactPhotoSphereViewer = dynamic(
  () =>
    import('react-photo-sphere-viewer').then((mod) => mod.ReactPhotoSphereViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(50vh,320px)] w-full bg-secondary-900 rounded-lg flex items-center justify-center text-secondary-400 text-sm">
        Загрузка просмотра…
      </div>
    ),
  },
)

/** PSV click event: radians in data.yaw / data.pitch */
function yawPitchDegFromViewerClick(evt: unknown): {
  yawDeg: number
  pitchDeg: number
} | null {
  const e = evt as { data?: { yaw?: number; pitch?: number } }
  const d = e.data
  if (!d || typeof d.yaw !== 'number' || typeof d.pitch !== 'number') return null
  return {
    yawDeg: Math.round(((d.yaw * 180) / Math.PI) * 10) / 10,
    pitchDeg: Math.round(((d.pitch * 180) / Math.PI) * 10) / 10,
  }
}

const PRESETS: { label: string; yawDeg: number; pitchDeg: number }[] = [
  { label: 'Вперёд', yawDeg: 0, pitchDeg: 0 },
  { label: 'Слева', yawDeg: -90, pitchDeg: 0 },
  { label: 'Справа', yawDeg: 90, pitchDeg: 0 },
  { label: 'Сзади', yawDeg: 180, pitchDeg: 0 },
  { label: 'Вверх', yawDeg: 0, pitchDeg: 45 },
  { label: 'Вниз', yawDeg: 0, pitchDeg: -35 },
]

export function YawPitchSliders(props: {
  yawDeg: number
  pitchDeg: number
  onChange: (next: { yawDeg: number; pitchDeg: number }) => void
  onOpenPicker: () => void
}) {
  const { yawDeg, pitchDeg, onChange, onOpenPicker } = props

  return (
    <div className="space-y-3 w-full min-w-0">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange({ yawDeg: p.yawDeg, pitchDeg: p.pitchDeg })}
            className="px-2 py-1 text-[11px] font-medium rounded-md bg-secondary-100 text-secondary-800 hover:bg-primary-100 hover:text-primary-900 border border-secondary-200"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between text-[10px] text-secondary-500 uppercase tracking-wide mb-1">
            <span>Поворот (yaw)</span>
            <span className="font-mono text-secondary-700">{Math.round(yawDeg)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={Math.max(-180, Math.min(180, yawDeg))}
            onChange={(e) =>
              onChange({ yawDeg: parseFloat(e.target.value), pitchDeg })
            }
            className="w-full h-2 accent-primary-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-secondary-500 uppercase tracking-wide mb-1">
            <span>Наклон (pitch)</span>
            <span className="font-mono text-secondary-700">{Math.round(pitchDeg)}°</span>
          </div>
          <input
            type="range"
            min={-90}
            max={90}
            step={1}
            value={Math.max(-90, Math.min(90, pitchDeg))}
            onChange={(e) =>
              onChange({ yawDeg, pitchDeg: parseFloat(e.target.value) })
            }
            className="w-full h-2 accent-primary-600"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenPicker}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          <Crosshair className="w-3.5 h-3.5" />
          Указать кликом на панораме
        </button>
        <span className="text-[10px] text-secondary-500">
          Поверните вид и нажмите на место стрелки
        </span>
      </div>
    </div>
  )
}

export function DirectionPickModal(props: {
  open: boolean
  panoramaSrc: string | null
  targetRoomLabel: string
  onClose: () => void
  onPicked: (yawDeg: number, pitchDeg: number) => void
}) {
  const { open, panoramaSrc, targetRoomLabel, onClose, onPicked } = props

  const handleClick = useCallback(
    (data: unknown) => {
      const pos = yawPitchDegFromViewerClick(data)
      if (pos) {
        onPicked(pos.yawDeg, pos.pitchDeg)
        onClose()
      }
    },
    [onPicked, onClose],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !panoramaSrc) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pick-direction-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-secondary-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-secondary-100 bg-secondary-50">
          <div>
            <h3 id="pick-direction-title" className="font-semibold text-secondary-900">
              Направление стрелки → {targetRoomLabel}
            </h3>
            <p className="text-xs text-secondary-600 mt-0.5">
              Вращайте вид мышью / пальцем, затем кликните по точке, где должна быть стрелка перехода.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-200 text-secondary-600"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative bg-secondary-950">
          <ReactPhotoSphereViewer
            src={panoramaSrc}
            height="320px"
            width="100%"
            container=""
            navbar={false}
            defaultZoomLvl={55}
            fisheye={false}
            mousewheel={true}
            mousemove={true}
            keyboard={false}
            loadingTxt=""
            touchmoveTwoFingers={false}
            plugins={[]}
            onClick={handleClick}
          />
          <div className="pointer-events-none absolute bottom-2 left-2 right-2 text-center text-[11px] text-white/90 drop-shadow-md">
            Клик по сфере сохраняет углы и закрывает окно
          </div>
        </div>
      </div>
    </div>
  )
}
