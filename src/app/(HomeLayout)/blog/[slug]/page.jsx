'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate, sanitizeHTML } from '../../../../utils/global-functions/global'
import { Banner } from '@/components/modules/Banner'
import parse from 'html-react-parser'
import {
  filterActiveBlogs,
  isFeaturedBlog,
  PUBLIC_BLOG_FETCH_OPTIONS,
  sortBlogsForDisplay,
} from '@/utils/blogVisibility'
import BlogComments from '@/components/blog/BlogComments'

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
          PUBLIC_BLOG_FETCH_OPTIONS,
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
          PUBLIC_BLOG_FETCH_OPTIONS,
        )
        const result = await response.json()
        setSidebarData(filterActiveBlogs(result.data))
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      }
    }

    fetchDetailData()
    fetchSidebarData()
  }, [slug, query])

  const featuredInsights = useMemo(() => {
    return sortBlogsForDisplay(filterActiveBlogs(sidebarData))
      .filter((item) => isFeaturedBlog(item) && item.slug !== slug)
      .slice(0, 4)
  }, [sidebarData, slug])

  return (
    <>
      <Banner title='News & trends' />

      <div className='theme-container py-5 sm:py-8 px-4 sm:px-6'>
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Main Content */}
          <div className='w-full lg:w-2/3 min-w-0'>
            {detailData ? (
              <>
                <h1 className='mb-3 text-base font-bold leading-snug text-balance text-gray-900 md:mb-4 md:text-lg lg:mb-5 lg:text-3xl lg:leading-tight xl:text-4xl'>
                  {detailData.title}
                </h1>

                <div className='mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] text-gray-600 md:mb-5 md:gap-x-3 md:text-xs lg:mb-6 lg:gap-x-4 lg:text-sm'>
                  <div className='flex items-center gap-1.5 md:gap-2'>
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-reefGold md:h-7 md:w-7 lg:h-8 lg:w-8'>
                      <span className='text-[10px] font-semibold text-white md:text-xs lg:text-sm'>A</span>
                    </div>
                    <span className='font-medium text-gray-800'>Admin</span>
                  </div>
                  <span className='hidden text-gray-300 xsm:inline' aria-hidden>|</span>
                  <time dateTime={detailData.createdAt} className='whitespace-nowrap text-gray-600'>
                    {formatDate(detailData.createdAt)}
                  </time>
                  <span className='text-gray-300' aria-hidden>|</span>
                  <span className='whitespace-nowrap text-gray-600'>5 min read</span>
                </div>

                <article className='min-w-0 bg-white'>
                  <div className='-mx-0 mb-4 overflow-hidden rounded-lg sm:mx-0 sm:rounded-xl md:mb-5 lg:mb-6'>
                    <Image
                      src={detailData.banner}
                      height={400}
                      width={800}
                      className='h-48 w-full object-cover xsm:h-56 sm:h-64 md:h-80 lg:h-[400px]'
                      priority
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 800px'
                      alt={detailData?.SEO?.imageAlt || detailData?.title}
                    />
                  </div>

                  <div className='blog-article-prose prose prose-sm max-w-none break-words text-gray-700 leading-relaxed lg:prose-base xl:prose-lg'>
                    {parse(sanitizeHTML(detailData?.services))}
                  </div>
                </article>

                <BlogComments blogUuid={detailData.uuid} />
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
            <div className='rounded-2xl bg-gradient-to-br from-reefGold/70 via-reefGold/25 to-prussianBlue/20 p-[1px] shadow-[0_8px_30px_rgba(162,145,62,0.15)] lg:sticky lg:top-8'>
              <div className='rounded-[15px] bg-white p-4 sm:p-5'>
                <div className='mb-4 border-b border-reefGold/20 pb-3'>
                  <h2 className='text-lg font-semibold text-prussianBlue sm:text-xl'>
                    Top Featured Insights
                  </h2>
                  <p className='mt-1 text-xs text-gray-500'>
                    Hand-picked articles worth reading
                  </p>
                </div>

                <div className='space-y-3'>
                  {featuredInsights.length > 0 ? (
                    featuredInsights.map((item) => (
                      <Link
                        href={`/blog/${item.slug}`}
                        key={item.uuid || item.slug}
                        className='group block'
                      >
                        <div className='flex gap-3 rounded-xl border border-reefGold/15 bg-gradient-to-r from-white to-gray-50/60 p-3 transition-all duration-300 hover:border-reefGold/45 hover:shadow-[0_4px_16px_rgba(162,145,62,0.12)]'>
                          <div className='relative shrink-0 overflow-hidden rounded-lg ring-1 ring-reefGold/20'>
                            <Image
                              src={item.banner}
                              height={80}
                              width={80}
                              className='h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-[72px] sm:w-[72px]'
                              alt={item.title}
                            />
                          </div>
                          <div className='min-w-0 flex-1'>
                            <span className='mb-1 inline-block rounded-full bg-reefGold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-reefGold'>
                              Featured
                            </span>
                            <h3 className='line-clamp-2 text-sm font-medium leading-snug text-gray-900 transition-colors group-hover:text-prussianBlue'>
                              {item.title}
                            </h3>
                            <p className='mt-1 text-xs text-gray-500'>
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className='rounded-xl border border-dashed border-reefGold/25 py-8 text-center text-sm text-gray-500'>
                      <p>No featured insights yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
