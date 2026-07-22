import React, { useEffect, useState } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import ViewModal from '@/components/Modals/ViewModal'
import { handleFileUpload } from '@/libs/uploadAsset'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import { formatListingPriceDisplay } from '@/libs/listingPriceDisplay'
import { formatPropertySizeDisplay } from '@/libs/propertySizeUnits'
import { toast } from 'react-toastify'
import Loader from '../../EvaluatorProfile/requestCompoenets/Loader'
import Modal from '../../../documents/modal'
import customAxios from '../../../../utils/apis/apis'
import {
  getListingImageSrc,
  getListingVideoSrc,
  getListingDocumentSrc,
} from '@/libs/listingCardMedia'
import Link from 'next/link'
import { getListingEditPath } from '@/libs/listingEditPaths'
import {
  formatRequestDocumentDate,
  getRequestDocumentName,
  isRequestDocumentFulfilled,
  normalizeRequestDocuments,
} from '@/utils/requestDocumentUtils'
import { fulfillRequestedDocument } from '@/utils/requestedDocumentUpload'

const EvaluationDetails = () => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [error, setError] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const searchParams = useSearchParams()
  const path = usePathname()
  const id = path.split('/')[3]
  // console.log({ id })

  const assetType = searchParams.get('assetType')
  const type = assetType?.split(' ')[0]

  useEffect(() => {
    if (assetType && id && type) {
      handleFetchdata()
    }
  }, [])

  const handleOpenDoc = (url) => {
    setPdfUrl(url.url)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleFetchdata = async () => {
    setLoading(true)
    try {
      let endpoint = ''

      switch (assetType) {
        case 'Property For Lease':
        case 'Property For Sale':
        case 'Property Off Plan For Sale':
          endpoint = `/property/${id}`
          break
        case 'Car For Sale':
          endpoint = `/car/${id}`
          break
        case 'Jewellery For Sale':
          endpoint = `/jewelry/${id}`
          break
        case 'Boats For Sale':
          endpoint = `/boat/${id}`
          break
        default:
          console.error('Unknown asset type:', assetType)
          return
      }
      // console.log({ endpoint })

      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        { status: 0 }
      )

      if (response.status === 200) {
        setSelectedProperty({ ...response.data, type: type })
        setLoading(false)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const commonFields = [
    { label: 'Title', value: selectedProperty?.title },
    { label: 'Phone Number', value: selectedProperty?.phoneNumber },
    { label: 'Price', value: formatListingPriceDisplay(selectedProperty) },
    {
      label: '3D embedded link',
      value: selectedProperty?.video3DWalkthrough?.link,
    },
    {
      label: 'Description',
      value: selectedProperty?.description,
      fieldType: 'textarea',
    },
  ]

  const fieldsMap = {
    Property: [
      ...commonFields,
      {
        label: 'Property size',
        value: formatPropertySizeDisplay(selectedProperty),
      },
      { label: 'Bedrooms', value: selectedProperty?.bedrooms },
      { label: 'Bathrooms', value: selectedProperty?.bathrooms },
      { label: 'Developer', value: selectedProperty?.developer },
      {
        label: 'Is it furnished',
        value: selectedProperty?.isFurnished ? 'Yes' : 'No',
      },
      { label: 'Occupancy Status', value: selectedProperty?.occupancyStatus },
      { label: 'Listing', value: selectedProperty?.listing },
    ],
    Car: [
      ...commonFields,
      { label: 'Make', value: selectedProperty?.make },
      { label: 'Model', value: selectedProperty?.model },
      { label: 'Fuel Type', value: selectedProperty?.fuelType },
      { label: 'Transmission', value: selectedProperty?.transmission },
    ],
    Boats: [
      ...commonFields,
      {
        label: 'Weight',
        value: formatNumberWithCommas(selectedProperty?.weight),
      },
      { label: 'Age', value: selectedProperty?.age },
      { label: 'Seats', value: selectedProperty?.seats },
      { label: 'Warranty', value: selectedProperty?.warranty },
    ],
    Jewellery: [
      ...commonFields,
      {
        label: 'Weight',
        value: formatNumberWithCommas(selectedProperty?.grams),
      },
      { label: 'Age', value: selectedProperty?.age },
      { label: 'Category', value: selectedProperty?.category },
      { label: 'Condition', value: selectedProperty?.condition },
    ],
  }

  const handleSubmit = async (file, requestIndex, requestName) => {
    if (!file) {
      toast.error('Please select a file to upload.')
      return
    }

    setUploadingIndex(requestIndex)
    try {
      const fileUpload = await handleFileUpload(file)
      if (!fileUpload?._id) {
        toast.error('Failed to upload document.')
        return
      }

      const response = await fulfillRequestedDocument({
        assetType: selectedProperty?.type,
        listingId: id,
        requestIndex,
        requestName,
        documentId: fileUpload._id,
      })

      if (response?.status === 200) {
        toast.success('File uploaded successfully.')
        await handleFetchdata()
      } else {
        toast.error('Failed to upload document')
      }
    } catch (uploadError) {
      console.error(
        'An error occurred while uploading the document:',
        uploadError?.message,
      )
      toast.error('Failed to upload document')
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleViewRequestedDocument = (document) => {
    const url = getListingDocumentSrc(document)
    if (!url) {
      toast.error('Document preview is not available.')
      return
    }
    window.open(url, '_blank')
  }

  const handleFilechange = async (e, requestIndex, requestName) => {
    const selectedFile = e.target.files[0]
    e.target.value = ''

    if (!selectedFile) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF or Word document.')
      return
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB.')
      return
    }

    setError(null)
    await handleSubmit(selectedFile, requestIndex, requestName)
  }

  const renderField = (label, value, fieldType = 'text') => (
    <div className='mb-4 grid grid-cols-1 gap-4'>
      <div>
        <label className='block text-sm font-medium text-[#969696]'>
          {label}
        </label>
        {fieldType === 'textarea' ? (
          <textarea
            value={value || ''}
            className='mt-1 block w-full pl-5 py-3 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'
            readOnly
          />
        ) : (
          <input
            type={fieldType}
            value={value || ''}
            className='mt-1 block w-full pl-5 py-3 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'
            readOnly
          />
        )}
      </div>
    </div>
  )

  const handleOpenMedia = (media) => {
    setSelectedMedia(media)
  }

  const handleCloseModal = () => {
    setSelectedMedia(null)
  }

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (e.target.id === 'modalOverlay') {
      handleCloseModal()
    }
  }

  return (
    <div>
      {/* add there */}
      {!loading ? (
        <>
          <span className='lg:text-4xl sm:text-2xl text-xl font-bold text-prussianBlue/80 mb-4 block'>
            Pending Evaluations
          </span>
          {selectedProperty?.uuid && assetType && (
            <div className='mb-4'>
              <Link
                href={getListingEditPath(assetType, selectedProperty.uuid)}
                className='inline-block rounded-md primary-gradient px-6 py-2 text-sm font-medium text-white'
              >
                Edit Listing
              </Link>
              <p className='mt-2 text-sm text-gray-600'>
                You can update your listing while waiting for the evaluator.
                The evaluation certificate is added by the evaluator after the
                visit — you do not need to upload it yourself.
              </p>
            </div>
          )}
          <div className='gap-2 md:px-8 px-4 py-4 w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {fieldsMap[selectedProperty?.type]?.map((field, index) =>
                renderField(field.label, field.value, field.fieldType)
              )}
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-[#969696]'>
                Media
              </label>
              <div className='mt-1 flex flex-col w-full px-3 py-3 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'>
                {selectedProperty?.video3DWalkthrough?.link ||
                  selectedProperty?.pictures?.images ? (
                  <div className='w-full h-full flex gap-2 justify-center'>
                    {/* 3D Walkthrough container */}
                    {selectedProperty?.video3DWalkthrough?.link ? (
                      <div className='relative w-64 min-h-full flex-shrink-0 rounded-sm overflow-hidden'>
                        <iframe
                          src={selectedProperty?.video3DWalkthrough?.link}
                          className='w-full h-full object-cover'
                          frameBorder='0'
                          title='3D Walkthrough'
                          style={{ pointerEvents: 'none' }}
                        />
                        <div
                          className='absolute inset-0 bg-transparent'
                          onClick={() =>
                            handleOpenMedia(
                              selectedProperty?.video3DWalkthrough?.link
                            )
                          }
                        />
                      </div>
                    ) : null}

                    {/* Remaining media container */}
                    <div className='w-full flex cursor-pointer flex-wrap gap-2'>
                      {[
                        ...(selectedProperty?.pictures
                          ? selectedProperty?.pictures?.images?.map(
                            (image) => ({
                              type: 'image',
                              src: getListingImageSrc(image),
                            })
                          )
                          : []),
                        ...(selectedProperty?.video
                          ? selectedProperty?.video?.videos?.map((video) => ({
                            type: 'video',
                            src: getListingVideoSrc(video),
                          }))
                          : []),
                      ]?.map((media, index) => (
                        <div
                          key={index}
                          className='w-28 h-28 rounded-sm overflow-hidden'
                          onClick={() => handleOpenMedia(media?.src)}
                        >
                          {media?.type === 'video' ? (
                            <video
                              src={media?.src}
                              className='w-full h-full object-cover rounded-sm'
                              controls
                            />
                          ) : (
                            <img
                              src={media?.src}
                              className='w-full h-full object-cover rounded-sm'
                              alt='Property'
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <img
                    src='/listing/no-image.png'
                    alt='No image'
                    className='w-full'
                  />
                )}
              </div>
              {selectedMedia && (
                <div>
                  <ViewModal
                    handleCloseModal={handleCloseModal}
                    handleClickOutside={handleClickOutside}
                    selectedMedia={selectedMedia}
                  />
                </div>
              )}
            </div>
            <div className='w-full'>
              <h1 className='primary-gradient !w-full !p-2 text-sm font-medium text-[#969696]'>
                Documents
              </h1>
              {selectedProperty?.technicalReport?.reportFile?.Certificate
                ?.url && (
                  <div className='flex justify-between py-2'>
                    <p className='font-semibold'>Technical Report:</p>
                    <p className=''>
                      {
                        selectedProperty?.technicalReport?.reportFile?.Certificate
                          ?.name
                      }
                    </p>
                    <div className='flex gap-2 items-center'>
                      <button
                        className='w-8 h-8'
                        title='view'
                        onClick={() =>
                          handleOpenDoc(
                            selectedProperty?.technicalReport?.reportFile
                              ?.Certificate
                          )
                        }
                      >
                        <img src='/icons/view.png' alt='View' />
                      </button>
                    </div>
                    <Modal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      fileUrl={pdfUrl}
                    />
                  </div>
                )}
              {selectedProperty?.evaluationCertificate?.Certificate?.url && (
                <div className='flex justify-between py-2'>
                  <p className='font-semibold'>Evaluation Certificate:</p>
                  <p className=''>
                    {selectedProperty?.evaluationCertificate?.Certificate?.name}
                  </p>
                  <div className='flex gap-2 items-center'>
                    <button
                      className='w-8 h-8'
                      title='view'
                      onClick={() =>
                        handleOpenDoc(
                          selectedProperty?.evaluationCertificate?.Certificate
                        )
                      }
                    >
                      <img src='/icons/view.png' alt='View' />
                    </button>
                  </div>
                  <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    fileUrl={pdfUrl}
                  />
                </div>
              )}
            </div>

            <div className='w-full mb-4 gap-4'>
              <div className='flex flex-col gap-2 !w-full'>
                <label className='primary-gradient !w-full !p-2 text-sm font-medium text-[#969696]'>
                  Requested Documents
                </label>
                <p className='text-sm text-gray-600'>
                  Upload each requested document here or from{' '}
                  <Link
                    href='/seller-profile/documents-storage'
                    className='text-blue-600 underline'
                  >
                    Document Management
                  </Link>
                  .
                </p>
                <div className='flex-1'>
                  {normalizeRequestDocuments(
                    selectedProperty?.requestDocument,
                  ).length > 0 ? (
                    normalizeRequestDocuments(
                      selectedProperty?.requestDocument,
                    ).map((doc, index) => (
                      <div
                        key={`${doc.name}-${index}`}
                        className='mb-3 flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between'
                      >
                        <div>
                          <p className='text-base capitalize'>
                            {getRequestDocumentName(doc)}
                          </p>
                          {doc.date ? (
                            <p className='text-xs text-gray-500'>
                              {formatRequestDocumentDate(doc.date)}
                            </p>
                          ) : null}
                          {isRequestDocumentFulfilled(doc) &&
                            (doc.uploadedAt || doc.document?.createdAt) ? (
                            <p className='text-xs text-gray-500'>
                              Uploaded:{' '}
                              {formatRequestDocumentDate(
                                doc.uploadedAt || doc.document?.createdAt,
                              )}
                            </p>
                          ) : null}
                        </div>
                        <div className='flex items-center gap-3'>
                          {isRequestDocumentFulfilled(doc) ? (
                            <button
                              type='button'
                              className='w-8 h-8'
                              title='view'
                              onClick={() =>
                                handleViewRequestedDocument(doc.document)
                              }
                            >
                              <img src='/icons/view.png' alt='View' />
                            </button>
                          ) : (
                            <label className='custom-shadow cursor-pointer rounded px-4 py-2 text-sm font-medium'>
                              <input
                                type='file'
                                accept='.pdf,.doc,.docx'
                                className='hidden'
                                disabled={uploadingIndex === index}
                                onChange={(e) =>
                                  handleFilechange(e, index, doc.name)
                                }
                              />
                              {uploadingIndex === index
                                ? 'Uploading...'
                                : 'Upload'}
                            </label>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No requested document!</p>
                  )}
                </div>
                {error ? <p className='text-sm text-red-600'>{error}</p> : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <Loader isOpen={uploadingIndex !== null} />
    </div>
  )
}

export default EvaluationDetails
