'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Banner } from '@/components/modules/Banner'
import { Gavel } from 'lucide-react'
import AuctionsPageSkeleton from '@/components/auctions/AuctionsPageSkeleton'

export default function AuctionsPage() {
  const [isPageReady, setIsPageReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPageReady(true), 650)
    return () => window.clearTimeout(timer)
  }, [])

  if (!isPageReady) {
    return <AuctionsPageSkeleton />
  }

  return (
    <>
      <Banner title='Auctions' />

      <section className='bg-white py-10 sm:py-14 md:py-20'>
        <div className='theme-container mx-auto px-4 sm:px-6'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-reefGold sm:text-sm'>
              Coming Soon
            </p>

            <div className='relative mx-auto mb-8 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full shadow-[0_8px_32px_rgba(162,145,62,0.25)] [background:linear-gradient(135deg,_#a2913e,_#d7c590_50%,_#a2913e)]'>
              <Gavel className='text-white' size={42} strokeWidth={1.75} />
            </div>

            <h2 className='mb-4 text-2xl font-bold text-prussianBlue sm:text-3xl md:text-4xl'>
              Auctions
            </h2>

            <p className='mb-2 text-base font-medium text-prussianBlue/80 sm:text-lg'>
              Launching soon on Funds Verifier
            </p>

            <div className='mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-reefGold to-transparent' />

            <p className='mb-8 text-sm leading-relaxed text-gray-600 sm:text-base'>
              We&apos;re building a secure auction experience for verified
              assets — transparent bidding, trusted evaluations, and safe
              transactions. This feature will be available shortly.
            </p>

            <div className='inline-flex items-center justify-center rounded-full border border-reefGold/35 bg-gradient-to-r from-[#faf6eb] via-white to-[#e9f1fd] px-5 py-2 shadow-sm'>
              <span className='text-xs font-semibold uppercase tracking-[0.25em] text-reefGold sm:text-sm'>
                Coming Soon
              </span>
            </div>

            <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4'>
              <Link
                href='/'
                className='inline-flex h-11 min-w-[140px] items-center justify-center rounded-l-sm px-6 font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] transition-opacity hover:opacity-90'
              >
                Back to Home
              </Link>
              <Link
                href='/contact'
                className='inline-flex h-11 min-w-[140px] items-center justify-center rounded-sm border border-reefGold/60 px-6 font-medium text-prussianBlue transition-colors hover:bg-reefGold/10'
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
