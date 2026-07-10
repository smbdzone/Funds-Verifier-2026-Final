export function generateListingSlug(title) {
  if (typeof title !== 'string') return ''

  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
}

export function getListingDetailId(listing = {}) {
  return listing.slug || listing.uuid || listing._id || ''
}
