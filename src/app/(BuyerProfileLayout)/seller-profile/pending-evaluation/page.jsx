'use client'
import { EvaluationList } from '@/components/modules/SellerProfile/PendingEvaluation/EvaluationList'
import { useEffect, useState } from 'react'
import { getTokenFromCookie } from '../../../../utils/helper'
import GlobalLoader from '@/utils/GlobalLoader'

export default function PendingEvaluation() {
  const [listings, setListings] = useState(null) // initialize with null
  const [error, setError] = useState(null)
  const token = getTokenFromCookie()

  useEffect(() => {
    const fetchListingsData = async () => {
      try {

        const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/boat?dashboard=true`, {
              cache: 'no-store',
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/property?dashboard=true`,
              {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/car?dashboard=true`, {
              cache: 'no-store',
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry?dashboard=true`,
              {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ])

        if (
          !boatResponse.ok ||
          !propertyResponse.ok ||
          !carResponse.ok ||
          !jewelryResponse.ok
        ) {
          throw new Error('One or more fetch requests failed.')
        }

        const [boatData, propertyData, carData, jewelryData] =
          await Promise.all([
            boatResponse.json(),
            propertyResponse.json(),
            carResponse.json(),
            jewelryResponse.json(),
          ])

        const filterListings = (data) =>
          data?.products?.filter((item) => item?.status === 0) || []

        const allListings = [
          ...filterListings(propertyData),
          ...filterListings(boatData),
          ...filterListings(carData),
          ...filterListings(jewelryData),
        ]

        setListings(allListings)
      } catch (error) {
        console.error('Error fetching listings:', error)
        setError('Failed to fetch evaluations.')
      }
    }

    if (token) {
      fetchListingsData()
    } else {
      console.warn('Token not found. Skipping fetch.')
      setListings([])
    }
  }, [token])

  if (error) return <p>{error}</p>
  if (listings === null) return <GlobalLoader />
  if (listings.length === 0) return <p>No evaluations found.</p>

  return <EvaluationList listings={listings} />
}
