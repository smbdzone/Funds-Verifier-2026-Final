'use client'
import React, { useEffect, useState } from 'react'
import customAxios from '@/utils/apis/apis'

const fetchListingsData = async () => {
  const [boatRes, propertyRes, carRes, jewelryRes] = await Promise.all([
    customAxios.get('/boat', { params: { limit: 500, page: 1 } }),
    customAxios.get('/property', { params: { limit: 500, page: 1 } }),
    customAxios.get('/car', { params: { limit: 500, page: 1 } }),
    customAxios.get('/jewelry', { params: { limit: 500, page: 1 } }),
  ])

  const keepListing = (item) =>
    item.status === undefined || item.status === 1 || item.status === 0

  return [
    ...propertyRes.data.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'property',
    })),
    ...boatRes.data.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'boat',
    })),
    ...carRes.data.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'car',
    })),
    ...jewelryRes.data.products.filter(keepListing).map((item) => ({
      ...item,
      type: 'jewelry',
    })),
  ]
}

const fetchAssignedTransactionsCount = async () => {
  const response = await customAxios.get('/arrange-view/bookings', {
    params: { assignedTo: 'fv_admin' },
  })

  return Array.isArray(response.data) ? response.data.length : 0
}

const page = () => {
  const [listings, setListings] = useState([])
  const [assignedCount, setAssignedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [data, assignedTotal] = await Promise.all([
          fetchListingsData(),
          fetchAssignedTransactionsCount(),
        ])
        setListings(data)
        setAssignedCount(assignedTotal)
      } catch (error) {
        setError(error?.response?.data?.message || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Initialize counts for each category
  const statusCounts = listings.reduce(
    (acc, item) => {
      // Count completed and pending statuses
      if (item.transactionStatus === 'completed') acc.completed++
      else if (item.transactionStatus === 'pending') acc.pending++

      // Count complaints
      if (item.complaint) acc.complaints++

      return acc
    },
    { completed: 0, pending: 0, complaints: 0 }
  )
  return (
    <div className='bg-gray-100 p-6 rounded-lg primary-gradient shadow-md w-full mx-auto'>
      <h2 className='lg:text-xl sm:text-lg text-base font-semibold text-white text-gray-800 mb-4'>
        Performance Metrics
      </h2>
      <ul className='space-y-3'>
        <li className='flex items-center justify-between bg-white p-4 rounded-md shadow-sm'>
          <span className='text-prussianBlue sm:text-base text-sm font-medium'>
            Assigned Transactions
          </span>
          <span className='text-purple-600 sm:text-base text-sm font-bold'>
            {assignedCount}
          </span>
        </li>
        <li className='flex items-center justify-between bg-white p-4 rounded-md shadow-sm'>
          <span className='text-prussianBlue sm:text-base text-sm font-medium'>
            Transactions Completed
          </span>
          <span className='text-green-600 sm:text-base text-sm font-bold'>
            {statusCounts.completed}
          </span>
        </li>
        <li className='flex items-center justify-between bg-white p-4 rounded-md shadow-sm'>
          <span className='text-prussianBlue sm:text-base text-sm font-medium'>
            Transactions Pending
          </span>
          <span className='text-yellow-600 sm:text-base text-sm font-bold'>
            {statusCounts.pending}
          </span>
        </li>
        <li className='flex items-center justify-between bg-white p-4 rounded-md shadow-sm'>
          <span className='text-prussianBlue sm:text-base text-sm font-medium'>
            Complaints Resolved
          </span>
          <span className='text-blue-600 sm:text-base text-sm font-bold'>
            {statusCounts.complaints}
          </span>
        </li>
      </ul>
    </div>
  )
}

export default page
