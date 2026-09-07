import { GET as resolveMapsUrl } from '@/app/api/resolve-maps-url/route'

// Production proxies /api/* to the Express backend. Expose the same resolver
// outside /api so this request is handled by the Next.js frontend server.
export const dynamic = 'force-dynamic'

export async function GET(request) {
  return resolveMapsUrl(request)
}
