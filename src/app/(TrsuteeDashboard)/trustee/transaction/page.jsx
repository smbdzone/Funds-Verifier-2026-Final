'use client'
import React, { useEffect, useState } from 'react'
import AllTransactions from '../../../../components/modules/TrusteeProfile/AllTransactions'
import customAxios from '@/utils/apis/apis'

const fetchListingsData = async () => {
  const [boatRes, propertyRes, carRes, jewelryRes] = await Promise.all([
    customAxios.get('/boat', { params: { limit: 500, page: 1 } }),
    customAxios.get('/property', { params: { limit: 500, page: 1 } }),
    customAxios.get('/car', { params: { limit: 500, page: 1 } }),
    customAxios.get('/jewelry', { params: { limit: 500, page: 1 } }),
  ])

  const boatData = boatRes.data
  const propertyData = propertyRes.data
  const carData = carRes.data
  const jewelryData = jewelryRes.data

  const keepListing = (item) =>
    item.status === undefined || item.status === 1 || item.status === 0

  return [
    ...propertyData.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'property',
    })),
    ...boatData.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'boat',
    })),
    ...carData.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'car',
    })),
    ...jewelryData.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'jewelry',
    })),
  ]
}

const Page = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchListingsData()
        setListings(data)
      } catch (err) {
        setError(err?.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!listings.length) {
    return <div className='p-4 text-gray-600'>No listings found.</div>
  }

  return (
    <div>
      <AllTransactions listings={listings} />
    </div>
  )
}

export default Page
