export function HomeListingSliderSkeleton({ count = 3 }) {
  return (
    <div
      className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-2 animate-pulse'
      aria-busy='true'
      aria-label='Loading listings'
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='mx-2 w-full shadow-[0px_0px_8px_rgba(0,0,0,0.15)] rounded-md bg-white overflow-hidden'
        >
          <div className='h-[275px] w-full bg-gray-200' />
          <div className='p-4 space-y-3'>
            <div className='h-4 bg-gray-200 rounded w-28' />
            <div className='h-5 bg-gray-200 rounded w-4/5' />
            <div className='h-4 bg-gray-200 rounded w-2/3' />
            <div className='border-t border-gray-200 my-3' />
            <div className='flex justify-between items-center pb-2'>
              <div className='flex gap-3 items-center'>
                <div className='w-12 h-12 rounded-full bg-gray-200 shrink-0' />
                <div className='h-4 bg-gray-200 rounded w-20' />
              </div>
              <div className='h-4 bg-gray-200 rounded w-24' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function NewsTrendCardSkeleton({ className = '' }) {
  return (
    <article
      className={`flex flex-col h-[420px] overflow-hidden rounded-xl bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.12)] ${className}`}
    >
      <div className='h-[200px] w-full bg-gray-200 shrink-0' />
      <div className='flex flex-1 flex-col items-center px-4 pt-4 pb-4 gap-2'>
        <div className='h-5 bg-gray-200 rounded w-[85%]' />
        <div className='h-3 bg-gray-200 rounded w-full mt-1' />
        <div className='h-3 bg-gray-200 rounded w-full' />
        <div className='h-3 bg-gray-200 rounded w-[75%]' />
        <div className='h-4 bg-gray-200 rounded w-24 mt-auto' />
      </div>
    </article>
  )
}

function NewsTrendsHeaderSkeleton({ mobile = false }) {
  return (
    <div
      className={`text-center ${mobile ? 'mb-6' : 'flex flex-col items-center justify-center px-4'}`}
    >
      <div
        className={`bg-gray-200 rounded mx-auto ${mobile ? 'h-8 w-44' : 'h-10 w-56 mb-5'
          }`}
      />
      <div className={`flex justify-center gap-2 ${mobile ? 'my-3' : 'my-5'}`}>
        <div className='h-[5.6px] w-5 md:w-8 bg-[#002D4F]/25 rounded-2xl' />
        <div className='h-[5.6px] w-12 md:w-20 bg-[#8D7C3B]/35 rounded-lg' />
      </div>
      <div className={`space-y-2 mx-auto ${mobile ? 'max-w-xs' : 'max-w-sm w-full'}`}>
        <div className='h-3 md:h-4 bg-gray-200 rounded w-full' />
        <div className='h-3 md:h-4 bg-gray-200 rounded w-[90%] mx-auto' />
        {!mobile && <div className='h-3 md:h-4 bg-gray-200 rounded w-4/5 mx-auto' />}
      </div>
    </div>
  )
}

export function HomeNewsTrendsSkeleton() {
  return (
    <div
      className='container mx-auto py-2 sm:pt-10 animate-pulse px-3 sm:px-4'
      aria-busy='true'
      aria-label='Loading News and Trends'
    >
      {/* Mobile — matches header + swiper cards */}
      <div className='md:hidden'>
        <NewsTrendsHeaderSkeleton mobile />
        <div className='grid grid-cols-1 xsm:grid-cols-2 gap-4 px-1'>
          <NewsTrendCardSkeleton />
          <NewsTrendCardSkeleton className='hidden xsm:flex' />
        </div>
      </div>

      {/* Desktop — matches 3-column grid with center title block */}
      <div className='hidden md:block'>
        <div className='flex justify-between gap-3 mb-3'>
          <NewsTrendCardSkeleton className='w-1/3' />
          <div className='w-1/3'>
            <NewsTrendsHeaderSkeleton />
          </div>
          <NewsTrendCardSkeleton className='w-1/3' />
        </div>
        <div className='flex justify-between gap-3'>
          <NewsTrendCardSkeleton className='w-1/3' />
          <NewsTrendCardSkeleton className='w-1/3' />
          <NewsTrendCardSkeleton className='w-1/3' />
        </div>
      </div>
    </div>
  )
}

export function HomeTestimonialsSkeleton() {
  return (
    <div
      className='w-full valuesBg xl:px-20 py-3 sm:pt-20 animate-pulse'
      aria-busy='true'
      aria-label='Loading testimonials'
    >
      <div className='container mx-auto flex flex-col md:flex-row gap-8 md:gap-10 px-4 sm:px-6'>
        <div className='md:w-[30%] w-full space-y-3'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex gap-3 p-3 rounded-md bg-white/25 items-center'
            >
              <div className='w-[72px] h-[72px] rounded-full bg-white/35 shrink-0' />
              <div className='flex-1 space-y-2 min-w-0'>
                <div className='h-4 bg-white/35 rounded w-3/4' />
                <div className='h-3 bg-white/25 rounded w-1/2' />
              </div>
            </div>
          ))}
        </div>
        <div className='md:w-[70%] w-full space-y-4 py-4 md:py-10'>
          <div className='h-10 md:h-12 bg-white/35 rounded w-56 max-w-full' />
          <div className='flex gap-2'>
            <div className='h-1.5 w-8 bg-white/35 rounded' />
            <div className='h-1.5 w-20 bg-white/25 rounded' />
          </div>
          <div className='h-5 bg-white/30 rounded w-48' />
          <div className='flex gap-2'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='w-6 h-6 bg-white/25 rounded' />
            ))}
          </div>
          <div className='space-y-2 pt-2'>
            <div className='h-4 bg-white/25 rounded w-full' />
            <div className='h-4 bg-white/25 rounded w-11/12' />
            <div className='h-4 bg-white/25 rounded w-4/5' />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomeFundsTypeSkeleton() {
  return (
    <div
      className='container mx-auto my-5 px-2 animate-pulse'
      aria-busy='true'
      aria-label='Loading categories'
    >
      <div className='flex flex-col md:flex-row gap-6 py-6'>
        <div className='md:w-1/3 space-y-3'>
          <div className='h-4 bg-gray-200 rounded w-24' />
          <div className='h-8 bg-gray-200 rounded w-48' />
          <div className='h-4 bg-gray-200 rounded w-full max-w-sm' />
        </div>
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='rounded-lg overflow-hidden bg-white shadow-md'>
              <div className='h-40 sm:h-48 bg-gray-200' />
              <div className='p-3 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto' />
                <div className='h-3 bg-gray-200 rounded w-full' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <main>
      <div className='flex gap-8 flex-col md:pt-32 sm:pt-10 pb-20 xl:px-20 homeDiv md:top-[100px] w-full animate-pulse'>
        <div className='container mx-auto px-4'>
          <div className='my-5 mt-20 space-y-3'>
            <div className='h-10 md:h-14 bg-white/20 rounded w-full max-w-2xl' />
            <div className='h-10 md:h-14 bg-white/20 rounded w-full max-w-xl' />
          </div>
          <div className='h-5 bg-white/15 rounded w-full max-w-md' />
          <div className='hidden lg:flex gap-3 mt-5 flex-wrap'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='h-[46px] bg-white/90 rounded-lg w-32' />
            ))}
          </div>
        </div>
      </div>
      <HomeFundsTypeSkeleton />
      <div className='w-full valuesBg py-10'>
        <div className='container mx-auto flex justify-between gap-4 px-4 animate-pulse'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex-1 text-center space-y-2'>
              <div className='h-10 bg-white/30 rounded mx-auto w-24' />
              <div className='h-4 bg-white/20 rounded mx-auto w-20' />
            </div>
          ))}
        </div>
      </div>
      <div className='md:px-10 md:my-20 py-3'>
        <HomeListingSliderSkeleton />
      </div>
      <div className='md:px-10 py-3'>
        <HomeListingSliderSkeleton />
      </div>
      <HomeTestimonialsSkeleton />
      <HomeNewsTrendsSkeleton />
    </main>
  )
}
