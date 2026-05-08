/**
 * Resolve asset URL for browser rendering.
 * - upload URLs are kept same-origin so nginx/Next serves them from /uploads/*
 * - external absolute URLs/data/blob are preserved
 * - other relative API paths are prefixed with NEXT_PUBLIC_API_URL
 */
export function resolvePublicAssetUrl(path: string): string {
  if (!path) return path
  const trimmed = path.trim()
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed)
      if (url.pathname.startsWith('/uploads/')) {
        return `${url.pathname}${url.search}${url.hash}`
      }
    } catch {
      return trimmed
    }
    return trimmed
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (normalized.startsWith('/uploads/')) {
    return normalized
  }

  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')
  return `${base}${normalized}`
}
