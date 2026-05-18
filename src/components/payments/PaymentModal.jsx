/* eslint-disable react/no-unescaped-entities */
import { CloseIcon } from '@/components/Icons'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useProfile } from '../../context/UserContext'

const PaymentModal = ({ show, onClose, HandleFormSubmit, setFormData }) => {
  if (!show) return null
  const { user } = useProfile()

  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.warn('[PaymentModal] blocked: Stripe not ready', {
        hasStripe: Boolean(stripe),
        hasElements: Boolean(elements),
      })
      toast.error('Stripe not loaded yet.')
      return
    }

    try {
      setLoading(true)

      const payload = {
        amount: 200,
        customerId: user?.uuid,
        email: user?.email,
      }
      console.log('[PaymentModal] submit — payload check', {
        amount: payload.amount,
        hasCustomerId: Boolean(payload.customerId),
        hasEmail: Boolean(String(payload.email ?? '').trim()),
      })

      if (!user?.email?.trim()) {
        console.warn(
          '[PaymentModal] blocked: missing user email — cannot create PaymentIntent',
        )
        toast.error(
          'Your profile email is required to process payment. Please update your account.',
        )
        return
      }

      const body = {
        ...payload,
        email: user.email.trim(),
      }

      // 1️⃣ Create a PaymentIntent from backend
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const clientIntent = await res.json()
      console.log('[PaymentModal] create-payment-intent response', {
        ok: res.ok,
        status: res.status,
        hasClientSecret: Boolean(clientIntent?.clientSecret),
        serverError: clientIntent?.error ?? null,
      })

      if (!res.ok) {
        throw new Error(
          clientIntent?.error ||
            `Could not start payment (${res.status}). Try again later.`,
        )
      }

      if (!clientIntent?.clientSecret) {
        throw new Error(
          clientIntent?.error ||
            'Payment could not be initialized. Check server configuration (Stripe).',
        )
      }

      // 2️⃣ Confirm card payment
      const cardElement = elements.getElement(CardNumberElement)

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientIntent?.clientSecret,
        { payment_method: { card: cardElement } },
      )
      if (error) {
        toast.error(error?.message)
      } else if (paymentIntent?.status === 'succeeded') {
        setFormData((prev) => ({
          ...prev,
          EvaluationPaymentStatus: true,
          paymentMethod: paymentIntent?.payment_method,
          customerId: clientIntent?.customerId,
        }))
        localStorage.setItem(
          'checkoutSession',
          JSON.stringify({
            EvaluationPaymentStatus: true,
            paymentMethod: paymentIntent?.payment_method,
            customerId: clientIntent?.customerId,
          }),
        )

        toast.success('Payment successful!')
        HandleFormSubmit()
        onClose()
      }
    } catch (err) {
      console.error('[PaymentModal] payment error', err?.message || err)
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Background overlay */}
      <div className='fixed inset-0 modal-bg z-10'></div>

      {/* Modal dialog */}
      <div className='fixed inset-0 flex justify-center items-center z-20 px-4'>
        <div className='bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto z-30 px-5 py-4'>
          <div className='flex justify-end items-center mb-3'>
            <span className='cursor-pointer pr-5' onClick={onClose}>
              <CloseIcon />
            </span>
          </div>
          <h2 className='text-black/50 text-light-gold text-[25px] font-medium mb-4 font-montserrat'>
            Payment for Evaluation
          </h2>
          <div className='text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 w-full'>
            <p className='mb-2'>
              We may store and use your payment details for up to{' '}
              <strong>90 days</strong> as per our{' '}
              <Link
                href='#'
                target='_blank'
                className='text-light-gold hover:underline'
              >
                Terms & Conditions
              </Link>
              .<br />A small charge (~<strong>2 dirham</strong>) will confirm
              your payment method.
            </p>
            <ul className='list-disc list-inside space-y-1'>
              <li>
                If asset unsold after 90 days → <strong>2,500 dirhams</strong>{' '}
                evaluation fee.
              </li>
              <li>If asset removed before 90 days → fee still applies.</li>
              <li>
                If asset sold later via <strong>Funds Verifier</strong> → fee
                refunded.
              </li>
            </ul>
          </div>
          <div className='text-black mb-4 text-center w-full'>
            <form
              className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-start'
              onSubmit={handleSubmit}
            >
              <div className='col-span-2 p-3 border rounded-lg'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1'>
                      Card Number
                    </label>
                    <div className='p-3 border rounded-lg'>
                      <CardNumberElement />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-1'>
                        Expiry
                      </label>
                      <div className='p-3 border rounded-lg'>
                        <CardExpiryElement />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-1'>
                        CVC
                      </label>
                      <div className='p-3 border rounded-lg'>
                        <CardCvcElement />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end items-center gap-2 sm:col-span-2'>
                <button
                  type='submit'
                  disabled={loading || !stripe}
                  className='bg-light-gold text-white text-[15px] px-8 py-3 disabled:opacity-50'
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  onClick={onClose}
                  type='button'
                  className='border-2 border-light-gold text-[15px] px-8 py-3'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentModal
