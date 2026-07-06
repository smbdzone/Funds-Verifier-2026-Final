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
    <section className='mb-8'>
      <Link
        href={href}
        className='group block overflow-hidden rounded-2xl border border-reefGold/25 bg-white shadow-[0_8px_32px_rgba(0,45,79,0.12)]'
      >
        <div className='flex flex-col md:min-h-[360px] md:flex-row md:items-stretch'>
          {/* Image — left on desktop */}
          <figure className='relative m-0 aspect-[16/10] w-full shrink-0 overflow-hidden bg-prussianBlue/5 md:aspect-auto md:min-h-[360px] md:w-1/2'>
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
              className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ${GOLD_GRADIENT}`}
            >
              Featured
            </span>
          </figure>

          {/* Content — right on desktop */}
          <div className='primary-gradient flex min-h-[260px] w-full flex-col justify-center px-6 py-8 md:min-h-[360px] md:w-1/2 md:px-10 md:py-10'>
            <h2 className='mb-2 text-xl font-bold leading-snug text-white sm:text-2xl md:text-3xl'>
              {blog.title}
            </h2>

            <time className='mb-3 text-sm font-medium text-white/75'>
              {formatDate(blog.createdAt)}
            </time>

            {description ? (
              <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-white/90 sm:text-base'>
                {description}
              </p>
            ) : null}

            {(blog.category || []).length > 0 ? (
              <div className='mb-6 flex flex-wrap gap-2'>
                {(blog.category || []).slice(0, 2).map((cat, index) => (
                  <span
                    key={`${cat}-${index}`}
                    className='rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium capitalize text-white'
                  >
                    {formatCategory(cat)}
                  </span>
                ))}
              </div>
            ) : null}

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 ${GOLD_GRADIENT}`}
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
