import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('name')
  const input = searchParams.get('query')

  const api = process.env.GOOGLE_MAP_API_KEY
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&types=(cities)&components=country:${countryCode}&key=${api}`
  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json({ data })
}
