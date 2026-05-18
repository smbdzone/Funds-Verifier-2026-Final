'use client'
import React, { useEffect, useState } from 'react'
import MyListingTabClient from '@/components/modules/SellerProfile/MyListings/MyListingsTabClient'
import { useProfile } from '@/context/UserContext'
import { fetchAllAssetHolderListings } from '@/libs/fetchAllDashboardProducts'
import { toast } from 'react-toastify'

const MyListingTab = () => {
  const [listings, setListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const { isAuthenticated, loading: authLoading } = useProfile()

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      setListings([])
      setListingsLoading(false)
      return
    }

    let cancelled = false

    const loadListings = async () => {
      setListingsLoading(true)
      try {
        const all = await fetchAllAssetHolderListings()
        if (!cancelled) setListings(all)
      } catch (error) {
        console.error('Error fetching listings:', error)
        if (!cancelled) {
          toast.error('Could not load all listings. Please refresh the page.')
        }
      } finally {
        if (!cancelled) setListingsLoading(false)
      }
    }

    loadListings()

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated])

  return (
    <MyListingTabClient
      listings={listings}
      listingsLoading={listingsLoading || authLoading}
    />
  )
}

export default MyListingTab
