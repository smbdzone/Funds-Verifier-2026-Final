import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id')
  try {
    if (!session_id) return NextResponse.redirect(new URL('/error', req?.url))

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/services/subscribe?session_id=${session_id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const data = await response?.json()
    return NextResponse.redirect(new URL('/', req.url))
  } catch (error) {
    console.error('Error fetching session details:', error)
    return NextResponse.redirect(new URL('/error', req?.url))
  }
}
