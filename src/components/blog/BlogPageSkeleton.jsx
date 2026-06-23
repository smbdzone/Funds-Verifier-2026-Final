import { Shimmer, ShimmerLine } from '@/components/contact/Shimmer'

function BlogBannerSkeleton() {
  return (
    <div
      className='bg-cover bg-center min-h-[140px] sm:min-h-[180px] md:min-h-[300px] flex flex-col gap-2 items-center justify-center px-4 py-8 sm:py-10 md:py-20'
      style={{ backgroundImage: 'linear-gradient(135deg, #002D4F 0%, #0a3d66 50%, #002D4F 100%)' }}
    >
      <Shimmer className='h-8 sm:h-10 md:h-12 w-52 sm:w-64 rounded-md opacity-90' />
    </div>
  )
}

function BlogFilterSkeleton() {
  return (
    <div className='flex items-center justify-between gap-2 my-6 mx-4'>
      <Shimmer className='h-11 w-[120px] rounded-l-sm' variant='gold' />
      <div className='flex items-center gap-2 lg:hidden'>
        <Shimmer className='h-10 w-10 rounded-l-sm' variant='gold' />
        <Shimmer className='h-10 w-10 rounded-l-sm' variant='gold' />
      </div>
    </div>
  )
}

function BlogCardDesktopSkeleton() {
  return (
    <div className='bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(162,145,62,0.08)] border border-reefGold/25'>
      <Shimmer className='h-64 w-full rounded-none' />
      <div className='p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Shimmer className='h-8 w-8 rounded-full shrink-0' variant='gold' />
            <ShimmerLine className='w-16' />
          </div>
          <ShimmerLine className='w-24' />
        </div>
        <Shimmer className='h-6 w-[90%] rounded' />
        <div className='space-y-2'>
          <ShimmerLine className='w-full' />
          <ShimmerLine className='w-full' />
          <ShimmerLine className='w-4/5' />
        </div>
        <div className='flex items-center justify-between pt-1'>
          <div className='flex gap-2'>
            <Shimmer className='h-6 w-20 rounded-full' variant='gold' />
            <Shimmer className='h-6 w-16 rounded-full' />
          </div>
          <ShimmerLine className='w-12' variant='gold' />
        </div>
      </div>
    </div>
  )
}

function BlogCardMobileSkeleton() {
  return (
    <article className='w-full max-w-full overflow-hidden rounded-md border border-reefGold/25 bg-white shadow-[0_2px_12px_rgba(162,145,62,0.1)]'>
      <Shimmer className='w-full aspect-[4/3] rounded-none' />
      <div className='space-y-3 px-4 py-3 pb-5'>
        <div className='flex justify-between gap-2'>
          <ShimmerLine className='w-24' />
          <ShimmerLine className='w-20' />
        </div>
        <Shimmer className='h-7 w-[90%] rounded' />
        <div className='space-y-2'>
          <ShimmerLine className='w-full' />
          <ShimmerLine className='w-full' />
          <ShimmerLine className='w-[92%]' />
        </div>
      </div>
    </article>
  )
}

export default function BlogPageSkeleton() {
  return (
    <div aria-busy='true' aria-label='Loading blog'>
      <BlogBannerSkeleton />
      <BlogFilterSkeleton />

      <section className='w-full h-full theme-container lg:flex-row flex-col z-1 flex gap-5 px-2 sm:px-0'>
        {/* Desktop grid */}
        <div className='hidden lg:block min-h-full w-full pb-5'>
          <div className='h-full w-full bg-white rounded-md lg:p-8 shadow-[0_2px_20px_rgba(162,145,62,0.06)] border border-reefGold/20 md:mb-24'>
            <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-6'>
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardDesktopSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile slider */}
        <div className='work__slider sm:mt-0 mt-2 w-full min-w-0 overflow-hidden px-4 lg:hidden'>
          <BlogCardMobileSkeleton />
          <div className='mt-6 flex justify-center gap-2 pb-2'>
            <Shimmer className='h-2 w-8 rounded-full' variant='gold' />
            <Shimmer className='h-2 w-2 rounded-full' />
            <Shimmer className='h-2 w-2 rounded-full' />
          </div>
        </div>
      </section>
    </div>
  )
}
