import { Shimmer, ShimmerLine } from '@/components/contact/Shimmer'

function SectionBars({ onDark = false }) {
  return (
    <div className='my-4 flex flex-row justify-center gap-2'>
      <Shimmer
        className='h-[5.6px] w-5 md:w-8 rounded-2xl'
        variant={onDark ? 'light' : 'gold'}
      />
      <Shimmer
        className='h-[5.6px] w-12 md:w-20 rounded-lg'
        variant={onDark ? 'light' : 'gold'}
      />
    </div>
  )
}

function HomeSectionHeaderSkeleton() {
  return (
    <div className='mb-6 text-center'>
      <Shimmer className='mx-auto h-8 w-56 rounded md:h-10' />
      <SectionBars />
      <ShimmerLine className='mx-auto w-full max-w-xs' />
    </div>
  )
}

export function HomeHeroSkeleton() {
  return (
    <div
      className='homeDiv flex w-full flex-col gap-8 pb-16 pt-24 sm:pb-20 sm:pt-28 md:top-[100px] md:pt-32 xl:px-20'
      aria-busy='true'
      aria-label='Loading hero'
    >
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='mt-6 space-y-2 sm:mt-10 md:mt-20'>
          <Shimmer variant='light' className='h-[31px] w-full max-w-[280px] rounded-lg sm:h-9 sm:max-w-md md:h-14 md:max-w-2xl' />
          <Shimmer variant='light' className='h-[31px] w-full max-w-[320px] rounded-lg sm:h-9 sm:max-w-lg md:h-14 md:max-w-xl' />
        </div>
        <Shimmer variant='light' className='mt-3 h-4 w-full max-w-sm rounded sm:mt-4 md:mt-5 md:h-6 md:max-w-md' />
        <div className='mt-5 flex flex-wrap gap-3'>
          <Shimmer className='h-[46px] w-full max-w-[160px] flex-1 rounded-lg sm:w-36' />
          <Shimmer className='h-[46px] w-full max-w-[160px] flex-1 rounded-lg sm:w-32' />
          <Shimmer className='h-[46px] w-full max-w-[160px] flex-1 rounded-lg sm:w-28' />
          <Shimmer className='h-[46px] w-full max-w-[160px] flex-1 rounded-lg sm:w-32' />
          <Shimmer className='h-[46px] w-full max-w-[160px] flex-1 rounded-lg sm:w-32' />
          <Shimmer variant='gold' className='h-[46px] w-full max-w-[160px] flex-1 rounded-lg sm:w-28' />
        </div>
      </div>
    </div>
  )
}

export function HomeListingSliderSkeleton({ count = 3 }) {
  return (
    <div
      className='grid grid-cols-1 gap-4 px-2 md:grid-cols-2 xl:grid-cols-3'
      aria-busy='true'
      aria-label='Loading listings'
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='mx-2 w-full overflow-hidden rounded-md bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.15)]'
        >
          <Shimmer className='h-[275px] w-full rounded-none' />
          <div className='space-y-3 p-4'>
            <ShimmerLine className='w-28' />
            <Shimmer className='h-5 w-4/5 rounded' />
            <ShimmerLine className='w-2/3' />
            <div className='my-3 border-t border-gray-100' />
            <div className='flex items-center justify-between pb-2'>
              <div className='flex items-center gap-3'>
                <Shimmer className='h-12 w-12 shrink-0 rounded-full' />
                <ShimmerLine className='w-20' />
              </div>
              <ShimmerLine className='w-24' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function HomeListingSectionSkeleton({ count = 3 }) {
  return (
    <div className='py-3 md:my-20 sm:my-10 md:px-10'>
      <HomeSectionHeaderSkeleton />
      <HomeListingSliderSkeleton count={count} />
    </div>
  )
}

function NewsTrendCardSkeleton({ className = '' }) {
  return (
    <article
      className={`flex h-[420px] flex-col overflow-hidden rounded-xl bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.12)] ${className}`}
    >
      <Shimmer className='h-[200px] w-full shrink-0 rounded-none' />
      <div className='flex flex-1 flex-col items-center gap-2 px-4 pb-4 pt-4'>
        <Shimmer className='h-5 w-[85%] rounded' />
        <ShimmerLine className='mt-1 w-full' />
        <ShimmerLine className='w-full' />
        <ShimmerLine className='w-[75%]' />
        <ShimmerLine className='mt-auto w-24' />
      </div>
    </article>
  )
}

function NewsTrendsHeaderSkeleton({ mobile = false }) {
  return (
    <div
      className={`text-center ${mobile ? 'mb-6' : 'flex flex-col items-center justify-center px-4'}`}
    >
      <Shimmer
        className={`mx-auto rounded ${mobile ? 'h-8 w-44' : 'mb-5 h-10 w-56'}`}
      />
      <SectionBars />
      <div className={`mx-auto space-y-2 ${mobile ? 'max-w-xs' : 'w-full max-w-sm'}`}>
        <ShimmerLine className='w-full' />
        <ShimmerLine className='mx-auto w-[90%]' />
        {!mobile && <ShimmerLine className='mx-auto w-4/5' />}
      </div>
    </div>
  )
}

export function HomeNewsTrendsSkeleton() {
  return (
    <div
      className='container mx-auto px-3 py-2 sm:px-4 sm:pt-10'
      aria-busy='true'
      aria-label='Loading News and Trends'
    >
      <div className='md:hidden'>
        <NewsTrendsHeaderSkeleton mobile />
        <div className='grid grid-cols-1 gap-4 px-1 xsm:grid-cols-2'>
          <NewsTrendCardSkeleton />
          <NewsTrendCardSkeleton className='hidden xsm:flex' />
        </div>
      </div>

      <div className='hidden md:block'>
        <div className='mb-3 flex justify-between gap-3'>
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
      className='valuesBg w-full py-3 sm:pt-20 xl:px-20'
      aria-busy='true'
      aria-label='Loading testimonials'
    >
      <div className='container mx-auto flex flex-col gap-8 px-4 sm:px-6 md:flex-row md:gap-10'>
        <div className='w-full space-y-3 md:w-[30%]'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex items-center gap-3 rounded-md bg-white/10 p-3'
            >
              <Shimmer variant='light' className='h-[72px] w-[72px] shrink-0 rounded-full' />
              <div className='min-w-0 flex-1 space-y-2'>
                <Shimmer variant='light' className='h-4 w-3/4 rounded' />
                <Shimmer variant='light' className='h-3 w-1/2 rounded' />
              </div>
            </div>
          ))}
        </div>
        <div className='w-full space-y-4 py-4 md:w-[70%] md:py-10'>
          <Shimmer variant='light' className='h-10 w-56 max-w-full rounded md:h-12' />
          <SectionBars onDark />
          <Shimmer variant='light' className='h-5 w-48 rounded' />
          <div className='flex gap-2'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Shimmer key={i} variant='light' className='h-6 w-6 rounded' />
            ))}
          </div>
          <div className='space-y-2 pt-2'>
            <Shimmer variant='light' className='h-4 w-full rounded' />
            <Shimmer variant='light' className='h-4 w-11/12 rounded' />
            <Shimmer variant='light' className='h-4 w-4/5 rounded' />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomeFundsTypeSkeleton() {
  return (
    <div
      className='container mx-auto my-5 px-2'
      aria-busy='true'
      aria-label='Loading categories'
    >
      <div className='flex flex-col gap-6 py-6 md:flex-row'>
        <div className='space-y-3 md:w-1/3'>
          <ShimmerLine className='w-24' />
          <Shimmer className='h-8 w-48 rounded' />
          <ShimmerLine className='max-w-sm w-full' />
        </div>
        <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='overflow-hidden rounded-lg bg-white shadow-md'>
              <Shimmer className='h-40 w-full rounded-none sm:h-48' />
              <div className='space-y-2 p-3'>
                <Shimmer className='mx-auto h-4 w-2/3 rounded' />
                <ShimmerLine className='w-full' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HomeValuesSkeleton() {
  return (
    <div
      className='valuesBg w-full py-5 pt-10 sm:py-14 sm:pt-20 lg:px-20 md:px-10'
      aria-busy='true'
      aria-label='Loading stats'
    >
      <div className='container mx-auto scroll-none overflow-x-auto'>
        <div className='flex min-w-[600px] flex-row items-center gap-x-3 whitespace-nowrap sm:min-w-full sm:justify-between sm:gap-x-0'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='px-4 text-center md:w-1/4'>
              <Shimmer variant='light' className='mx-auto h-10 w-24 rounded md:h-12' />
              <Shimmer variant='light' className='mx-auto mt-4 h-4 w-28 rounded sm:mt-5' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HomePartnersSkeleton() {
  return (
    <div
      className='container mx-auto px-4 py-2 pt-5 sm:pt-14'
      aria-busy='true'
      aria-label='Loading partners'
    >
      <Shimmer className='mx-auto mb-5 h-8 w-44 rounded sm:mb-10 sm:h-10' />
      <div className='flex flex-wrap justify-center gap-4 overflow-hidden'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Shimmer
            key={i}
            className='h-[70px] w-[170px] rounded-md border border-[#8D7C3B]/20 sm:h-[80px]'
          />
        ))}
      </div>
    </div>
  )
}

export function HomeInTouchSkeleton() {
  return (
    <div
      className='inTouchBg w-full px-5 py-2 sm:py-7 md:px-20 md:py-14 md:pt-20 sm:pt-10'
      aria-busy='true'
      aria-label='Loading contact section'
    >
      <Shimmer className='mx-auto h-8 w-72 max-w-full rounded md:h-10' />
      <div className='mt-5 flex justify-center'>
        <Shimmer variant='gold' className='my-3 h-7 w-[100px] rounded md:my-5 md:h-10 md:w-[150px] lg:my-7 lg:h-[60px] lg:w-[260px]' />
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <main aria-busy='true' aria-label='Loading home page'>
      <HomeHeroSkeleton />
      <HomeFundsTypeSkeleton />
      <HomeValuesSkeleton />
      <HomeListingSectionSkeleton />
      <HomeListingSectionSkeleton />
      <HomeListingSectionSkeleton />
      <HomeListingSectionSkeleton />
      <HomeTestimonialsSkeleton />
      <HomePartnersSkeleton />
      <HomeNewsTrendsSkeleton />
      <HomeInTouchSkeleton />
    </main>
  )
}
