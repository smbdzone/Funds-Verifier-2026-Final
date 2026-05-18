import React, { useEffect, useState } from 'react'
import { Upload2Icon } from '@/components/Icons'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { handleFileUpload } from '@/libs/uploadAsset'
import { toast } from 'react-toastify'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import customAxios from '../../../utils/apis/apis'

// Function to format the date
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })?.format(date)
  } catch (error) {
    return ''
  }
}

const TransactionProgress = () => {
  const [selectedProperty, setSelectedProperty] = useState(null) // State to store selected property details
  const [uploadDocument, setUploadDocument] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [viewerData, setViewerData] = useState(null)
  const [note, setNote] = useState(null)
  const searchParams = useSearchParams()
  const path = usePathname()
  const id = path.split('/')[3]
  const assetType = searchParams.get('assetType')
  const type = assetType?.split(' ')[0]
  const router = useRouter()
  useEffect(() => {
    if (assetType && id && type) {
      handleFetchdata()
    }
  }, [])

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
    {
      label: 'Asset',
      value: `${selectedProperty?.title} at ${selectedProperty?.neighbourhood}`,
    },
    {
      label: 'Buyer',
      value: `${selectedProperty?.dealhunterId?.name || 'No Buyer'}`,
    },
    {
      label: 'Seller',
      value: `${selectedProperty?.userUUID?.name || 'No Seller'}`,
    },
    {
      label: 'Viewing Scheduled',
      value: viewerData
        ? `${formatDate(
            viewerData?.slotId?.date
          )}``${viewerData?.timeSlot?.time}`
        : 'No Schedule For Viewing',
    },
    {
      label: 'Deposit Received',
      value: selectedProperty?.transactionDepositDocument?.Certificate.name
        ? 'Received'
        : 'Pending',
    },
  ]

  const fieldsMap = {
    Property: [...commonFields],
    Car: [...commonFields],
    Boats: [...commonFields],
    Jewellery: [...commonFields],
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
        transactionDepositDocument: fileUpload.uuid,
        trusteeNote: note,
      })

      if (response?.status === 200) {
        toast.success('Uploaded successfully.')
        setIsLoading(false)
        router.replace('/trustee/transaction')
      } else {
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
    <div className='mb-4 grid grid-cols-1 gap-2 sm:gap-4'>
      <div>
        <h1 className='block lg:text-lg sm:text-base text-sm font-semibold text-prussianBlue'>
          {label}
        </h1>
        <h1 className='block lg:text-lg sm:text-base text-sm font-semibold text-prussianBlue/50'>
          {value}
        </h1>
      </div>
    </div>
  )

  const fetchBookingDetails = async () => {
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/booking/${id}`
      )
      setViewerData(response.data)
    } catch (error) {
      console.error('Error fetching booking details', error.message)
    }
  }

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  return (
    <div>
      {/* add there */}
      {!loading ? (
        <>
          <span className='lg:text-3xl sm:text-xl text-lg font-bold text-prussianBlue/80 mb-4 block'>
            Transaction Management
          </span>
          <span>{}</span>
          <div className='gap-2 px-8 py-4 w-full'>
            <div className='grid grid-cols-1 gap-4'>
              {fieldsMap[selectedProperty?.type]?.map((field, index) =>
                renderField(field.label, field.value, field.fieldType)
              )}
            </div>

            <div className='w-full mb-4 gap-4'>
              <div className='flex flex-col gap-2 !w-full'>
                <label className='primary-gradient !w-full !p-2 text-sm font-medium text-[#969696]'>
                  Transaction Deposit Receipt
                </label>
                <div className='flex-1'>
                  {selectedProperty?.transactionDepositDocument && (
                    <div className='mb-2'>
                      <p className='text-base capitalize'>
                        {
                          selectedProperty?.transactionDepositDocument
                            ?.Certificate.name
                        }
                      </p>
                    </div>
                  )}
                </div>
                {selectedProperty?.transactionDepositDocument?.Certificate
                  .name ? null : (
                  <>
                    <label className='flex cursor-pointer flex-col py-11 justify-center items-center'>
                      <input
                        type='file'
                        onChange={handleFilechange}
                        className='hidden'
                        id='file-upload'
                      />
                      <span className='mb-4'>
                        <Upload2Icon className='' />
                      </span>

                      <span className='custom-shadow sm:text-base text-sm rounded py-3  px-7  font-medium mb-3'>
                        Upload Receipt
                      </span>
                      <span className='text-black/30  sm:text-base text-sm'>
                        Maximum file size: 2MB
                      </span>
                      <p className='text-black  sm:text-base text-sm'>
                        {uploadDocument?.name}
                      </p>
                    </label>
                    <div>
                      {uploadDocument.length > 0 && (
                        <div className='flex flex-col gap-2'>
                          {uploadDocument.map((file, index) => (
                            <div
                              key={index}
                              className='flex justify-between w-full'
                            >
                              <p className='sm:text-base text-sm'>
                                {file.name}
                              </p>
                              <div className='flex gap-3'>
                                <button onClick={handleViewDocument}>
                                  <img src='./icons/view.png' />
                                </button>
                                <button
                                  onClick={() => {
                                    const newUploadDocument =
                                      uploadDocument.filter(
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
                    <div>
                      <label className='block  sm:text-base text-sm font-medium'>
                        Add Note
                      </label>
                      <div className='relative'>
                        <input
                          type='text'
                          onChange={(e) => setNote(e.target.value)}
                          className=' mt-1 block w-full pl-2 py-2.5  rounded-md bg-white  border border-[#8d7c3b] text-gray-800 focus:outline-none'
                        />
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
                  </>
                )}
              </div>
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

export default TransactionProgress
