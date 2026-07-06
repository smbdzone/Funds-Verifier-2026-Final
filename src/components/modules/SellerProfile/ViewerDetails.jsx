'use client'

import { useEffect, useState } from 'react'
import GlobalLoader from '@/utils/GlobalLoader'
import { TriangleAlertIcon, UploadCloudIcon } from 'lucide-react'
import { handleFileUpload, resolveCertificateUploadUrl } from '@/libs/uploadAsset'
import { toast } from 'react-toastify'
import { useProfile } from '../../../context/UserContext'
import Modal from '../../product-modal/modal'
import customAxios from '../../../utils/apis/apis'
import { getListingImageSrc } from '@/libs/listingCardMedia'
import { parseSlotTimeOnDate } from '@/libs/slotTimeFilters'

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
  const [TransferProof, setTransferProof] = useState({
    PaymentProof: '',
  })

  const [TransferDocs, setTransferDocs] = useState({
    fees: 0,
    assetTransferDocument: '',
  })
  const [loading, setLoading] = useState(false)
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
      ...TransferDocs,
    }
    try {
      const response = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/ready-to-transfer`,
        dataToSend,
        { params: { id: bookingId } }
      )
      toast.success(
        response?.data?.message?.includes('successfully')
          ? 'Payment link sent to the seller by email. They must pay and upload the fee invoice before you confirm transfer.'
          : response?.data?.message || 'Payment link sent to the seller.',
      )
      await fetchBookingDetails({ silent: true })
    } catch (error) {
      console.error('Error sending mail:', error)
      toast.error(
        error?.response?.data?.message || error?.message || 'Not submitted.',
      )
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
      if (savedTransfer.assetTransferDocument || savedTransfer.successFee) {
        setTransferDocs({
          fees: Number(savedTransfer.successFee) || 0,
          assetTransferDocument: savedTransfer.assetTransferDocument || '',
        })
      }
      if (savedTransfer.PaymentProof) {
        setTransferProof({ PaymentProof: savedTransfer.PaymentProof })
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

  const pictures = viewerData?.productData?.pictures
  const rawGalleryImages =
    pictures?.images?.length > 0
      ? pictures.images
      : viewerData?.productData?.thumbnailImg?.images
  const galleryImages = Array.isArray(rawGalleryImages) ? rawGalleryImages : []
  const broker = viewerData?.brokerId || {}
  const name = broker.name ?? ''
  const email = broker.email ?? ''
  const phone = broker.phone ?? broker.phoneNumber ?? ''
  const transferDocuments = viewerData?.productData?.transferDocuments || {}
  const hasTransferDocSubmitted = Boolean(
    transferDocuments.assetTransferDocument,
  )
  const submittedSuccessFee =
    Number(transferDocuments.successFee) || Number(TransferDocs.fees) || 0
  const submittedTransferDocUrl = transferDocuments.assetTransferDocument || ''
  const hasPaymentProof = Boolean(transferDocuments.PaymentProof)
  const assetHolder = viewerData?.assetHolder || {}
  const isAssetHolderViewer =
    user?.role === 'AssetHolder' &&
    (assetHolder?._id === user?._id ||
      assetHolder?.uuid === user?.uuid ||
      String(assetHolder?._id) === String(user?._id))

  return (
    <div className='w-full bg-white'>
      <div className='sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-5'>
        <h2
          id='viewer-details-title'
          className='pr-8 text-base font-bold leading-snug text-[#002d4f] sm:text-lg'
        >
          Booking &amp; asset details
        </h2>
        <button
          type='button'
          className='shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-[#002d4f] transition hover:bg-slate-50'
          onClick={handleClose}
        >
          Close
        </button>
      </div>

      <div className='space-y-8 px-4 py-5 sm:px-5 sm:py-6'>
        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Asset details
          </h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
            {Array.isArray(viewerData?.productData?.fields)
              ? viewerData.productData.fields.map((field, index) => (
                <div key={`${field?.label || 'field'}-${index}`} className='flex flex-col'>
                  <label className='mb-2 text-sm font-medium text-gray-700'>
                    {field?.label || ''}
                  </label>
                  <input
                    type='text'
                    value={formatFieldValue(field?.value)}
                    className='rounded-md border-2 border-[#8d7c3b] px-2 py-2 focus:outline-none'
                    readOnly
                  />
                </div>
              ))
              : null}
          </div>
        </div>

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Images
          </h3>
          <div className='grid grid-cols-2 gap-3 sm:gap-4'>
            {galleryImages.length > 0 ? (
              galleryImages.map((image) => (
                <img
                  key={image?.uuid || image?._id || image?.url}
                  src={getListingImageSrc(image)}
                  alt={`Property Image ${image?.uuid}`}
                  className='w-full h-40 object-cover rounded-md'
                />
              ))
            ) : (
              <p className='text-sm text-slate-500'>No images</p>
            )}
          </div>
        </div>

        <div>
          <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
            Booking details
          </h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium text-gray-700'>
                Broker Name
              </label>
              <input
                type='text'
                value={name || ''}
                className='bg-white py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue outline-none'
                disabled
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium text-gray-700'>
                Broker Email
              </label>
              <input
                type='text'
                value={email || ''}
                className='bg-white py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue outline-none'
                disabled
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-2 text-sm font-medium text-gray-700'>
                Broker Phone
              </label>
              <input
                type='text'
                value={phone || ''}
                className='bg-white py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue outline-none'
                disabled
              />
            </div>
          </div>
        </div>

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
              <h3 className='mb-1 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
                Step 1: Send transfer documents &amp; success fee
              </h3>
              <p className='mb-3 text-sm text-slate-600'>
                Upload the transfer document and enter the success fee. The seller
                (asset holder) will receive a payment link by email.
              </p>

              {hasTransferDocSubmitted ? (
                <div className='mb-3 rounded-md border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-900'>
                  <p className='font-medium'>Submitted to broker</p>
                  <p className='mt-1'>
                    Success fee:{' '}
                    <span className='font-semibold'>
                      AED {submittedSuccessFee.toLocaleString()}
                    </span>
                  </p>
                  <p className='mt-1 text-green-800'>
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
                      ? submittedSuccessFee
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
      </div>
    </div>
  )
}

export default ViewerDetails
