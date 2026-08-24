import { formatCityLabel } from '@/libs/dummyLocationData'
import { normalizeCitiesResponse } from '@/libs/normalizeCountriesResponse'
import customAxios from '@/utils/apis/apis'

export async function fetchCatalogCities() {
  try {
    const { data } = await customAxios.get('/location-catalog/cities')
    return Array.isArray(data?.cities) ? data.cities : []
  } catch {
    return []
  }
}

export async function fetchCatalogNeighbourhoods(cityName) {
  const city = formatCityLabel(cityName)
  if (!city) return []
  try {
    const { data } = await customAxios.get('/location-catalog/neighbourhoods', {
      params: { city },
    })
    return Array.isArray(data?.neighbourhoods) ? data.neighbourhoods : []
  } catch {
    return []
  }
}

/** Extra Super Admin cities first only if not already in Google/dummy list. */
export function mergeCityPredictions(base, catalogCities, query = '') {
  const q = String(query || '')
    .trim()
    .toLowerCase()
  const existing = normalizeCitiesResponse(base)
  const seen = new Set(
    existing.map((city) => String(city.description || '').toLowerCase()),
  )
  const extras = (catalogCities || [])
    .map((city) => formatCityLabel(city?.name || city?.description || city))
    .filter((name) => {
      if (!name) return false
      if (q && !name.toLowerCase().includes(q)) return false
      const key = name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((description) => ({ description }))

  return [...existing, ...extras]
}

/** Existing Google/dummy neighbourhoods first; Super Admin extras appended. */
export function mergeNeighbourhoodRows(base, catalogRows) {
  const existing = []
  const seen = new Set()
  for (const row of base || []) {
    const name = String(row?.name || row || '').trim()
    const key = name.toLowerCase()
    if (!name || seen.has(key)) continue
    seen.add(key)
    existing.push({ name })
  }

  const extras = (catalogRows || [])
    .map((row) => String(row?.name || '').trim())
    .filter((name) => name && !seen.has(name.toLowerCase()))
    .map((name) => {
      seen.add(name.toLowerCase())
      return { name }
    })

  return [...existing, ...extras]
}
