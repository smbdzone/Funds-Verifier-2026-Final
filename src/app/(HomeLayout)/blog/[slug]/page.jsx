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
      <Banner
        title='NEWS & TREND'
        catagory='Home'
        subcatagory={`News And Trends / ${detailData?.slug}`}
      />
      <div className='mb-6 max-w-2xl my-4 mx-auto'>
        <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight'>
          {detailData?.title}
        </h1>

        <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-medium'>A</span>
            </div>
            <span>Admin</span>
          </div>

          <div className='flex items-center gap-1'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                clipRule='evenodd'
              />
            </svg>
            <span>{formatDate(detailData?.createdAt)}</span>
          </div>

          <div className='flex items-center gap-1'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span>5 min read</span>
          </div>
        </div>

        {/* Categories */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {detailData?.category?.map((cat, i) => (
            <span
              key={i}
              className='px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'
            >
              {cat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>
      <div className='theme-container py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content */}
          <div className='lg:w-2/3'>
            {detailData && (
              <article className='bg-white'>
                {/* Main Image */}
                <div className='mb-6'>
                  <Image
                    src={detailData?.banner}
                    height={400}
                    width={800}
                    className='w-full h-[400px] object-cover rounded-lg'
                    priority
                    alt={detailData?.SEO?.imageAlt || detailData?.title}
                  />
                </div>

                {/* Article Header */}

                {/* Article Content */}
                <div className='prose prose-lg max-w-none text-gray-700 leading-relaxed'>
                  {parse(sanitizeHTML(detailData?.services))}
                </div>
                {detailData?.faqs && detailData?.faqs.length > 0 && (
                  <section className='bg-gray-50 py-8'>
                    <div className=' space-y-4'>
                      {detailData?.faqs.map((faq, index) => (
                        <div
                          key={index}
                          className='bg-white rounded-lg shadow-sm'
                        >
                          <span className='text-lg font-medium text-gray-900'>
                            {faq.question}
                          </span>

                          <div className='text-gray-700 leading-relaxed'>
                            {parse(sanitizeHTML(faq.answer || ''))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </article>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:w-1/3'>
            <div className='bg-gray-50 rounded-lg p-6 sticky top-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Most Red Featured Insight
              </h2>

              {/* Related Articles */}
              <div className='space-y-4'>
                {sidebarData.length > 0 ? (
                  sidebarData.slice(0, 6).map((item, index) => (
                    <Link href={`/blog/${item.slug}`} key={index}>
                      <div className='flex gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer'>
                        <div className='flex-shrink-0'>
                          <Image
                            src={item.banner}
                            height={80}
                            width={80}
                            className='h-[80px] w-[80px] object-cover rounded-lg'
                            alt={item.title}
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-sm font-medium text-gray-900 line-clamp-2 mb-2'>
                            {item.title}
                          </h3>
                          <div className='flex items-center text-xs text-gray-500 mb-1'>
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                          <div className='flex flex-wrap gap-1'>
                            {item.category?.slice(0, 1).map((cat, i) => (
                              <span
                                key={i}
                                className='text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded'
                              >
                                {cat.replace(/-/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className='text-center text-gray-500 py-8'>
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
