import React, { useEffect, useState } from 'react'
import { Upload2Icon } from '@/components/Icons'
import { useSearchParams, usePathname } from 'next/navigation'
import axios from 'axios'
import ViewModal from '@/components/Modals/ViewModal'
import { handleFileUpload } from '@/libs/uploadAsset'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import { toast } from 'react-toastify'
import Loader from '../../EvaluatorProfile/requestCompoenets/Loader'
import DocumentSection from '../../EvaluatorProfile/requestCompoenets/DocumentSection'
import Modal from '../../../documents/modal'
import customAxios from '../../../../utils/apis/apis'
import {
  getListingImageSrc,
  getListingVideoSrc,
} from '@/libs/listingCardMedia'

const EvaluationDetails = () => {
  const [selectedProperty, setSelectedProperty] = useState(null) // State to store selected property details
  const [uploadDocument, setUploadDocument] = useState([])
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
    { label: 'Price', value: formatNumberWithCommas(selectedProperty?.price) },
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
        label: 'Size in square feet',
        value: formatNumberWithCommas(selectedProperty?.sizeSQFT),
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

  const handleSubmit = async (file) => {
    setIsLoading(true)
    try {
      let apiUrl
      if (selectedProperty?.type === 'Property') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/property/${id}`
      } else if (selectedProperty?.type === 'Car') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/car/${id}`
      } else if (selectedProperty?.type === 'Boats') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/boat/${id}`
      } else if (selectedProperty?.type === 'Jewellery') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${id}`
      }

      const fileUpload = await handleFileUpload(file)

      const response = await customAxios.put(apiUrl, {
        uploadDocument: fileUpload._id,
      })

      if (response?.status === 200) {
        toast.success('File uploaded successfully.')
        setIsLoading(false)
      } else {
        alert('Failed to upload document')
        console.error('Failed to upload document:', response.data)
      }
    } catch (error) {
      console.error(
        'An error occurred while uploading the document:',
        error?.message
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDocument = () => {
    window.open(uploadDocument, '_blank')
  }

  const handleFilechange = async (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (allowedTypes.includes(selectedFile.type)) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB.')
        return
      }

      setUploadDocument(selectedFile) // Ensure key matches the backend's `req.file`
    }
  }

  const handleFileSubmit = async () => {
    await handleSubmit(uploadDocument) // Upload the files
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
          <span>{}</span>
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
                <div className='flex-1'>
                  {selectedProperty?.requestDocument &&
                  selectedProperty.requestDocument.length > 0 ? (
                    selectedProperty.requestDocument.map((doc, index) => (
                      <div key={index} className='mb-2'>
                        <p className='text-base capitalize'>{doc}</p>
                      </div>
                    ))
                  ) : (
                    <p>No requested document!</p>
                  )}
                </div>

                <label className='flex cursor-pointer flex-col py-5 sm:py-11 justify-center items-center'>
                  <input
                    type='file'
                    accept='.pdf,.doc,.docx'
                    className='hidden'
                    id='file-upload'
                    onChange={handleFilechange}
                  />

                  <span className='mb-4'>
                    <Upload2Icon className='' />
                  </span>

                  <span className='custom-shadow sm:text-base text-sm rounded py-3 my-3 px-7 font-medium mb-3'>
                    Upload Documents
                  </span>
                  <span className='text-black/30 sm:text-base text-sm'>
                    Maximum file size: 2MB
                  </span>
                  <p className='text-black'>{uploadDocument?.name}</p>
                </label>
                <div>
                  {uploadDocument.length > 0 && (
                    <div className='flex flex-col gap-2'>
                      {uploadDocument.map((file, index) => (
                        <div
                          key={index}
                          className='flex justify-between w-full'
                        >
                          <p>{file.name}</p>
                          <div className='flex gap-3'>
                            <button onClick={handleViewDocument}>
                              <img src='./icons/view.png' />
                            </button>
                            <button
                              onClick={() => {
                                const newUploadDocument = uploadDocument.filter(
                                  (_, i) => i !== index
                                )
                                setUploadDocument(newUploadDocument) // Update the state after deletion
                              }}
                            >
                              <img
                                src='./icons/delete.png'
                                className='w-full'
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='flex justify-center space-x-4'>
              <button
                onClick={() => handleFileSubmit()}
                className='primary-gradient text-white px-4 py-2 rounded-md'
              >
                Upload
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <Loader isOpen={isLoading} />
    </div>
  )
}

export default EvaluationDetails
