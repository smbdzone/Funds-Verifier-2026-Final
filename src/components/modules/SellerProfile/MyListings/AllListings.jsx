'use client'
import React, { useEffect, useMemo, useState } from 'react'
import ListingCard from '@/components/cards/ListingCard'
import customAxios from '@/utils/apis/apis'
import DeleteModal from '@/components/Modals/DeleteModal'
import PaginationComponent from '../../Pagination'
import useDebounce from '../../../../hooks/useDebounce'
import { toast } from 'react-toastify'
import GlobalLoader from '@/utils/GlobalLoader'

function AllListings({ listings, query, isFetchingAll }) {
  const [allListings, setAllListings] = useState(listings || [])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    setAllListings(listings || [])
  }, [listings])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery])

  const filteredListings = useMemo(() => {
    const q = (debouncedQuery || '').trim().toLowerCase()
    if (!q) return allListings
    return allListings.filter((listing) => {
      const title = (listing.title || '').toLowerCase()
      const country = (listing.country || '').toLowerCase()
      return title.includes(q) || country.includes(q)
    })
  }, [allListings, debouncedQuery])

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredListings.slice(startIndex, endIndex)
  }, [filteredListings, currentPage])

  const handleDeleteClick = (listing) => {
    setIsDeleteModalOpen(true)
    setListingToDelete(listing)
  }

  // API listing.assetType values match ListingCard (e.g. "Property For Sale", "Car For Sale")
  const getDeleteEndpoint = (assetType) => {
    const t = (assetType || '').toLowerCase()
    if (t.includes('car')) return '/car/'
    if (t.includes('boat')) return '/boat/'
    if (t.includes('jewel')) return '/jewelry/'
    return '/property/'
  }

  const handleDeleteConfirm = async () => {
    if (!listingToDelete.uuid) return

    const deleteEndpoint = getDeleteEndpoint(listingToDelete?.assetType)

    try {
      await customAxios.delete(`${deleteEndpoint}${listingToDelete.uuid}`)

      // Remove the deleted listing from state
      setAllListings((prev) =>
        prev.filter((listing) => listing.uuid !== listingToDelete.uuid)
      )

      setIsDeleteModalOpen(false)
      setListingToDelete(null)

      // Show success message
      toast.success(
        `Successfully deleted ${listingToDelete?.assetType || 'listing'}!`
      )
    } catch (error) {
      console.error('Failed to delete listing:', error)
      toast.error(
        `Failed to delete listing: ${error?.response?.data?.message || error?.message || 'Unknown error'
        }`
      )
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      {isFetchingAll ? (
        <GlobalLoader />
      ) : (
        <div>
          {allListings?.length === 0 ? (
            <p className='text-center text-xl font-medium text-dark-black'>
              No Listings found
            </p>
          ) : filteredListings?.length === 0 ? (
            <p className='text-center text-xl font-medium text-dark-black'>
              No listings match your search.
            </p>
          ) : (
            <>
              <ListingCard
                listings={paginatedListings}
                handleDeleteClick={handleDeleteClick}
              />
              {isDeleteModalOpen && (
                <DeleteModal
                  onClose={() => setIsDeleteModalOpen(false)}
                  onDelete={handleDeleteConfirm}
                />
              )}
              <div className='md:mt-5 mt-3'>
                {totalPages > 1 && (
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AllListings
