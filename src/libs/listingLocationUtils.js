import {
  LISTING_COUNTRY_UAE_LABEL,
  toUnitedArabEmiratesListingCountryName,
  formatCityLabel,
} from '@/libs/dummyLocationData'

export function normalizeListingCountryKey(country) {
  if (
    !country ||
    country === 'Select Country' ||
    country === 'required_country'
  ) {
    return null
  }
  return toUnitedArabEmiratesListingCountryName(country) || country
}

/** Unique sorted cities per country from listing products. */
export function buildCountryToCitiesMap(products) {
  const nextMap = {}

    ; (products || []).forEach((item) => {
      const countryKey = normalizeListingCountryKey(item.country)
      const city = formatCityLabel(item.city)

      if (!countryKey || !city) return

      if (!nextMap[countryKey]) {
        nextMap[countryKey] = new Set()
      }
      nextMap[countryKey].add(city)
    })

  return Object.fromEntries(
    Object.entries(nextMap).map(([country, citySet]) => [
      country,
      Array.from(citySet).sort((a, b) => a.localeCompare(b)),
    ]),
  )
}

/** Country → city → neighbourhoods from listing products. */
export function buildCountryCityNeighbourhoodMap(products) {
  const countryCityMap = {}

    ; (products || []).forEach((item) => {
      const countryKey = normalizeListingCountryKey(item.country)
      const city = formatCityLabel(item.city)
      const neighbourhood = String(item.neighbourhood || '').trim()

      if (!countryKey || !city) return

      if (!countryCityMap[countryKey]) {
        countryCityMap[countryKey] = {}
      }

      if (!countryCityMap[countryKey][city]) {
        countryCityMap[countryKey][city] = new Set()
      }

      if (neighbourhood) {
        countryCityMap[countryKey][city].add(neighbourhood)
      }
    })

  return Object.fromEntries(
    Object.entries(countryCityMap).map(([country, cities]) => [
      country,
      Object.fromEntries(
        Object.entries(cities).map(([city, neighbourhoods]) => [
          city,
          Array.from(neighbourhoods).sort((a, b) => a.localeCompare(b)),
        ]),
      ),
    ]),
  )
}

export function getListingCitiesForCountry(countryCityMap, country) {
  const countryKey = normalizeListingCountryKey(country)
  if (!countryKey) return []
  return countryCityMap[countryKey] || []
}

/** Human-readable location: neighbourhood, country. */
export function formatListingLocation(listing) {
  if (!listing || typeof listing !== 'object') return ''

  if (typeof listing.location === 'string' && listing.location.trim()) {
    return listing.location.trim()
  }

  const neighbourhood = String(listing.neighbourhood || '').trim()
  const country =
    toUnitedArabEmiratesListingCountryName(listing.country) ||
    String(listing.country || '').trim()

  return [neighbourhood, country].filter(Boolean).join(', ')
}

export const UAE_ONLY_COUNTRY_OPTIONS = [LISTING_COUNTRY_UAE_LABEL]

/** Project Number (DLD) is Dubai-only. Neighbourhoods like "Downtown Dubai" do not count. */
export function shouldShowProjectNumber(listingOrCity) {
  const raw =
    typeof listingOrCity === 'string' || listingOrCity == null
      ? listingOrCity
      : listingOrCity.city
  const city = formatCityLabel(raw).toLowerCase().trim()
  return city === 'dubai' || city === 'دبي'
}

