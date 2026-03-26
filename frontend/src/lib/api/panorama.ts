import { apiClient } from './client'
import type { PanoramaTileConfig } from '@/components/properties/Tour360Viewer'

/**
 * Fetch the tile configuration for a tiled 360° panorama.
 * Returns null if the panorama hasn't been tiled yet.
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
    // 404 or network error → tiles not available, caller falls back to full image
    return null
  }
}
