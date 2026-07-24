'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ListingCard from '@/components/cards/ListingCard'
import { fetchAssetHolderListingsProgressive } from '@/libs/fetchAllDashboardProducts'
import { filterListingsByMyListingTab } from '@/libs/filterMyListingTab'
import customAxios from '@/utils/apis/apis'
import DeleteModal from '@/components/Modals/DeleteModal'
import GlobalLoader from '@/utils/GlobalLoader'
import { toast } from 'react-toastify'

const ADMIN_LISTING_TABS = [
  { name: 'All Listing' },
  { name: 'Properties For Sale' },
  { name: 'Off Plan Properties' },
  { name: 'Cars For Sale' },
  { name: 'Jewelleries For Sale' },
  { name: 'Boats For Sale' },
]

/**
 * Super Admin listings — same ListingCard UI as asset holder,
 * but edit is disabled (handled inside ListingCard for Admin role).
 */
export default function AdminAllListingsTab() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const [query, setQuery] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setIsLoadingMore(false)
      try {
        // Same endpoints as asset-holder dashboard; Admin sees all listings
        // (backend elevated-moderator path removes listing-visibility filter).
        await fetchAssetHolderListingsProgressive((partial) => {
          if (cancelled) return
          setListings(partial)
          setLoading(false)
          setIsLoadingMore(true)
        })
      } catch (error) {
        console.error('Admin listings fetch failed:', error)
        if (!cancelled) {
          toast.error('Could not load listings. Please refresh.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setIsLoadingMore(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const tabListings = useMemo(
    () => filterListingsByMyListingTab(listings, selectedTabIdx),
    [listings, selectedTabIdx],
  )

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tabListings
    return tabListings.filter((listing) => {
      const title = String(listing.title || '').toLowerCase()
      const country = String(listing.country || '').toLowerCase()
      return title.includes(q) || country.includes(q)
    })
  }, [tabListings, query])

  const openDeleteModal = (listing) => {
    setListingToDelete(listing)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setListingToDelete(null)
  }

  const confirmDelete = async () => {
    if (!listingToDelete?.uuid) return
    try {
      const assetType = String(listingToDelete.assetType || '').toLowerCase()
      let endpoint = '/property'
      if (assetType.includes('car')) endpoint = '/car'
      else if (assetType.includes('boat')) endpoint = '/boat'
      else if (assetType.includes('jewel')) endpoint = '/jewelry'

      await customAxios.delete(`${endpoint}/${listingToDelete.uuid}`)
      setListings((prev) =>
        prev.filter((item) => item.uuid !== listingToDelete.uuid),
      )
      toast.success('Listing deleted')
      closeDeleteModal()
    } catch (error) {
      console.error('Delete listing failed:', error)
      toast.error('Could not delete listing')
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-[240px] items-center justify-center'>
        <GlobalLoader />
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xl font-semibold text-prussianBlue'>All Listings</h2>
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search by title or country'
          className='h-10 w-full max-w-sm rounded border border-black/10 px-3 text-sm outline-none shadow-neons focus:border-[#8D7C3B]'
        />
      </div>

      <div className='mb-4 flex flex-wrap gap-2'>
        {ADMIN_LISTING_TABS.map((tab, index) => (
          <button
            key={tab.name}
            type='button'
            onClick={() => setSelectedTabIdx(index)}
            className={`rounded px-3 py-1.5 text-sm ${selectedTabIdx === index
                ? 'bg-prussianBlue text-white'
                : 'bg-whiteSmoke text-prussianBlue'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {isLoadingMore ? (
        <p className='mb-2 text-xs text-black/50'>Loading more listings…</p>
      ) : null}

      {filteredListings.length === 0 ? (
        <p className='py-10 text-center text-black/50'>No listings found.</p>
      ) : (
        <ListingCard
          listings={filteredListings}
          showEdit={false}
          handleDeleteClick={openDeleteModal}
        />
      )}

      {isDeleteModalOpen ? (
        <DeleteModal
          onClose={closeDeleteModal}
          onDelete={confirmDelete}
          title='Delete listing?'
          message='This listing will be removed. This cannot be undone.'
        />
      ) : null}
    </div>
  )
}
