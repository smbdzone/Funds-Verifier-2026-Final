import { Shimmer, ShimmerLine } from './Shimmer'

export default function ContactPageSkeleton() {
  return (
    <div aria-busy='true' aria-label='Loading contact page'>
      <div className='bg-prussianBlue/90 min-h-[140px] sm:min-h-[180px] md:min-h-[220px] flex items-center justify-center px-4 py-8'>
        <Shimmer className='h-8 sm:h-10 w-48 rounded-md opacity-80' />
      </div>

      <div className='bg-white'>
        <div className='theme-container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6 sm:px-6 sm:py-8 md:p-10'>
          <div className='bg-[#e9f1fd] p-5 sm:p-6 md:p-8 rounded-md space-y-4'>
            <ShimmerLine className='w-28' />
            <Shimmer className='h-7 w-48 rounded' />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
              <Shimmer className='h-10 w-full rounded' />
              <Shimmer className='h-10 w-full rounded' />
              <Shimmer className='h-10 w-full rounded' />
              <Shimmer className='h-10 w-full rounded' />
            </div>
            <Shimmer className='h-28 w-full rounded' />
            <Shimmer className='h-11 w-full rounded' variant='gold' />
          </div>

          <div className='flex flex-col justify-center space-y-5 sm:space-y-6'>
            <div className='space-y-2'>
              <ShimmerLine className='w-24' />
              <Shimmer className='h-7 w-56 rounded' />
              <ShimmerLine className='w-full max-w-sm' />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex items-start gap-4'>
                <Shimmer className='h-11 w-[50px] shrink-0 rounded-l-sm' variant='gold' />
                <div className='flex-1 space-y-2 pt-1'>
                  <ShimmerLine className='w-32' />
                  <ShimmerLine className='h-4 w-40' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='theme-container mx-auto px-4 pb-6 sm:px-6 sm:pb-8 md:px-10 md:pb-10'>
          <Shimmer className='h-[220px] sm:h-[280px] md:h-[350px] w-full rounded-md' />
        </div>
      </div>
    </div>
  )
}
