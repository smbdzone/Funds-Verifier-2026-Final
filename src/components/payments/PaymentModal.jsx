'use client'

import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import { useProfile } from '../../context/UserContext'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'
import PaymentChoiceModal from './PaymentChoiceModal'
import { initiateClozerPayment, getClozerErrorMessage } from '@/libs/initiateClozerPayment'
import {
  applyFullPayDiscount,
  formatAed,
  getFullPayDiscountPercent,
} from '@/libs/paymentDiscount'
import { clearAbandonedEvaluationPaymentDraft } from '@/libs/evaluationBooking'
import { savePendingListingDraft } from '@/libs/pendingListingDraft'
import {
  handleImageUpload,
  handleThumbnailUpload,
  handleVideoUpload,
} from '@/libs/uploadAsset'
import { getCsrfHeaders } from '@/utils/csrf'
import { CloseIcon } from '@/components/Icons'

const EVALUATION_CLOZER_AMOUNT = 2500

const PaymentModal = ({
  show,
  onClose,
  HandleFormSubmit,
  setFormData,
  formData,
}) => {
  const { user } = useProfile()
  const listingCtx = useContext(ListingContext) || {}
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState('choice')
  const [clozerLoading, setClozerLoading] = useState(false)

  useEffect(() => {
    if (!show || !formData) return
    savePendingListingDraft({
      formData,
      images: listingCtx.images || [],
      thumbnail: listingCtx.thumbnail,
      videos: listingCtx.videos || [],
      qrScan: listingCtx.qrScan,
    })
  }, [
    show,
    formData,
    listingCtx.images,
    listingCtx.thumbnail,
    listingCtx.videos,
    listingCtx.qrScan,
  ])

  if (!show) return null

  const evaluationAmount =
    Number(formData?.evaluationFeePrice) > 0
      ? Number(formData.evaluationFeePrice)
      : EVALUATION_CLOZER_AMOUNT

  const handleClozerPay = async () => {
    if (!user?.uuid) {
      toast.error('Please log in to continue.')
      return
    }

    try {
      setClozerLoading(true)
      const origin =
        typeof window !== 'undefined' ? window.location.origin : ''
      localStorage.setItem(
        'clozerReturnUrl',
        `${window.location.pathname}${window.location.search}`,
      )

      const listingDraft = formData
        ? {
          assetType: formData.assetType,
          title: formData.title,
          price: formData.price,
        }
        : undefined

      if (formData) {
        let draftForm = { ...formData }
        let draftImages = listingCtx.images || []
        let draftThumb = listingCtx.thumbnail
        let draftVideos = listingCtx.videos || []
        let draftQr = listingCtx.qrScan

        // Persist File blobs to the server before leaving the page for Clozer.
        try {
          const fileImages = (draftImages || []).filter(
            (item) => item instanceof File || item instanceof Blob,
          )
          if (fileImages.length) {
            const uploaded = await handleImageUpload(fileImages)
            if (uploaded) {
              draftForm = { ...draftForm, pictures: uploaded }
              draftImages = uploaded?.images || draftImages
              listingCtx.setImages?.(
                Array.isArray(uploaded?.images) ? uploaded.images : draftImages,
              )
              listingCtx.setFormData?.((prev) => ({
                ...prev,
                pictures: uploaded,
              }))
            }
          }

          if (draftThumb instanceof File || draftThumb instanceof Blob) {
            const uploadedThumb = await handleThumbnailUpload(draftThumb)
            if (uploadedThumb) {
              draftForm = { ...draftForm, thumbnailImg: uploadedThumb }
              const firstImage = Array.isArray(uploadedThumb?.images)
                ? uploadedThumb.images[0]
                : uploadedThumb?.images && typeof uploadedThumb.images === 'object'
                  ? Object.values(uploadedThumb.images)[0]
                  : null
              draftThumb = firstImage
                ? {
                  ...firstImage,
                  signedUrl:
                    firstImage.signedUrl ||
                    uploadedThumb.signedUrl ||
                    firstImage.url,
                  url:
                    firstImage.url ||
                    uploadedThumb.signedUrl ||
                    firstImage.signedUrl,
                }
                : {
                  ...uploadedThumb,
                  signedUrl: uploadedThumb.signedUrl || uploadedThumb.url,
                  url: uploadedThumb.url || uploadedThumb.signedUrl,
                }
              listingCtx.setThumbnail?.(draftThumb)
              listingCtx.setFormData?.((prev) => ({
                ...prev,
                thumbnailImg: uploadedThumb,
              }))
            }
          }

          const fileVideos = (draftVideos || []).filter(
            (item) => item instanceof File || item instanceof Blob,
          )
          if (fileVideos.length) {
            const uploadedVideo = await handleVideoUpload(fileVideos)
            if (uploadedVideo) {
              draftForm = { ...draftForm, video: uploadedVideo }
              if (
                Array.isArray(uploadedVideo?.videos) &&
                uploadedVideo.videos.length
              ) {
                draftVideos = uploadedVideo.videos.map((v) => ({
                  ...v,
                  signedUrl:
                    v?.signedUrl || uploadedVideo.signedUrl || v?.url,
                  url: v?.url || v?.signedUrl || uploadedVideo.signedUrl,
                }))
              } else if (uploadedVideo?.signedUrl || uploadedVideo?.url) {
                draftVideos = [
                  {
                    url: uploadedVideo.url || uploadedVideo.signedUrl,
                    signedUrl: uploadedVideo.signedUrl || uploadedVideo.url,
                    _id: uploadedVideo._id,
                  },
                ]
              }
              listingCtx.setVideos?.(draftVideos)
              listingCtx.setFormData?.((prev) => ({
                ...prev,
                video: uploadedVideo,
              }))
            }
          }

          if (draftQr instanceof File || draftQr instanceof Blob) {
            const uploadedQr = await handleImageUpload([draftQr])
            if (uploadedQr) {
              draftForm = { ...draftForm, qrScan: uploadedQr }
              draftQr = uploadedQr?.images?.[0]
                ? {
                  ...uploadedQr.images[0],
                  signedUrl:
                    uploadedQr.images[0].signedUrl ||
                    uploadedQr.signedUrl ||
                    uploadedQr.images[0].url,
                  url:
                    uploadedQr.images[0].url ||
                    uploadedQr.signedUrl ||
                    uploadedQr.images[0].signedUrl,
                }
                : uploadedQr
              listingCtx.setQrScan?.(draftQr)
              listingCtx.setFormData?.((prev) => ({
                ...prev,
                qrScan: uploadedQr,
              }))
            }
          }
        } catch (uploadErr) {
          console.error('Draft media upload before Clozer:', uploadErr)
        }

        savePendingListingDraft({
          formData: draftForm,
          images: draftImages,
          thumbnail: draftThumb,
          videos: draftVideos,
          qrScan: draftQr,
        })
      }

      const data = await initiateClozerPayment({
        userUUID: user.uuid,
        service: 'evaluation',
        price: evaluationAmount,
        success_url: `${origin}/clozer-return`,
        listingDraft,
      })

      if (data?.redirectUrl) {
        localStorage.setItem('clozerTransactionId', data.transaction_id)
        window.location.href = data.redirectUrl
        return
      }

      toast.error(data?.message || 'Could not start installment payment.')
    } catch (err) {
      toast.error(getClozerErrorMessage(err))
    } finally {
      setClozerLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast.error('Stripe not loaded yet.')
      return
    }

    try {
      setLoading(true)

      if (!user?.email?.trim()) {
        toast.error(
          'Your profile email is required to process payment. Please update your account.',
        )
        return
      }

      const csrfHeaders = await getCsrfHeaders({
        'Content-Type': 'application/json',
      })
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: csrfHeaders,
        credentials: 'include',
        body: JSON.stringify({
          amount: 200,
          customerId: user?.uuid,
          email: user.email.trim(),
        }),
      })

      const clientIntent = await res.json()

      if (!res.ok || !clientIntent?.clientSecret) {
        throw new Error(
          clientIntent?.error ||
          `Could not start payment (${res.status}). Try again later.`,
        )
      }

      const cardElement = elements.getElement(CardNumberElement)
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientIntent.clientSecret,
        { payment_method: { card: cardElement } },
      )

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent?.status === 'succeeded') {
        setFormData((prev) => ({
          ...prev,
          EvaluationPaymentStatus: true,
          paymentMethod: paymentIntent.payment_method,
          customerId: clientIntent.customerId,
        }))
        localStorage.setItem(
          'checkoutSession',
          JSON.stringify({
            EvaluationPaymentStatus: true,
            paymentMethod: paymentIntent.payment_method,
            customerId: clientIntent.customerId,
          }),
        )
        toast.success('Payment successful!')
        HandleFormSubmit()
        onClose()
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Keep listing form + evaluation slot; only drop unpaid checkout session.
    clearAbandonedEvaluationPaymentDraft()
    if (formData) {
      savePendingListingDraft({
        formData,
        images: listingCtx.images || [],
        thumbnail: listingCtx.thumbnail,
        videos: listingCtx.videos || [],
        qrScan: listingCtx.qrScan,
      })
    }
    setPaymentStep('choice')
    onClose()
  }

  const handleBackToPaymentChoice = () => {
    // Switching Pay in Full ↔ Installments must not clear listing/slot data.
    setPaymentStep('choice')
  }

  const persistDraftThen = async (next) => {
    if (formData) {
      savePendingListingDraft({
        formData,
        images: listingCtx.images || [],
        thumbnail: listingCtx.thumbnail,
        videos: listingCtx.videos || [],
        qrScan: listingCtx.qrScan,
      })
    }
    if (typeof next === 'function') next()
  }

  return (
    <>
      <div className='fixed inset-0 modal-bg z-10' />
      <div className='fixed inset-0 flex justify-center items-center z-20 px-4'>
        <div className='bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto z-30 px-5 py-4'>
          <div className='flex justify-end items-center mb-3'>
            <span className='cursor-pointer pr-5' onClick={handleClose}>
              <CloseIcon />
            </span>
          </div>

          <PaymentChoiceModal
            show={paymentStep === 'choice'}
            onClose={handleClose}
            amount={evaluationAmount}
            loading={clozerLoading}
            title='Payment for Evaluation'
            onPayFull={() => {
              persistDraftThen(() => setPaymentStep('stripe'))
            }}
            onPayInstallments={handleClozerPay}
          />

          {paymentStep === 'stripe' && (
            <>
              <h2 className='text-black/50 text-light-gold text-[25px] font-medium mb-4 font-montserrat'>
                Pay in Full (Card)
              </h2>
              {getFullPayDiscountPercent() > 0 && (
                <p className='text-sm text-green-700 mb-3'>
                  {getFullPayDiscountPercent()}% discount applied to evaluation fee (
                  {formatAed(applyFullPayDiscount(evaluationAmount).discounted)}{' '}
                  instead of {formatAed(evaluationAmount)} if charged after 90 days).
                </p>
              )}
              <div className='text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 w-full'>
                <p className='mb-2'>
                  We may store and use your payment details for up to{' '}
                  <strong>90 days</strong> as per our{' '}
                  <Link href='#' target='_blank' className='text-light-gold hover:underline'>
                    Terms & Conditions
                  </Link>
                  .<br />A small charge (~<strong>2 dirham</strong>) will confirm your payment method.
                </p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>If asset unsold after 90 days → <strong>{formatAed(evaluationAmount)}</strong> evaluation fee.</li>
                  <li>If asset removed before 90 days → fee still applies.</li>
                  <li>If asset sold later via <strong>Funds Verifier</strong> → fee refunded.</li>
                </ul>
              </div>
              <form
                className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-start'
                onSubmit={handleSubmit}
              >
                <div className='col-span-2 p-3 border rounded-lg space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Card Number</label>
                    <div className='p-3 border rounded-lg'>
                      <CardNumberElement />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-1'>Expiry</label>
                      <div className='p-3 border rounded-lg'>
                        <CardExpiryElement />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-1'>CVC</label>
                      <div className='p-3 border rounded-lg'>
                        <CardCvcElement />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end items-center gap-2 sm:col-span-2'>
                  <button
                    type='button'
                    onClick={handleBackToPaymentChoice}
                    className='border-2 border-gray-300 text-[15px] px-6 py-3'
                  >
                    Back
                  </button>
                  <button
                    type='submit'
                    disabled={loading || !stripe}
                    className='bg-light-gold text-white text-[15px] px-8 py-3 disabled:opacity-50'
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default PaymentModal
