'use client'
import { useState, useEffect, useRef } from 'react'
import PaginationComponent from './Pagination'
import Image from 'next/image'
import ProductCard from '@/components/global/ProductCard'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './style.css'
import {
  buildQueryString,
  formatNumberWithCommas,
} from '@/utils/global-functions/global'
import FooterAdd from '@/components/advertisementComponent/FooterAdd'
import { getTokenFromCookie } from '@/utils/helper'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'
import {
  hasListingSearchFilters,
  ListingEmptyState,
} from '@/components/global/ListingEmptyState'
import customAxios from '@/utils/apis/apis'
import { isOffPlanListing } from '@/libs/filterMyListingTab'

const PROPERTY_UI_ONLY_PARAMS = new Set(['assetType'])

function buildPropertyApiParams(page, queryKeyForFetch) {
  const paramsObj = Object.fromEntries(
    new URLSearchParams(queryKeyForFetch).entries(),
  )

  PROPERTY_UI_ONLY_PARAMS.forEach((key) => {
    delete paramsObj[key]
  })

  return {
    page,
    limit: 10,
    statusFilter: 1,
    ...paramsObj,
  }
}

function filterPropertyProducts(products, queryKeyForFetch) {
  const params = new URLSearchParams(queryKeyForFetch)
  const assetType = params.get('assetType')
  let list = Array.isArray(products) ? products : []

  list = list.filter((item) => !isOffPlanListing(item))

  const saleType = String(assetType || '').toLowerCase()
  if (saleType.includes('for lease')) {
    list = list.filter((item) => {
      const type = String(item?.assetType || '').toLowerCase()
      return (
        type.includes('lease') ||
        String(item?.propertyForLease || '').trim().toLowerCase() === 'yes'
      )
    })
  } else if (!saleType || saleType.includes('for sale')) {
    list = list.filter((item) => {
      const type = String(item?.assetType || '').toLowerCase()
      const forSale =
        String(item?.propertyForSale || '').trim().toLowerCase() === 'yes' ||
        type.includes('for sale')
      const leaseOnly =
        String(item?.propertyForLease || '').trim().toLowerCase() === 'yes' &&
        !forSale &&
        type.includes('for lease')

      return forSale && !leaseOnly
    })
  }

  return list
}

const DeleteModal = ({ onClose, onDelete }) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='bg-white p-6 rounded-[12px] shadow-lg w-96'>
      <h2 className='text-lg text-[#8D7C3B] font-semibold mb-4'>
        Delete Confirmation
      </h2>
      <p>Are you sure you want to delete this listing?</p>
      <div className='flex justify-end mt-6'>
        <button
          onClick={onClose}
          className='mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded'
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className='px-4 py-2 bg-[#8D7C3B] text-white rounded'
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

export const AuctionData = () => {
  const searchParams = useSearchParams()
  const queryKey = searchParams?.toString() || ''
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState([])
  const [listingToDelete, setListingToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState()
  const [modalCardId, setModalCardId] = useState(null)
  const token = getTokenFromCookie()
  // Define openModal function to set the modalCardId
  const openModal = (cardId) => {
    setModalCardId(cardId) // This sets the modal to open for a specific card
  }

  // Define closeModal function to reset the modalCardId
  const closeModal = () => {
    setModalCardId(null) // This will close the modal
  }
  const router = useRouter()
  const swiperRefs = useRef({})

  const handlePrevSlide = (id) => {
    if (swiperRefs.current[id]) {
      swiperRefs.current[id].slidePrev()
    }
  }

  const handleNextSlide = (id) => {
    if (swiperRefs.current[id]) {
      swiperRefs.current[id].slideNext()
    }
  }

  const fetchData = async (page, token, queryKeyForFetch) => {
    setLoading(true)

    const params = buildPropertyApiParams(page, queryKeyForFetch)
    const queryString = buildQueryString(params).replace(/\+/g, '%20')

    try {
      const { data: result } = await customAxios.get(`/property?${queryString}`)

      const products = filterPropertyProducts(
        result?.products || [],
        queryKeyForFetch,
      )

      setData(products)
      setTotalPages(result?.totalPages || 1)
      setCurrentPage(result?.currentPage || page)
    } catch (error) {
      console.error('Error fetching data:', error.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const queryKeyRef = useRef(queryKey)

  useEffect(() => {
    const filtersChanged = queryKeyRef.current !== queryKey
    queryKeyRef.current = queryKey

    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1)
      return
    }

    fetchData(currentPage, token, queryKey)
  }, [queryKey, currentPage, token])

  const modifiedData = [
    ...(Array.isArray(data) ? data.slice(0, 3) : []),
    { isAd: true },
    ...(Array.isArray(data) ? data.slice(3) : []),
  ]

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return
    try {
      const response = await customAxios.put(
        `
        ${process.env.NEXT_PUBLIC_BASE_URL}/property/${listingToDelete}`,
        { status: 0 },
      )
      if (response.status === 200) {
        setData((prevData) =>
          prevData.filter((item) => item.uuid !== listingToDelete),
        )
        setIsDeleteModalOpen(false)
        setListingToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false) // Technical Report Modal
  const [isModal2Open, setIsModal2Open] = useState(false) // Evaluation certificate

  const closeModal2 = () => {
    setIsModal2Open(false)
  }

  const openTechnicalReport = (reportUrl, id) => {
    if (reportUrl && id === match) {
      setIsModalOpen(true)
    } else {
      console.error('No valid report URL available.')
    }
  }

  const openEvaluationCertificate = (reportUrl, id) => {
    if (reportUrl && id === match) {
      setIsModal2Open(true)
    } else {
      console.error('No valid certificate URL available.')
    }
  }

  const getShortTitle = (title, limit = 20) => {
    return title.length > limit ? `${title.slice(0, limit)}...` : title
  }

  const listings = Array.isArray(data) ? data : []
  const hasFilters = hasListingSearchFilters(searchParams)

  return (
    <div className='flex flex-col w-full xl:me-20 gap-6'>
      {loading ? (
        <ListingCardSkeleton count={3} />
      ) : listings.length === 0 ? (
        <ListingEmptyState hasFilters={hasFilters} />
      ) : (
        modifiedData.map((item, index) => {
          if (item?.isAd) {
            return (
              <figure key={`ad-${index}`} className='w-full'>
                {token && <FooterAdd />}
              </figure>
            )
          }
          return (
            <ProductCard
              key={item.uuid}
              type='property'
              item={item}
              attributes={[
                item.bedrooms + ' Beds',
                item.bathrooms + ' Baths',
                formatNumberWithCommas(item.sizeSQFT) + ' Sqft',
              ]}
              handlePrevSlide={handlePrevSlide}
              handleNextSlide={handleNextSlide}
              openTechnicalReport={openTechnicalReport}
              openEvaluationCertificate={openEvaluationCertificate}
              getShortTitle={getShortTitle}
              swiperRefs={swiperRefs}
              isModalOpen={isModalOpen}
              isModal2Open={isModal2Open}
              closeModal2={closeModal2}
              setMatch={setMatch}
              modalCardId={modalCardId}
              openModal={openModal}
              closeModal={closeModal}
            />
          )
        })
      )}
      {!loading && listings.length > 0 && totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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
