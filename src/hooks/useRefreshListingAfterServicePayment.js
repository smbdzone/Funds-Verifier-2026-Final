'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

/**
 * After Stripe service checkout, reload the listing so 3D / technical report
 * refs from SubscribeServices appear on the edit form.
 */
export function useRefreshListingAfterServicePayment(listingId, routeName, fetchData) {
  const ran = useRef(false)

  useEffect(() => {
    if (!listingId || !routeName || typeof fetchData !== 'function') return
    if (ran.current) return

    const sessionId = localStorage.getItem('checkoutSessionId')
    const formPaymentRaw = localStorage.getItem('FormPayment')
    if (!sessionId || !formPaymentRaw) return

    let paid = false
    try {
      const formPayment = JSON.parse(formPaymentRaw)
      const status = String(formPayment?.payment_method_status || '').toLowerCase()
      paid = status === 'paid' || status === 'succeeded'
    } catch {
      return
    }

    if (!paid) return

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
