'use client'
import React, { useEffect, useState } from 'react'
import ListingCard from '@/components/cards/ListingCard'
import DeleteModal from '@/components/Modals/DeleteModal'
import PaginationComponent from '../../Pagination'
import useDebounce from '../../../../hooks/useDebounce'
import { getTokenFromCookie } from '../../../../utils/helper'
import GlobalLoader from '@/utils/GlobalLoader'
import customAxios from '../../../../utils/apis/apis'

function BoatListing({ query }) {
  const [boatListings, setBoatListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const debouncedQuery = useDebounce(query, 500) // Adjust delay as desired
  const token = getTokenFromCookie()

  // Reset to the first page whenever the search term (debounced) changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery])

  const fetchBoatListings = async (page) => {
    setIsLoading(true)
    try {
      const response = await customAxios.get('/boat', {
        params: {
          page,
          limit: 10,
          title: debouncedQuery || undefined,
          dashboard: true,
        },
      })

      setBoatListings(response.data.products || [])
      setCurrentPage(response.data.currentPage || page)
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching boat listings:', error)
      setBoatListings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBoatListings(currentPage)
  }, [currentPage, debouncedQuery])

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/boat/${listingToDelete.uuid}`,
        { status: 0 }
      )

      if (response.status === 200) {
        setIsDeleteModalOpen(false)
        fetchPropertyListings() // Reload listings data after deletion
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  // Filter listings based on the search query
  const filteredListings = boatListings.filter((listing) =>
    listing.title.toLowerCase().includes(query.toLowerCase())
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      {isLoading ? (
        <GlobalLoader />
      ) : boatListings.length === 0 ? (
        <p className='text-center text-xl font-medium text-dark-black'>
          No Listings found
        </p>
      ) : (
        <>
          <div>
            <ListingCard
              listings={boatListings}
              handleDeleteClick={handleDeleteClick}
            />
            {isDeleteModalOpen && (
              <DeleteModal
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteConfirm}
              />
            )}
            <div className='md:mt-5 mt-3'>
              {!isLoading && totalPages > 1 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default BoatListing
