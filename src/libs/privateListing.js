import { isOwnListing } from '@/libs/isOwnListing'
import { formatCityLabel } from '@/libs/dummyLocationData'
import { formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { setPostLoginRedirect } from '@/utils/auth/postLoginRedirect'

export const DEAL_HUNTER_FINANCE_PATH = '/profile?highlight=financial'

export function isPrivateListing(listing) {
  return (
    String(listing?.listing || '').trim() === 'Private' ||
    Boolean(listing?.privateLocked)
  )
}

const UNLOCK_ROLES = new Set([
  'admin',
  'superadmin',
  'evaluator',
  'subevaluator',
  'trustee',
])

function filled(value) {
  if (value == null || value === '') return false
  if (typeof value === 'object') {
    if (value._id || value.uuid || value.Certificate || value.id) return true
    const asString =
      typeof value.toString === 'function' ? String(value.toString()) : ''
    return Boolean(asString && asString !== '[object Object]')
  }
  return String(value).trim().length > 0
}

export function parseMoneyAmount(value) {
  if (value == null || value === '') return NaN
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN
  }
  const cleaned = String(value).replace(/,/g, '').trim()
  if (!cleaned) return NaN
  const amount = Number(cleaned)
  return Number.isFinite(amount) ? amount : NaN
}

export function getListingUnlockPrice(listing) {
  const from = parseMoneyAmount(listing?.priceFrom)
  const price = parseMoneyAmount(listing?.price)
  if (Number.isFinite(from) && from > 0) return from
  if (Number.isFinite(price) && price > 0) return price
  return 0
}

export function hasCompleteDealHunterFinance(user) {
  const info = user?.financialInfo
  if (!info) return false
  const funds = parseMoneyAmount(info.fundsVerification)
  return (
    filled(info.verificationCertificate) &&
    filled(info.fundsVerification) &&
    Number.isFinite(funds) &&
    funds > 0 &&
    filled(info.bankName) &&
    filled(info.bankBranch) &&
    filled(info.city) &&
    filled(info.country)
  )
}

export function isDealHunterFinanceApproved(user) {
  return String(user?.financialInfo?.status || '').trim() === 'Approved'
}

export function getDealHunterFundsAmount(user) {
  const amount = parseMoneyAmount(user?.financialInfo?.fundsVerification)
  return Number.isFinite(amount) ? amount : 0
}

function normalizeRoleKey(role) {
  return String(role || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '')
}

export function isDealHunterRole(user) {
  return normalizeRoleKey(user?.role) === 'dealhunter'
}

export function isAssetHolderRole(user) {
  return normalizeRoleKey(user?.role) === 'assetholder'
}

/** Deal Hunter with approved, complete finance whose funds cover this listing. */
export function dealHunterCanViewPrivateListing(user, listing) {
  if (!isDealHunterRole(user)) return false
  if (!hasCompleteDealHunterFinance(user)) return false
  if (!isDealHunterFinanceApproved(user)) return false
  const listingPrice = getListingUnlockPrice(listing)
  if (listingPrice <= 0) return false
  return getDealHunterFundsAmount(user) >= listingPrice
}

export function getPrivateListingLockCopy(user, listing) {
  if (!user || !isDealHunterRole(user)) {
    return {
      message: 'Complete finance information to view this listing.',
      detail:
        'Login with UAE Pass and add your finance information. If your funds verification covers this listing price, you can view it.',
      ctaLabel: 'Login and put your finance information',
    }
  }

  if (!hasCompleteDealHunterFinance(user)) {
    return {
      message: 'Complete finance information to view this listing.',
      detail:
        'Fill the bank form (certificate PDF, funds verification amount, bank name/branch, country, and city) to view this listing.',
      ctaLabel: 'Put your finance information',
    }
  }

  if (!isDealHunterFinanceApproved(user)) {
    return {
      message: 'Waiting for Super Admin approval to view this listing.',
      detail:
        'Your finance information is submitted. After Super Admin approval you can see private listings your funds cover.',
      ctaLabel: 'View finance information',
    }
  }

  const listingPrice = getListingUnlockPrice(listing)
  const funds = getDealHunterFundsAmount(user)
  if (listingPrice > 0 && funds < listingPrice) {
    return {
      message: 'Your funds verification does not cover this listing price.',
      detail:
        'Update your funds verification amount if it now covers this listing.',
      ctaLabel: 'Update finance information',
    }
  }

  return {
    message: 'Complete finance information to view this listing.',
    detail:
      'Fill the bank form to view private listings your funds cover.',
    ctaLabel: 'Put your finance information',
  }
}

export function canUnlockPrivateListing(listing, user, { staffUnlock = true } = {}) {
  if (!isPrivateListing(listing)) return true
  if (!user) return false
  if (isOwnListing(listing, user)) return true
  if (dealHunterCanViewPrivateListing(user, listing)) return true
  if (!staffUnlock) return false
  const roleKey = String(user.role || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '')
  return UNLOCK_ROLES.has(roleKey)
}

export function shouldLockPrivateListing(listing, user, options) {
  if (!isPrivateListing(listing)) return false
  if (listing?.status != null && Number(listing.status) !== 1) return false
  return !canUnlockPrivateListing(listing, user, options)
}

function firstFilled(...values) {
  for (const value of values) {
    const text = String(value ?? '').trim()
    if (text) return text
  }
  return ''
}

export function formatPrivateListingRoi(listing) {
  const raw = listing?.roi
  if (raw == null || raw === '') return ''
  const text = String(raw).trim()
  if (!text) return ''
  return text.includes('%') ? text : `${text}%`
}

function listingAssetKind(listing) {
  return String(listing?.assetType || listing?.type || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
}

function isCarBoatOrJewelryListing(listing) {
  const t = listingAssetKind(listing)
  return t.includes('car') || t.includes('boat') || t.includes('jewel')
}

function prettyTypeLabel(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Villa / Apartment (or car/boat/jewelry type) for locked overlays. */
export function getPrivateListingTypeLabel(listing) {
  const t = listingAssetKind(listing)
  if (t.includes('car')) {
    return prettyTypeLabel(
      firstFilled(listing?.carType, listing?.make, listing?.category),
    )
  }
  if (t.includes('boat')) {
    return prettyTypeLabel(
      firstFilled(listing?.brands, listing?.boatType, listing?.category),
    )
  }
  if (t.includes('jewel')) {
    return prettyTypeLabel(
      firstFilled(listing?.make, listing?.category, listing?.brands),
    )
  }

  const propertyType = prettyTypeLabel(listing?.propertyType)
  if (!propertyType) return prettyTypeLabel(listing?.assetType)
  if (t.includes('off plan')) return propertyType
  if (t.includes('lease')) return `${propertyType} For Lease`
  return `${propertyType} For Sale`
}

/** City, area, and price stay visible on locked cards. ROI is property-only. */
export function getPrivateListingPreviewFacts(listing) {
  const city = formatCityLabel(listing?.city)
  const area = firstFilled(
    listing?.neighbourhood,
    listing?.area,
    listing?.location,
    listing?.locateBoat,
    listing?.locateJewelry,
  )
  const price = formatListingCardPrice(listing)
  const typeLabel = getPrivateListingTypeLabel(listing)
  const facts = []

  if (typeLabel) {
    facts.push({
      key: 'type',
      label: isCarBoatOrJewelryListing(listing) ? 'Type' : 'Property Type',
      value: typeLabel,
    })
  }

  facts.push(
    { key: 'city', label: 'City', value: city || '—' },
    { key: 'area', label: 'Area', value: area || '—' },
    { key: 'price', label: 'Price', value: price ? `AED ${price}` : '—' },
  )

  if (!isCarBoatOrJewelryListing(listing)) {
    facts.push({
      key: 'roi',
      label: 'ROI',
      value: formatPrivateListingRoi(listing) || '—',
    })
  }

  return facts
}

/** UAE Pass login (if needed), then Deal Hunter profile finance section. */
export async function goToDealHunterFinance(user, { switchUserRole } = {}) {
  if (typeof window === 'undefined') return
  const path = DEAL_HUNTER_FINANCE_PATH
  if (user && isDealHunterRole(user)) {
    window.location.assign(path)
    return
  }
  if (user && isAssetHolderRole(user) && typeof switchUserRole === 'function') {
    await switchUserRole('DealHunter', { redirectTo: path })
    return
  }
  setPostLoginRedirect(path)
  window.location.assign(
    `/login?redirect=${encodeURIComponent(path)}&uaepass=1`,
  )
}
