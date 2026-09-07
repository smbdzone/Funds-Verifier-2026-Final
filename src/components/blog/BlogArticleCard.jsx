'use client'

import Link from 'next/link'
import { formatDate } from '@/utils/global-functions/global'
import StyledContent from '@/components/global/StyledContent'

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

export default function BlogArticleCard({ item, className = '' }) {
  const href = item?.slug ? `/blog/${item.slug}` : '#'
  const excerpt = stripHtml(item?.services)

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-reefGold/25 bg-white shadow-[0_2px_16px_rgba(162,145,62,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,45,79,0.12)] ${className}`}
    >
      <Link href={href} className='flex h-full flex-col'>
        <figure className='relative m-0 aspect-[16/10] w-full overflow-hidden'>
          <img
            src={item.banner}
            alt={item.imagealttext || item.title || 'Blog article'}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            loading='lazy'
            referrerPolicy='no-referrer'
          />
          {item?.isFeatured ? (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${GOLD_GRADIENT}`}
            >
              Featured
            </span>
          ) : null}
        </figure>

        <div className='flex flex-1 flex-col px-5 py-4'>
          <div className='mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-prussianBlue/50'>
            <div className='flex flex-wrap gap-2'>
              {(item?.category || []).slice(0, 2).map((cat, index) => (
                <span
                  key={`${cat}-${index}`}
                  className='rounded-full border border-reefGold/30 bg-reefGold/10 px-2.5 py-0.5 text-[11px] font-medium capitalize text-prussianBlue'
                >
                  {formatCategory(cat)}
                </span>
              ))}
            </div>
            <time className='shrink-0'>{formatDate(item.createdAt)}</time>
          </div>

          <h2 className='mb-2 line-clamp-2 text-lg font-semibold leading-snug text-prussianBlue transition-colors group-hover:text-reefGold md:text-xl'>
            {item.title}
          </h2>

          {excerpt ? (
            <p className='mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-prussianBlue/65'>
              {excerpt}
            </p>
          ) : (
            <div className='mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-prussianBlue/65'>
              <StyledContent htmlContent={item.services} />
            </div>
          )}

          <span className='mt-auto inline-flex items-center gap-1 text-sm font-semibold text-reefGold'>
            Read more
            <span
              className='transition-transform duration-200 group-hover:translate-x-1'
              aria-hidden='true'
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}
