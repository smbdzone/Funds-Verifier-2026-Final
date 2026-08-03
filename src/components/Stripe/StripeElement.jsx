'use client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// loadStripe must be called once — recreating it on each render changes the
// Elements `stripe` prop and triggers Stripe's unsupported-prop warning.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
)

export default function StripeElement({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>
}
