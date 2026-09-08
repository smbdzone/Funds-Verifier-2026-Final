import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { confirmAdPaid } from '@/libs/adPayment'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { price, pathName, data, origin } = await req.json()
    const token = await req.headers.get('token')

    // Where to return the user after checkout. Prefer the caller's real origin
    // (browser location); fall back to this route's origin. Never hardcode the
    // production domain so localhost/staging return correctly too.
    const returnOrigin = origin || pathName || req.nextUrl.origin

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
              // Stripe requires an integer minor-unit amount. Round to fils so a
              // decimal budget (e.g. 19.99 → 1999) doesn't throw and orphan the
              // just-created ad row.
              unit_amount: Math.round(Number(price) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // Lets an advertiser enter a promotion code at checkout (e.g. a 100%-off
        // house/campaign coupon). A code that zeroes the total makes Stripe skip
        // card collection and complete the session with
        // payment_status: 'no_payment_required', so the normal success_url flow
        // still marks the ad paid. Mutually exclusive with `discounts`.
        allow_promotion_codes: true,
        metadata: {
          // Mongo _id so the confirmation handler/webhook can mark the ad paid.
          // NOTE: we deliberately do NOT put the user's JWT here anymore —
          // confirmation is server-to-server via the internal secret.
          id: responseData?.data?._id || responseData?.data?.uuid,
          adTitle: responseData?.data?.title || null,
          userUUID: responseData?.data?.userUUID || null,
        },
        // Return through the confirmation handler (marks the ad paid) which then
        // redirects to the dashboard on the same origin.
        success_url: `${returnOrigin}/api/stripe-advertisement?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnOrigin}/advertiser-dashboard/create`,
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
    const origin = req.nextUrl.origin

    // Trust Stripe's own view of the charge — not any client input. A zeroed
    // (100%-off coupon) checkout completes as 'no_payment_required'.
    const paid =
      session?.payment_status === 'paid' ||
      session?.payment_status === 'no_payment_required'

    if (adId && paid) {
      const paymentIntentId =
        typeof session?.payment_intent === 'string'
          ? session.payment_intent
          : session?.payment_intent?.id
      const result = await confirmAdPaid(adId, paymentIntentId)
      if (!result.ok) {
        // The Stripe webhook is the authoritative fallback, so don't strand the
        // user — send them to the dashboard; the webhook reconciles paid status.
        console.error('Checkout-return payment confirmation failed for', adId)
      }
    }

    return NextResponse.redirect(`${origin}/advertiser-dashboard`, {
      status: 302,
    })

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
