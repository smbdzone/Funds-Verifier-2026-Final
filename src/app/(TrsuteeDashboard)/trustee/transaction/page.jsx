'use client'
import React, { useEffect, useState } from 'react'
import AllTransactions from '../../../../components/modules/TrusteeProfile/AllTransactions'
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

  return (
    <div>
      <AllTransactions listings={listings} />
    </div>
  )
}

export default Page
