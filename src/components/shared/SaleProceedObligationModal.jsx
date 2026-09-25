'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import { CloseIcon } from '@/components/Icons'
import customAxios from '@/utils/apis/apis'
import {
  formatSuccessFeeAed,
  loadPublicSuccessFees,
  resolveSuccessFeeForAssetType,
} from '@/libs/successFee'

/**
 * Seller success-fee obligation disclosure.
 * Shown before listing payment and before arrange-viewing.
 */
export default function SaleProceedObligationModal({
  show,
  onClose,
  onAgree,
  assetType = '',
  listingTitle = '',
  listingUuid = '',
  /** 'listing' | 'viewing' */
  context = 'listing',
}) {
  const [mounted, setMounted] = useState(false)
  const [amount, setAmount] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!show) return
    let cancelled = false
      ; (async () => {
        const fees = await loadPublicSuccessFees()
        if (cancelled) return
        setAmount(resolveSuccessFeeForAssetType(assetType, fees))
      })()
    return () => {
      cancelled = true
    }
  }, [show, assetType])

  if (!show || !mounted) return null

  const amountLabel =
    amount != null ? formatSuccessFeeAed(amount) : 'AED …'

  const handleDisagree = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await customAxios.post('/success-fee/obligation-disagree', {
        context,
        assetType: assetType || '',
        listingTitle: listingTitle || '',
        listingUuid: listingUuid || '',
        amount: amount != null ? amount : undefined,
        message: 'User selected Disagree on the sale/purchase obligation popup.',
      })
      toast.info('Your response was sent to Funds Verifier admin.')
      onClose?.()
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        'Could not notify admin. Please try again or contact support.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleAgree = () => {
    if (submitting) return
    onAgree?.()
  }

  return createPortal(
    <div
      className='fixed inset-0 z-[80] flex items-center justify-center px-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='sale-obligation-title'
    >
      <button
        type='button'
        aria-label='Close'
        className='absolute inset-0 bg-[#002d4f]/55 backdrop-blur-[2px]'
        onClick={onClose}
      />

      <div className='relative w-full max-w-[440px] overflow-hidden rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm bg-white shadow-[0_24px_60px_rgba(0,45,79,0.28)]'>
        <div className='h-1.5 w-full bg-gradient-to-r from-[#002d4f] via-[#A2913E] to-[#d4c07a]' />

        <div className='flex justify-end px-5 pt-4'>
          <button
            type='button'
            onClick={onClose}
            className='cursor-pointer p-1 text-[#002d4f]/70 transition hover:text-[#002d4f]'
            aria-label='Close dialog'
          >
            <CloseIcon />
          </button>
        </div>

        <div className='px-6 pb-8 pt-1 text-center sm:px-8'>
          <p className='mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A2913E]'>
            Sale &amp; purchase terms
          </p>
          <h2
            id='sale-obligation-title'
            className='font-montserrat text-[22px] font-medium leading-tight text-[#A2913E] sm:text-[25px]'
          >
            Proceed with care
          </h2>

          <div className='mx-auto mt-5 rounded-lg border border-[#A2913E]/25 bg-gradient-to-b from-[#faf7ef] to-white px-4 py-5 text-left shadow-sm'>
            <p className='text-[15px] leading-relaxed text-[#1a2b3c]'>
              The seller is obligated to pay the amount of{' '}
              <span className='inline-block rounded bg-[#A2913E]/15 px-2 py-0.5 font-semibold text-[#002d4f]'>
                {amountLabel}
              </span>{' '}
              once both parties agree to proceed with the sale and purchase.
            </p>
          </div>

          <p className='mt-4 text-sm text-[#002d4f]/65'>
            Please confirm that you understand this obligation before continuing.
          </p>

          <div className='mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center'>
            <button
              type='button'
              disabled={submitting}
              onClick={handleDisagree}
              className='rounded-sm border-2 border-[#A2913E] px-8 py-3 text-[15px] font-medium text-[#002d4f] transition hover:bg-[#A2913E]/10 disabled:opacity-60'
            >
              {submitting ? 'Sending…' : 'Disagree'}
            </button>
            <button
              type='button'
              disabled={submitting}
              onClick={handleAgree}
              className='rounded-tl-sm rounded-bl-sm bg-light-gold px-8 py-3 text-[15px] font-medium text-white shadow-neons transition hover:brightness-105 disabled:opacity-60'
            >
              Agree
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
