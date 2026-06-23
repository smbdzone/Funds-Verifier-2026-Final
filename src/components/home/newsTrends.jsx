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
import { swiperCanLoop } from '@/utils/swiperLoop'

function stripHtml(html) {
  if (!html || typeof html !== 'string') return ''
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function isRemoteImage(url) {
  return (
    typeof url === 'string' &&
    (url.startsWith('http://') || url.startsWith('https://'))
  )
}

function NewsTrendCard({ item, className = '' }) {
  const href = item.slug ? `/blog/${item.slug}` : '/blog'
  const description = stripHtml(item.description) || 'No description available.'

  return (
    <article
      className={`flex flex-col h-[420px] overflow-hidden rounded-xl bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.15)] ${className}`}
    >
      <Link href={href} className='relative block h-[200px] w-full shrink-0 overflow-hidden'>
        {isRemoteImage(item.image) ? (
          <img
            src={item.image}
            alt={item.title}
            referrerPolicy='no-referrer'
            className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
          />
        ) : (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 768px) 100vw, 33vw'
            className='object-cover transition-transform duration-300 hover:scale-105'
          />
        )}
      </Link>

      <div className='flex flex-1 flex-col px-4 pt-3 pb-4 min-h-0'>
        <h3 className='text-[#002D4F] text-center text-lg lg:text-xl font-semibold line-clamp-2 leading-snug shrink-0'>
          {item.title}
        </h3>

        <p
          className='mt-2 text-sm leading-[22px] text-center text-black/80 overflow-hidden max-h-[66px]'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
          }}
        >
          {description}
        </p>

        <div className='mt-3 flex justify-center shrink-0'>
          <Link
            href={href}
            className='text-[#8D7C3B] text-sm font-semibold underline underline-offset-2 hover:text-[#6f6130] transition-colors'
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function NewsTrends() {
  const swiperRef = useRef(null)
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(false)
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
          title: item?.title?.trim() || 'Untitled',
          image: item?.banner || Object.values(dummyImages)[idx % 5],
          description: item?.SEO?.description || 'No description available.',
          slug: item?.slug || item?.uuid || '',
        }))

        setNewsItems(formatted)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
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
        loading ? <p className='text-center text-gray-500 py-10'>
          loading News & Trends...
        </p> : (<>
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
              loop={swiperCanLoop(newsItems.length, 2)}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
              }}
              className='px-3'
            >
              {newsItems.map((item, index) => (
                <SwiperSlide key={index} className='!h-auto'>
                  <NewsTrendCard item={item} className='shadow-lg shadow-black/10' />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Grid */}
          <div className='hidden md:block'>
            <div className='flex justify-between gap-3 mb-3'>
              {/* Left Card */}
              <NewsTrendCard item={newsItems[0]} className='w-1/3' />

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
                <NewsTrendCard item={newsItems[1]} className='w-1/3' />
              )}
            </div>

            {/* Second Row */}
            <div className='flex justify-between gap-3'>
              {newsItems.slice(2).map((item, idx) => (
                <NewsTrendCard key={idx} item={item} className='w-1/3' />
              ))}
            </div>
          </div>
        </>)
      }

    </div>
  )
}
