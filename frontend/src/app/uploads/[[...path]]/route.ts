import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Proxy /uploads/* through Next.js to avoid browser mixed-content/CORS issues.
 * Browser hits :3000/uploads/*, server fetches backend :3001/uploads/*.
 */
export async function GET(
  request: NextRequest,
  ctx: { params: { path?: string[] } },
) {
  const segments = ctx.params.path ?? []
  const backend =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  const base = backend.replace(/\/$/, '')
  const uploadPath = `/uploads/${segments.join('/')}`
  const url = `${base}${uploadPath}${request.nextUrl.search}`

  let upstream: Response
  try {
    upstream = await fetch(url, { cache: 'no-store' })
  } catch (err) {
    console.error('[uploads proxy] fetch failed:', url, err)
    return new Response('Bad gateway', { status: 502 })
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
  const body = upstream.body
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Access-Control-Allow-Origin': '*',
  }
  const cc = upstream.headers.get('cache-control')
  if (cc) headers['Cache-Control'] = cc

  if (!body) {
    const buf = await upstream.arrayBuffer()
    return new Response(buf, { status: upstream.status, headers })
  }

  return new Response(body, { status: upstream.status, headers })
}
