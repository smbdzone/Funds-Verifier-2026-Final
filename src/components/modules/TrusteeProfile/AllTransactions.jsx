'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import DeleteModal from '@/components/Modals/DeleteModal'
import PaginationComponent from '../Pagination'
import { TransactionMange } from './TransactTionManage'
import customAxios from '../../../utils/apis/apis'

const CATEGORY_ORDER = [
  'Property For Sale',
  'Property For Lease',
  'Property Off Plan For Sale',
  'Car For Sale',
  'Boats For Sale',
  'Jewellery For Sale',
]

const SEARCH_VISIBLE_ROWS = 5
const SEARCH_ROW_HEIGHT_PX = 40

function getListingCategory(listing) {
  if (listing?.assetType) return listing.assetType
  const typeMap = {
    property: 'Property For Sale',
    car: 'Car For Sale',
    boat: 'Boats For Sale',
    jewelry: 'Jewellery For Sale',
  }
  return typeMap[listing?.type] || 'Other'
}

function getListingSearchLabel(listing) {
  const title = listing?.title || 'Untitled'
  const area = listing?.neighbourhood ? ` at ${listing.neighbourhood}` : ''
  return `${title}${area}`
}

function isActiveTransaction(listing) {
  return listing.status === 0 || !Object.prototype.hasOwnProperty.call(listing, 'status')
}

function AllTransactions({ listings }) {
  const [allListings, setAllListings] = useState(listings)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [listingSearch, setListingSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)
  const searchDropdownRef = useRef(null)
  const itemsPerPage = 10

  useEffect(() => {
    setAllListings(listings)
  }, [listings])

  useEffect(() => {
    setCurrentPage(1)
  }, [listingSearch, selectedCategory])

  useEffect(() => {
    if (!searchMenuOpen) return

    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setSearchMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchMenuOpen])

  const transactionListings = useMemo(
    () => allListings.filter(isActiveTransaction),
    [allListings],
  )

  const availableCategories = useMemo(() => {
    const categories = new Set(
      transactionListings.map((listing) => getListingCategory(listing)),
    )
    return CATEGORY_ORDER.filter((category) => categories.has(category))
  }, [transactionListings])

  const normalizedSearch = listingSearch.trim().toLowerCase()

  const searchResults = useMemo(() => {
    if (!normalizedSearch) return []

    const pool = selectedCategory
      ? transactionListings.filter(
          (listing) => getListingCategory(listing) === selectedCategory,
        )
      : transactionListings

    return pool
      .filter((listing) =>
        getListingSearchLabel(listing).toLowerCase().includes(normalizedSearch),
      )
      .sort((a, b) =>
        getListingSearchLabel(a).localeCompare(getListingSearchLabel(b)),
      )
  }, [transactionListings, selectedCategory, normalizedSearch])

  const filteredListings = useMemo(() => {
    let results = transactionListings

    if (selectedCategory) {
      results = results.filter(
        (listing) => getListingCategory(listing) === selectedCategory,
      )
    }

    if (normalizedSearch) {
      results = results.filter((listing) =>
        getListingSearchLabel(listing).toLowerCase().includes(normalizedSearch),
      )
    }

    return results
  }, [transactionListings, selectedCategory, normalizedSearch])

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredListings.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, itemsPerPage, filteredListings])

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)

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

      const response = await customAxios.delete(endpoint)

      if (response.status === 200) {
        setAllListings((prevListings) =>
          prevListings.filter((item) => item.uuid !== listingToDelete.uuid),
        )
        setIsDeleteModalOpen(false)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const handleSearchSelect = (listing) => {
    setListingSearch(listing.title || '')
    setSelectedCategory(getListingCategory(listing))
    setSearchMenuOpen(false)
  }

  return (
    <div className='w-full max-w-full min-w-0'>
      <div className='mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div ref={searchDropdownRef}>
          <label
            htmlFor='transaction-listing-search'
            className='block text-sm font-medium text-prussianBlue mb-2'
          >
            Search Listing
          </label>
          <div className='relative'>
            <input
              id='transaction-listing-search'
              type='search'
              value={listingSearch}
              onChange={(e) => {
                setListingSearch(e.target.value)
                setSearchMenuOpen(true)
              }}
              onFocus={() => {
                if (normalizedSearch) setSearchMenuOpen(true)
              }}
              placeholder='Search by listing name...'
              className='w-full rounded-md border border-prussianBlue bg-white px-3 py-2.5 text-sm text-prussianBlue outline-none placeholder:text-gray-400'
            />

            {searchMenuOpen && normalizedSearch ? (
              <div className='absolute z-40 mt-1 w-full overflow-hidden rounded-md border border-prussianBlue bg-white shadow-lg'>
                <div
                  className='overflow-y-auto'
                  style={{
                    maxHeight: SEARCH_ROW_HEIGHT_PX * SEARCH_VISIBLE_ROWS,
                  }}
                >
                  {searchResults.length === 0 ? (
                    <p className='px-3 py-2.5 text-sm text-gray-500'>
                      No listings match your search.
                    </p>
                  ) : (
                    searchResults.map((listing) => (
                      <button
                        key={listing.uuid}
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSearchSelect(listing)}
                        className='block w-full truncate px-3 text-left text-sm text-prussianBlue hover:bg-gray-100'
                        style={{ height: SEARCH_ROW_HEIGHT_PX }}
                        title={listing.title || 'Untitled'}
                      >
                        {listing.title || 'Untitled'}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-prussianBlue mb-2'>
            Asset Type
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='w-full rounded-md border border-prussianBlue bg-white px-3 py-2.5 text-sm text-prussianBlue outline-none'
          >
            <option value=''>All asset types</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TransactionMange
        propertyListings={paginatedListings}
        totalCount={filteredListings.length}
        onDelete={handleDeleteClick}
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
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default AllTransactions
