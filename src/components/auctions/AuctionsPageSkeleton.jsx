import { Shimmer, ShimmerLine } from '@/components/contact/Shimmer'

export default function AuctionsPageSkeleton() {
  return (
    <div aria-busy='true' aria-label='Loading auctions page'>
      <div className='flex min-h-[140px] items-center justify-center bg-prussianBlue/90 px-4 py-8 sm:min-h-[180px] md:min-h-[220px]'>
        <Shimmer className='h-8 w-40 rounded-md opacity-80 sm:h-10' />
      </div>

      <section className='bg-white py-10 sm:py-14 md:py-20'>
        <div className='theme-container mx-auto px-4 sm:px-6'>
          <div className='mx-auto flex max-w-2xl flex-col items-center text-center'>
            <ShimmerLine className='mb-4 w-24' variant='gold' />

            <Shimmer
              className='mb-8 h-24 w-24 rounded-full sm:h-28 sm:w-28'
              variant='gold'
            />

            <Shimmer className='mb-4 h-9 w-44 rounded sm:h-10' />

            <ShimmerLine className='mb-2 h-5 w-56 sm:w-64' />

            <Shimmer className='mx-auto mb-6 h-px w-24 rounded-full' variant='gold' />

            <div className='mb-8 w-full space-y-2'>
              <ShimmerLine className='mx-auto w-full max-w-md' />
              <ShimmerLine className='mx-auto w-full max-w-sm' />
              <ShimmerLine className='mx-auto w-4/5 max-w-xs' />
            </div>

            <Shimmer className='h-9 w-36 rounded-full sm:h-10 sm:w-40' variant='gold' />

            <div className='mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4'>
              <Shimmer className='h-11 min-w-[140px] rounded-l-sm' variant='gold' />
              <Shimmer className='h-11 min-w-[140px] rounded-sm border border-reefGold/25' />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
