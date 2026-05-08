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

const PRESETS: { label: string; emoji: string; yawDeg: number; pitchDeg: number }[] = [
  { label: 'Прямо',  emoji: '⬆️', yawDeg: 0,   pitchDeg: 0   },
  { label: 'Справа', emoji: '➡️', yawDeg: 90,  pitchDeg: 0   },
  { label: 'Назад',  emoji: '⬇️', yawDeg: 180, pitchDeg: 0   },
  { label: 'Слева',  emoji: '⬅️', yawDeg: -90, pitchDeg: 0   },
  { label: 'Вверху', emoji: '🔼', yawDeg: 0,   pitchDeg: 35  },
  { label: 'Внизу',  emoji: '🔽', yawDeg: 0,   pitchDeg: -25 },
]

/** Small SVG compass that shows where the arrow will appear */
function DirectionCompass({ yawDeg, pitchDeg }: { yawDeg: number; pitchDeg: number }) {
  const rad = (yawDeg * Math.PI) / 180
  const cx = 36
  const cy = 36
  const r = 22
  const dotX = cx + r * Math.sin(rad)
  const dotY = cy - r * Math.cos(rad)

  const pitchLabel =
    pitchDeg >= 25 ? '↑ высоко' : pitchDeg <= -25 ? '↓ низко' : '→ горизонталь'

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* background circle */}
        <circle cx={cx} cy={cy} r={r + 6} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
        {/* compass ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* cardinal ticks */}
        {[0, 90, 180, 270].map((a) => {
          const rr = (a * Math.PI) / 180
          const x1 = cx + (r - 4) * Math.sin(rr)
          const y1 = cy - (r - 4) * Math.cos(rr)
          const x2 = cx + r * Math.sin(rr)
          const y2 = cy - r * Math.cos(rr)
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.5" />
        })}
        {/* N label */}
        <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="7" fill="#64748b" fontWeight="600">С</text>
        {/* direction arrow line */}
        <line
          x1={cx} y1={cy}
          x2={dotX} y2={dotY}
          stroke="#2563eb" strokeWidth="2" strokeLinecap="round"
        />
        {/* dot at tip */}
        <circle cx={dotX} cy={dotY} r={4} fill="#2563eb" />
        {/* center */}
        <circle cx={cx} cy={cy} r={3} fill="#94a3b8" />
      </svg>
      <span className="text-[10px] text-secondary-500">{pitchLabel}</span>
    </div>
  )
}

export function YawPitchSliders(props: {
  yawDeg: number
  pitchDeg: number
  onChange: (next: { yawDeg: number; pitchDeg: number }) => void
  onOpenPicker: () => void
}) {
  const { yawDeg, pitchDeg, onChange, onOpenPicker } = props

  const safeYaw = Number.isFinite(yawDeg) ? yawDeg : 0
  const safePitch = Number.isFinite(pitchDeg) ? pitchDeg : 0

  return (
    <div className="space-y-2.5 w-full min-w-0">

      {/* ── Primary action: visual click on panorama ── */}
      <button
        type="button"
        onClick={onOpenPicker}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
      >
        <Crosshair className="w-4 h-4" />
        Кликнуть место стрелки на панораме
      </button>

      {/* ── Preset direction buttons ── */}
      <div className="rounded-lg border border-secondary-200 bg-white p-2.5">
        <p className="text-[11px] font-medium text-secondary-500 mb-2 uppercase tracking-wide">
          Быстрые направления
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((p) => {
            const active = Math.round(safeYaw) === p.yawDeg && Math.round(safePitch) === p.pitchDeg
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange({ yawDeg: p.yawDeg, pitchDeg: p.pitchDeg })}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 text-[11px] font-medium rounded-lg border transition-colors ${
                  active
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-secondary-50 text-secondary-700 border-secondary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-800'
                }`}
              >
                <span className="text-base leading-none">{p.emoji}</span>
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Fine-tune with sliders + compass ── */}
      <div className="rounded-lg border border-secondary-200 bg-white p-2.5">
        <p className="text-[11px] font-medium text-secondary-500 mb-3 uppercase tracking-wide">
          Точная настройка
        </p>
        <div className="flex items-start gap-3">
          {/* compass */}
          <div className="flex-shrink-0">
            <DirectionCompass yawDeg={safeYaw} pitchDeg={safePitch} />
          </div>

          {/* sliders */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* yaw */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-secondary-700 font-medium">Поворот (лево/право)</span>
                <span className="text-xs font-mono font-semibold text-primary-700">
                  {Math.round(safeYaw)}°
                </span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={safeYaw}
                onChange={(e) => onChange({ yawDeg: Number(e.target.value), pitchDeg: safePitch })}
                className="w-full h-2 rounded-full appearance-none bg-secondary-200 accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-secondary-400 mt-0.5">
                <span>← Лево</span>
                <span>Право →</span>
              </div>
            </div>

            {/* pitch */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-secondary-700 font-medium">Высота (вверх/вниз)</span>
                <span className="text-xs font-mono font-semibold text-primary-700">
                  {Math.round(safePitch)}°
                </span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                step={1}
                value={safePitch}
                onChange={(e) => onChange({ yawDeg: safeYaw, pitchDeg: Number(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none bg-secondary-200 accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-secondary-400 mt-0.5">
                <span>↓ Вниз</span>
                <span>Вверх ↑</span>
              </div>
            </div>
          </div>
        </div>
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-secondary-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-secondary-100 bg-secondary-50">
          <div>
            <h3 id="pick-direction-title" className="font-semibold text-secondary-900">
              Где поставить стрелку → {targetRoomLabel}
            </h3>
            <p className="text-xs text-secondary-600 mt-0.5">
              Найдите дверь, коридор или нужную сторону и кликните прямо туда. Числа вводить не нужно.
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
              Поверните панораму и кликните где нужна стрелка
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 text-center text-[11px] text-white/70">
            После клика окно закроется автоматически
          </div>
        </div>
      </div>
    </div>
  )
}
