import { apiClient } from './client'
import type { PanoramaTileConfig } from '@/components/properties/Tour360Viewer'

/**
 * Fetch the tile configuration for a single tiled 360° panorama.
 * Returns null if the panorama hasn't been tiled yet or isn't found.
 */
export async function getPanoramaTileConfig(
  panoramaId: string,
): Promise<PanoramaTileConfig | null> {
  try {
    const { data } = await apiClient.get<PanoramaTileConfig>(
      `/panorama/${panoramaId}/config`,
    )
    return data
  } catch {
    return null
  }
}

/**
 * Fetch tile configurations for multiple panorama IDs in parallel.
 * Returns a map of panoramaId → config (absent keys had no tiles).
 */
export async function getPanoramaTileConfigs(
  ids: string[],
): Promise<Record<string, PanoramaTileConfig>> {
  const results = await Promise.all(
    ids.map(async (id) => {
      const cfg = await getPanoramaTileConfig(id)
      return [id, cfg] as const
    }),
  )
  return Object.fromEntries(results.filter(([, cfg]) => cfg !== null)) as Record<string, PanoramaTileConfig>
}
