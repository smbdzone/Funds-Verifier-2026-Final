import axios from 'axios'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { dateTime, name, pathName, price, bedrooms } = await req.json()

    const { headers } = req

    // Dynamically determine base URL (works for both local and production)
    const protocol = headers.get('x-forwarded-proto') || 'http'
    const host = headers.get('host')
    const baseUrl = `${protocol}://${host}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: name,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/3d-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: decodeURIComponent(pathName),
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
