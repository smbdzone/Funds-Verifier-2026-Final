/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from 'react'
import { getTokenFromCookie } from '../../../../utils/helper'

const fetchListingsData = async () => {
  const token = getTokenFromCookie()

  try {
    const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
      await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/boat`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/property`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/car`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

    if (
      !boatResponse.ok ||
      !propertyResponse.ok ||
      !carResponse.ok ||
      !jewelryResponse.ok
    ) {
      throw new Error('Failed to fetch listings data')
    }

    const [boatData, propertyData, carData, jewelryData] = await Promise.all([
      boatResponse.json(),
      propertyResponse.json(),
      carResponse.json(),
      jewelryResponse.json(),
    ])

    const filteredBoatListings = boatData.products.filter(
      (item) =>
        item.status === undefined || item.status === 1 || item.status === 0
    )
    const filteredPropertyListings = propertyData.products.filter(
      (item) =>
        item.status === undefined || item.status === 1 || item.status === 0
    )
    const filteredCarListings = carData.products.filter(
      (item) =>
        item.status === undefined || item.status === 1 || item.status === 0
    )
    const filteredJewelryListings = jewelryData.products.filter(
      (item) =>
        item.status === undefined || item.status === 1 || item.status === 0
    )

    return [
      ...filteredPropertyListings.map((item) => ({
        ...item,
        type: 'property',
      })),
      ...filteredBoatListings.map((item) => ({ ...item, type: 'boat' })),
      ...filteredCarListings.map((item) => ({ ...item, type: 'car' })),
      ...filteredJewelryListings.map((item) => ({ ...item, type: 'jewelry' })),
    ]
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}

const page = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchListingsData()
        setListings(data)
      } catch (error) {
        setError(error.message)
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
