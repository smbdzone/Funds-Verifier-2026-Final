'use client'
import { useEffect, useState, useRef } from 'react'
import PaginationComponent from '../Pagination'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import ProductCard from '@/components/global/ProductCard'
import {
  formatNumberWithCommas,
  buildQueryString,
} from '@/utils/global-functions/global'
import FooterAdd from '../../advertisementComponent/FooterAdd'
import { getTokenFromCookie } from '../../../utils/helper'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'
import {
  hasListingSearchFilters,
  ListingEmptyState,
} from '@/components/global/ListingEmptyState'
import customAxios from '@/utils/apis/apis'

export const JewelleryListingCard = () => {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
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

  const swiperRefs = useRef({})
  //  const swiperRefs = useRef<{ [key: string]: SwiperInstance }>({});

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

  const modifiedData = [
    ...(Array.isArray(data) ? data.slice(0, 3) : []),
    { isAd: true },
    ...(Array.isArray(data) ? data.slice(3) : []),
  ]

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    const fetchData = async (page, token) => {
      setLoading(true) // Start loading
      try {
        const paramsObj = Object.fromEntries(searchParams.entries()) // Convert it to a regular object

        const params = {
          page,
          limit: 10,
          statusFilter: 1,
          ...paramsObj, // Dynamically add URL search params here
        }

        const queryString = buildQueryString(params)
        const { data: result } = await customAxios.get(`/jewelry?${queryString}`)

        setData(result?.products || [])
        setTotalPages(result?.totalPages)
        setCurrentPage(result?.currentPage)
      } catch (error) {
        console.log({ error })

        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData(currentPage)
  }, [searchParams, currentPage])

  const [isModalOpen, setIsModalOpen] = useState(false) // Technical Report Modal
  const [isModal2Open, setIsModal2Open] = useState(false) //evaluation certificate

  const closeModal2 = () => {
    setIsModal2Open(false)
    setPdf2Url('')
  }
  const convertToRelativeURL = (filePath) => {
    const fileName = filePath.split('\\').pop() // Extract file name from path
    return `/pdfs/${fileName}` // Adjust based on your server setup
  }
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdf2Url, setPdf2Url] = useState('')

  const openTechnicalReport = (reportUrl) => {
    if (reportUrl) {
      setIsModalOpen(true)
    } else {
      console.error('No valid report URL available.')
    }
  }

  const openEvaluationCertificate = (reportUrl) => {
    if (reportUrl) {
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
    <div className='flex w-full flex-col gap-6'>
      {loading ? (
        <ListingCardSkeleton count={3} />
      ) : listings.length === 0 ? (
        <ListingEmptyState hasFilters={hasFilters} />
      ) : (
        <>
          {modifiedData.map((item, index) => {
            if (item.isAd) {
              return (
                <figure key={`ad-${index}`} className='w-full'>
                  {token && <FooterAdd />}
                </figure>
              )
            }
            return (
              <ProductCard
                key={item?.uuid || item?._id || index}
                type='jewelry'
                item={item}
                attributes={[
                  Array.isArray(item?.materials) && item.materials[0]
                    ? item.materials[0]
                    : item?.jewelryMetal || item?.metal || '—',
                  item?.age != null && item?.age !== ''
                    ? `Age ${item.age}`
                    : null,
                  item?.grams != null && item?.grams !== ''
                    ? `${formatNumberWithCommas(item.grams)} Grams`
                    : null,
                ].filter(Boolean)}
                handlePrevSlide={handlePrevSlide}
                handleNextSlide={handleNextSlide}
                openTechnicalReport={openTechnicalReport}
                openEvaluationCertificate={openEvaluationCertificate}
                convertToRelativeURL={convertToRelativeURL}
                getShortTitle={getShortTitle}
                swiperRefs={swiperRefs}
                isModalOpen={isModalOpen}
                modalCardId={modalCardId}
                openModal={openModal}
                closeModal={closeModal}
                pdfUrl={pdfUrl}
                isModal2Open={isModal2Open}
                closeModal2={closeModal2}
                pdf2Url={pdf2Url}
              />
            )
          })}
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
