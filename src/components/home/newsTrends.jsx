'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import house from '@/assets/images/mask-group@2x.png'
import boats from '@/assets/images/rectangle-81@2x.png'
import cars from '@/assets/images/rectangle-80@2x.png'
import planes from '@/assets/images/rectangle-82@2x.png'
import jewellry from '@/assets/images/rectangle-83@2x.png'
import arrow_right from '@/assets/vector1.svg'
import Link from 'next/link'

export default function NewsTrends() {
  const swiperRef = useRef(null)
  const [newsItems, setNewsItems] = useState([])
   const [loading,setLoading]=useState(false)
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getAll?limit=5&page=1`
        )
        const data = await res.json()
        const articles = data?.data || []

        const dummyImages = { house, boats, cars, planes, jewellry }

        const formatted = articles.map((item, idx) => ({
          category: item?.category?.[0] || 'General',
          image: item?.banner || Object.values(dummyImages)[idx % 5],
          description: item?.SEO?.description || 'No description available.',
          slug: item?.slug || item?.uuid || '', // ✅ add slug here
        }))

        setNewsItems(formatted)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      }finally{
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  if (newsItems.length === 0) {
    return (
      <p className='text-center text-gray-500 py-10'>
        No News & Trends
      </p>
    )
  }

  return (
    <div className='container mx-auto py-2 sm:pt-10'>
      {
        loading ?  <p className='text-center text-gray-500 py-10'>
        loading News & Trends...
      </p>:(<>
       {/* Header for all views */}
       <div className='text-center mb-6 md:hidden'>
        <div className='tracking-wide text-2xl lg:text-4xl font-semibold text-[#002D4F]'>
          News & Trends
        </div>
        <div className='flex justify-center my-3 gap-2'>
          <div className='bg-[#002D4F] w-5 h-[5.6px] rounded-2xl' />
          <div className='bg-[#8D7C3B] w-12 h-[5.6px] rounded-lg' />
        </div>
        <p className='xl:w-[35%] lg:w-[50%] md:hidden md:px-5 pb-2 text-xs text-center'>
          Stay updated with the latest industry trends and updates.
        </p>
        <div className='flex justify-center md:hidden space-x-2'>
          <div onClick={handlePrev} className='cursor-pointer'>
            <div className='btn-gradient px-1 py-1 rounded'>
              <Image
                src={arrow_right}
                alt='previous'
                height={15}
                width={15}
                className='transform rotate-180 w-[10px] h-[10px]'
              />
            </div>
          </div>
          <div onClick={handleNext} className='cursor-pointer'>
            <div className='btn-gradient px-1 py-1 rounded'>
              <Image
                src={arrow_right}
                alt='next'
                height={15}
                width={15}
                className='transform w-[10px] h-[10px]'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Swiper */}
      <div className='block md:hidden'>
        <Swiper
          ref={swiperRef}
          modules={[]}
          spaceBetween={20}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
          }}
          className='px-3'
        >
          {newsItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className='shadow-lg shadow-black/10 rounded-md col-span-1'>
                <Image
                  src={item.image}
                  alt={item.category}
                  width={500}
                  height={300}
                  className='rounded object-cover'
                />
                <div className='text-[#002D4F] my-2 text-center text-xl lg:text-2xl font-semibold'>
                  {item.category}
                </div>
                <p className='text-xs md:text-sm lg:text-base leading-[22px] text-center text-black line-clamp-4 px-2'>
                  {item.description}
                </p>
                <div className='flex justify-center items-center'>
                  <Link href={`/blog/${item.slug}`}>
                    <button className='text-[#8D7C3B] text-sm font-medium my-3 underline text-center cursor-pointer'>
                      View More
                    </button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className='hidden md:block'>
        <div className='flex justify-between gap-3 mb-3'>
          {/* Left Card */}
          <div className='shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] h-auto w-1/3 rounded bg-white'>
            <Image
              src={newsItems[0].image}
              alt={newsItems[0].category}
              width={500}
              height={300}
              className='rounded-[12px] object-cover'
            />
            <div className='text-[#002D4F] my-2 text-center text-xl lg:text-2xl font-semibold'>
              {newsItems[0].category}
            </div>
            <p className='text-sm leading-[22px] px-2 text-center text-black line-clamp-4'>
              {newsItems[0].description}
            </p>
            <div className='flex justify-center items-center'>
              <Link href={`/blog/${newsItems[0].slug}`}>
                <button className='text-[#8D7C3B] text-sm font-medium my-3 underline text-center cursor-pointer'>
                  View More
                </button>
              </Link>
            </div>
          </div>

          {/* Center Text */}
          <div className='w-1/3 flex flex-col items-center justify-center text-center'>
            <div className='text-[#002D4F] text-2xl lg:text-4xl font-semibold'>
              News & Trends
            </div>
            <div className='flex justify-center gap-2 my-5'>
              <div className='bg-[#002D4F] w-[31.8px] h-[5.6px] rounded-2xl' />
              <div className='bg-[#8D7C3B] w-[84.9px] h-[5.6px] rounded-lg' />
            </div>
            <p className='text-base lg:text-lg leading-[30px] px-5'>
              Stay updated with the latest industry trends and updates from Fund
              Verify.
            </p>
          </div>

          {/* Right Card */}
          {newsItems[1]?.image && (
            <div className='shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] h-auto w-1/3 rounded bg-white'>
              <Image
                src={newsItems[1].image}
                alt={newsItems[1].category || 'news'}
                width={500}
                height={300}
                className='rounded object-cover'
              />

              <div className='text-[#002D4F] my-2 text-center text-xl lg:text-2xl font-semibold'>
                {newsItems[1].category}
              </div>
              <p className='text-sm leading-[22px] px-2 text-center text-black line-clamp-4'>
                {newsItems[1].description}
              </p>
              <div className='flex justify-center items-center'>
                <Link href={`/blog/${newsItems[1].slug}`}>
                  <button className='text-[#8D7C3B] text-sm font-medium my-3 underline text-center cursor-pointer'>
                    View More
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Second Row */}
        <div className='flex justify-between gap-3'>
          {newsItems.slice(2).map((item, idx) => (
            <div
              key={idx}
              className='shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] w-1/3 rounded bg-white'
            >
              <div className='relative h-[300px] rounded overflow-hidden'>
                <Image
                  src={item.image}
                  alt={item.category}
                  fill
                  className='object-cover'
                />
              </div>

              <div className='text-[#002D4F] my-2 text-center text-xl lg:text-2xl font-semibold'>
                {item.category}
              </div>
              <p className='text-sm leading-[22px] px-2 text-center text-black line-clamp-4'>
                {item.description}
              </p>
              <div className='flex justify-center items-center'>
                <Link href={`/blog/${item.slug}`}>
                  <button className='text-[#8D7C3B] text-sm font-medium my-3 underline text-center cursor-pointer'>
                    View More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>)
      }
     
    </div>
  )
}
