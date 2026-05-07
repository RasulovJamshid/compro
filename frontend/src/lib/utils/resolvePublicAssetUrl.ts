/**
 * Resolve asset URL for browser rendering.
 * - absolute URLs/data/blob are preserved
 * - /uploads/* is kept same-origin so Next route handler proxies to backend
 * - other relative API paths are prefixed with NEXT_PUBLIC_API_URL
 */
export function resolvePublicAssetUrl(path: string): string {
  if (!path) return path
  const trimmed = path.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (normalized.startsWith('/uploads/')) {
    return normalized
  }

  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')
  return `${base}${normalized}`
}
