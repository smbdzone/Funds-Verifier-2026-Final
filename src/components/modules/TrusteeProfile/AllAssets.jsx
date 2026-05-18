'use client'
import React, { useMemo, useState } from 'react'
import axios from 'axios'
import DeleteModal from '@/components/Modals/DeleteModal'
import PaginationComponent from '../Pagination'
import { AssignedTransaction } from './AssignedTransaction'
import customAxios from '../../../utils/apis/apis'

function AllAssets({ listings }) {
  const [allListings, setAllListings] = useState(listings)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Number of items per page

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      let endpoint = ''

      switch (listingToDelete.assetType) {
        case 'Property For Lease':
        case 'Property For Sale':
        case 'Property Off Plan For Sale':
          endpoint = `/property/${listingToDelete.uuid}`
          break
        case 'Car For Sale':
          endpoint = `/car/${listingToDelete.uuid}`
          break
        case 'Jewellery For Sale':
          endpoint = `/jewelry/${listingToDelete.uuid}`
          break
        case 'Boats For Sale':
          endpoint = `/boat/${listingToDelete.uuid}`
          break
        default:
          console.error('Unknown asset type:', listingToDelete.assetType)
          return
      }

      const response = await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`
      )

      if (response.status === 200) {
        setAllListings((prevListings) =>
          prevListings.filter((item) => item.uuid !== listingToDelete.uuid)
        )
        setIsDeleteModalOpen(false)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allListings.slice(startIndex, endIndex)
  }, [currentPage, itemsPerPage, allListings])

  const totalPages = Math.ceil(allListings.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <AssignedTransaction
            propertyListings={paginatedListings}
            onDelete={handleDeleteClick}
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
      )}
    </>
  )
}

export default AllAssets
