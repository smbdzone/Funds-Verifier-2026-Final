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

/**
 * City dropdown / form value: keep only the city (emirate) name.
 * e.g. "Dubai, United Arab Emirates" → "Dubai"
 */
export function formatCityLabel(city) {
  if (city == null || city === '') return ''
  const main = String(city).split(',')[0]?.trim()
  return main || String(city).trim()
}

/** Used when GET /api/countries fails or returns an empty list (listing country picker). */
export const DUMMY_FALLBACK_COUNTRIES = [
  { country: LISTING_COUNTRY_UAE_LABEL, code: 'AE' },
]

/** Listing forms: only United Arab Emirates. */
export function filterCountriesToUaeOnly(countries) {
  if (!Array.isArray(countries) || !countries.length) {
    return [...DUMMY_FALLBACK_COUNTRIES]
  }
  const uae = countries.filter(
    (c) =>
      String(c.code || '').toUpperCase() === 'AE' ||
      isUnitedArabEmiratesListingCountry(c.country),
  )
  if (!uae.length) {
    return [...DUMMY_FALLBACK_COUNTRIES]
  }
  return uae.map((c) => ({
    ...c,
    country: LISTING_COUNTRY_UAE_LABEL,
    code: 'AE',
  }))
}

/** All 7 emirates — city picker shows name only (no country suffix). */
export const DUMMY_UAE_CITY_PREDICTIONS = [
  { description: 'Abu Dhabi' },
  { description: 'Dubai' },
  { description: 'Sharjah' },
  { description: 'Ajman' },
  { description: 'Umm Al Quwain' },
  { description: 'Ras Al Khaimah' },
  { description: 'Fujairah' },
]

function toNeighbourhoodRows(names) {
  const seen = new Set()
  const rows = []
  for (const raw of names) {
    const name = String(raw || '').trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    rows.push({ name })
  }
  return rows
}

/** Rows need `name` for neighbourhood search/filter in `Listing.jsx`. */
export const DUMMY_DUBAI_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Downtown Dubai',
  'Dubai Marina',
  'Dubai Hills Estate',
  'Dubai Land Residence Complex (DLRC)',
  'Dubai South',
  'Dubai Creek Harbour',
  'Bur Dubai',
  'Dubai Investments Park (DIP)',
  'Dubai Sports City',
  'Dubai Islands',
  'Dubai Silicon Oasis (DSO)',
  'Dubai Production City (IMPZ)',
  'Dubai Harbour',
  'Dubai Science Park',
  'Dubai Investments Park 1',
  'Dubai Healthcare City Phase 2',
  'Al Jaddaf',
  'Al Nahda',
  'Dubai Maritime City',
  'Dubai Studio City',
])

export const DUMMY_SHARJAH_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Ajmal Makan City - Sharjah Waterfront',
  'Al Nahda',
  'Sharjah Garden City',
  'Sharjah Sustainable City',
  'Shaghrafa 1, Al Rahmaniya',
  'Sharjah Sustainable City II',
  'Umm Fanain',
  'Sharjah Terraces',
  'Al Khan',
  'Sharjah Tower Al Nahda',
  'Sharjah Tower Taawun',
  'Al Taawun',
  'Anantara Sharjah Residences',
  'Al Rifah',
  'Sharjah University City',
  'Sharjah Tower 555',
  'Saif Zone (Sharjah International Airport Free Zone)',
  'Sharjah Gate Tower',
  'Sharjah Investment Center',
  'Al Noor Tower',
  'Al Majaz 2, Al Majaz',
  'New Sharjah Tower',
  'Al Jubail',
  'Swiss Belhotel',
  'Al Nabba',
  'Central Souk',
  'Al Majaz 1, Al Majaz',
  'Four Points by Sheraton',
  'Al Nad, Al Qasimia',
])

export const DUMMY_AJMAN_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Corniche Ajman',
  'Ajman Corniche Residence',
  'Ajman One Towers',
  'Al Rashidiya 3, Al Rashidiya',
  'Ajman Downtown',
  'Tiger Downtown Ajman',
  'Al Alia',
  'Ajman Industrial',
  'Ajman Uptown',
  'Ajman One Phase 2',
  'Ajman Free Zone',
  'Ajman Creek Towers',
  'Ajman Industrial 2',
  'Ajman Pearl Towers',
  'Gulf Tower Ajman',
  'Emirates City',
  'Ajman Industrial 1',
  'Ajman One Tower 10',
  'Ajman One Towers, Al Rashidiya 3, Al Rashidiya',
  'Tiger Downtown Ajman Tower A',
  'Tiger Downtown Ajman, Al Alia',
  'Ajman One Tower 1',
  'Ajman One Tower 9',
  'Tiger Downtown Ajman Tower C',
])

export const DUMMY_ABU_DHABI_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Shams Abu Dhabi',
  'Al Reem Island',
  'Najmat Abu Dhabi',
  'Louvre Abu Dhabi Residences',
  'Saadiyat Cultural District, Saadiyat Island',
  'Abu Dhabi Industrial City',
  'Rawdhat Abu Dhabi',
  'Danet Abu Dhabi',
  "Al Sa'adah",
  'Hilton Residences Abu Dhabi',
  'Al Raha Beach',
  'Reportage Village Abu Dhabi',
  'Khalifa City',
  'Abu Dhabi National Exhibition Centre (ADNEC)',
  'Capital Centre',
  'Uptown Hotel Apartments Abu Dhabi',
  'Al Markaziya',
  'Hills Abu Dhabi',
  'Al Maqtaa',
  'Abu Dhabi Aviation Residential Complex',
  'Zayed City',
  'Abu Dhabi Commercial Bank Building',
  'Al Karama',
  'Abu Dhabi Gate City (Officers City)',
  'Abu Dhabi Global Market (ADGM)',
  'Sowwah Square, Al Maryah Island',
  'Abu Dhabi Plaza Hotel Apartments',
  'Al Danah',
  'Abu Dhabi Plaza Tower',
  'DoubleTree by Hilton Abu Dhabi Yas Island Residences',
  'Yas Island',
  'Dusit Thani Abu Dhabi',
  'Muroor Road, Al Muroor',
])

export const DUMMY_UMM_AL_QUWAIN_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Umm Al Quwain Marina',
  'Al Ramlah',
  'Umm Al Thuoob',
  'Al Seanneeah',
  'Sobha Siniya Island',
  'Emirates Modern Industrial Area',
  'Al Raudah',
  'Al Salamah',
  'AMRA Residences',
  'Al Salam City',
  'Al Serra',
  'Umm Dera',
  'Old Town Area',
  'Sobha Aquamont',
  'King Faisal Street',
  'AYA Beachfront Residences',
  'Al Rass',
  'Industrial Area',
  'Coral Beach Villas',
  'Sobha Siniya Island, Al Seanneeah',
])

export const DUMMY_FUJAIRAH_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Address Fujairah Beach Resort',
  'Address Residences Fujairah Resort',
  'Corniche Al Fujairah',
  'Fujairah Trade Centre',
  'Town Centre',
  'Eagle Hills Fujairah Beach',
  'Fujairah Tower',
  'Fujairah Freezone',
  'Royal M Hotel Fujairah by Gewan',
  'Dibba',
  'Oceana',
  'Al Hayl',
  'Al Dana Island',
  'Ocean Living',
  'Al Faseel Area',
  'Saniaya',
  'Creative Tower',
  'Sakamkam',
  'Hamad Bin Abdullah Road',
])

export const DUMMY_RAS_AL_KHAIMAH_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Cornich Ras Al Khaimah',
  'Anantara Mina Ras Al Khaimah Residences',
  'Mina Al Arab',
  'Waldorf Astoria Ras Al Khaimah',
  'Al Hamra Village',
  'Ras Al Khaimah Creek',
  'Ras Al Khaimah Gateway',
  'Jannah Resort & Villas Ras Al Khaimah',
  'RAK City',
  'Al Marjan Island',
  'RAK Central',
  'Hayat Island',
  'Pacific',
  'Playa Viva',
  'Falcon Island',
  'Royal Breeze Apartment',
  'Azure by Lapis',
  'Bay Residences',
  'Hayat Island, Mina Al Arab',
  'Pelagia by BNW Developments',
])

/** Normalize emirate/city label for lookup (handles spelling variants). */
export function normalizeUaeCityKey(city) {
  const label = formatCityLabel(city).toLowerCase().replace(/[^a-z0-9]+/g, '')
  if (!label) return ''
  if (label.includes('dubai')) return 'dubai'
  if (label.includes('sharjah')) return 'sharjah'
  if (label.includes('ajman')) return 'ajman'
  if (label.includes('abudhabi')) return 'abu-dhabi'
  if (
    label.includes('ummalquwain') ||
    label.includes('umalquwain') ||
    label.includes('ummalquwaim') ||
    label.includes('uaq')
  ) {
    return 'umm-al-quwain'
  }
  if (label.includes('fujairah') || label.includes('fujeirah')) return 'fujairah'
  if (label.includes('rasalkhaimah') || label === 'rak') {
    return 'ras-al-khaimah'
  }
  return label
}

const DUMMY_NEIGHBOURHOODS_BY_CITY = {
  dubai: DUMMY_DUBAI_NEIGHBOURHOODS,
  sharjah: DUMMY_SHARJAH_NEIGHBOURHOODS,
  ajman: DUMMY_AJMAN_NEIGHBOURHOODS,
  'abu-dhabi': DUMMY_ABU_DHABI_NEIGHBOURHOODS,
  'umm-al-quwain': DUMMY_UMM_AL_QUWAIN_NEIGHBOURHOODS,
  fujairah: DUMMY_FUJAIRAH_NEIGHBOURHOODS,
  'ras-al-khaimah': DUMMY_RAS_AL_KHAIMAH_NEIGHBOURHOODS,
}

/** Dummy neighbourhood rows for a UAE city/emirate, or [] if unknown. */
export function getDummyNeighbourhoodsForCity(city) {
  const key = normalizeUaeCityKey(city)
  const rows = DUMMY_NEIGHBOURHOODS_BY_CITY[key]
  return rows ? [...rows] : []
}

export function hasDummyNeighbourhoodsForCity(city) {
  return getDummyNeighbourhoodsForCity(city).length > 0
}

export function filterDummyCitiesByQuery(predictions, query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return [...predictions]
  return predictions.filter((p) =>
    String(p.description || '')
      .toLowerCase()
      .includes(q),
  )
}

export function isDubaiCitySelection(city) {
  return normalizeUaeCityKey(city) === 'dubai'
}
