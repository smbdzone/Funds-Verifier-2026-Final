'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import GlobalLoader from '@/utils/GlobalLoader'
import { fetchClozerTransactionStatus } from '@/libs/initiateClozerPayment'

function ClozerReturnContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const transactionId = searchParams.get('transaction_id')
  const [error, setError] = useState(null)
  const [statusData, setStatusData] = useState(null)

  useEffect(() => {
    if (!transactionId) {
      setError('Missing transaction reference. Please contact support.')
      return
    }

    localStorage.setItem('clozerTransactionId', transactionId)

    let cancelled = false
    let attempts = 0

    const poll = async () => {
      try {
        const data = await fetchClozerTransactionStatus(transactionId)
        if (cancelled) return

        setStatusData(data.data)
        const status = String(data.data?.clozer_status || '').toLowerCase()
        const paymentStatus = String(data.data?.payment_method_status || '').toLowerCase()

        if (['approved', 'active', 'completed', 'succeeded'].includes(status) ||
          ['active', 'succeeded'].includes(paymentStatus)) {
          localStorage.setItem(
            'FormPayment',
            JSON.stringify({
              payment_method_status: paymentStatus || status,
              payment_provider: 'clozer',
              transaction_id: transactionId,
            }),
          )

          if (data.data?.service_type === 'evaluation') {
            localStorage.setItem(
              'checkoutSession',
              JSON.stringify({
                EvaluationPaymentStatus: true,
                payment_provider: 'clozer',
                clozer_transaction_id: transactionId,
              }),
            )
          }

          if (data.data?.service_type === 'purchase') {
            toast.success('Installment plan approved. Your purchase is confirmed.')
            localStorage.removeItem('clozerReturnUrl')
            router.replace('/profile/installment-payments')
            return
          }

          toast.success('Installment plan received. Redirecting…')

          const returnUrl =
            localStorage.getItem('servicePaymentReturnUrl') ||
            localStorage.getItem('clozerReturnUrl') ||
            '/dashboard/property-listing'

          localStorage.removeItem('servicePaymentReturnUrl')
          localStorage.removeItem('clozerReturnUrl')

          router.replace(returnUrl)
          return
        }

        if (['rejected', 'defaulted'].includes(status)) {
          setError('Your installment application was not approved. Please try pay in full or contact support.')
          return
        }

        attempts += 1
        if (attempts < 8) {
          setTimeout(poll, 2500)
        } else {
          setError(
            'Your application is being processed. Check your dashboard for updates, or contact support with reference: ' +
            transactionId,
          )
        }
      } catch (err) {
        if (cancelled) return
        setError(
          err?.response?.data?.message ||
          'Could not verify installment status. Please check your dashboard later.',
        )
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [transactionId, router])

  if (error) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center'>
        <h1 className='text-2xl font-semibold text-[#002D4F]'>Installment status</h1>
        <p className='max-w-md text-gray-600'>{error}</p>
        <button
          type='button'
          className='btn-gradient px-6 py-2'
          onClick={() => router.push('/dashboard/property-listing')}
        >
          Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center'>
      <GlobalLoader />
      <p className='text-gray-600'>Checking your Clozer installment application…</p>
      {statusData?.clozer_status && (
        <p className='text-sm text-gray-500'>Status: {statusData.clozer_status}</p>
      )}
    </div>
  )
}

export default function ClozerReturnPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-[60vh] items-center justify-center'>
          <GlobalLoader />
        </div>
      }
    >
      <ClozerReturnContent />
    </Suspense>
  )
}
