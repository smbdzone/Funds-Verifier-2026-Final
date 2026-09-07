/**
 * Resolve the amenity / facility / extras list for any listing asset type.
 * Forms store different field names per type; public UI should use one helper.
 */
export function getListingAmenities(listing) {
  if (!listing || typeof listing !== 'object') return []

  const assetType = String(listing.assetType || '')

  const asCleanList = (value) => {
    if (value == null || value === '') return []

    if (typeof value === 'string') {
      return value
        .split(/[,|]/)
        .map((item) => item.trim())
        .filter(Boolean)
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (item == null) return ''
          if (typeof item === 'string' || typeof item === 'number') {
            return String(item).trim()
          }
          if (typeof item === 'object') {
            return String(
              item.name || item.label || item.title || item.value || '',
            ).trim()
          }
          return ''
        })
        .filter(Boolean)
    }

    if (typeof value === 'object') {
      return Object.values(value)
        .map((item) => (item == null ? '' : String(item).trim()))
        .filter(Boolean)
    }

    return []
  }

  const unique = (items) => [...new Set(items)]

  if (assetType.includes('Car') || assetType === 'Car For Sale') {
    return unique([
      ...asCleanList(listing.technicalFeatures),
      ...asCleanList(listing.extras),
      ...asCleanList(listing.amenities),
    ])
  }

  if (assetType.includes('Boat') || assetType === 'Boats For Sale') {
    return unique([
      ...asCleanList(listing.extras),
      ...asCleanList(listing.amenities),
    ])
  }

  if (assetType.includes('Jewel') || assetType === 'Jewellery For Sale') {
    return unique([
      ...asCleanList(listing.materials),
      ...asCleanList(listing.amenities),
    ])
  }

  // Property / off-plan / lease
  return unique([
    ...asCleanList(listing.facilities),
    ...asCleanList(listing.amenities),
  ])
}
