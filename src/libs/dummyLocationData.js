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
  'Al Nahda (Dubai)',
  'Dubai Maritime City',
  'Dubai Studio City',
  'Mohammed Bin Rashid City (MBR City)',
  'Koyo by Fuji',
  'Mohammad Bin Rashid Boulevard',
  'Mina Rashid',
  'Rasis Business Centre',
  'Abu Hail',
  'Abu Keibal',
  'Abu Ghazale Building',
  'Abu Hail Building 13',
  'Umm Suqeim',
  'Umm Suqeim 1',
  'Umm Suqeim 2',
  'Umm Suqeim 3',
  'Umm Ramool',
  'Umm Hurair',
  'Umm Hurair 1',
  'Umm Hurair 2',
  'Umm Nahad 3',
  'Umm Al Sheif',
  'Umm Hurrair Residence',
  'Al Sayegh Building Umm Hurair',
  'Al Hashimi Umm Hurair Building',
  'Masaken Umm Hurair 1 Building',
  'Ras Al Khor',
  'Ras Al Khor Industrial',
  'Ras Al Khor Industrial 1',
  'Ras Al Khor Industrial 2',
  'Jumeirah Village Circle (JVC)',
  'Business Bay',
  'DAMAC Hills',
  'Palm Jumeirah',
  'Arjan',
  'Meydan',
  'Al Furjan',
  'Jumeirah Lake Towers (JLT)',
  'City Walk',
  'Town Square',
  'Sobha Hartland',
  'Jumeirah',
  'Jumeirah Beach Residence (JBR)',
  'Jumeirah Village Triangle (JVT)',
  'Remraam',
  'The Greens',
  'The Views',
  'Mirdif',
  'International City',
  'Discovery Gardens',
  'Bluewaters Island',
  'DAMAC Hills 2 (Akoya by DAMAC)',
  'Majan',
  'Arabian Ranches',
  'The Valley by Emaar',
  'DIFC',
  'The Springs',
  'Arabian Ranches 3',
  'Jumeirah Golf Estates',
  'The Meadows',
  'Culture Village (Jaddaf Waterfront)',
  'Jebel Ali',
  'Al Barsha',
  'The Lakes',
  "Za'abeel",
  'Motor City',
  'International City Phase 2 (Warsan 4)',
  'Mudon',
  'Villanova',
  'Sobha Hartland 2',
  'Sheikh Zayed Road',
  'Al Quoz',
  'Living Legends',
  'Dubai Festival City',
  'Al Barari',
  'Reem',
  'Al Safa',
  'DAMAC Lagoons',
  'Al Wasl',
  'Expo City',
  'City of Arabia',
  'Tilal Al Ghaf',
  'Dubai Design District (D3)',
  'Barsha Heights (TECOM)',
  'The Acres',
  'Arabian Ranches 2',
  'Wasl Gate',
  'Dubai Industrial City',
  'Al Sufouh',
  'Jumeirah Garden City',
  'Nad Al Sheba',
  'Rukan',
  'Liwan',
  'Dubai Media City',
  'Green Community',
  'The Hills',
  'Jumeirah Islands',
  'Serena',
  'The Oasis by Emaar',
  'Ghaf Woods',
  'Jumeirah Park',
  'Al Garhoud',
  'The World Islands',
  'Emirates Hills',
  'Dubai World Trade Centre (DWTC)',
  'Dubai Internet City',
  'Jebel Ali Village',
  'Palm Jebel Ali',
  'Pearl Jumeirah',
  'Dubai Waterfront',
  'Paradise Hills',
  'The Villa',
  'DAMAC Islands',
  'Sobha Reserve',
  'Dubailand',
  'Haven by Aldar',
  'Layan',
  'Dubai Healthcare City',
  'R. Hills',
  'Reportage Village',
  'Muhaisnah',
  'Bianca',
  'Cherrywoods',
  'Al Waha',
  'Jumeirah Heights',
  'DAMAC Sun City',
  'Al Qusais',
  'Falcon City of Wonders',
  'The Sustainable City',
  'Meydan Horizon',
  'Deira',
  'Maha Villas, Expo City Dubai',
  'Al Quoz Industrial Area 3',
  'Al Warqaa 5',
  'Verdana, Dubai Investments Park (DIP)',
  'Golf Place I, Dubai Hills Estate',
  'Ras Al Khor Industrial 3',
  'Khalid Bin Waleed Road, Bur Dubai',
  'Al Quoz Industrial Area 4',
  'Al Raffa, Bur Dubai',
  'Commercial District, Dubai South',
  'Novelia, Dubai Sports City',
  'Sidra Villas I, Dubai Hills Estate',
  'Sidra 3 Villas, Dubai Hills Estate',
  'Dubai Digital Park, Dubai Silicon Oasis',
  'Marbella Village, Dubai Sports City',
  'Mira 4, Reem Dubai',
  'Dubai Textile City, International City',
  'Dubai Airport Freezone (DAFZA)',
  'The Gardens, Dubai',
  'Sheikh Hamdan Colony, Dubai',
  'Al Twar, Dubai',
  'Al Mina, Dubai',
  'Dubai Hills Grove',
  'Dubai Creek Club Villas',
  'Prime Villas, Dubai Sports City',
  'Marina Promenade, Dubai Marina',
  'Park Island, Dubai Marina',
  'Golf Grove, Dubai Hills Estate',
  'Al Mankhool, Bur Dubai',
  'Fairway Vistas, Dubai Hills Estate',
  'Victory Heights, Dubai Sports City',
  'Parkway Vistas, Dubai Hills Estate',
  'Dubai Style, Al Furjan',
  'Cedre Villas, Dubai Silicon Oasis',
  'Al Nahda 2, Dubai',
  'Maple, Dubai Hills Estate',
  'Fortuna Village, Dubai Sports City',
  'Morella, Dubai Sports City',
])

export const DUMMY_SHARJAH_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Aljada',
  'Ajmal Makan City - Sharjah Waterfront',
  'Al Nahda (Sharjah)',
  'Sharjah Garden City',
  'Sharjah Sustainable City',
  'Shaghrafa 1, Al Rahmaniya',
  'Sharjah Sustainable City II',
  'Umm Fanain',
  'Sharqan',
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
  'Sharjah Gate tower',
  'Sharjah Investment Center',
  'Al Noor Tower',
  'Al Noor Tower Sharjah',
  'Al Majaz 2, Al Majaz',
  'New Sharjah Tower',
  'Al Jubail',
  'Swiss Belhotel',
  'Al Nabba',
  'Central Souk',
  'Al Majaz 1, Al Majaz',
  'Four Points by Sheraton',
  'Al Nad, Al Qasimia',
  'Al Sharq',
  'Um Tarafa',
  'Raseel',
  'Abu Shagara',
  'MB Abu Shagara Building',
  'Abu Shagara Tower',
  'Abu Mossa Building',
  'Abu Bakar Building',
  'Al Juraina 4, Sharjah',
  'Industrial Area 8, Sharjah',
  'Al Juraina 3, Sharjah',
  'Al Majaz 3, Sharjah',
  'Al Hamriyah, Sharjah',
  'Industrial Area 3, Sharjah',
  'Al Layyah Suburb, Sharjah',
  'Industrial Area 11, Sharjah',
  'Industrial Area 9, Sharjah',
  'Industrial Area 15, Sharjah',
  'Al Juraina, Sharjah',
  'Al Sweihat, Sharjah',
  'Hamriyah Free Zone, Sharjah',
  'Industrial Area 7, Sharjah',
  'Al Madam, Sharjah',
  'Maleha, Sharjah',
  'Muwafjah, Sharjah',
  'Al Noaf 1, Sharjah',
  'Sharjah Industrial Area 6',
  'Al Maliha, Sharjah',
  'Industrial Area 18, Sharjah',
  'Al Heerah Suburb, Sharjah',
  'Industrial Area 5, Sharjah',
  'Industrial Area 12, Sharjah',
  'Sharjah Industrial Area 17',
  'Al Khaledia Suburb, Sharjah',
  'Maysaloon, Sharjah',
  'Al Atain, Sharjah',
  'Industrial Area 13, Sharjah',
  'Sharjah Industrial Area 1',
  'Al Hazannah, Sharjah',
  'Al Fayha, Sharjah',
  'Al Qadisiya, Sharjah',
  'Al Noaf, Sharjah',
  'Samnan, Sharjah',
  'Al Falaj, Sharjah',
  'Al Mirgab, Sharjah',
  'Al Nasserya, Sharjah',
  'Dibba Al Hisn, Sharjah',
  'Al Khezamia, Sharjah',
  'Al Mamzar, Sharjah',
  'Tilal City',
  'Al Majaz',
  'Al Rahmaniya',
  'Al Tai',
  'Barashi',
  'Al Qasimia',
  'Al Zahia',
  'Al Menhaz',
  'Al Tay West',
  'Muwaileh Commercial',
  'Khor Fakkan',
  'Al Sehma',
  'Al Suyoh',
])

export const DUMMY_AJMAN_NEIGHBOURHOODS = toNeighbourhoodRows([
  'Corniche Ajman',
  'Ajman Corniche Residence',
  'Ajman One Towers',
  'Al Rashidiya',
  'Al Rashidiya 1',
  'Al Rashidiya 2',
  'Al Rashidiya 3',
  'Al Rashidiya 3, Al Rashidiya',
  'Al Rashidiya Towers',
  'Sheikh Maktoum Bin Rashid Street',
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
  'Tiger Downtown Ajman Tower A2',
  'Tiger Downtown Ajman, Al Alia',
  'Ajman One Tower 1',
  'Ajman One Tower 9',
  'Tiger Downtown Ajman Tower C',
  'Tiger Downtown Ajman Tower C2',
  'Ajman Clock Tower',
  'Al Tallah 2',
  'Al Talla 1',
  'Liwara 1',
  'Al Butain',
  'Al Owan',
  'Sheikh Khalifa Bin Zayed Street',
  'Erica 2H, Ajman Uptown',
  'Ajman Industrial Area 1',
  'Ajman Marina',
  'Al Raqaib',
  'Masfout',
  'Dahlia, Ajman Uptown',
  'Al Manama',
  'Begonia, Ajman Uptown',
  'Erica 1, Ajman Uptown',
  'Camellia, Ajman Uptown',
  'Acacia, Ajman Uptown',
  'Al Rawda 3',
  'Al Nakhil',
  'Ajman China Mall',
  'Al Zahraa',
  'Ajman Industrial Area',
  'Garden City',
  'Al Ameera Village',
  'Ajman Corniche',
  'Al Amerah',
  'Al Zorah',
  'Al Jurf',
  'Al Zahya',
  'Al Helio',
  'Al Bustan',
  'Al Mowaihat',
  'Al Nuaimiya',
  'Emirates Lake Towers',
  'Al Yasmeen',
  'Al Rawda',
  'Al Humaid City',
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
  'Abu Dhabi National Exhibition Centre ADNEC',
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
  'Bawabat Al Sharq',
  'Zayed The First Street, Abu Dhabi',
  'Mubarak Bin Mohammed Street, Abu Dhabi',
  'Baniyas North, Abu Dhabi',
  'Al Ghadeer Phase 2, Abu Dhabi',
  'Al Shahama, Abu Dhabi',
  'Dalma Island, Abu Dhabi',
  'Al Sader, Abu Dhabi',
  'Al Mafraq, Abu Dhabi',
  'KIZAD (Khalifa Industrial Zone Abu Dhabi)',
  'Al Ruwais Industrial City, Abu Dhabi',
  'Abu Krayyah, Al Ain',
  'Abu Samrah, Al Ain',
  'Al Ras Al Akhdar, Abu Dhabi',
  'New Al Falah, Abu Dhabi',
  'Al Khubeirah, Abu Dhabi',
  'New Shahama, Abu Dhabi',
  'Al Markaz, Abu Dhabi',
  'Al Qurm Street, Abu Dhabi',
  'Al Nahda, Abu Dhabi',
  'Al Firdous Street, Abu Dhabi',
  'Old Shahama, Abu Dhabi',
  'Al Rawdah, Abu Dhabi',
  'Industrial City of Abu Dhabi (ICAD), Musaffah',
  'Al Jurf, Abu Dhabi',
  'Al Bateen Complex, Abu Dhabi',
  'Ghantoot, Abu Dhabi',
  'Al Rahba, Abu Dhabi',
  'Al Hosn, Abu Dhabi',
  'Al Mirfa, Abu Dhabi',
  'Al Zaab Abu Dhabi',
  'Defence Road Abu Dhabi',
  'Sheikh Khalifa Bin Zayed Street Abu Dhabi',
  'Liwa Street, Abu Dhabi',
  'Al Zahraa, Abu Dhabi',
  'Al Rehhan, Abu Dhabi',
  'Al Matar, Abu Dhabi',
  'Al Manhal, Abu Dhabi',
  'Al Dhannah City, Abu Dhabi',
  'Qasr El Bahr, Abu Dhabi',
  'Brabus Island, Al Raha Beach',
  'Saadiyat Island',
  'Al Raha Gardens',
  'Masdar City',
  'Al Ghadeer',
  'Corniche Area',
  'Al Maryah Island',
  'Corniche Road',
  'Al Muntazah',
  'Ramhan Island',
  'Hydra Village',
  'Al Dhafrah',
  'Al Reef',
  'Al Bateen',
  'Al Khalidiyah',
  'Baniyas',
  'Al Shamkha',
  'Rabdan',
  'The Marina',
  'Al Mushrif',
  'Al Samha',
  'Al Jubail Island',
  'Musaffah',
  'Tourist Club Area (TCA)',
  'Al Hudayriat Island',
  'Zayed Sports City',
  'Marina Village',
  'Nurai Island',
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
  'Al Dar Al Baida, Umm al Quwain',
  'Falaj Al Mualla, Umm Al Quwain',
  'Al Maqtaa, Umm Al Quwain',
  'Al Humrah, Umm Al Quwain',
  'Al Riqqah, Umm al Quwain',
  'Al Ramlah C, Umm Al Quwain',
  'Al Hawiyah, Umm Al Quwain',
  'Al Maidan, Umm Al Quwain',
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
  'Thoban, Fujairah',
  'Dhadna, Fujairah',
  'Mina Al Fajer, Fujairah',
  'Mirbah, Fujairah',
  'Dibba Al Fujairah',
  'Merashid Area, Fujairah',
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
  'Al Sharisha',
  'Al Howaelat, Ras Al Khaimah',
  'Al Mataf, Ras Al Khaimah',
  'Al Digdagah, Ras al Khaimah',
  'Ras Al Selaab, Ras Al Khaimah',
  'Dahan, Ras Al Khaimah',
  'Al Turfa, Ras Al Khaimah',
  'Al Nudood, Ras Al Khaimah',
  'Al Juwais, Ras al Khaimah',
  'Al Mamourah, Ras Al Khaimah City',
  'Sidroh, Ras Al Khaimah',
  'Al Nakheel, Ras Al Khaimah',
  'Al Seer, Ras Al Khaimah',
  'Al Mairid, Ras Al Khaimah',
  'Al Uraibi, Ras Al Khaimah',
  'Al Fahlain, Ras Al Khaimah',
  'Seih Al Hudaibah, Ras Al Khaimah',
  "Sha'am, Ras Al Khaimah",
  'Al Nadiyah, Ras Al Khaimah',
  'Al Kharran, Ras Al Khaimah',
  'Yasmin Village Ras Al Khaimah',
  'Dafan Al Nakheel',
  'Nad Al Sili',
  'Khuzam',
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
