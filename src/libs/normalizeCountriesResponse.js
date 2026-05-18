import {
  LISTING_COUNTRY_UAE_LABEL,
  isUnitedArabEmiratesListingCountry,
} from '@/libs/dummyLocationData'

/**
 * Normalizes GET /api/countries JSON into `{ country, code, flag? }[]`.
 * Supports a plain array (local Next route) or `{ total, countries: [{ name, code, flag }] }` (production).
 * AE / UAE entries always use the full country name for listing forms and search.
 */
export function normalizeCountriesResponse(raw) {
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : raw.countries ?? raw.data
  if (!Array.isArray(list)) return []
  return list.map((c) => {
    const code = String(c.code ?? '').toUpperCase()
    const name = String(c.country ?? c.name ?? '').trim()
    const country =
      code === 'AE' || isUnitedArabEmiratesListingCountry(name)
        ? LISTING_COUNTRY_UAE_LABEL
        : name
    return {
      country,
      code: c.code ?? '',
      ...(c.flag ? { flag: c.flag } : {}),
    }
  })
}

/**
 * Normalizes GET /api/country responses: Google wrapper `{ data: { predictions } }` or a raw array (e.g. `[]`).
 */
export function normalizeCitiesResponse(raw) {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw
  const preds = raw?.data?.predictions ?? raw.predictions
  return Array.isArray(preds) ? preds : []
}
