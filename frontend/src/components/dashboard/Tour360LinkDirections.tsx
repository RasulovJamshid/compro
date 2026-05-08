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
  { label: 'Прямо', yawDeg: 0, pitchDeg: 0 },
  { label: 'Левая сторона', yawDeg: -90, pitchDeg: 0 },
  { label: 'Правая сторона', yawDeg: 90, pitchDeg: 0 },
  { label: 'Назад', yawDeg: 180, pitchDeg: 0 },
  { label: 'Выше', yawDeg: 0, pitchDeg: 35 },
  { label: 'Ниже', yawDeg: 0, pitchDeg: -25 },
]

function describeDirection(yawDeg: number, pitchDeg: number): string {
  if (pitchDeg >= 30) return 'выше центра'
  if (pitchDeg <= -30) return 'ниже центра'

  const yaw = ((yawDeg + 180) % 360) - 180
  if (yaw >= -35 && yaw <= 35) return 'перед пользователем'
  if (yaw > 35 && yaw < 135) return 'справа'
  if (yaw < -35 && yaw > -135) return 'слева'
  return 'позади'
}

export function YawPitchSliders(props: {
  yawDeg: number
  pitchDeg: number
  onChange: (next: { yawDeg: number; pitchDeg: number }) => void
  onOpenPicker: () => void
}) {
  const { yawDeg, pitchDeg, onChange, onOpenPicker } = props

  return (
    <div className="space-y-2 w-full min-w-0">
      <div className="rounded-lg border border-primary-100 bg-primary-50 p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary-900">
              Стрелка появится: {describeDirection(yawDeg, pitchDeg)}
            </p>
            <p className="text-[11px] text-primary-700 mt-0.5">
              Самый простой способ: нажмите кнопку и кликните место стрелки прямо на панораме.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPicker}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Поставить стрелку
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-secondary-200 bg-white p-2.5">
        <p className="text-[11px] font-medium text-secondary-600 mb-2">
          Быстро выбрать примерное направление
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange({ yawDeg: p.yawDeg, pitchDeg: p.pitchDeg })}
              className="px-2 py-1.5 text-[11px] font-medium rounded-md bg-secondary-50 text-secondary-800 hover:bg-primary-100 hover:text-primary-900 border border-secondary-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <details className="rounded-lg border border-secondary-200 bg-white">
        <summary className="cursor-pointer select-none px-2.5 py-2 text-xs font-medium text-secondary-700">
          Ввести yaw / pitch вручную
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2.5 pb-2.5 border-t border-secondary-100 pt-2.5">
          <label className="block">
            <span className="text-[10px] text-secondary-500 uppercase tracking-wide">
              Yaw - поворот
            </span>
            <input
              type="number"
              min={-180}
              max={180}
              step={1}
              value={Number.isFinite(yawDeg) ? yawDeg : 0}
              onChange={(e) =>
                onChange({ yawDeg: parseFloat(e.target.value) || 0, pitchDeg })
              }
              className="mt-1 w-full rounded-md border border-secondary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <span className="mt-1 block text-[10px] text-secondary-400">
              -180 до 180
            </span>
          </label>
          <label className="block">
            <span className="text-[10px] text-secondary-500 uppercase tracking-wide">
              Pitch - высота
            </span>
            <input
              type="number"
              min={-90}
              max={90}
              step={1}
              value={Number.isFinite(pitchDeg) ? pitchDeg : 0}
              onChange={(e) =>
                onChange({ yawDeg, pitchDeg: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-secondary-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <span className="mt-1 block text-[10px] text-secondary-400">
              -90 до 90
            </span>
          </label>
        </div>
      </details>
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-secondary-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-secondary-100 bg-secondary-50">
          <div>
            <h3 id="pick-direction-title" className="font-semibold text-secondary-900">
              Где поставить стрелку перехода → {targetRoomLabel}
            </h3>
            <p className="text-xs text-secondary-600 mt-0.5">
              Найдите дверь, коридор или нужную сторону комнаты и кликните прямо туда. Числа вводить не нужно.
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
        <div className="relative bg-secondary-950 cursor-crosshair">
          <ReactPhotoSphereViewer
            src={panoramaSrc}
            height="min(70vh,520px)"
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
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex justify-center">
            <div className="rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white shadow-lg">
              Кликните в точку, где пользователь должен увидеть стрелку
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 text-center text-[11px] text-white/90 drop-shadow-md">
            После клика направление сохранится автоматически
          </div>
        </div>
      </div>
    </div>
  )
}
