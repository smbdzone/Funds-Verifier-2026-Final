import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const hasStripeKey = Boolean(process.env.STRIPE_SECRET_KEY?.trim())
    if (!hasStripeKey) {
      console.error(
        '[create-payment-intent] STRIPE_SECRET_KEY is missing or empty'
      )
      return new Response(
        JSON.stringify({
          error:
            'Payments are not configured on this server (missing STRIPE_SECRET_KEY).',
        }),
        { status: 500 }
      )
    }

    const { amount, customerId, email } = await req.json()

    console.log('[create-payment-intent] incoming body', {
      amount,
      amountValid: Boolean(amount) && !isNaN(amount),
      hasCustomerId: Boolean(customerId),
      hasEmail: Boolean(email && String(email).trim()),
    })

    if (!amount || isNaN(amount)) {
      console.warn('[create-payment-intent] rejected: invalid or missing amount')
      return new Response(
        JSON.stringify({ error: 'Amount is required and must be a number' }),
        { status: 400 }
      )
    }
    let customer
    if (!email || !String(email).trim()) {
      console.warn('[create-payment-intent] rejected: missing email')
      return new Response(
        JSON.stringify({
          error: 'Email is required if no customerId is provided',
        }),
        { status: 400 }
      )
    }

    // Try to find existing customer by email
    const existingCustomers = await stripe.customers.list({ email, limit: 1 })

    if (existingCustomers?.data?.length > 0) {
      customer = existingCustomers?.data[0]?.id
    } else {
      const newCustomer = await stripe.customers.create({ email })
      customer = newCustomer?.id
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'aed',
      customer,
      setup_future_usage: 'off_session',
      automatic_payment_methods: { enabled: true },
    })
    const paymentMethodId = paymentIntent?.payment_method

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        customerId: customer,
        paymentMethodId: paymentMethodId,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Stripe error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500 }
    )
  }
}
