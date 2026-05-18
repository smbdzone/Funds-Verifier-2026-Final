'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import customAxios from '../../../utils/apis/apis'

function SmbDetailsContent() {
  const [walkthrough, setWalkthrough] = useState(null)
  const [productDetails, setproductDetails] = useState(null)
  const [link3D, setLink3D] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    if (id) {
      const fetchWalkthrough = async () => {
        try {
          const response = await customAxios.get(
            `/request3d/walkthrough-request/${id}`,
          )
          setWalkthrough(response.data)
          setLink3D(response?.data?.link)

          const { product, assetType } = response.data
          const endpointMap = {
            'Property For Sale': 'property',
            'Property For Lease': 'property',
            'Car For Sale': 'car',
            'Boats For Sale': 'boat',
            'Jewellery For Sale': 'jewelry',
          }
          const endpoint = endpointMap[assetType]

          if (endpoint) {
            const productResponse = await customAxios.get(
              `/${endpoint}/${product.uuid}`,
            )
            setproductDetails(productResponse.data)
          }
        } catch (error) {
          console.error('Error fetching walkthrough details:', error)
          toast.error(
            error?.response?.data?.message ||
            'Failed to load walkthrough details.',
          )
        }
      }

      fetchWalkthrough()
    }
  }, [id])

  // SANITIZE 3D LINK
  const sanitize3DLink = (link) => {
    if (!link) return ''
    return link.trim().replace(/[\n\r<>"]/g, '')
  }

  const update3DLink = async () => {
    const sanitizedLink = sanitize3DLink(link3D)
    const requestUuid = walkthrough?.uuid || id

    if (!sanitizedLink) {
      toast.error('Please enter a valid 3D walkthrough link.')
      return
    }

    if (!requestUuid) {
      toast.error('Walkthrough request not found. Reload the page and try again.')
      return
    }

    if (
      !sanitizedLink.startsWith('http://') &&
      !sanitizedLink.startsWith('https://')
    ) {
      toast.error('Link must start with http:// or https://')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await customAxios.put(
        `/request3d/walkthrough-request/${requestUuid}`,
        { link: sanitizedLink, status: 'successful' },
      )

      setWalkthrough((prev) =>
        prev ? { ...prev, link: sanitizedLink, status: 'successful' } : prev,
      )

      toast.success(
        response?.data?.message || '3D walkthrough link saved successfully!',
      )

      window.setTimeout(() => {
        router.replace('/3d-walkthrough')
      }, 1500)
    } catch (error) {
      console.error('Error updating 3D link:', error)
      toast.error(
        error?.response?.data?.message ||
        'Failed to save 3D walkthrough link. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handle3DLinkChange = (e) => setLink3D(e.target.value)

  const commonFields = [
    { label: 'Title', value: productDetails?.title },
    { label: 'Phone Number', value: productDetails?.phoneNumber },
    { label: 'Price', value: formatNumberWithCommas(productDetails?.price) },
    { label: '3D Embedded Link', value: link3D },
  ]

  const assetSpecificFields = () => {
    switch (walkthrough?.assetType) {
      case 'Property For Sale':
      case 'Property For Lease':
        return [
          { label: 'Size in sq feet', value: formatNumberWithCommas(productDetails?.sizeSQFT) },
          { label: 'Bedrooms', value: productDetails?.bedrooms },
          { label: 'Bathrooms', value: productDetails?.bathrooms },
          { label: 'Developer', value: productDetails?.developer },
          { label: 'Is it Furnished', value: productDetails?.isFurnished ? 'Yes' : 'No' },
          { label: 'Occupancy Status', value: productDetails?.occupancyStatus },
        ]
      case 'Car For Sale':
        return [
          { label: 'Make', value: productDetails?.make },
          { label: 'Model', value: productDetails?.model },
          { label: 'Year', value: productDetails?.year },
          { label: 'Kilometers', value: formatNumberWithCommas(productDetails?.kilometers) },
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
          { label: 'Category', value: productDetails?.category },
          { label: 'Grams', value: formatNumberWithCommas(productDetails?.grams) },
          { label: 'Condition', value: productDetails?.condition },
          { label: 'Age', value: productDetails?.age },
        ]
      default:
        return []
    }
  }

  const fields = [...commonFields, ...assetSpecificFields()]

  return (
    <div className='flex w-full flex-col md:flex-row'>
      <div className='flex-1 bg-white p-4 z-20 md:rounded-lg'>
        <div className='px-4 md:px-24 lg:px-48'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {fields.map((field, index) => (
              <div key={index} className='flex flex-col'>
                <label htmlFor={field.label} className='mb-2 text-sm text-[#969696] font-medium'>
                  {field.label}
                </label>
                {field.label === '3D Embedded Link' ? (
                  <input
                    type='text'
                    id={field.label}
                    name={field.label}
                    value={link3D}
                    onChange={handle3DLinkChange}
                    className='py-2 px-2 border-4 rounded-md border-prussianBlue'
                  />
                ) : (
                  <input
                    type='text'
                    id={field.label}
                    name={field.label}
                    value={field.value || ''}
                    className='py-2 px-2 border-4 text-[#969696] rounded-md border-prussianBlue'
                    readOnly
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type='button'
            onClick={update3DLink}
            disabled={isSubmitting || !walkthrough}
            className='primary-gradient text-white px-4 py-2 m-2 rounded disabled:opacity-60'
          >
            {isSubmitting ? 'Saving…' : 'Upload 3D'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Profiledetails() {
  return (
    <Suspense
      fallback={
        <div className='p-8 text-center text-gray-600'>Loading details…</div>
      }
    >
      <SmbDetailsContent />
    </Suspense>
  )
}
