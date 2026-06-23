export function ListingCardSkeleton({ count = 3 }) {
  return (
    <div className='flex flex-col gap-6 w-full' aria-busy='true' aria-label='Loading listings'>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='flex p-3 md:pr-0 flex-col gap-4 xl:gap-5 items-center md:flex-row rounded-[12px] bg-white shadow-xl animate-pulse'
        >
          <div className='w-full md:w-[42%] lg:w-[38%] h-48 sm:h-52 md:h-56 bg-gray-200 rounded-lg shrink-0' />
          <div className='flex-1 w-full space-y-3 py-1 px-1 md:px-2'>
            <div className='h-5 bg-gray-200 rounded w-3/4' />
            <div className='h-4 bg-gray-200 rounded w-1/3' />
            <div className='h-4 bg-gray-200 rounded w-full' />
            <div className='h-4 bg-gray-200 rounded w-5/6' />
            <div className='flex gap-2 pt-2'>
              <div className='h-8 bg-gray-200 rounded w-20' />
              <div className='h-8 bg-gray-200 rounded w-20' />
              <div className='h-8 bg-gray-200 rounded w-20' />
            </div>
            <div className='h-10 bg-gray-200 rounded w-36 mt-2' />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListingCardSkeleton
