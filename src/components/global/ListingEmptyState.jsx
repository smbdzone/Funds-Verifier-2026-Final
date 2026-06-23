export function hasListingSearchFilters(searchParams) {
  if (!searchParams) return false
  const skip = new Set(['page'])
  for (const [key] of searchParams.entries()) {
    if (!skip.has(key)) return true
  }
  return false
}

export function ListingEmptyState({ hasFilters = false }) {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4 text-center rounded-[12px] bg-white shadow-sm'>
      <p className='text-xl font-medium text-gray-900 mb-2'>
        {hasFilters
          ? 'No listings match your search'
          : 'No listings available'}
      </p>
      <p className='text-sm text-gray-600 max-w-md'>
        {hasFilters
          ? 'Try adjusting your filters or search criteria to find more results.'
          : 'Check back soon — new listings are added regularly.'}
      </p>
    </div>
  )
}

export default ListingEmptyState
