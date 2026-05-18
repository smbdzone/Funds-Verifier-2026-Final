'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import GlobalLoader from '@/utils/GlobalLoader'
import { confirmServicePayment } from '@/libs/confirmServicePayment'

const TechnicalReportSuccessComponent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const session_id = searchParams.get('session_id')
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session_id) {
      setError('Missing payment session.')
      return
    }

    confirmServicePayment(session_id)
      .then((data) => {
        if (data.payment_status !== 'paid') {
          setError('Payment was not completed.')
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

        setPaymentDetails(data)
        toast.success(data.message || 'Payment successful!')

        const returnUrl =
          localStorage.getItem('servicePaymentReturnUrl') ||
          '/dashboard/property-listing'
        localStorage.removeItem('servicePaymentReturnUrl')
        router.replace(returnUrl)
      })
      .catch((err) => {
        console.error('Error fetching session:', err)
        setError(
          err?.response?.data?.message ||
          'Could not confirm payment. Please go back to your listing.',
        )
      })
  }, [session_id, router])

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          className="btn-gradient px-6 py-2"
          onClick={() => router.push('/dashboard/property-listing')}
        >
          Back to listing
        </button>
      </div>
    )
  }

  if (!paymentDetails) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <GlobalLoader />
        <p>Confirming your payment…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[80vh] gap-4 items-center text-center justify-center">
      <h1 className="text-blue capitalize text-center text-[40px] font-bold">
        Payment Confirmation
      </h1>
      <p>Redirecting you back to your listing…</p>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <TechnicalReportSuccessComponent />
    </Suspense>
  )
}

export default Page
