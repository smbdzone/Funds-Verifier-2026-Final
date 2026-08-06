export function generateListingSlug(title) {
  if (typeof title !== 'string') return ''

  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
}

export function getListingDetailId(listing = {}) {
  // Prefer uuid so duplicate title-slugs never open the wrong listing
  // (e.g. ready property layout/floor plan missing on detail).
  return listing.uuid || listing.slug || listing._id || ''
}
