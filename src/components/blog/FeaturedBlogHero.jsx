'use client'

import Link from 'next/link'
import { formatDate } from '@/utils/global-functions/global'

const GOLD_GRADIENT =
  '[background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]'

function stripHtml(html) {
  if (!html || typeof html !== 'string') return ''
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function formatCategory(category) {
  return String(category || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function FeaturedBlogHero({ blog }) {
  if (!blog) return null

  const description = stripHtml(blog.services || blog.SEO?.description || '')
  const href = blog.slug ? `/blog/${blog.slug}` : '#'

  return (
    <section className='mb-6 md:mb-8'>
      <Link
        href={href}
        className='group mx-auto block max-w-5xl overflow-hidden rounded-2xl border border-reefGold/25 bg-white shadow-[0_8px_32px_rgba(0,45,79,0.12)] xl:max-w-none'
      >
        <div className='flex flex-col md:min-h-[260px] md:flex-row md:items-stretch lg:min-h-[300px] xl:min-h-[360px]'>
          {/* Image — left on tablet/desktop; slightly shorter on big tablet */}
          <figure className='relative m-0 aspect-[16/10] w-full shrink-0 overflow-hidden bg-prussianBlue/5 md:aspect-auto md:min-h-[260px] md:w-1/2 lg:min-h-[300px] xl:min-h-[360px]'>
            {blog.banner ? (
              <img
                src={blog.banner}
                alt={blog.imagealttext || blog.title || 'Featured blog'}
                className='absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]'
                referrerPolicy='no-referrer'
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center text-sm text-prussianBlue/40'>
                No image
              </div>
            )}
            <span
              className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white md:left-4 md:top-4 md:px-3 md:text-xs ${GOLD_GRADIENT}`}
            >
              Featured
            </span>
          </figure>

          {/* Content — right on tablet/desktop */}
          <div className='primary-gradient flex min-h-[180px] w-full flex-col justify-center px-4 py-4 md:min-h-[220px] md:w-1/2 md:px-5 md:py-5 lg:min-h-[260px] lg:px-6 xl:min-h-[360px] xl:px-10 xl:py-10'>
            <h2 className='mb-1.5 text-sm font-bold leading-snug text-white md:mb-2 md:text-[15px] lg:text-base xl:text-3xl xl:leading-snug'>
              {blog.title}
            </h2>

            <time className='mb-1.5 text-[10px] font-medium text-white/75 md:mb-2 md:text-[11px] xl:mb-3 xl:text-sm'>
              {formatDate(blog.createdAt)}
            </time>

            {description ? (
              <p className='mb-2.5 line-clamp-2 text-xs leading-relaxed text-white/90 md:mb-3 md:line-clamp-2 md:text-xs lg:line-clamp-3 xl:mb-4 xl:text-base'>
                {description}
              </p>
            ) : null}

            {(blog.category || []).length > 0 ? (
              <div className='mb-3 flex flex-wrap gap-1.5 md:mb-4 xl:mb-6 xl:gap-2'>
                {(blog.category || []).slice(0, 2).map((cat, index) => (
                  <span
                    key={`${cat}-${index}`}
                    className='rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[10px] font-medium capitalize text-white md:text-[11px] xl:px-3 xl:py-1 xl:text-xs'
                  >
                    {formatCategory(cat)}
                  </span>
                ))}
              </div>
            ) : null}

            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90 md:px-3.5 md:py-2 md:text-xs xl:gap-2 xl:px-5 xl:py-2.5 xl:text-sm ${GOLD_GRADIENT}`}
            >
              Read article
              <span
                className='transition-transform duration-200 group-hover:translate-x-1'
                aria-hidden='true'
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </section>
  )
}
