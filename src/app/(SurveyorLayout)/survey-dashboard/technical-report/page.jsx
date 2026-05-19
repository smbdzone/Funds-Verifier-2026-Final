'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { handleFileUpload } from '@/libs/uploadAsset'
import { toast } from 'react-toastify'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import customAxios from '../../../../utils/apis/apis'
import Modal2 from '@/components/product-modal/modal2'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'

function Page() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [reportDetails, setReportDetails] = useState(null)
  const [productDetails, setProductDetails] = useState(null)
  const [fileName, setFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [Recommended, setRecommended] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const router = useRouter()

  const reportDocSrc = reportDetails?.reportFile
    ? getListingDocumentSrc(reportDetails.reportFile)
    : ''
  // Handle file selection and validation
  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF or Word document.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB.')
      return
    }

    setSelectedFile(file)
    setFileName(file.name)
  }
  // Upload the document
  const uploadDoc = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.')
      return
    }

    if (!id) {
      toast.error('Report request not found. Go back and open a report again.')
      return
    }

    try {
      setLoading(true)

      const fileUpload = await handleFileUpload(selectedFile)
      if (!fileUpload?._id) {
        throw new Error('File upload did not return a valid document id.')
      }

      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report/${id}`,
        {
          assetId: productDetails?.uuid,
          IsRecommended: Recommended,
          reportFile: fileUpload._id,
        },
      )

      setUploadSuccess(true)
      setLoading(false)
      toast.success('Technical report uploaded successfully!', {
        autoClose: 5000,
      })
      setTimeout(() => {
        router.replace('/survey-dashboard/requested-reports?uploaded=success')
      }, 2500)
    } catch (error) {
      console.error('Error uploading document:', error)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to upload technical report. Please try again.'
      toast.error(message)
      setLoading(false)
    }
  }

  // Fetch report and product details
  useEffect(() => {
    if (id) {
      const fetchWalkthrough = async () => {
        try {
          const response = await customAxios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report/${id}`
          )

          setReportDetails(response.data)

          const { product, assetType } = response.data
          setRecommended(response?.data?.IsRecommended)

          const endpointMap = {
            'Property For Sale': 'property',
            'Property For Lease': 'property',
            'Property Off Plan For Sale': 'property',
            'Car For Sale': 'car',
            'Boats For Sale': 'boat',
            'Jewellery For Sale': 'jewelry',
          }

          const endpoint = endpointMap[assetType]

          if (endpoint) {
            const productResponse = await customAxios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/${endpoint}/${product.uuid}`
            )
            setProductDetails(productResponse.data)
          }
        } catch (error) {
          console.error('Error fetching report details:', error)
        }
      }

      fetchWalkthrough()
    }
  }, [id])

  // Common fields for all asset types
  const commonFields = [
    { label: 'Title', value: productDetails?.title },
    { label: 'Phone Number', value: productDetails?.phoneNumber },
    { label: 'Price', value: formatNumberWithCommas(productDetails?.price) },
  ]

  // Asset-specific fields
  const assetSpecificFields = () => {
    switch (reportDetails?.assetType) {
      case 'Property For Sale':
      case 'Property For Lease':
        return [
          {
            label: 'Size in sq feet',
            value: formatNumberWithCommas(productDetails?.sizeSQFT),
          },
          { label: 'Bedrooms', value: productDetails?.bedrooms },
          { label: 'Bathrooms', value: productDetails?.bathrooms },
          { label: 'Developer', value: productDetails?.developer },
          {
            label: 'Is it Furnished',
            value: productDetails?.isFurnished ? 'Yes' : 'No',
          },
          { label: 'Occupancy Status', value: productDetails?.occupancyStatus },
        ]
      case 'Car For Sale':
        return [
          { label: 'Make', value: productDetails?.make },
          { label: 'Model', value: productDetails?.model },
          { label: 'Year', value: productDetails?.year },
          {
            label: 'Kilometers',
            value: formatNumberWithCommas(productDetails?.kilometers),
          },
          { label: 'Seats', value: productDetails?.seats },
          { label: 'Doors', value: productDetails?.doors },
          { label: 'Body Condition', value: productDetails?.bodyCondition },
          { label: 'Warranty', value: productDetails?.warranty },
          { label: 'Fuel Type', value: productDetails?.fuelType },
          { label: 'No Of Cylinders', value: productDetails?.noofCylinders },
        ]
      case 'Boats For Sale':
        return [
          { label: 'Length', value: productDetails?.length },
          { label: 'Condition', value: productDetails?.condition },
          { label: 'Age', value: productDetails?.age },
          { label: 'Usage', value: productDetails?.usage },
          { label: 'Seats', value: productDetails?.seats },
        ]
      case 'Jewellery For Sale':
        return [
          { label: 'Metal Material', value: productDetails?.jewelryMetal },
          {
            label: 'Grams',
            value: formatNumberWithCommas(productDetails?.grams),
          },
          { label: 'Condition', value: productDetails?.condition },
          { label: 'Age', value: productDetails?.age },
        ]
      default:
        return []
    }
  }

  const fields = [...commonFields, ...assetSpecificFields()]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex-1 bg-white md:rounded-lg'>
        {uploadSuccess ? (
          <div
            role='alert'
            className='mx-4 md:mx-24 lg:mx-44 mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800'
          >
            Technical report uploaded successfully. Returning to requested
            reports…
          </div>
        ) : null}
        <div className='px-4 md:px-24 lg:px-44'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {fields.map((field, index) => (
              <div key={index} className='flex flex-col'>
                <label className='mb-2 text-sm text-[#969696] font-medium text-gray-700'>
                  {field.label}
                </label>
                <input
                  type='text'
                  value={field.value || ''}
                  className='py-2 px-2 border-2 text-[#969696] rounded-md border-[#8d7c3b] focus:outline-none'
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        {/* Upload Document */}
        <div className='mt-6 px-4 md:px-24 lg:px-44'>
          <div className='flex flex-col'>
            <div className='w-full flex flex-col gap-4'>
              <div className='w-full flex-col relative flex items-start justify-start'>
                {reportDocSrc ? (
                  <>
                    <label className='mb-2 text-sm font-medium text-gray-700'>
                      Uploaded Report
                    </label>
                    <div className='flex flex-wrap items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => setIsReportModalOpen(true)}
                        className='py-2 px-4 w-fit rounded-md text-white bg-[#8d7c3b] hover:opacity-90'
                      >
                        View document
                      </button>
                      <a
                        href={reportDocSrc}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='py-2 px-4 w-fit rounded-md border-2 border-[#8d7c3b] text-[#8d7c3b] hover:bg-[#8d7c3b]/10'
                      >
                        Open in new tab
                      </a>
                    </div>
                    <Modal2
                      isOpen={isReportModalOpen}
                      onClose={() => setIsReportModalOpen(false)}
                      file2Url={reportDocSrc}
                      downloadFileName={
                        reportDetails?.reportFile?.Certificate?.name ||
                        'technical-report.pdf'
                      }
                      modalTitle='Technical report'
                    />
                  </>
                ) : null}
              </div>
              <div className='w-full flex-col relative flex items-start justify-start'>
                <label className='mb-2 text-sm font-medium text-gray-700'>
                  Upload Report
                </label>
                <input
                  id='technical-report-upload'
                  type='file'
                  accept='.pdf'
                  className='absolute inset-0 opacity-0 cursor-pointer'
                  onChange={handleFileChange}
                />
                <div
                  className='py-2 px-2 border-2 rounded-md border-[#8d7c3b] w-full cursor-pointer text-gray-500'
                  onClick={() =>
                    document.getElementById('technical-report-upload')?.click()
                  }
                >
                  {fileName || 'Click to upload document'}
                </div>
              </div>
              <label htmlFor='Recommended' className='flex items-center gap-2'>
                <input
                  id='Recommended'
                  className='custom-checkbox'
                  type='checkbox'
                  checked={Recommended || false}
                  value={Recommended || false}
                  onChange={(e) => setRecommended(e.target.checked)}
                />
                <span className='text-[18px] text-gray-700'>
                  Recommended Asset
                </span>
              </label>
              <div className='flex justify-end items-center'>
                <button
                  type='button'
                  onClick={uploadDoc}
                  disabled={loading}
                  className={`bg-[#8d7c3b] w-fit text-white py-2 px-6 rounded-md focus:outline-none`}
                >
                  {loading ? 'loading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  )
}
