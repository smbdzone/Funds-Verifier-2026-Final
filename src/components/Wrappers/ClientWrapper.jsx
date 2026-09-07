'use client'
import { useState, Suspense } from 'react'
import { ListingSidebar } from '@/components/modules/ListingSidebar'
import { AuctionData } from '@/components/modules/AuctionData'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'

export default function ClientWrapper({ initialData, searchParams, params }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev)
  }

  return (
    <div className='relative flex w-full flex-col justify-between gap-4 px-3 sm:px-4 min-[1200px]:flex-row min-[1200px]:gap-6 xl:px-12'>
      {/* Below 1200px: filters on top (collapsible) */}
      <div className='w-full min-[1200px]:hidden'>
        <button
          type='button'
          onClick={toggleSidebar}
          className='mb-2 flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left text-sm font-semibold text-prussianBlue shadow-md sm:text-base'
        >
          <span>{isSidebarVisible ? 'Hide Filters' : 'Show Filters'}</span>
          <img
            src='/icons/golden-arrow-previous.png'
            alt=''
            className={`h-3 w-3 transition-transform ${isSidebarVisible ? 'rotate-90' : '-rotate-90'}`}
          />
        </button>
        {isSidebarVisible ? (
          <div className='w-full overflow-hidden rounded-lg bg-white shadow-xl'>
            <ListingSidebar
              initialData={initialData}
              params={params}
              isSidebarVisible={toggleSidebar}
            />
          </div>
        ) : null}
      </div>

      {/* 1200px+: side filter */}
      <div className='hidden shrink-0 min-[1200px]:block'>
        <ListingSidebar
          initialData={initialData}
          params={params}
          isSidebarVisible={toggleSidebar}
        />
      </div>

      {/* Listings — full long width */}
      <div className='w-full min-w-0 flex-1 py-2 min-[1200px]:py-6'>
        <Suspense fallback={<ListingCardSkeleton count={3} />}>
          <AuctionData
            initialData={initialData}
            searchParams={searchParams}
            params={params}
            isSidebarVisible={toggleSidebar}
          />
        </Suspense>
      </div>
    </div>
  )
}
