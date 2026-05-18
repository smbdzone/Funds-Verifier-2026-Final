import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const session_id = decodeURIComponent(searchParams.get('session_id'))
  const sessionId = session_id.replace(/"/g, '')
  try {
    if (!sessionId)
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    const paymentMethod = await stripe.paymentMethods.retrieve(
      `${process.env.PAYMENT_METHOD}`
    )
    return NextResponse.json({ paymentMethod })
  } catch (error) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}
