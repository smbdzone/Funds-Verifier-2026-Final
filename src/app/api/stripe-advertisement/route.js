import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { price, pathName, data } = await req.json()
    const token = await req.headers.get('token')

    // ✅ TEMP: Ensure sessionId is unique before DB insertion
    if (!data.sessionId) {
      data.sessionId =
        crypto.randomUUID?.() || Math.random().toString(36).slice(2)
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/create-advertisement`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (response?.ok) {
      const responseData = await response.json()

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aed',
              product_data: { name: 'Advertisement' },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          id: responseData?.data.uuid,
          adTitle: responseData?.data?.title || null,
          userUUID: responseData?.data?.userUUID || null,
          token,
        },
        success_url: `${pathName}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: decodeURIComponent(pathName),
      })

      return NextResponse.json(
        { url: session.url, sessionId: session?.id },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to save the advertisement.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')

    // Use the URL API to extract query parameters
    const { searchParams } = new URL(req.url)
    const session_id = searchParams.get('session_id')

    if (!session_id)
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const adId = session?.metadata?.id || null
    const token = session?.metadata?.token || null

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/${adId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed', paymentStatus: 1 }),
      }
    )

    const AdData = await response.json()
    const origin = req.nextUrl.origin

    if (!response?.ok) {
      return NextResponse.redirect(`${origin}/error`, { status: 302 })
    } else {
      return NextResponse.redirect(`${origin}/advertise-with-us`, {
        status: 302,
      })
    }

    // return NextResponse.json({
    //   message: `If you are notredirected, please check your advertisement status.`,
    //   link: `${origin}/advertise-with-us`,
    // })
  } catch (error) {
    console.error('Error fetching payment session details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment details.' },
      { status: 500 }
    )
  }
}
