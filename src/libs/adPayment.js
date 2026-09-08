// Server-side helper: confirm an advertisement as paid by calling the backend's
// trusted payment-confirm endpoint with the shared internal secret. Used by both
// the Stripe checkout-return handler and the Stripe webhook. This is the ONLY
// path that marks an ad paid — the general update endpoint no longer accepts
// paymentStatus, so a client can't forge it.
export async function confirmAdPaid(adId, paymentIntentId) {
  if (!adId) return { ok: false, error: 'missing adId' }

  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  const secret = process.env.INTERNAL_API_SECRET // server-only (not NEXT_PUBLIC)

  if (!base || !secret) {
    console.error(
      'confirmAdPaid: NEXT_PUBLIC_BASE_URL or INTERNAL_API_SECRET is not configured',
    )
    return { ok: false, error: 'server not configured' }
  }

  try {
    const res = await fetch(`${base}/advertisement/payment-confirm/${adId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      // Stored so the ad can be refunded to the original card on deletion.
      body: JSON.stringify(
        paymentIntentId ? { paymentIntentId } : {},
      ),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('confirmAdPaid: backend returned', res.status, text)
    }
    return { ok: res.ok }
  } catch (e) {
    console.error('confirmAdPaid failed:', e?.message)
    return { ok: false, error: e?.message }
  }
}
