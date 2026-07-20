'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import GlobalLoader from '@/utils/GlobalLoader'
import { confirmServicePayment } from '@/libs/confirmServicePayment'

function ServicePaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const session_id = searchParams.get('session_id')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session_id) {
      setError('Payment session was not found. Please try again from your listing.')
      return
    }

    let cancelled = false

    const run = async () => {
      try {
        const data = await confirmServicePayment(session_id)
        if (cancelled) return

        if (data.payment_status !== 'paid') {
          setError('Payment is not complete yet. If you were charged, contact support.')
          return
        }

        localStorage.setItem(
          'FormPayment',
          JSON.stringify({
            payment_method_status: 'paid',
            payment_details: data.payload || data,
          }),
        )
        localStorage.setItem('checkoutSessionId', session_id)

        toast.success(data.message || 'Payment successful!')

        const returnUrl =
          data?.payload?.paymentType === 'off_plan_approval_fee'
            ? '/seller-profile/invoices'
            : localStorage.getItem('servicePaymentReturnUrl') ||
            '/dashboard/property-listing'

        localStorage.removeItem('servicePaymentReturnUrl')

        router.replace(returnUrl)
      } catch (err) {
        if (cancelled) return
        console.error('Service payment confirmation failed:', err)
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Could not confirm your payment. Please refresh or contact support.',
        )
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [session_id, router])

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold text-blue">Payment confirmation issue</h1>
        <p className="max-w-md text-gray-600">{error}</p>
        <button
          type="button"
          className="btn-gradient px-6 py-2"
          onClick={() =>
            router.push(
              localStorage.getItem('servicePaymentReturnUrl') ||
              '/dashboard/property-listing',
            )
          }
        >
          Back to listing
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <GlobalLoader />
      <p className="text-gray-600">Confirming your payment…</p>
    </div>
  )
}

export default function ServicePaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <GlobalLoader />
        </div>
      }
    >
      <ServicePaymentSuccessContent />
    </Suspense>
  )
}
