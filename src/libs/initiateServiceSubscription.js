import customAxios from '@/utils/apis/apis'

/**
 * Start Stripe Checkout for 3D walkthrough / technical report services.
 * Calls the Express API at /services/subscribe (not a Next.js route).
 */
export async function initiateServiceSubscription(payload) {
  const response = await customAxios.post('/services/subscribe', payload)
  return response.data
}
