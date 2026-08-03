'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import customAxios from '@/utils/apis/apis'
import { useProfile } from '@/context/UserContext'

const goldBtn =
  'btn-gradient flex justify-center rounded border-0 px-5 py-3 text-xs font-medium text-white focus:outline-none md:text-sm'
const outlineBtn =
  'flex justify-center rounded border border-[#A2913E] px-5 py-3 text-xs font-medium text-[#002D4F] hover:bg-[#A2913E]/10 focus:outline-none md:text-sm'

function getPofState(user, listingPrice) {
  const amount = Number(user?.financialInfo?.fundsVerification)
  const status = String(user?.financialInfo?.status || '')
  const approved = status === 'Approved' && Number.isFinite(amount) && amount > 0
  const sufficient =
    approved && (!listingPrice || listingPrice <= 0 || amount >= listingPrice)
  return { amount, status, approved, sufficient }
}

function InquiryModal({
  title,
  onClose,
  onSubmit,
  busy,
  children,
  submitLabel,
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-5 shadow-xl'>
        <div className='mb-4 flex items-start justify-between gap-3'>
          <h3 className='text-lg font-semibold text-[#002D4F]'>{title}</h3>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-500 hover:text-black'
            aria-label='Close'
          >
            ✕
          </button>
        </div>
        <div className='space-y-3'>{children}</div>
        <div className='mt-5 flex flex-wrap gap-2'>
          <button
            type='button'
            disabled={busy}
            onClick={onSubmit}
            className={`${goldBtn} disabled:opacity-60`}
          >
            {busy ? 'Submitting…' : submitLabel}
          </button>
          <button type='button' onClick={onClose} className={outlineBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Buyer CTAs for published off-plan / developer units:
 * Proof of Funds · Make Offer · Reserve (+ optional viewing).
 */
export default function OffPlanBuyerActions({
  listing,
  onArrangeViewing,
}) {
  const { user } = useProfile()
  const router = useRouter()
  const pathname = usePathname()
  const [modal, setModal] = useState(null) // 'offer' | 'reserve' | null
  const [offerAmount, setOfferAmount] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const listingId = listing?.uuid || listing?.id || listing?.slug
  const listingPrice = Number(listing?.priceFrom ?? listing?.priceTo ?? listing?.price) || 0
  const inventoryStatus = String(listing?.occupancyStatus || '').trim()
  const isSold = inventoryStatus === 'Sold' || Number(listing?.status) !== 1
  const isHeld = ['Reserved', 'Under Offer'].includes(inventoryStatus)
  const pof = useMemo(() => getPofState(user, listingPrice), [user, listingPrice])

  const requireLogin = () => {
    const returnTo = pathname || '/offplan'
    router.push(`/user-login?redirect=${encodeURIComponent(returnTo)}`)
  }

  const submitInquiry = async (type, payload = {}) => {
    if (!user) {
      requireLogin()
      return
    }
    if (!listingId) {
      toast.error('Listing reference missing')
      return
    }
    setBusy(true)
    try {
      const { data } = await customAxios.post(
        `/property/${listingId}/developer-inquiry`,
        { type, ...payload },
      )
      toast.success(data?.message || 'Submitted')
      setModal(null)
      setOfferAmount('')
      setMessage('')
    } catch (error) {
      const code = error?.response?.data?.code
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Could not submit request'
      toast.error(msg)
      if (code === 'POF_REQUIRED' || code === 'POF_INSUFFICIENT') {
        router.push('/profile')
      }
    } finally {
      setBusy(false)
    }
  }

  const handlePof = async () => {
    if (!user) {
      requireLogin()
      return
    }
    if (!pof.approved || !pof.sufficient) {
      toast.info(
        pof.approved
          ? 'Increase your verified funds to match this listing price'
          : 'Complete Proof of Funds verification in your profile',
      )
      router.push('/profile')
      return
    }
    await submitInquiry('pof', {
      message: 'Buyer confirmed approved Proof of Funds for this listing.',
    })
  }

  const handleOfferClick = () => {
    if (!user) {
      requireLogin()
      return
    }
    if (!pof.approved) {
      toast.info('Approved Proof of Funds is required before making an offer')
      router.push('/profile')
      return
    }
    setOfferAmount(listingPrice ? String(listingPrice) : '')
    setModal('offer')
  }

  const handleReserveClick = () => {
    if (!user) {
      requireLogin()
      return
    }
    if (!pof.approved) {
      toast.info('Approved Proof of Funds is required before reserving')
      router.push('/profile')
      return
    }
    setModal('reserve')
  }

  if (isSold) {
    return (
      <p className='rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-600'>
        This unit is no longer available.
      </p>
    )
  }

  return (
    <div className='flex w-full flex-col gap-3'>
      {isHeld ? (
        <p className='rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900'>
          Inventory status: <strong>{inventoryStatus}</strong>
          {inventoryStatus === 'Reserved'
            ? ' — new reservations may be limited.'
            : ' — an offer is in progress.'}
        </p>
      ) : null}

      <div className='flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap'>
        <button type='button' onClick={handlePof} className={goldBtn} disabled={busy}>
          {pof.approved && pof.sufficient
            ? 'Confirm Proof of Funds'
            : 'Proof of Funds'}
        </button>
        <button
          type='button'
          onClick={handleOfferClick}
          className={outlineBtn}
          disabled={busy || inventoryStatus === 'Reserved'}
        >
          Make Offer
        </button>
        <button
          type='button'
          onClick={handleReserveClick}
          className={outlineBtn}
          disabled={busy || inventoryStatus === 'Reserved'}
        >
          Reserve
        </button>
        {typeof onArrangeViewing === 'function' ? (
          <button type='button' onClick={onArrangeViewing} className={outlineBtn}>
            Arrange Viewing
          </button>
        ) : null}
      </div>

      {!user ? (
        <p className='text-xs text-gray-500'>
          <Link href={`/user-login?redirect=${encodeURIComponent(pathname || '/offplan')}`} className='text-[#A2913E] underline'>
            Sign in
          </Link>{' '}
          to submit POF, offers, or reservations.
        </p>
      ) : !pof.approved ? (
        <p className='text-xs text-gray-500'>
          Submit funds verification in your{' '}
          <Link href='/profile' className='text-[#A2913E] underline'>
            profile
          </Link>{' '}
          to unlock offer and reserve.
        </p>
      ) : null}

      {modal === 'offer' ? (
        <InquiryModal
          title='Make an offer'
          onClose={() => setModal(null)}
          busy={busy}
          submitLabel='Submit offer'
          onSubmit={() =>
            submitInquiry('offer', {
              offerAmount: Number(offerAmount),
              message,
            })
          }
        >
          <p className='text-sm text-gray-600'>
            Listing price:{' '}
            <strong>
              AED {listingPrice ? listingPrice.toLocaleString() : '—'}
            </strong>
          </p>
          <label className='block text-sm font-medium text-[#002D4F]'>
            Your offer (AED)
            <input
              type='number'
              min='1'
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2'
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
            />
          </label>
          <label className='block text-sm font-medium text-[#002D4F]'>
            Message (optional)
            <textarea
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </InquiryModal>
      ) : null}

      {modal === 'reserve' ? (
        <InquiryModal
          title='Request reservation'
          onClose={() => setModal(null)}
          busy={busy}
          submitLabel='Submit reservation'
          onSubmit={() => submitInquiry('reserve', { message })}
        >
          <p className='text-sm text-gray-600'>
            Request to reserve this unit at{' '}
            <strong>
              AED {listingPrice ? listingPrice.toLocaleString() : '—'}
            </strong>
            . The developer will confirm in their CRM.
          </p>
          <p className='text-xs text-gray-500'>
            Your verified POF: AED{' '}
            {pof.amount ? pof.amount.toLocaleString() : '—'} ({pof.status || 'n/a'})
          </p>
          <label className='block text-sm font-medium text-[#002D4F]'>
            Message (optional)
            <textarea
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </InquiryModal>
      ) : null}
    </div>
  )
}
