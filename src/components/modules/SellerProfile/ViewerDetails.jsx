'use client'

import { useEffect, useState } from 'react'
import GlobalLoader from '@/utils/GlobalLoader'
import { TriangleAlertIcon, UploadCloudIcon } from 'lucide-react'
import { handleFileUpload, resolveCertificateUploadUrl } from '@/libs/uploadAsset'
import { toast } from 'react-toastify'
import { useProfile } from '../../../context/UserContext'
import Modal from '../../product-modal/modal'
import CancelTransferModal from '@/components/Modals/CancelTransferModal'
import TransferPaymentLinkModal from '@/components/Modals/TransferPaymentLinkModal'
import customAxios from '../../../utils/apis/apis'
import {
  getListingImageSrc,
  getListingVideoSrc,
} from '@/libs/listingCardMedia'
import { getListingAmenities } from '@/libs/listingAmenities'
import { parseSlotTimeOnDate } from '@/libs/slotTimeFilters'
import {
  formatTransactionPhase,
  transactionPhaseBadgeClass,
} from '@/libs/transactionPhase'

const ViewerDetails = ({ bookingId, handleClose }) => {
  const [viewerData, setViewerData] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState('myself')
  const [assignSubmitting, setAssignSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [assignmentLocked, setAssignmentLocked] = useState(false)
  const [isTimeCritical, setIsTimeCritical] = useState(false)
  const [TransferFile, setTransferFile] = useState(null)
  const [TransferProofFile, setTransferProofFile] = useState(null)
  const [transferDocUploading, setTransferDocUploading] = useState(false)
  const [transferProofUploading, setTransferProofUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [transferDocOpen, setTransferDocOpen] = useState(false)
  const [isCancelTransferModalOpen, setIsCancelTransferModalOpen] = useState(false)
  const [paymentLinkModal, setPaymentLinkModal] = useState({
    open: false,
    url: '',
    recipientEmail: '',
    emailFailed: false,
  })
  const [TransferProof, setTransferProof] = useState({
    PaymentProof: '',
  })

  const [TransferDocs, setTransferDocs] = useState({
    fees: 0,
    assetTransferDocument: '',
  })
  const [loading, setLoading] = useState(false)
  const [transferActionLoading, setTransferActionLoading] = useState(null)
  const [error, setError] = useState('')
  const { user } = useProfile()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      e.target.value = ''
      return
    }

    setTransferFile(file)
    setTransferDocUploading(true)
    try {
      const data = await handleFileUpload(file)
      const docUrl = resolveCertificateUploadUrl(data)
      if (!docUrl) {
        toast.error('Upload finished but no document URL was returned.')
        setTransferFile(null)
        e.target.value = ''
        return
      }
      setTransferDocs((prev) => ({
        ...prev,
        assetTransferDocument: docUrl,
      }))
      toast.success('Transfer document uploaded.')
    } catch (err) {
      console.error('Transfer document upload failed:', err)
      setTransferFile(null)
      e.target.value = ''
      toast.error(err?.message || 'Failed to upload transfer document.')
    } finally {
      setTransferDocUploading(false)
    }
  }

  const handleFileChange2 = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      e.target.value = ''
      return
    }

    setTransferProofFile(file)
    setTransferProofUploading(true)
    try {
      const data = await handleFileUpload(file)
      const docUrl = resolveCertificateUploadUrl(data)
      if (!docUrl) {
        toast.error('Upload finished but no document URL was returned.')
        setTransferProofFile(null)
        e.target.value = ''
        return
      }
      setTransferProof((prev) => ({
        ...prev,
        PaymentProof: docUrl,
      }))
      toast.success('Payment proof uploaded.')
    } catch (err) {
      console.error('Payment proof upload failed:', err)
      setTransferProofFile(null)
      e.target.value = ''
      toast.error(err?.message || 'Failed to upload payment proof.')
    } finally {
      setTransferProofUploading(false)
    }
  }

  const handleFeeChange = (e) => {
    setTransferDocs((prev) => ({
      ...prev,
      fees: e.target.value,
    }))
  }

  const openPaymentLinkModal = ({ paymentUrl, recipientEmail, emailFailed }) => {
    if (!paymentUrl) return
    setPaymentLinkModal({
      open: true,
      url: paymentUrl,
      recipientEmail: recipientEmail || '',
      emailFailed: Boolean(emailFailed),
    })
  }

  const handlePaymentLinkResponse = (response) => {
    const emailSent = response?.data?.emailSent !== false
    const paymentUrl = response?.data?.PaymentUrl
    const recipientEmail = response?.data?.recipientEmail

    if (emailSent) {
      return { successToast: true, paymentUrl }
    }

    if (paymentUrl) {
      openPaymentLinkModal({
        paymentUrl,
        recipientEmail,
        emailFailed: true,
      })
    }

    return { successToast: false, paymentUrl }
  }

  const handleSubmit = async () => {
    if (!TransferDocs.assetTransferDocument) {
      toast.error('Please upload transfer documents.')
      return
    }
    if (!TransferDocs?.fees || TransferDocs?.fees <= 0) {
      toast.error('Please enter a valid success fee.')
      return
    }
    const dataToSend = {
      success_url: window.location.origin,
      assetTransferDocument: TransferDocs.assetTransferDocument,
      fees: Number(TransferDocs.fees),
    }
    try {
      const response = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/ready-to-transfer`,
        dataToSend,
        { params: { id: bookingId } }
      )

      const { successToast } = handlePaymentLinkResponse(response)

      if (successToast) {
        toast.success(
          'Payment link sent to the seller by email. They must pay and upload the fee invoice before you confirm transfer.',
        )
      } else {
        toast.warning(
          response?.data?.mailError ||
          response?.data?.message ||
          'Transfer saved. Share the payment link with the seller manually.',
        )
      }

      await fetchBookingDetails({ silent: true })
    } catch (error) {
      console.error('Error sending mail:', error)
      toast.error(
        error?.response?.data?.message || error?.message || 'Not submitted.',
      )
    }
  }

  const handleCancelTransfer = async () => {
    if (!bookingId) return
    if (viewerData?.productData?.transferDocuments?.PaymentProof) return

    setTransferActionLoading('cancel')
    try {
      await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/cancel-transfer`,
        {},
        { params: { id: bookingId } },
      )
      setTransferDocs({ fees: 0, assetTransferDocument: '' })
      setTransferFile(null)
      setTransferProof({ PaymentProof: '' })
      setIsCancelTransferModalOpen(false)
      toast.success('Transfer submission cancelled.')
      await fetchBookingDetails({ silent: true })
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Could not cancel transfer submission.',
      )
    } finally {
      setTransferActionLoading(null)
    }
  }

  const handleResendPayment = async () => {
    if (!bookingId) return
    if (viewerData?.productData?.transferDocuments?.PaymentProof) return

    setTransferActionLoading('resend')
    try {
      const response = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/transfer-payment/resend`,
        { success_url: window.location.origin },
        { params: { id: bookingId } },
      )

      const { successToast } = handlePaymentLinkResponse(response)

      if (successToast) {
        toast.success('Payment link resent to the seller by email.')
      } else {
        toast.warning(
          response?.data?.mailError ||
          response?.data?.message ||
          'Could not send payment email. Use the payment link popup to share manually.',
        )
      }

      await fetchBookingDetails({ silent: true })
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Could not resend payment link.',
      )
    } finally {
      setTransferActionLoading(null)
    }
  }

  const adminOptions = [
    { id: 1, name: 'Myself', value: 'myself' },
    { id: 2, name: 'FV Admin', value: 'fv_admin' },
  ]

  const fetchBookingDetails = async ({ silent = false } = {}) => {
    if (!bookingId) return
    const showBlockingLoader = !silent && !viewerData
    if (showBlockingLoader) {
      setLoading(true)
      setError('')
    }
    try {
      const response = await customAxios.get(
        `/arrange-view/bookings/${bookingId}`,
      )
      const data = response?.data
      if (!data) {
        throw new Error('Booking details were empty.')
      }
      setViewerData(data)
      const savedAssignee = data?.viewAssignedTo
      if (savedAssignee === 'myself' || savedAssignee === 'fv_admin') {
        setSelectedAdmin(savedAssignee)
      }

      const savedTransfer = data?.productData?.transferDocuments || {}
      setTransferDocs({
        fees: Number(savedTransfer.successFee) || 0,
        assetTransferDocument: savedTransfer.assetTransferDocument || '',
      })
      setTransferProof({
        PaymentProof: savedTransfer.PaymentProof || '',
      })
      if (savedTransfer.assetTransferDocument) {
        setTransferFile(null)
      }
    } catch (err) {
      console.error('Error fetching booking details', err)
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load booking details. Please try again later.'
      if (!silent || !viewerData) {
        setError(msg)
      }
      if (showBlockingLoader) {
        setViewerData(null)
      }
    } finally {
      if (showBlockingLoader) {
        setLoading(false)
      }
    }
  }

  const handleTransferProof = async () => {
    if (!TransferProof.PaymentProof) {
      toast.error('Please upload payment proof first.')
      return
    }
    try {
      const response = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/transfer-proof`,
        { ...TransferProof },
        { params: { id: bookingId } },
      )
      toast.success(
        response?.data?.message || 'Success fee invoice submitted successfully.',
      )
      await fetchBookingDetails({ silent: true })
    } catch (err) {
      console.error('Error sending transfer proofs:', err)
      toast.error(
        err?.response?.data?.message || err?.message || 'Could not submit payment proof.',
      )
    }
  }

  const handleAssignSubmit = async () => {
    if (assignmentLocked) {
      toast.error('Assignment cannot be changed after the viewing time has passed.')
      return
    }
    if (!bookingId) {
      toast.error('Missing booking reference.')
      return
    }

    setAssignSubmitting(true)
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/trustee/update/${bookingId}`,
        { viewAssignedTo: selectedAdmin },
      )
      toast.success('Viewing assignment saved.')
      await fetchBookingDetails({ silent: true })
    } catch (err) {
      console.error('Error saving viewing assignment:', err)
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Could not save assignment.',
      )
    } finally {
      setAssignSubmitting(false)
    }
  }

  const handleMarkAsTransfered = async () => {
    try {
      const response = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/mark-as-transfer`,
        {},
        { params: { id: bookingId } }
      )
      toast.success('Asset marked as transferred.')
      await fetchBookingDetails({ silent: true })
    } catch (err) {
      console.error('Error marking asset as transferred:', err)
      toast.error(err?.response?.data?.message || err?.message)
    }
  }

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  useEffect(() => {
    if (user?.role !== 'Trustee' || !viewerData) return

    const transferDocuments = viewerData?.productData?.transferDocuments || {}
    const submitted = Boolean(transferDocuments.assetTransferDocument)
    const proofReceived = Boolean(transferDocuments.PaymentProof)
    if (!submitted || proofReceived) return

    const interval = setInterval(() => {
      fetchBookingDetails({ silent: true })
    }, 15000)

    return () => clearInterval(interval)
  }, [user?.role, viewerData, bookingId])

  useEffect(() => {
    if (!viewerData) return

    const bookingTime =
      parseSlotTimeOnDate(viewerData?.date, viewerData?.time) ||
      new Date(viewerData?.date || Date.now())

    const updateTimer = () => {
      const currentTime = new Date()
      const timeDifference = bookingTime.getTime() - currentTime.getTime()

      if (timeDifference <= 0) {
        setTimeLeft('The time has passed.')
        setAssignmentLocked(true)
        setIsTimeCritical(false)
      } else {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60))
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
        )
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        setTimeLeft(`${days}d ${hours % 24}h ${minutes}m ${seconds}s left`)
        setAssignmentLocked(false)
        setIsTimeCritical(hours < 8)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [viewerData])

  const handleAdminSelection = (value) => {
    if (assignmentLocked) return
    setSelectedAdmin(value)
  }

  if (loading && !viewerData) {
    return (
      <div className='flex min-h-[280px] w-full items-center justify-center px-6 py-12'>
        <GlobalLoader />
      </div>
    )
  }

  if (error && !viewerData) {
    return (
      <div className='relative w-full bg-white px-6 py-8'>
        <button
          type='button'
          className='absolute right-4 top-4 rounded-lg border border-[#002d4f] px-3 py-1 text-sm font-medium text-[#002d4f] transition hover:bg-slate-50'
          onClick={handleClose}
        >
          Close
        </button>
        <h2 id='viewer-details-title' className='mb-2 text-lg font-bold text-red-600'>
          Error
        </h2>
        <p className='text-slate-600'>{error}</p>
      </div>
    )
  }

  if (!viewerData) {
    return (
      <div className='relative w-full bg-white px-6 py-8'>
        <button
          type='button'
          className='absolute right-4 top-4 rounded-lg border border-[#002d4f] px-3 py-1 text-sm font-medium text-[#002d4f] transition hover:bg-slate-50'
          onClick={handleClose}
        >
          Close
        </button>
        <p className='text-slate-600'>No booking details available.</p>
      </div>
    )
  }

  const formatFieldValue = (value) => {
    if (value == null || value === '') return ''
    if (typeof value === 'object') return ''
    return String(value)
  }

  const product = viewerData?.productData || {}
  const listingTitle = product?.title || ''
  const listingType = product?.assetType || ''
  const listingPrice = product?.price
  const assetFields = Array.isArray(product?.fields)
    ? product.fields.filter((field) => {
      const value = formatFieldValue(field?.value)
      return value !== ''
    })
    : []
  const galleryImages = (() => {
    const items = []
    const seen = new Set()
    const push = (img) => {
      const src = getListingImageSrc(img)
      if (!src || src === '/listing/camera.svg' || seen.has(src)) return
      seen.add(src)
      items.push(img)
    }
    const thumbs = product?.thumbnailImg?.images
    if (Array.isArray(thumbs)) thumbs.forEach(push)
    const pics = product?.pictures?.images
    if (Array.isArray(pics)) pics.forEach(push)
    return items
  })()
  const videoItems = Array.isArray(product?.video?.videos)
    ? product.video.videos
      .map((v) => ({
        src: getListingVideoSrc(v),
        key: v?.uuid || v?._id || v?.url,
      }))
      .filter((v) => v.src)
    : []
  const qrSrc = (() => {
    const qr = product?.qrScan
    if (!qr) return ''
    if (Array.isArray(qr?.images) && qr.images.length) {
      return getListingImageSrc(qr.images[0])
    }
    return getListingImageSrc(qr)
  })()
  const amenitiesList =
    Array.isArray(product?.amenities) && product.amenities.length
      ? product.amenities
      : getListingAmenities(product)
  const broker = viewerData?.brokerId || {}
  const name = broker.name ?? ''
  const email = broker.email ?? ''
  const phone = broker.phone ?? broker.phoneNumber ?? ''
  const assetHolder = viewerData?.assetHolder || {}
  const sellerName = assetHolder.name ?? ''
  const sellerEmail = assetHolder.email ?? ''
  const sellerPhone = assetHolder.phone ?? assetHolder.phoneNumber ?? ''
  const transferDocuments = viewerData?.productData?.transferDocuments || {}
  const transferPhase =
    viewerData?.productData?.transactionPhase ||
    (viewerData?.productData?.dealClosed
      ? 'transferred'
      : transferDocuments.PaymentProof
        ? 'payment_proof_received'
        : transferDocuments.assetTransferDocument
          ? 'awaiting_payment'
          : null)
  const hasTransferDocSubmitted = Boolean(
    transferDocuments.assetTransferDocument,
  )
  const submittedSuccessFee = (() => {
    const apiFee = Number(transferDocuments.successFee)
    const stateFee = Number(TransferDocs.fees)
    if (Number.isFinite(apiFee) && apiFee > 0) return apiFee
    if (Number.isFinite(stateFee) && stateFee > 0) return stateFee
    return 0
  })()
  const submittedTransferDocUrl = transferDocuments.assetTransferDocument || ''
  const storedPaymentUrl = transferDocuments.paymentUrl || ''
  const hasPaymentProof = Boolean(transferDocuments.PaymentProof)
  const missingRecordedFee =
    hasTransferDocSubmitted && submittedSuccessFee <= 0 && !hasPaymentProof
  const isAssetHolderRole = user?.role === 'AssetHolder'
  const isAssetHolderViewer =
    isAssetHolderRole &&
    (assetHolder?._id === user?._id ||
      assetHolder?.uuid === user?.uuid ||
      String(assetHolder?._id) === String(user?._id) ||
      !assetHolder?._id)

  const DetailBox = ({ label, value, wide = false, multiline = false }) => {
    const text = value == null || value === '' ? '—' : String(value)
    const useArea = multiline || text.length > 36
    return (
      <div className={`flex min-w-0 flex-col ${wide ? 'sm:col-span-2' : ''}`}>
        <label className='mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500'>
          {label}
        </label>
        {useArea ? (
          <textarea
            value={text}
            rows={text.length > 80 ? 3 : 2}
            className='resize-none break-words whitespace-pre-wrap rounded-lg border border-[#8d7c3b] bg-white px-3 py-2.5 text-sm text-[#002d4f] outline-none'
            readOnly
            disabled
          />
        ) : (
          <input
            type='text'
            value={text}
            className='rounded-lg border border-[#8d7c3b] bg-white px-3 py-2.5 text-sm text-[#002d4f] outline-none'
            readOnly
            disabled
          />
        )}
      </div>
    )
  }

  const buyerBlock = (
    <div>
      <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
        Buyer details
      </h3>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
        <DetailBox label='Buyer name' value={name} wide multiline />
        <DetailBox label='Buyer email' value={email} multiline />
        <DetailBox label='Buyer phone' value={phone} />
      </div>
    </div>
  )

  const sellerBlock = (
    <div>
      <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
        Seller details
      </h3>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
        <DetailBox label='Seller name' value={sellerName} wide multiline />
        <DetailBox label='Seller email' value={sellerEmail} multiline />
        <DetailBox label='Seller phone' value={sellerPhone} />
      </div>
    </div>
  )

  return (
    <div className='flex h-full w-full flex-col bg-white'>
      <div className='sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-5'>
        <div className='min-w-0 pr-2'>
          <h2
            id='viewer-details-title'
            className='text-base font-bold leading-snug text-[#002d4f] sm:text-lg'
          >
            Booking &amp; asset details
          </h2>
          {listingTitle ? (
            <p className='mt-1 break-words text-sm font-medium leading-snug text-slate-600'>
              {listingTitle}
              {listingType ? (
                <span className='font-normal text-slate-500'>
                  {' '}
                  · {listingType}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
        <button
          type='button'
          className='shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-[#002d4f] transition hover:bg-slate-50'
          onClick={handleClose}
        >
          Close
        </button>
      </div>

      <div className='space-y-7 px-4 py-5 sm:px-5 sm:py-6'>
        {/* Asset holders care most about who booked; show buyer first */}
        {isAssetHolderRole ? buyerBlock : sellerBlock}

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Asset details
          </h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
            {listingTitle ? (
              <DetailBox label='Property / listing' value={listingTitle} wide multiline />
            ) : null}
            {listingType ? (
              <DetailBox label='Asset type' value={listingType} />
            ) : null}
            {listingPrice != null && listingPrice !== '' ? (
              <DetailBox label='Price' value={listingPrice} />
            ) : null}
            {assetFields.map((field, index) => {
              const label = field?.label || `Field ${index + 1}`
              const value = formatFieldValue(field?.value)
              if (
                /^(title|asset type|price)$/i.test(String(label).trim()) &&
                (listingTitle || listingType || listingPrice != null)
              ) {
                return null
              }
              return (
                <DetailBox
                  key={`${label}-${index}`}
                  label={label}
                  value={value}
                  wide={
                    value.length > 36 ||
                    /description|map url|title/i.test(label)
                  }
                  multiline={
                    value.length > 36 ||
                    /description|map url|title/i.test(label)
                  }
                />
              )
            })}
          </div>
        </div>

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Amenities / facilities
          </h3>
          {amenitiesList.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {amenitiesList.map((item) => (
                <span
                  key={item}
                  className='rounded-full border border-[#8d7c3b]/35 bg-[#f7f4ea] px-3 py-1.5 text-xs font-medium leading-snug text-[#002d4f] sm:text-sm'
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className='text-sm text-slate-500'>No amenities</p>
          )}
        </div>

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Images
          </h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {galleryImages.length > 0 ? (
              galleryImages.map((image, index) => (
                <div
                  key={image?.uuid || image?._id || image?.url || index}
                  className='overflow-hidden rounded-xl border border-slate-200 bg-slate-50'
                >
                  <img
                    src={getListingImageSrc(image)}
                    alt={`Property Image ${index + 1}`}
                    className='aspect-[4/3] w-full object-cover'
                  />
                </div>
              ))
            ) : (
              <p className='text-sm text-slate-500'>No images</p>
            )}
          </div>
        </div>

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Video
          </h3>
          {videoItems.length > 0 ? (
            <div className='grid grid-cols-1 gap-3'>
              {videoItems.map((video, index) => (
                <video
                  key={video.key || index}
                  src={video.src}
                  controls
                  className='aspect-video w-full rounded-xl bg-black object-contain'
                />
              ))}
            </div>
          ) : (
            <p className='text-sm text-slate-500'>No video</p>
          )}
        </div>

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            QR code
          </h3>
          {qrSrc && qrSrc !== '/listing/camera.svg' ? (
            <img
              src={qrSrc}
              alt='Listing QR code'
              className='h-44 w-44 rounded-xl border border-slate-200 bg-white object-contain p-3'
            />
          ) : (
            <p className='text-sm text-slate-500'>No QR code</p>
          )}
        </div>

        {isAssetHolderRole ? sellerBlock : buyerBlock}

        <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
          <div className='min-w-0 flex-1'>
            <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
              Booked slots
            </h3>
            <input
              type='text'
              value={viewerData?.time || ''}
              className='bg-white w-full py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue outline-none'
              disabled
            />
          </div>

          <div className='min-w-0 flex-1'>
            <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
              Time left until booking
            </h3>
            <div
              className={`py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue ${isTimeCritical ? 'text-red-500 border-red-500' : ''
                }`}
            >
              {timeLeft}
            </div>
          </div>
        </div>

        {user?.role === 'Trustee' ? (
          <>
            <div>
              <div className='mb-3 flex flex-wrap items-center gap-3'>
                <h3 className='text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
                  Step 1: Send transfer documents &amp; success fee
                </h3>
                {transferPhase ? (
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${transactionPhaseBadgeClass(transferPhase)}`}
                  >
                    {formatTransactionPhase(transferPhase)}
                  </span>
                ) : null}
              </div>
              <p className='mb-3 text-sm text-slate-600'>
                Upload the transfer document and enter the success fee. The seller
                (asset holder) will receive a payment link by email.
              </p>

              {hasTransferDocSubmitted ? (
                <div className='mb-3 rounded-md border border-light-gold/50 bg-light-gold/10 px-3 py-3 text-sm text-prussianBlue'>
                  <p className='font-medium'>Submitted to broker</p>
                  <p className='mt-1'>
                    Success fee:{' '}
                    <span className='font-semibold'>
                      {submittedSuccessFee > 0
                        ? `AED ${submittedSuccessFee.toLocaleString()}`
                        : 'Not recorded'}
                    </span>
                  </p>
                  {missingRecordedFee ? (
                    <p className='mt-1 text-amber-800'>
                      Fee was not saved on this submission. Use Cancel, then
                      submit again with the correct amount.
                    </p>
                  ) : null}
                  <p className='mt-1 text-prussianBlue/80'>
                    Waiting for the seller to pay the success fee and upload the
                    invoice.
                  </p>
                  {submittedTransferDocUrl ? (
                    <button
                      type='button'
                      onClick={() => setTransferDocOpen(true)}
                      className='mt-2 text-sm font-medium text-[#002d4f] underline'
                    >
                      View submitted transfer document
                    </button>
                  ) : null}
                  {storedPaymentUrl && !hasPaymentProof ? (
                    <button
                      type='button'
                      onClick={() =>
                        openPaymentLinkModal({
                          paymentUrl: storedPaymentUrl,
                          recipientEmail: assetHolder?.email || '',
                          emailFailed: false,
                        })
                      }
                      className='mt-2 block text-sm font-medium text-[#002d4f] underline'
                    >
                      View / copy Stripe payment link
                    </button>
                  ) : null}
                  {!hasPaymentProof ? (
                    <div className='mt-3 flex flex-wrap gap-2'>
                      <button
                        type='button'
                        onClick={handleResendPayment}
                        disabled={
                          transferActionLoading != null || missingRecordedFee
                        }
                        className='rounded-md border border-[#002d4f] px-3 py-1.5 text-sm font-medium text-[#002d4f] disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {transferActionLoading === 'resend'
                          ? 'Resending…'
                          : 'Resend payment link'}
                      </button>
                      <button
                        type='button'
                        onClick={() => setIsCancelTransferModalOpen(true)}
                        disabled={transferActionLoading != null}
                        className='rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {transferActionLoading === 'cancel'
                          ? 'Cancelling…'
                          : 'Cancel'}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className='flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center' onClick={(e) => e.stopPropagation()}>
                {/* Upload file */}
                <label
                  htmlFor='AssetTransferDocs'
                  className={`primary-gradient text-white p-2 px-4 rounded ${transferDocUploading || hasTransferDocSubmitted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className='flex items-center gap-2'>
                    <UploadCloudIcon />
                    <span>
                      {transferDocUploading
                        ? 'Uploading…'
                        : TransferFile
                          ? TransferFile.name
                          : hasTransferDocSubmitted
                            ? 'Transfer document submitted'
                            : 'Transfer document'}
                    </span>
                  </span>
                </label>
                <input
                  onChange={handleFileChange}
                  type='file'
                  className='sr-only'
                  accept='.pdf,application/pdf'
                  id='AssetTransferDocs'
                  disabled={transferDocUploading || hasTransferDocSubmitted}
                />
                {TransferDocs.assetTransferDocument && !hasTransferDocSubmitted ? (
                  <span className='text-sm font-medium text-green-700'>
                    Ready to submit
                  </span>
                ) : null}

                {/* Fee input */}
                <input
                  type='number'
                  min='0'
                  className='bg-white py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue outline-none disabled:bg-slate-100'
                  placeholder='asset success fee (AED)'
                  value={
                    hasTransferDocSubmitted
                      ? submittedSuccessFee > 0
                        ? submittedSuccessFee
                        : ''
                      : TransferDocs.fees === 0
                        ? ''
                        : TransferDocs.fees
                  }
                  onChange={handleFeeChange}
                  disabled={hasTransferDocSubmitted}
                />

                {/* Submit button */}
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={hasTransferDocSubmitted}
                  className='primary-gradient text-white p-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {hasTransferDocSubmitted ? 'Submitted' : 'Submit'}
                </button>
              </div>
            </div>
            <div>
              <h3 className='mb-1 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
                Step 2: Confirm asset transfer
              </h3>
              <p className='mb-3 text-sm text-slate-600'>
                Only after the seller has paid the success fee and uploaded the
                fee invoice, confirm that the asset transfer is complete.
              </p>
              <div className='border-l-4 border-yellow-500 bg-yellow-400/10 p-4'>
                <div className='flex'>
                  <div className='shrink-0'>
                    <TriangleAlertIcon
                      aria-hidden='true'
                      className='size-5 text-yellow-500'
                    />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-yellow-500'>
                      <span className='font-medium text-yellow-600'>
                        Warning:{' '}
                      </span>
                      Do not transfer the asset until proof of payment and the
                      success fee have been received. If you proceed without
                      confirmation, you may be responsible for paying the success
                      fee from your own earnings.
                    </p>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center'>
                <button
                  type='button'
                  onClick={() => {
                    if (!hasPaymentProof) {
                      toast.info(
                        'Fee invoice not available yet. The seller must pay and upload proof first.',
                      )
                      return
                    }
                    setIsOpen(true)
                  }}
                  className={`border p-2 px-4 rounded ${hasPaymentProof
                    ? 'border-[#002d4f] text-[#002d4f] cursor-pointer'
                    : 'border-slate-300 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  <span>
                    {hasPaymentProof
                      ? 'View seller fee invoice'
                      : 'Fee invoice not received yet'}
                  </span>
                </button>

                <button
                  type='button'
                  onClick={handleMarkAsTransfered}
                  disabled={!hasPaymentProof || viewerData?.productData?.dealClosed}
                  className='primary-gradient text-white p-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {viewerData?.productData?.dealClosed
                    ? 'Transferred'
                    : 'Mark as transferred'}
                </button>
              </div>
            </div>
          </>
        ) : isAssetHolderViewer ? (
          <div>
            <h3 className='mb-1 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
              Success fee &amp; upload invoice
            </h3>
            <p className='mb-3 text-sm text-slate-600'>
              {hasTransferDocSubmitted
                ? 'Step 1: Pay the success fee using the link in your email. Step 2: Upload your payment invoice (PDF) here for the trustee.'
                : 'The trustee has not sent transfer documents yet. You will receive an email when the success fee is due.'}
            </p>

            {transferDocuments.PaymentProof ? (
              <p className='mb-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800'>
                Fee invoice submitted. The trustee will review and complete the
                transfer.
              </p>
            ) : null}

            {hasTransferDocSubmitted ? (
              <div className='flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center'>
                <label
                  htmlFor='AssetTransferProof'
                  className={`primary-gradient text-white p-2 px-4 rounded ${transferProofUploading || transferDocuments.PaymentProof ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  <span className='flex items-center gap-2'>
                    <UploadCloudIcon />
                    <span>
                      {transferProofUploading
                        ? 'Uploading…'
                        : TransferProofFile
                          ? TransferProofFile.name
                          : transferDocuments.PaymentProof
                            ? 'Invoice submitted'
                            : 'Upload fee invoice (PDF)'}
                    </span>
                  </span>
                </label>
                <input
                  onChange={handleFileChange2}
                  type='file'
                  className='sr-only'
                  accept='.pdf,application/pdf'
                  id='AssetTransferProof'
                  disabled={
                    transferProofUploading ||
                    Boolean(transferDocuments.PaymentProof) ||
                    !hasTransferDocSubmitted
                  }
                />
                {TransferProof.PaymentProof && !transferDocuments.PaymentProof ? (
                  <span className='text-sm font-medium text-green-700'>
                    Ready to submit
                  </span>
                ) : null}
                <button
                  type='button'
                  onClick={handleTransferProof}
                  disabled={
                    Boolean(transferDocuments.PaymentProof) ||
                    !hasTransferDocSubmitted
                  }
                  className='primary-gradient text-white p-2 px-4 rounded disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {transferDocuments.PaymentProof ? 'Submitted' : 'Submit invoice'}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className='rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
            The seller pays the success fee and uploads the invoice to the
            trustee after transfer documents are sent.
          </div>
        )}

        {user?.role === 'Trustee' ? (
          <div>
            <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
              Assign booking view
            </h3>
            <p className='mb-3 text-sm text-slate-600'>
              Choose who will handle this viewing: you (Myself) or FV Admin.
            </p>
            <div className='flex flex-wrap items-start gap-4'>
              {adminOptions.map((admin) => (
                <div
                  className='flex text-prussianBlue items-center'
                  key={admin?.id}
                >
                  <input
                    id={admin.value}
                    type='radio'
                    name='viewAssignedTo'
                    value={admin.value}
                    checked={selectedAdmin === admin.value}
                    onChange={() => handleAdminSelection(admin.value)}
                    disabled={assignmentLocked}
                    className='mr-2'
                  />
                  <label
                    htmlFor={admin.value}
                    className='text-sm font-medium text-gray-700'
                  >
                    {admin.name}
                  </label>
                </div>
              ))}
            </div>
            {assignmentLocked ? (
              <p className='mt-2 text-sm text-amber-700'>
                Assignment is locked because the viewing time has passed.
              </p>
            ) : isTimeCritical ? (
              <p className='mt-2 text-sm text-amber-700'>
                Viewing is soon — save your assignment before the slot starts.
              </p>
            ) : null}
            <button
              type='button'
              onClick={handleAssignSubmit}
              disabled={assignSubmitting || assignmentLocked}
              className='primary-gradient mt-4 rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              {assignSubmitting ? 'Saving…' : 'Save assignment'}
            </button>
          </div>
        ) : null}

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          fileUrl={viewerData?.productData?.transferDocuments?.PaymentProof}
        />
        <Modal
          isOpen={transferDocOpen}
          onClose={() => setTransferDocOpen(false)}
          fileUrl={submittedTransferDocUrl}
        />
        {isCancelTransferModalOpen ? (
          <CancelTransferModal
            onClose={() => {
              if (transferActionLoading !== 'cancel') {
                setIsCancelTransferModalOpen(false)
              }
            }}
            onConfirm={handleCancelTransfer}
            loading={transferActionLoading === 'cancel'}
          />
        ) : null}
        {paymentLinkModal.open ? (
          <TransferPaymentLinkModal
            paymentUrl={paymentLinkModal.url}
            recipientEmail={paymentLinkModal.recipientEmail}
            emailFailed={paymentLinkModal.emailFailed}
            onClose={() =>
              setPaymentLinkModal((prev) => ({ ...prev, open: false }))
            }
          />
        ) : null}
      </div>
    </div>
  )
}

export default ViewerDetails
