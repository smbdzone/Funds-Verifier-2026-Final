'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

const PAID_SERVICE_PAYMENT_STATUSES = new Set([
  'paid',
  'succeeded',
  'active',
  'approved',
  'completed',
])

function hasConfirmedServicePayment() {
  const formPaymentRaw = localStorage.getItem('FormPayment')
  if (!formPaymentRaw) return false

  try {
    const formPayment = JSON.parse(formPaymentRaw)
    const status = String(formPayment?.payment_method_status || '').toLowerCase()
    if (!PAID_SERVICE_PAYMENT_STATUSES.has(status)) return false

    return (
      Boolean(localStorage.getItem('checkoutSessionId')) ||
      (formPayment.payment_provider === 'clozer' &&
        Boolean(localStorage.getItem('clozerTransactionId')))
    )
  } catch {
    return false
  }
}

/**
 * After Stripe or Clozer service checkout, reload the listing so 3D / technical
 * report refs from SubscribeServices appear on the edit form.
 */
export function useRefreshListingAfterServicePayment(listingId, routeName, fetchData) {
  const ran = useRef(false)

  useEffect(() => {
    if (!listingId || !routeName || typeof fetchData !== 'function') return
    if (ran.current) return
    if (!hasConfirmedServicePayment()) return

    ran.current = true
    fetchData(routeName)
      .then(() => {
        toast.success('Premium service payment received. Listing updated.')
        localStorage.removeItem('checkoutSessionId')
      })
      .catch(() => {
        ran.current = false
      })
  }, [listingId, routeName, fetchData])
}
