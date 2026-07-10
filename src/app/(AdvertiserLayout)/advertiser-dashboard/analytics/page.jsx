'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import AnalyticsComponent from '@/components/advertisementComponent/AnalyticsComponent'

const AnalyticsInner = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const creativeId = searchParams.get('creative')

  if (!id) {
    return (
      <div className='rounded-xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500'>
        <p>Select an advertisement to view its analytics.</p>
        <Link
          href='/advertiser-dashboard/my-ads'
          className='inline-block mt-4 text-[#A2913E] font-medium hover:underline'
        >
          Go to My Advertisements →
        </Link>
      </div>
    )
  }

  return <AnalyticsComponent id={id} creativeId={creativeId} />
}

const AnalyticsPage = () => {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold text-[#002D4F]'>
          Analytics
        </h1>
        <p className='text-gray-500 mt-1'>
          Impressions and clicks for your advertisements.
        </p>
      </div>

      <Suspense fallback={<div className='p-8 text-gray-500'>Loading…</div>}>
        <AnalyticsInner />
      </Suspense>
    </div>
  )
}

export default AnalyticsPage
