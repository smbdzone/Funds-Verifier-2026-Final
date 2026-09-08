import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { confirmAdPaid } from '@/libs/adPayment'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Stripe webhook — the authoritative payment confirmation. Unlike the checkout
// return handler, this fires even if the buyer closes the tab, so an ad can't
// end up charged-but-unpaid. Configure the endpoint URL
// (<origin>/api/stripe-webhook) and its signing secret (STRIPE_WEBHOOK_SECRET)
// in the Stripe dashboard.
export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('stripe-webhook: STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'not configured' }, { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  // Raw body is required for signature verification — do not parse as JSON.
  const rawBody = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    console.error('stripe-webhook: signature verification failed:', err?.message)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const adId = session?.metadata?.id || null
      const paid =
        session?.payment_status === 'paid' ||
        session?.payment_status === 'no_payment_required'

      if (adId && paid) {
        await confirmAdPaid(adId)
      }
    }
  } catch (err) {
    // Acknowledge receipt so Stripe doesn't hammer retries; log for follow-up.
    console.error('stripe-webhook: handler error:', err?.message)
  }

  return NextResponse.json({ received: true })
}
