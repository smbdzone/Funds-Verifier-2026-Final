'use client'
import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import PaginationComponent from '../Pagination'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../SellerProfile/style.css'
import ProductCard from '@/components/global/ProductCard'
import {
  buildQueryString,
  formatNumberWithCommas,
} from '@/utils/global-functions/global'
import FooterAdd from '@/components/advertisementComponent/FooterAdd'
import { getTokenFromCookie } from '../../../utils/helper'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'
import {
  hasListingSearchFilters,
  ListingEmptyState,
} from '@/components/global/ListingEmptyState'
import customAxios from '@/utils/apis/apis'

export const CarListingCard = () => {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
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
        const { data: result } = await customAxios.get(`/car?${queryString}`)

        setData(result?.products || [])
        setTotalPages(result?.totalPages)
        setCurrentPage(result?.currentPage)
      } catch (error) {
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData(currentPage)
  }, [searchParams, currentPage, token])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

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
  const pdfBaseUrl = process.env.NEXT_PUBLIC_PDF
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdf2Url, setPdf2Url] = useState('')

  const openTechnicalReport = (reportUrl) => {
    if (reportUrl) {
      const pdfUrl = `${pdfBaseUrl}${reportUrl}`
      setPdfUrl(pdfUrl)
      setIsModalOpen(true)
    } else {
      console.error('No valid report URL available.')
    }
  }

  const openEvaluationCertificate = (reportUrl) => {
    if (reportUrl) {
      const pdf2Url = `${pdfBaseUrl}${reportUrl}`
      setPdf2Url(pdf2Url)
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
        <>
          {modifiedData.map((item, index) => {
            if (item?.isAd) {
              return (
                <figure key={`ad-${index}`} className='w-full'>
                  {token && <FooterAdd />}
                </figure>
              )
            }
            return (
              <ProductCard
                key={index}
                type='car'
                item={item}
                attributes={[
                  item.year + ' year',
                  formatNumberWithCommas(item.kilometers) + ' kms',
                  item.steeringSide + ' side',
                ]}
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
