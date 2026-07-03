import { useEffect, useState } from 'react'
import GlobalLoader from '@/utils/GlobalLoader'
import { TriangleAlertIcon, UploadCloudIcon } from 'lucide-react'
import { handleFileUpload, resolveCertificateUploadUrl } from '@/libs/uploadAsset'
import { toast } from 'react-toastify'
import { useProfile } from '../../../context/UserContext'
import Modal from '../../product-modal/modal'
import customAxios from '../../../utils/apis/apis'
import { getListingImageSrc } from '@/libs/listingCardMedia'

const ViewerDetails = ({ bookingId, handleClose }) => {
  const [viewerData, setViewerData] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState('myself')
  const [showWarning, setShowWarning] = useState(false)
  const [assignSubmitting, setAssignSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [disableAdminSelect, setDisableAdminSelect] = useState(false)
  const [isTimeCritical, setIsTimeCritical] = useState(false)
  const [TransferFile, setTransferFile] = useState(null)
  const [TransferProofFile, setTransferProofFile] = useState(null)
  const [transferDocUploading, setTransferDocUploading] = useState(false)
  const [transferProofUploading, setTransferProofUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
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
        response?.data?.message || 'Payment link sent to the broker.',
      )
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
    try {
      const dataToSend = {
        ...TransferProof,
      }
      // console.log(dataToSend);

      const response = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/transfer-proof/${viewerData?.productData?.uuid}`,
        { ...TransferProof },
        { params: { id: bookingId } }
      )
      toast.success('Asset transfer proofs sended.')
    } catch (err) {
      console.error('Error sending transfer proofs:', err)
      toast.error(err?.message)
    }
  }

  const handleAssignSubmit = async () => {
    if (disableAdminSelect) {
      setShowWarning(true)
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
      setShowWarning(false)
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
      toast.success('Asset marked as transfered.')
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
    if (viewerData) {
      const bookingTime = new Date(viewerData?.date || Date.now())
      const updateTimer = () => {
        const currentTime = new Date()
        const timeDifference = bookingTime - currentTime

        if (timeDifference <= 0) {
          setTimeLeft('The time has passed.')
          setDisableAdminSelect(true)
        } else {
          const hours = Math.floor(timeDifference / (1000 * 60 * 60))
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          )
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

          setTimeLeft(`${days}d ${hours % 24}h ${minutes}m ${seconds}s left`)

          if (hours < 4) setDisableAdminSelect(true)
          if (hours < 8) setIsTimeCritical(true)
        }
      }

      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [viewerData])

  const handleAdminSelection = (value) => {
    if (disableAdminSelect) {
      setShowWarning(true)
      return
    }
    setSelectedAdmin(value)
    setShowWarning(false)
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
              <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
                Ready to transfer asset?
              </h3>

              <div className='flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center' onClick={(e) => e.stopPropagation()}>
                {/* Upload file */}
                <label
                  htmlFor='AssetTransferDocs'
                  className={`primary-gradient text-white p-2 px-4 rounded ${transferDocUploading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className='flex items-center gap-2'>
                    <UploadCloudIcon />
                    <span>
                      {transferDocUploading
                        ? 'Uploading…'
                        : TransferFile
                          ? TransferFile.name
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
                  disabled={transferDocUploading}
                />
                {TransferDocs.assetTransferDocument ? (
                  <span className='text-sm font-medium text-green-700'>
                    Ready to submit
                  </span>
                ) : null}

                {/* Fee input */}
                <input
                  type='number'
                  min='0'
                  className='bg-white py-2 px-2 rounded-md border text-prussianBlue border-prussianBlue outline-none'
                  placeholder='asset success fee (AED)'
                  value={TransferDocs.fees === 0 ? '' : TransferDocs.fees}
                  onChange={handleFeeChange}
                />

                {/* Submit button */}
                <button
                  type='button'
                  onClick={handleSubmit}
                  className='primary-gradient text-white p-2 px-4 rounded'
                >
                  Submit
                </button>
              </div>
            </div>
            <div>
              <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
                Asset is transferred
              </h3>
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
                      Do not transfer assets until proof of payment and the
                      success fee has been received. If you proceed without
                      confirmation, you will be responsible for paying the success
                      fee from your own earnings.
                    </p>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center'>
                <button
                  onClick={() => setIsOpen(true)}
                  className='border border-[#002d4f] text-[#002d4f] p-2 px-4 rounded cursor-pointer'
                >
                  <span>Click to see proof of success fee payment</span>
                </button>

                <button
                  type='button'
                  onClick={handleMarkAsTransfered}
                  className='primary-gradient text-white p-2 px-4 rounded'
                >
                  Mark as Transfered
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h3 className='mb-3 text-sm font-bold uppercase tracking-wide text-[#a2913e]'>
              Asset transfer proof
            </h3>

            <div className='flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center'>
              <label
                htmlFor='AssetTransferProof'
                className={`primary-gradient text-white p-2 px-4 rounded ${transferProofUploading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
              >
                <span className='flex items-center gap-2'>
                  <UploadCloudIcon />
                  <span>
                    {transferProofUploading
                      ? 'Uploading…'
                      : TransferProofFile
                        ? TransferProofFile.name
                        : 'Transfer documents'}
                  </span>
                </span>
              </label>
              <input
                onChange={handleFileChange2}
                type='file'
                className='sr-only'
                accept='.pdf,application/pdf'
                id='AssetTransferProof'
                disabled={transferProofUploading}
              />
              {TransferProof.PaymentProof ? (
                <span className='text-sm font-medium text-green-700'>
                  Ready to submit
                </span>
              ) : null}
              {/* Submit button */}
              <button
                type='button'
                onClick={handleTransferProof}
                className='primary-gradient text-white p-2 px-4 rounded'
              >
                Submit
              </button>
            </div>
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
                    disabled={disableAdminSelect}
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
            {showWarning && (
              <div className='text-red-500 text-sm mt-2'>
                Admin selection is disabled because the booking is less than 4
                hours away.
              </div>
            )}
            <button
              type='button'
              onClick={handleAssignSubmit}
              disabled={assignSubmitting || disableAdminSelect}
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
      </div>
    </div>
  )
}

export default ViewerDetails
