'use client'
import React, { useEffect, useState } from 'react'
import ListingCard from '@/components/cards/ListingCard'
import DeleteModal from '@/components/Modals/DeleteModal'
import PaginationComponent from '../../Pagination'
import useDebounce from '../../../../hooks/useDebounce'
import { getTokenFromCookie } from '../../../../utils/helper'
import GlobalLoader from '@/utils/GlobalLoader'
import customAxios from '../../../../utils/apis/apis'

function AllListings({ query }) {
  const [propertyListings, setPropertyListings] = useState([])
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

  const fetchPropertyListings = async (page) => {
    setIsLoading(true)
    try {
      const response = await customAxios.get('/property', {
        params: {
          page,
          limit: 10,
          title: debouncedQuery || undefined,
          dashboard: true,
        },
      })

      setPropertyListings(response.data.products || [])
      setCurrentPage(response.data.currentPage || page)
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching property listings:', error)
      setPropertyListings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchPropertyListings(currentPage)
    }
  }, [currentPage, debouncedQuery, token])

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await customAxios.delete(
        `/property/${listingToDelete.uuid}`,
        { status: 0 }
      )

      if (response.status === 200) {
        setPropertyListings((prevListings) =>
          prevListings.filter((item) => item.uuid !== listingToDelete.uuid)
        )

        setIsDeleteModalOpen(false)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div>
      {isLoading ? (
        <GlobalLoader />
      ) : propertyListings.length === 0 ? (
        <p className='text-center text-xl font-medium text-dark-black'>
          No Listings found
        </p>
      ) : (
        <>
          <ListingCard
            listings={propertyListings}
            handleDeleteClick={handleDeleteClick}
          />
          {!isLoading && totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  )
}

export default AllListings
