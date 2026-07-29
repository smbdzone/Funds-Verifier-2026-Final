'use client'
import React, { useEffect, useState } from 'react'
import MyListingTabClient from '@/components/modules/SellerProfile/MyListings/MyListingsTabClient'
import ListingPendingApprovalNotice from '@/components/ListingsForm/ListingPendingApprovalNotice'
import { useProfile } from '@/context/UserContext'
import { fetchAssetHolderListingsProgressive } from '@/libs/fetchAllDashboardProducts'
import { toast } from 'react-toastify'

const MyListingTab = () => {
  const [listings, setListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const { isAuthenticated, loading: authLoading } = useProfile()

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      setListings([])
      setListingsLoading(false)
      setIsLoadingMore(false)
      return
    }

    let cancelled = false

    const loadListings = async () => {
      setListingsLoading(true)
      setIsLoadingMore(false)
      try {
        await fetchAssetHolderListingsProgressive((partial) => {
          if (cancelled) return
          setListings(partial)
          setListingsLoading(false)
          setIsLoadingMore(true)
        })
      } catch (error) {
        console.error('Error fetching listings:', error)
        if (!cancelled) {
          toast.error('Could not load all listings. Please refresh the page.')
        }
      } finally {
        if (!cancelled) {
          setListingsLoading(false)
          setIsLoadingMore(false)
        }
      }
    }

    loadListings()

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated])

  const handleListingDeleted = (uuid) => {
    setListings((prev) => prev.filter((l) => l.uuid !== uuid))
  }

  return (
    <>
      <ListingPendingApprovalNotice />
      <MyListingTabClient
        listings={listings}
        listingsLoading={listingsLoading || authLoading}
        isLoadingMore={isLoadingMore}
        onListingDeleted={handleListingDeleted}
      />
    </>
  )
}

export default MyListingTab
