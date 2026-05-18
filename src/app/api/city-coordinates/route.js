import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('name')
  const api = process.env.GOOGLE_MAP_API_KEY
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cities+in+${city.replace(
      / /g,
      '+'
    )}&key=${api}`
  )
  const data = await res.json()
  const location = data.results[0].geometry.location
  return NextResponse.json({ location })
}
