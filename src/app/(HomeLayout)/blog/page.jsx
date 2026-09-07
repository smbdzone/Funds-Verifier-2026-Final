'use client'
import { Banner } from '@/components/modules/Banner'
import { useEffect, useState, useRef, useMemo } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { swiperCanLoop } from '@/utils/swiperLoop'
import BlogPageSkeleton from '@/components/blog/BlogPageSkeleton'
import FeaturedBlogHero from '@/components/blog/FeaturedBlogHero'
import BlogArticleCard from '@/components/blog/BlogArticleCard'
import {
  filterActiveBlogs,
  pickFeaturedBlog,
  PUBLIC_BLOG_FETCH_OPTIONS,
  sortBlogsForDisplay,
} from '@/utils/blogVisibility'

const DESKTOP_PAGE_SIZE = 3
const GOLD_GRADIENT =
  '[background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]'

export default function Insight() {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [desktopPage, setDesktopPage] = useState(1)
  const [query, setQuery] = useState({
    page: 1,
    limit: 20,
  })
  const [noDataMessage, setNoDataMessage] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const swiperRef = useRef()
  const dropdownRef = useRef()

  // Categories data as shown in the image
  const categories = {
    left: [
      { label: 'Properties', value: 'properties' },
      { label: 'Cars', value: 'cars' },
      { label: 'Jewellery', value: 'jewelry' },
      { label: 'Boat', value: 'boats' },
    ],
    right: [{ label: 'General News', value: 'general-news' }],
  }

  useEffect(() => {
    const fetchFilteredData = async () => {
      setIsLoading(true)
      setNoDataMessage(null)

      try {
        if (selectedCategories.length === 0) {
          setData([])
          const queryString = new URLSearchParams(query).toString()
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getAll?${queryString}`,
            PUBLIC_BLOG_FETCH_OPTIONS,
          )
          const datas = await response.json()
          const activeBlogs = sortBlogsForDisplay(filterActiveBlogs(datas.data))
          if (activeBlogs.length === 0) {
            setNoDataMessage('No data found for the selected categories.')
          } else {
            setData(activeBlogs)
          }
        } else {
          setData([])
          const categoryString = selectedCategories.join(',')
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getByCategory/${categoryString}`,
            PUBLIC_BLOG_FETCH_OPTIONS,
          )
          const datas = await response.json()
          const activeBlogs = sortBlogsForDisplay(filterActiveBlogs(datas.data))
          if (datas.message && !activeBlogs.length) {
            setNoDataMessage(
              `No data found for the selected categories: ${selectedCategories.join(
                ', ',
              )}`,
            )
            setData([])
          } else {
            setData(activeBlogs)
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilteredData()
  }, [selectedCategories, query])

  useEffect(() => {
    setDesktopPage(1)
  }, [selectedCategories, data.length])

  const isAllFilter = selectedCategories.length === 0
  const featuredBlog = useMemo(
    () => (isAllFilter ? pickFeaturedBlog(data) : null),
    [data, isAllFilter],
  )
  const listData = useMemo(() => {
    if (!featuredBlog) return data
    return data.filter((item) => item.uuid !== featuredBlog.uuid)
  }, [data, featuredBlog])

  const totalDesktopPages = Math.max(1, Math.ceil(listData.length / DESKTOP_PAGE_SIZE))
  const showDesktopPagination = listData.length > DESKTOP_PAGE_SIZE
  const paginatedDesktopData = showDesktopPagination
    ? listData.slice(
      (desktopPage - 1) * DESKTOP_PAGE_SIZE,
      desktopPage * DESKTOP_PAGE_SIZE,
    )
    : listData

  const goToDesktopPage = (page) => {
    const nextPage = Math.min(Math.max(1, page), totalDesktopPages)
    setDesktopPage(nextPage)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMouseEnter = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.autoplay.stop()
    }
  }

  const handleMouseLeave = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.autoplay.start()
    }
  }

  const handleDropdownClick = (dropdownType) => {
    if (activeDropdown === dropdownType) {
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      setActiveDropdown(dropdownType)
      setIsDropdownOpen(true)
    }
  }

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      )
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const clearAllCategories = () => {
    setSelectedCategories([])
    setIsDropdownOpen(false)
    setActiveDropdown(null)
  }

  if (isLoading) {
    return <BlogPageSkeleton />
  }

  return (
    <>
      <Banner title='News & trends' />

      <div className='theme-container px-4 pb-16 md:pb-24'>
        <div
          className='relative my-6 flex flex-wrap items-center justify-between gap-3'
          ref={dropdownRef}
        >
          <div className='relative'>
            <button
              type='button'
              onClick={() => handleDropdownClick('first')}
              className={`flex h-11 w-[120px] items-center justify-center rounded-l-sm font-medium text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
            >
              ALL
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen && activeDropdown === 'first' ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>

            {isDropdownOpen ? (
              <div className='absolute left-0 top-full z-50 mt-2 min-w-[280px] rounded-xl border border-reefGold/20 bg-white shadow-xl'>
                <div className='flex'>
                  <div className='flex-1 border-r border-gray-100 p-4'>
                    {categories.left.map((category) => (
                      <button
                        key={category.value}
                        type='button'
                        onClick={() => handleCategorySelect(category.value)}
                        className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                          selectedCategories.includes(category.value)
                            ? `text-white ${GOLD_GRADIENT}`
                            : 'border border-gray-200 text-prussianBlue hover:bg-reefGold/5'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                  <div className='flex-1 p-4'>
                    {categories.right.map((category) => (
                      <button
                        key={category.value}
                        type='button'
                        onClick={() => handleCategorySelect(category.value)}
                        className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                          selectedCategories.includes(category.value)
                            ? `text-white ${GOLD_GRADIENT}`
                            : 'border border-gray-200 text-prussianBlue hover:bg-reefGold/5'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className='border-t border-gray-100 px-4 py-3'>
                  <button
                    type='button'
                    onClick={clearAllCategories}
                    className='w-full rounded-md bg-prussianBlue/5 px-3 py-2 text-sm font-medium text-prussianBlue transition hover:bg-prussianBlue/10'
                  >
                    Clear All
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className='flex items-center gap-2 lg:hidden'>
            <button
              type='button'
              aria-label='Previous article'
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
              className={`flex h-10 w-10 items-center justify-center rounded-l-sm text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type='button'
              aria-label='Next article'
              onClick={() => swiperRef.current?.swiper?.slideNext()}
              className={`flex h-10 w-10 items-center justify-center rounded-l-sm text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {selectedCategories.length > 0 ? (
            <div className='flex w-full flex-wrap gap-2 pt-1'>
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className='inline-flex items-center rounded-full border border-reefGold/30 bg-reefGold/10 px-3 py-1 text-xs font-medium capitalize text-prussianBlue'
                >
                  {category.replace(/-/g, ' ')}
                  <button
                    type='button'
                    onClick={() => handleCategorySelect(category)}
                    className='ml-2 text-prussianBlue/60 hover:text-prussianBlue'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {featuredBlog ? <FeaturedBlogHero blog={featuredBlog} /> : null}

        {noDataMessage ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-reefGold/20 bg-white py-16 shadow-sm'>
            <img src='/no-data-found.png' alt='No data found' className='max-w-[200px]' />
            <p className='mt-4 text-lg text-prussianBlue/70'>Oops! No results were found!</p>
          </div>
        ) : (
          <>
            <div className='hidden lg:block'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {paginatedDesktopData.map((item) => (
                  <BlogArticleCard key={item.uuid} item={item} />
                ))}
              </div>

              {showDesktopPagination ? (
                <nav
                  className='mt-10 flex flex-wrap items-center justify-center gap-2'
                  aria-label='Blog pagination'
                >
                  <button
                    type='button'
                    aria-label='Previous page'
                    disabled={desktopPage === 1}
                    onClick={() => goToDesktopPage(desktopPage - 1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-l-sm text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${GOLD_GRADIENT}`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalDesktopPages }).map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = desktopPage === pageNumber
                    return (
                      <button
                        key={pageNumber}
                        type='button'
                        aria-label={`Page ${pageNumber}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => goToDesktopPage(pageNumber)}
                        className={`flex h-10 min-w-[40px] items-center justify-center rounded-sm px-3 text-sm font-semibold transition-colors ${
                          isActive
                            ? `text-white ${GOLD_GRADIENT}`
                            : 'border border-reefGold/40 bg-white text-prussianBlue hover:bg-reefGold/10'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}

                  <button
                    type='button'
                    aria-label='Next page'
                    disabled={desktopPage === totalDesktopPages}
                    onClick={() => goToDesktopPage(desktopPage + 1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-l-sm text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${GOLD_GRADIENT}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              ) : null}
            </div>

            <div className='lg:hidden'>
              <Swiper
                ref={swiperRef}
                modules={[Autoplay]}
                slidesPerView={1}
                speed={1200}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                spaceBetween={16}
                loop={swiperCanLoop(listData.length, 1)}
                pagination={{ clickable: true }}
                className='blog-mobile-swiper !overflow-hidden'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {listData.map((item, i) => (
                  <SwiperSlide key={item.uuid || i} className='!h-auto'>
                    <BlogArticleCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}
      </div>
    </>
  )
}
