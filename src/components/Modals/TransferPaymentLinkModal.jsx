'use client'

import React, { useState } from 'react'

const TransferPaymentLinkModal = ({
  paymentUrl,
  recipientEmail = '',
  emailFailed = false,
  onClose,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!paymentUrl) return
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='payment-link-title'
    >
      <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
        <h2
          id='payment-link-title'
          className='text-xl font-semibold text-prussianBlue'
        >
          {emailFailed ? 'Email could not be sent' : 'Payment link'}
        </h2>
        <p className='mt-2 text-sm text-slate-600'>
          {emailFailed
            ? 'The Stripe payment link was created, but the email to the seller failed. Share this link with the asset holder manually.'
            : 'Share this Stripe payment link with the seller so they can pay the success fee.'}
        </p>
        {recipientEmail ? (
          <p className='mt-2 text-sm text-slate-500'>
            Intended recipient:{' '}
            <span className='font-medium text-prussianBlue'>{recipientEmail}</span>
          </p>
        ) : null}

        <div className='mt-4 rounded-md border border-light-gold/50 bg-light-gold/10 p-3'>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-prussianBlue/70'>
            Stripe payment link
          </p>
          <p className='break-all text-sm text-prussianBlue'>{paymentUrl}</p>
        </div>

        <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-prussianBlue'
          >
            Close
          </button>
          <button
            type='button'
            onClick={handleCopy}
            className='rounded-md border border-[#002d4f] px-4 py-2 text-sm font-medium text-[#002d4f]'
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <a
            href={paymentUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-md primary-gradient px-4 py-2 text-center text-sm font-medium text-white'
          >
            Open link
          </a>
        </div>
      </div>
    </div>
  )
}

export default TransferPaymentLinkModal
