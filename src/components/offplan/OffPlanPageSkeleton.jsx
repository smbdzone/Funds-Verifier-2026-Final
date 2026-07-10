import { Shimmer } from '@/components/contact/Shimmer'

function OffPlanCardSkeleton() {
  return (
    <div className='mx-auto w-full max-w-[404px] rounded-[5px] bg-white pb-4 shadow-[0px_0px_8px_rgba(0,0,0,0.15)]'>
      <Shimmer className='h-[275px] w-full rounded-t-[5px]' />
      <div className='space-y-4 px-4 pt-4'>
        <Shimmer className='h-4 w-40 rounded' />
        <Shimmer className='h-6 w-full rounded' />
        <Shimmer className='h-4 w-3/4 rounded' />
        <Shimmer className='h-6 w-1/2 rounded' />
        <Shimmer className='h-0.5 w-full rounded-full' variant='gold' />
        <div className='flex items-center justify-between pb-2'>
          <Shimmer className='h-12 w-32 rounded' />
          <Shimmer className='h-5 w-24 rounded' />
        </div>
      </div>
    </div>
  )
}

export default function OffPlanPageSkeleton() {
  return (
    <div aria-busy='true' aria-label='Loading off plan page'>
      <div className='flex min-h-[140px] items-center justify-center bg-prussianBlue/90 px-4 py-8 sm:min-h-[180px] md:min-h-[220px]'>
        <Shimmer className='h-8 w-56 rounded-md opacity-80 sm:h-10' />
      </div>

      <section className='bg-white py-10 sm:py-14 md:py-20'>
        <div className='theme-container mx-auto px-4 sm:px-6'>
          <div className='mb-8 flex flex-col items-center gap-3'>
            <Shimmer className='h-9 w-64 rounded sm:h-10' />
            <Shimmer className='h-4 w-full max-w-xl rounded' />
          </div>

          <div className='grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {Array.from({ length: 4 }).map((_, index) => (
              <OffPlanCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
