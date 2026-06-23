'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate, sanitizeHTML } from '../../../../utils/global-functions/global'
import { Banner } from '@/components/modules/Banner'
import parse from 'html-react-parser'

export default function ClientInsight() {
  const [detailData, setDetailData] = useState(null)
  const [sidebarData, setSidebarData] = useState([])
  const [query, setQuery] = useState('')
  const path = usePathname()
  const slug = path.split('/')[2]

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getBySlug/${slug}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const result = await response.json()
        setDetailData(result.data)
      } catch (error) {
        console.error('Error fetching detail data:', error)
      }
    }

    const fetchSidebarData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blog/getAll?category=${query}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const result = await response.json()
        setSidebarData(result.data)
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      }
    }

    fetchDetailData()
    fetchSidebarData()
  }, [slug, query])

  return (
    <>
      <Banner title='News & trends' />

      <div className='theme-container py-5 sm:py-8 px-4 sm:px-6'>
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Main Content */}
          <div className='w-full lg:w-2/3 min-w-0'>
            {detailData ? (
              <>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug sm:leading-tight text-balance mb-4 sm:mb-5'>
                  {detailData.title}
                </h1>

                <div className='flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 mb-5 sm:mb-6 text-xs sm:text-sm text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 bg-reefGold rounded-full flex items-center justify-center shrink-0'>
                      <span className='text-white text-xs sm:text-sm font-semibold'>A</span>
                    </div>
                    <span className='font-medium text-gray-800'>Admin</span>
                  </div>
                  <span className='hidden xsm:inline text-gray-300' aria-hidden>|</span>
                  <time dateTime={detailData.createdAt} className='text-gray-600 whitespace-nowrap'>
                    {formatDate(detailData.createdAt)}
                  </time>
                  <span className='text-gray-300' aria-hidden>|</span>
                  <span className='text-gray-600 whitespace-nowrap'>5 min read</span>
                </div>

                <article className='bg-white min-w-0'>
                  <div className='mb-5 sm:mb-6 -mx-0 sm:mx-0 overflow-hidden rounded-lg sm:rounded-xl'>
                    <Image
                      src={detailData.banner}
                      height={400}
                      width={800}
                      className='w-full h-48 xsm:h-56 sm:h-64 md:h-80 lg:h-[400px] object-cover'
                      priority
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 800px'
                      alt={detailData?.SEO?.imageAlt || detailData?.title}
                    />
                  </div>

                  <div className='blog-article-prose prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed break-words'>
                    {parse(sanitizeHTML(detailData?.services))}
                  </div>

                  {detailData?.faqs && detailData.faqs.length > 0 && (
                    <section className='mt-8 sm:mt-10 -mx-4 sm:mx-0 bg-gray-50 rounded-none sm:rounded-xl px-4 sm:px-6 py-6 sm:py-8'>
                      <div className='space-y-3 sm:space-y-4'>
                        {detailData.faqs.map((faq, index) => (
                          <div
                            key={index}
                            className='bg-white rounded-lg shadow-sm p-4 sm:p-5'
                          >
                            <p className='text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3'>
                              {faq.question}
                            </p>
                            <div className='text-sm sm:text-base text-gray-700 leading-relaxed break-words'>
                              {parse(sanitizeHTML(faq.answer || ''))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </article>
              </>
            ) : (
              <div className='animate-pulse space-y-4'>
                <div className='h-8 sm:h-10 bg-gray-200 rounded w-full max-w-xl' />
                <div className='h-4 bg-gray-200 rounded w-48' />
                <div className='h-48 sm:h-64 bg-gray-200 rounded-lg' />
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded' />
                  <div className='h-4 bg-gray-200 rounded' />
                  <div className='h-4 bg-gray-200 rounded w-5/6' />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='w-full lg:w-1/3 min-w-0'>
            <div className='bg-gray-50 rounded-lg p-4 sm:p-6 lg:sticky lg:top-8'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4'>
                Most Red Featured Insight
              </h2>

              <div className='space-y-3 sm:space-y-4'>
                {sidebarData.length > 0 ? (
                  sidebarData.slice(0, 6).map((item, index) => (
                    <Link href={`/blog/${item.slug}`} key={index} className='block'>
                      <div className='flex gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow'>
                        <div className='shrink-0'>
                          <Image
                            src={item.banner}
                            height={80}
                            width={80}
                            className='h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg'
                            alt={item.title}
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-sm font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2 leading-snug'>
                            {item.title}
                          </h3>
                          <p className='text-xs text-gray-500'>
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className='text-center text-gray-500 py-6 sm:py-8 text-sm'>
                    <p>No related articles found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
