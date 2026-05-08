'use client'

import { useState, type Dispatch, type SetStateAction } from 'react'
import { Plus, Trash2, Globe, Upload, Loader2, Link2 } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { resolvePublicAssetUrl } from '@/lib/utils/resolvePublicAssetUrl'
import {
  DirectionPickModal,
  YawPitchSliders,
} from '@/components/dashboard/Tour360LinkDirections'

export interface TourRoomLink {
  nodeId: string
  yawDeg: number
  pitchDeg: number
}

export interface TourRoomNode {
  id: string
  name: string
  panoramaId: string | null
  previewUrl: string | null
  uploading: boolean
  uploadProgress: number
  links: TourRoomLink[]
}

function normalizeLinksFromApi(links: unknown): TourRoomLink[] {
  if (!Array.isArray(links)) return []
  return links
    .map((l: Record<string, unknown>) => {
      const nodeId = (l?.nodeId as string) || (l?.targetNodeId as string)
      if (!nodeId) return null
      if (typeof l.yawDeg === 'number' && typeof l.pitchDeg === 'number') {
        return { nodeId, yawDeg: l.yawDeg, pitchDeg: l.pitchDeg }
      }
      const pos = l.position as { yaw?: number; pitch?: number } | undefined
      if (pos && typeof pos.yaw === 'number') {
        return {
          nodeId,
          yawDeg: Math.round(((pos.yaw * 180) / Math.PI) * 100) / 100,
          pitchDeg: Math.round((((pos.pitch ?? 0) * 180) / Math.PI) * 100) / 100,
        }
      }
      return { nodeId, yawDeg: 0, pitchDeg: 0 }
    })
    .filter(Boolean) as TourRoomLink[]
}

export function tourNodesFromProperty(property: {
  virtualTourConfig?: { nodes?: unknown[] } | null
  panorama360Id?: string | null
}): TourRoomNode[] {
  const vtc = property.virtualTourConfig as { nodes?: Record<string, unknown>[] } | null
  if (vtc?.nodes?.length) {
    return vtc.nodes.map((n) => ({
      id: String(n.id),
      name: (n.name as string) || '',
      panoramaId: (n.panoramaId as string) || null,
      previewUrl: null,
      uploading: false,
      uploadProgress: 0,
      links: normalizeLinksFromApi(n.links),
    }))
  }
  if (property.panorama360Id) {
    return [
      {
        id: 'node-1',
        name: 'Основной вид',
        panoramaId: property.panorama360Id,
        previewUrl: null,
        uploading: false,
        uploadProgress: 0,
        links: [],
      },
    ]
  }
  return []
}

export function buildVirtualTourPayload(tourNodes: TourRoomNode[]) {
  const withPano = tourNodes.filter((n) => n.panoramaId)
  if (withPano.length === 0) {
    return {
      virtualTourConfig: null as null,
      panorama360Id: undefined as string | undefined,
      hasTour360FromUploads: false,
    }
  }
  const withPanoSet = new Set(withPano.map((t) => t.id))
  const nodes = withPano.map((n, idx) => ({
    id: n.id,
    name: n.name?.trim() || `Помещение ${idx + 1}`,
    panoramaId: n.panoramaId!,
    links: (n.links || [])
      .filter((l) => l.nodeId && withPanoSet.has(l.nodeId) && l.nodeId !== n.id)
      .map((l) => ({
        nodeId: l.nodeId,
        yawDeg: Number(l.yawDeg) || 0,
        pitchDeg: Number(l.pitchDeg) || 0,
      })),
  }))
  return {
    virtualTourConfig: {
      nodes,
      startNodeId: withPano[0]!.id,
    },
    panorama360Id: withPano[0]!.panoramaId!,
    hasTour360FromUploads: true,
  }
}

export function tiledLowPreviewUrl(panoramaId: string): string {
  return resolvePublicAssetUrl(`/uploads/tiles/${panoramaId}/low.jpg`)
}

export default function Tour360RoomsSection({
  nodes,
  setNodes,
  tour360Url,
  onTour360UrlChange,
  onUploadError,
}: {
  nodes: TourRoomNode[]
  setNodes: Dispatch<SetStateAction<TourRoomNode[]>>
  tour360Url: string
  onTour360UrlChange: (url: string) => void
  onUploadError?: (message: string) => void
}) {
  const anyUploading = nodes.some((n) => n.uploading)
  const [pickLink, setPickLink] = useState<{
    sourceNodeId: string
    linkIndex: number
  } | null>(null)

  const pickPanoramaSrc =
    pickLink &&
    (() => {
      const n = nodes.find((x) => x.id === pickLink.sourceNodeId)
      if (!n?.panoramaId && !n?.previewUrl) return null
      if (n.previewUrl) return n.previewUrl
      return tiledLowPreviewUrl(n.panoramaId!)
    })()

  const pickTargetLabel =
    pickLink &&
    (() => {
      const src = nodes.find((x) => x.id === pickLink.sourceNodeId)
      const link = src?.links?.[pickLink.linkIndex]
      if (!link?.nodeId) return ''
      const tgt = nodes.find((x) => x.id === link.nodeId)
      return tgt?.name?.trim() || tgt?.id || link.nodeId
    })()

  const addTourRoom = () => {
    const id = `node-${Date.now()}`
    setNodes((prev) => [
      ...prev,
      {
        id,
        name: '',
        panoramaId: null,
        previewUrl: null,
        uploading: false,
        uploadProgress: 0,
        links: [],
      },
    ])
  }

  const removeTourRoom = (id: string) => {
    setNodes((prev) =>
      prev
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          links: (n.links || []).filter((l) => l.nodeId !== id),
        })),
    )
  }

  const updateTourRoomName = (id: string, name: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, name } : n)))
  }

  const handleTourRoomUpload = async (nodeId: string, file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, previewUrl: reader.result as string } : n,
        ),
      )
    }
    reader.readAsDataURL(file)

    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, uploading: true, uploadProgress: 0 } : n,
      ),
    )
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await apiClient.post('/panorama/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (!ev.total) return
          const pct = Math.round((ev.loaded / ev.total) * 100)
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nodeId ? { ...n, uploadProgress: pct } : n,
            ),
          )
        },
      })
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                panoramaId: data.panoramaId,
                uploading: false,
                uploadProgress: 100,
              }
            : n,
        ),
      )
    } catch {
      onUploadError?.('Не удалось загрузить 360° панораму')
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                previewUrl: null,
                uploading: false,
                uploadProgress: 0,
              }
            : n,
        ),
      )
    }
  }

  const addTourLink = (nodeId: string) => {
    const source = nodes.find((n) => n.id === nodeId)
    const targets = nodes.filter((n) => n.panoramaId && n.id !== nodeId)
    if (!source || targets.length === 0) return

    const used = new Set((source.links || []).map((l) => l.nodeId))
    const pick = targets.find((t) => !used.has(t.id)) || targets[0]!
    const newLinkIndex = source.links?.length || 0

    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              links: [...(n.links || []), { nodeId: pick.id, yawDeg: 0, pitchDeg: 0 }],
            }
          : n,
      ),
    )

    // Open the visual picker immediately so non-technical users never need yaw/pitch.
    setPickLink({ sourceNodeId: nodeId, linkIndex: newLinkIndex })
  }

  const updateTourLink = (
    nodeId: string,
    index: number,
    patch: Partial<TourRoomLink>,
  ) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n
        const links = [...(n.links || [])]
        if (!links[index]) return n
        links[index] = { ...links[index], ...patch }
        return { ...n, links }
      }),
    )
  }

  const removeTourLink = (nodeId: string, index: number) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n
        const links = [...(n.links || [])]
        links.splice(index, 1)
        return { ...n, links }
      }),
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl shadow-lg border-2 border-primary-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-600 rounded-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-secondary-900">360° Виртуальный тур</h2>
          <p className="text-sm text-secondary-600">
            Несколько панорам: добавьте помещение для каждого кадра и при необходимости настройте переходы
          </p>
        </div>
        <button
          type="button"
          onClick={addTourRoom}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Помещение
        </button>
      </div>

      {nodes.length === 0 ? (
        <button
          type="button"
          onClick={addTourRoom}
          className="w-full border-2 border-dashed border-primary-300 bg-white rounded-lg p-10 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all"
        >
          <Upload className="w-12 h-12 text-primary-400 mx-auto mb-3" />
          <p className="text-base font-semibold text-secondary-900 mb-1">
            Добавьте первое помещение
          </p>
          <p className="text-sm text-secondary-500">
            Equirectangular 2:1 • JPG / PNG / WEBP • до ~80 МБ на файл
          </p>
        </button>
      ) : (
        <div className="space-y-3">
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              className="border border-secondary-200 rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 px-3 py-2 bg-secondary-50 border-b border-secondary-200">
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={node.name}
                  onChange={(e) => updateTourRoomName(node.id, e.target.value)}
                  placeholder={`Помещение ${idx + 1}`}
                  className="flex-1 text-sm font-medium bg-transparent outline-none text-secondary-900 placeholder-secondary-400 min-w-0"
                />
                <button
                  type="button"
                  onClick={() => removeTourRoom(node.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                  aria-label="Удалить помещение"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                {node.previewUrl || node.panoramaId ? (
                  <div className="relative group">
                    {node.previewUrl ? (
                      <img
                        src={node.previewUrl}
                        alt={node.name || `Помещение ${idx + 1}`}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <img
                        src={tiledLowPreviewUrl(node.panoramaId!)}
                        alt=""
                        className="w-full h-40 object-cover bg-secondary-100"
                      />
                    )}
                    {node.uploading && (
                      <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 px-4">
                        <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
                        <div className="w-full max-w-[180px] text-xs text-secondary-600 text-center">
                          {node.uploadProgress < 100 ? 'Загрузка…' : 'Обработка…'}{' '}
                          {node.uploadProgress}%
                        </div>
                      </div>
                    )}
                    {!node.uploading && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors cursor-pointer">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-secondary-800 text-xs font-medium px-3 py-1.5 rounded-lg">
                          Заменить файл
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleTourRoomUpload(node.id, e.target.files?.[0])
                          }
                        />
                      </label>
                    )}
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-primary-600 text-white text-xs font-medium rounded-full flex items-center gap-1.5 shadow">
                      <Globe className="w-3 h-3" />
                      {node.panoramaId ? '360° готово' : 'Загрузка…'}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-secondary-50 transition-colors">
                    {node.uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-primary-500 mb-2 animate-spin" />
                        <span className="text-sm text-secondary-600">
                          {node.uploadProgress}%
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-secondary-400 mb-2" />
                        <p className="text-sm text-secondary-600">Загрузить панораму</p>
                        <p className="text-xs text-secondary-400 mt-0.5">Equirectangular</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={node.uploading}
                      onChange={(e) =>
                        handleTourRoomUpload(node.id, e.target.files?.[0])
                      }
                    />
                  </label>
                )}
              </div>

              {node.panoramaId && (
                <div className="px-3 py-2.5 border-t border-secondary-100 bg-secondary-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-secondary-800">
                    <Link2 className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                    Стрелки перехода
                  </div>
                  {nodes.filter((t) => t.panoramaId && t.id !== node.id).length === 0 ? (
                    <p className="text-[11px] text-secondary-500">
                      Добавьте ещё одно помещение со своей панорамой, чтобы поставить стрелку перехода.
                    </p>
                  ) : (
                    <>
                      {(node.links || []).map((link, li) => {
                        const validTargets = nodes.filter(
                          (t) => t.panoramaId && t.id !== node.id,
                        )
                        const selectValue = validTargets.some((t) => t.id === link.nodeId)
                          ? link.nodeId
                          : ''
                        return (
                          <div
                            key={`${node.id}-l-${li}`}
                            className="flex flex-wrap items-start gap-2 bg-white rounded-lg p-2 border border-secondary-200"
                          >
                            <div className="min-w-[140px] flex-1">
                              <label className="text-[10px] text-secondary-500 uppercase tracking-wide block">
                                Переход в
                              </label>
                              <select
                                value={selectValue}
                                onChange={(e) =>
                                  updateTourLink(node.id, li, { nodeId: e.target.value })
                                }
                                className="mt-0.5 w-full text-sm border border-secondary-200 rounded-md px-2 py-1.5 bg-white"
                              >
                                <option value="" disabled>
                                  Выберите
                                </option>
                                {validTargets.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.name?.trim() || t.id}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-full sm:flex-1 min-w-0 basis-full">
                              <YawPitchSliders
                                yawDeg={link.yawDeg}
                                pitchDeg={link.pitchDeg}
                                onChange={(next) =>
                                  updateTourLink(node.id, li, next)
                                }
                                onOpenPicker={() =>
                                  setPickLink({ sourceNodeId: node.id, linkIndex: li })
                                }
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTourLink(node.id, li)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg self-start sm:self-end sm:mb-1"
                              aria-label="Удалить переход"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                      <button
                        type="button"
                        onClick={() => addTourLink(node.id)}
                        className="text-xs font-medium text-primary-600 hover:text-primary-800"
                      >
                        + Поставить новую стрелку
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-primary-200/60">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Внешний URL тура (необязательно)
        </label>
        <input
          type="url"
          value={tour360Url}
          onChange={(e) => onTour360UrlChange(e.target.value)}
          placeholder="https://example.com/tour"
          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white text-sm"
        />
        <p className="mt-1 text-xs text-secondary-500">
          Если загружены панорамы выше, сайт покажет их в приоритете; поле можно оставить пустым.
        </p>
      </div>

      {anyUploading && (
        <p className="mt-2 text-xs text-amber-700">Дождитесь окончания загрузки панорам.</p>
      )}

      <DirectionPickModal
        open={!!pickLink && !!pickPanoramaSrc}
        panoramaSrc={pickPanoramaSrc}
        targetRoomLabel={pickTargetLabel || 'комната'}
        onClose={() => setPickLink(null)}
        onPicked={(yawDeg, pitchDeg) => {
          if (!pickLink) return
          updateTourLink(pickLink.sourceNodeId, pickLink.linkIndex, {
            yawDeg,
            pitchDeg,
          })
          setPickLink(null)
        }}
      />
    </div>
  )
}
