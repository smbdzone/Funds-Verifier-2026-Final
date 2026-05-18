import customAxios from '@/utils/apis/apis'

/**
 * Finalize a Stripe Checkout session for 3D / technical-report services.
 * Uses the Express API (not Next /api routes) so production nginx routing works.
 */
export async function confirmServicePayment(sessionId) {
  if (!sessionId) {
    throw new Error('Missing payment session id')
  }

  const response = await customAxios.get(
    `/services/subscribe?session_id=${encodeURIComponent(sessionId)}`,
  )

  const payload = response?.data?.payload
  const paid =
    response?.data?.success === true &&
    (payload?.payment_status === 'paid' || payload?.payment_status === 'succeeded')

  return {
    ...response.data,
    payment_status: paid ? 'paid' : 'unpaid',
    amount_total: payload?.amount_total,
    currency: payload?.currency,
  }
}
