'use client'
import React, { useEffect, useMemo, useState } from 'react'
import ListingCard from '@/components/cards/ListingCard'
import customAxios from '@/utils/apis/apis'
import DeleteModal from '@/components/Modals/DeleteModal'
import PaginationComponent from '../../Pagination'
import useDebounce from '../../../../hooks/useDebounce'
import { toast } from 'react-toastify'
import GlobalLoader from '@/utils/GlobalLoader'
import { filterListingsByMyListingTab } from '@/libs/filterMyListingTab'

function AllListings({
  listings,
  query,
  isFetchingAll,
  isLoadingMore = false,
  selectedTabIdx = 0,
  onListingDeleted,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const debouncedQuery = useDebounce(query, 500)

  const tabListings = useMemo(
    () => filterListingsByMyListingTab(listings, selectedTabIdx),
    [listings, selectedTabIdx],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, selectedTabIdx])

  const filteredListings = useMemo(() => {
    const q = (debouncedQuery || '').trim().toLowerCase()
    if (!q) return tabListings
    return tabListings.filter((listing) => {
      const title = (listing.title || '').toLowerCase()
      const country = (listing.country || '').toLowerCase()
      return title.includes(q) || country.includes(q)
    })
  }, [tabListings, debouncedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage))

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredListings.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredListings, currentPage])

  const handleDeleteClick = (listing) => {
    setIsDeleteModalOpen(true)
    setListingToDelete(listing)
  }

  const getDeleteEndpoint = (assetType) => {
    const t = (assetType || '').toLowerCase()
    if (t.includes('car')) return '/car/'
    if (t.includes('boat')) return '/boat/'
    if (t.includes('jewel')) return '/jewelry/'
    return '/property/'
  }

  const handleDeleteConfirm = async () => {
    if (!listingToDelete?.uuid) return

    const deleteEndpoint = getDeleteEndpoint(listingToDelete?.assetType)

    try {
      await customAxios.delete(`${deleteEndpoint}${listingToDelete.uuid}`)

      onListingDeleted?.(listingToDelete.uuid)

      setIsDeleteModalOpen(false)
      setListingToDelete(null)

      toast.success(
        `Successfully deleted ${listingToDelete?.assetType || 'listing'}!`,
      )
    } catch (error) {
      console.error('Failed to delete listing:', error)
      toast.error(
        `Failed to delete listing: ${error?.response?.data?.message ||
        error?.message ||
        'Unknown error'
        }`,
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
          {isLoadingMore ? (
            <p className='text-center text-sm text-prussianBlue/60 mb-4'>
              Loading more listings…
            </p>
          ) : null}
          {tabListings.length === 0 ? (
            <p className='text-center text-xl font-medium text-dark-black'>
              No Listings found
            </p>
          ) : filteredListings.length === 0 ? (
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
