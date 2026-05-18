import React, { useEffect, useState } from 'react'
import { Upload2Icon } from '@/components/Icons'
import { useSearchParams, usePathname } from 'next/navigation'
import axios from 'axios'
import ViewModal from '@/components/Modals/ViewModal'
import { handleFileUpload } from '@/libs/uploadAsset'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import { toast } from 'react-toastify'
import Modal from '../../../components/documents/modal'
import customAxios from '../../../utils/apis/apis'

const AssetDetails = () => {
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
  const assetType = searchParams.get('assetType')
  const type = assetType?.split(' ')[0]

  useEffect(() => {
    if (assetType && id && type) {
      handleFetchdata()
    }
  }, [])

  const handleOpenDoc = (url) => {
    setPdfUrl(url)
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
      { label: 'Market Price', value: selectedProperty?.evaluationPrices },
      {
        label: 'Roi',
        value: selectedProperty?.roi ? `${selectedProperty?.roi}%` : null,
      },
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
          <span className='lg:text-4xl sm:text-2xl text-base font-bold text-prussianBlue/80 mb-4 block'>
            Assigned Transactions
          </span>
          <div className='gap-2 md:px-8 px-4 py-4 w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4'>
              {fieldsMap[selectedProperty?.type]?.map((field, index) =>
                renderField(field.label, field.value, field.fieldType)
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default AssetDetails
