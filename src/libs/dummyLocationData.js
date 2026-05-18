/**
 * Shared UAE / Dubai test data for listing flows when APIs return nothing or fail.
 * Enable forced dummy mode with NEXT_PUBLIC_USE_DUMMY_UAE_LOCATIONS=true in .env.
 */

export const isDummyUaeLocationsEnabled =
  process.env.NEXT_PUBLIC_USE_DUMMY_UAE_LOCATIONS === 'true'

/** Full country name stored on listings (not the abbreviation UAE). */
export const LISTING_COUNTRY_UAE_LABEL = 'United Arab Emirates'

/** True if the saved/display country refers to AE (legacy "UAE" or full name). */
export function isUnitedArabEmiratesListingCountry(value) {
  const v = (value || '').toString().trim().toLowerCase()
  return (
    v === 'uae' ||
    v === 'u.a.e.' ||
    v === 'u.a.e' ||
    v === 'the uae' ||
    v === 'emirates' ||
    v === 'united arab emirates'
  )
}

/**
 * Coerce legacy / short UAE labels to the full country name for forms and API payloads.
 */
export function toUnitedArabEmiratesListingCountryName(value) {
  if (value == null || value === '') return value
  const s = String(value).trim()
  if (isUnitedArabEmiratesListingCountry(s)) return LISTING_COUNTRY_UAE_LABEL
  return s
}

/** Used when GET /api/countries fails or returns an empty list. */
export const DUMMY_FALLBACK_COUNTRIES = [
  { country: LISTING_COUNTRY_UAE_LABEL, code: 'AE' },
  { country: 'United States of America', code: 'US' },
  { country: 'United Kingdom', code: 'GB' },
]

/** Google Places-style predictions; `description` matches `Listing.jsx` city options. */
export const DUMMY_UAE_CITY_PREDICTIONS = [
  { description: 'Dubai, United Arab Emirates' },
  { description: 'Abu Dhabi, United Arab Emirates' },
  { description: 'Sharjah, United Arab Emirates' },
  { description: 'Ajman, United Arab Emirates' },
  { description: 'Ras Al Khaimah, United Arab Emirates' },
]

/** Rows need `name` for neighbourhood search/filter in `Listing.jsx`. */
export const DUMMY_DUBAI_NEIGHBOURHOODS = [
  { name: 'Downtown Dubai' },
  { name: 'Dubai Marina' },
  { name: 'Palm Jumeirah' },
  { name: 'Jumeirah Beach Residence (JBR)' },
  { name: 'Business Bay' },
  { name: 'Deira' },
  { name: 'Bur Dubai' },
  { name: 'Jumeirah' },
  { name: 'Al Barsha' },
  { name: 'Dubai International City' },
  { name: 'Arabian Ranches' },
  { name: 'Dubai Silicon Oasis' },
  { name: 'Dubai Hills Estate' },
  { name: 'City Walk' },
  { name: 'DIFC' },
]

export function filterDummyCitiesByQuery(predictions, query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return [...predictions]
  return predictions.filter((p) =>
    p.description.toLowerCase().includes(q),
  )
}

export function isDubaiCitySelection(city) {
  return typeof city === 'string' && /dubai/i.test(city)
}
