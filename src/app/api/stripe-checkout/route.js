import axios from 'axios'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const convertToCents = (amount) => {
  return Math.round(amount * 100) // Rounds to nearest integer
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { productId, assetType, previewMedia, pathName, applyFullPayDiscount } =
      await req.json()
    const { headers } = req

    // Dynamically determine base URL (works for both local and production)
    const protocol = headers.get('x-forwarded-proto') || 'http'
    const host = headers.get('host')
    const baseUrl = `${protocol}://${host}`

    const assetResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${assetType}/${productId}`
    )
    const data = assetResponse.data

    let feeUsd =
      data.assetType === 'Car For Sale'
        ? 1500.14
        : data.assetType === 'Boats For Sale'
          ? 2000
          : data.assetType === 'Jewellery For Sale'
            ? 999.18
            : 3000.27
    let totalUsd = data.price + feeUsd
    if (applyFullPayDiscount) {
      let discountPercent = 5
      try {
        const discountRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/success-fee/full-pay-discount`,
          { cache: 'no-store' },
        )
        if (discountRes.ok) {
          const discountData = await discountRes.json()
          discountPercent = Number(discountData.fullPayDiscountPercent ?? 5)
        }
      } catch {
        discountPercent = Number(process.env.FULL_PAY_DISCOUNT_PERCENT || 5)
      }

      discountPercent = Math.min(50, Math.max(0, discountPercent))
      if (discountPercent > 0) {
        totalUsd =
          Math.round(totalUsd * (1 - discountPercent / 100) * 100) / 100
      }
    }
    const totalprice = convertToCents(totalUsd)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: data.title,
              images: [previewMedia],
            },
            unit_amount: totalprice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?id=${productId}&assetType=${data.assetType}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: decodeURIComponent(pathName),
    })
    // payment_status
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    // Use the URL API to extract query parameters
    const { searchParams } = new URL(req.url)
    const session_id = searchParams.get('session_id')

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Optional: Retrieve the payment intent for detailed payment status
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    )

    return NextResponse.json({
      payment_status: paymentIntent.status, // 'succeeded', 'requires_action', etc.
      amount_total: session.amount_total,
      currency: session.currency,
    })
  } catch (error) {
    console.error('Error fetching payment session details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    )
  }
}
