import axios from 'axios'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { name, pathName, price } = await req.json()

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
      success_url: `${baseUrl}/technical-report-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: decodeURIComponent(pathName),
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const session_id = decodeURIComponent(searchParams.get('session_id'))
  const sessionId = session_id.replace(/"/g, '')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    )
  }

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      payment_status: session.payment_status, // 'succeeded', 'requires_action', etc.
      amount_total: session.amount_total,
      currency: session.currency,
    })
  } catch (error) {
    console.error('Error fetching session details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session details' },
      { status: 500 }
    )
  }
}
