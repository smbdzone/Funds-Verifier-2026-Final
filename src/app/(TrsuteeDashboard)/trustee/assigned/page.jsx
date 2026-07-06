'use client'

import { useEffect, useState } from 'react'
import AllAssets from '../../../../components/modules/TrusteeProfile/AllAssets'
import GlobalLoader from '@/utils/GlobalLoader'
import customAxios from '@/utils/apis/apis'

function resolveListingType(product = {}) {
  const assetType = String(product.assetType || '')
  if (/car/i.test(assetType)) return 'car'
  if (/boat/i.test(assetType)) return 'boat'
  if (/jewell/i.test(assetType)) return 'jewelry'
  return 'property'
}

function mapAssignedBookingToListing(booking) {
  const product = booking?.productData || {}

  return {
    ...product,
    uuid: product.uuid || booking.uuid,
    bookingUuid: booking.uuid,
    title: product.title || 'Viewing request',
    neighbourhood: product.neighbourhood || product.city || '—',
    transactionStatus: booking.status || 'open',
    type: resolveListingType(product),
    assetType: product.assetType,
    brokerName: booking.brokerId?.name || '—',
    viewingDate: booking.date,
    viewingTime: booking.timeSlot?.time || '',
  }
}

const fetchAssignedViewings = async () => {
  const response = await customAxios.get('/arrange-view/bookings', {
    params: { assignedTo: 'fv_admin' },
  })

  return (Array.isArray(response.data) ? response.data : []).map(
    mapAssignedBookingToListing,
  )
}

const Page = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAssignedViewings()
        setListings(data)
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load assigned viewings.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <GlobalLoader />
  if (error) return <div className='p-4 text-red-600'>Error: {error}</div>

  if (!listings.length) {
    return (
      <div className='rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600'>
        No viewings assigned to FV Admin yet. Assign a viewing from the
        Viewing requests page to see it here.
      </div>
    )
  }

  return (
    <div>
      <AllAssets listings={listings} />
    </div>
  )
}

export default Page
