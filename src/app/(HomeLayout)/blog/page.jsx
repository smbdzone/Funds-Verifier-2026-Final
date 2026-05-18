'use client'
import { formatDate, sanitizeHTML } from '../../../utils/global-functions/global'
import Image from 'next/image'
import Link from 'next/link'
import { Banner } from '@/components/modules/Banner'
import { useEffect, useState, useRef } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import StyledContent from '../../../components/global/StyledContent'
import { useSecureAxios } from '../../../utils/useSecureAxios'
import { usePublicTokenContext } from '../../../utils/PublicTokenProvider.'

export default function Insight() {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [data, setData] = useState([])
  const [query, setQuery] = useState({
    page: 1,
    limit: 20,
  })
  const [noDataMessage, setNoDataMessage] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const swiperRef = useRef()
  const dropdownRef = useRef()
  const api = useSecureAxios()
  const publicToken = usePublicTokenContext()

  useEffect(() => {
    if (!publicToken) return // ✅ wait safely inside effect

    api
      .get('/public/data')
      .then((res) => {
        // console.log(res.data)
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error(err)
        }
      })
  }, [publicToken]) // 🔑 dependency is REQUIRED

  // if (!publicToken) {
  //   return <GlobalLoader /> // ✅ valid render fallback
  // }
  // Categories data as shown in the image
  const categories = {
    left: [
      { label: 'Real Estate', value: 'real-estate' },
      { label: 'Cars', value: 'cars' },
      { label: 'Jewelry', value: 'jewelry' },
      { label: 'Boats', value: 'boats' },
    ],
    right: [
      {
        label: 'General',
        value: 'general',
      },
      { label: 'News', value: 'news' },
      { label: 'Regulations', value: 'regulations' },
      { label: 'Announcement', value: 'announcement' },
    ],
  }

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (selectedCategories.length === 0) {
        setNoDataMessage(null)
        setData([])
        const queryString = new URLSearchParams(query).toString()
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getAll?${queryString}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((datas) => {
            if (datas.data.length === 0) {
              setNoDataMessage('No data found for the selected categories.')
            } else {
              setNoDataMessage(null)
              setData(datas.data)
            }
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      } else {
        setNoDataMessage(null)
        setData([])
        const categoryString = selectedCategories.join(',')
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getByCategory/${categoryString}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((datas) => {
            if (datas.message && !datas.data) {
              setNoDataMessage(
                `No data found for the selected categories: ${selectedCategories.join(
                  ', '
                )}`
              )
              setData([])
            } else {
              setNoDataMessage(null)
              setData(datas.data)
            }
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
    }

    fetchFilteredData()
  }, [selectedCategories, query])

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

  const getAuthorInitial = (title) => {
    return title.charAt(0).toUpperCase()
  }
  const stripHtml = (html) => {
    if (!html) return ''
    // Sanitize HTML before using innerHTML to prevent XSS
    const sanitized = sanitizeHTML(html)
    const div = document.createElement('div')
    div.innerHTML = sanitized
    return div.textContent || div.innerText || ''
  }
  const formatCategory = (category) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }
  return (
    <>
      <Banner
        title='NEWS & TREND'
        catagory='Home'
        subcatagory='News And Trends'
      />

      <div
        className='flex items-center gap-2 my-6 mx-4 relative'
        ref={dropdownRef}
      >
        {/* First ALL Button */}
        <div className='relative'>
          <button
            onClick={() => handleDropdownClick('first')}
            className='justify-center flex items-center rounded-l-sm font-medium text-darkslategray-100 [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-[120px] h-11 cursor-pointer hover:opacity-90 transition-opacity'
          >
            ALL
            <svg
              className={`ml-2 w-4 h-4 transition-transform ${
                isDropdownOpen && activeDropdown === 'first' ? 'rotate-180' : ''
              }`}
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
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className='absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[280px]'>
            <div className='flex'>
              {/* Left Column */}
              <div className='flex-1 p-4 border-r border-gray-200'>
                {categories.left.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category.value)}
                    className={`w-full text-left px-3 py-2 mb-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategories.includes(category.value)
                        ? 'bg-gradient-to-r from-[#a2913e] to-[#d7c590] text-white'
                        : category.value === selectedCategories
                        ? 'bg-gradient-to-r from-[#a2913e] to-[#d7c590] text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Right Column */}
              <div className='flex-1 p-4'>
                {categories.right.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category.value)}
                    className={`w-full text-left px-3 py-2 mb-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategories.includes(category.value)
                        ? 'bg-gradient-to-r from-[#a2913e] to-[#d7c590] text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All Button */}
            <div className='px-4 py-3 border-t border-gray-200'>
              <button
                onClick={clearAllCategories}
                className='w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors'
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <div className='flex flex-wrap gap-2 ml-4'>
            {selectedCategories.map((category) => (
              <span
                key={category}
                className='inline-flex items-center px-2 py-1 rounded-md border text-xs bg-blue-100 text-blue-800'
              >
                {category}
                <button
                  onClick={() => handleCategorySelect(category)}
                  className='ml-1 hover:text-blue-600'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <section className='w-full h-full theme-container lg:flex-row flex-col z-1 flex gap-5'>
        <div className='hidden lg:block min-h-full w-full pb-5'>
          <div className='h-full w-full flex flex-col justify-between bg-white rounded-md lg:p-8 text-prussianBlue shadow-md md:mb-24'>
            {noDataMessage ? (
              <div className='flex flex-col items-center justify-center'>
                <img src='/no-data-found.png' alt='No data found' />
                <p className='text-center mt-3 text-lg text-gray-700'>
                  Oops! No results were found!
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-6'>
                {data.map((item, index) => (
                  <div key={item.uuid} className='group cursor-pointer'>
                    <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                      {/* Image */}
                      <div className='relative overflow-hidden'>
                        <img
                          src={item.banner}
                          alt={item.title}
                          className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      </div>

                      {/* Content */}
                      <div className='p-6'>
                        {/* Author and Date */}
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center space-x-3'>
                            <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                              <span className='text-gray bg-gray-600 w-10 h-8 flex items-center justify-center rounded-full text-sm font-medium'>
                                {getAuthorInitial(item.title)}
                              </span>
                            </div>
                            <span className='text-gray-600 text-sm font-medium'>
                              Author
                            </span>
                          </div>
                          <div className='flex items-center text-gray-400 text-sm'>
                            <svg
                              className='w-4 h-4 mr-1'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                            </svg>
                            {formatDate(item.createdAt)}
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className='text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200'>
                          {item.title}
                        </h2>

                        {/* Description */}
                        <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3'>
                          {stripHtml(item.services)}
                        </p>

                        {/* Categories and Read More */}
                        <div className='flex items-center justify-between'>
                          <div className='flex flex-wrap gap-2'>
                            {item.category.slice(0, 2).map((cat, i) => (
                              <span
                                key={i}
                                className='px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full'
                              >
                                {formatCategory(cat)}
                              </span>
                            ))}
                            {item.category.length > 2 && (
                              <span className='px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full'>
                                +{item.category.length - 2}
                              </span>
                            )}
                          </div>
                          <Link href={`/blog/${item.slug}`}>
                            <button className='flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700'>
                              <span>More</span>
                              <svg
                                className='w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                                />
                              </svg>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='work__slider sm:mt-0 mt-5'>
          <Swiper
            ref={swiperRef}
            breakpoints={{
              350: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 1,
              },
              992: {
                slidesPerView: 1,
              },
            }}
            speed={1200}
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            spaceBetween={40}
            loop={true}
            pagination={{ clickable: true }}
            // modules={[ Autoplay]}
            className='h-auto'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {data
              .slice()
              .reverse()
              .map((item, i) => (
                <SwiperSlide key={i}>
                  <div className='bg-light rounded-sm w-full pb-3 lg:w-[449px]'>
                    <Link href={`/blog/${item.slug}`} key={i}>
                      <figure className='mb-2.5'>
                        <img
                          className='rounded-image w-full h-[293px] object-cover'
                          src={item.banner}
                          height={293}
                          width={449}
                          alt='Insight Hub Image'
                          loading='lazy'
                        />
                      </figure>
                      <div className='flex text-sm justify-normal lg:justify-between mb-1 pl-2.5 font-light'>
                        <div className='space-x-2'>
                          {item?.category?.map((cat, i) => (
                            <span key={i} className='text-prussianBlue/50'>
                              {cat}
                            </span>
                          ))}
                        </div>
                        <span className='pr-5 block text-prussianBlue/40'>
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <h2 className='mb-1 text-xl font-medium pl-2.5 w-full line-clamp-1 lg:w-[80%] leading-9'>
                        {item.title}
                      </h2>
                      <p className='pl-2.5 mb-4 text-prussianBlue/60 text-sm font-light line-clamp-3 lg:w-[92%]'>
                        <StyledContent htmlContent={item.services} />
                      </p>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>
    </>
  )
}
