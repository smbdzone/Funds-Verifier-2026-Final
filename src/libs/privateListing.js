import { isOwnListing } from '@/libs/isOwnListing'
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
    return Boolean(value._id || value.uuid || value.Certificate || value.id)
  }
  return String(value).trim().length > 0
}

export function getListingUnlockPrice(listing) {
  const from = Number(listing?.priceFrom)
  const price = Number(listing?.price)
  if (Number.isFinite(from) && from > 0) return from
  if (Number.isFinite(price) && price > 0) return price
  return 0
}

export function hasCompleteDealHunterFinance(user) {
  const info = user?.financialInfo
  if (!info) return false
  return (
    filled(info.verificationCertificate) &&
    filled(info.fundsVerification) &&
    Number(info.fundsVerification) > 0 &&
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
  const amount = Number(user?.financialInfo?.fundsVerification)
  return Number.isFinite(amount) ? amount : 0
}

export function isDealHunterRole(user) {
  return (
    String(user?.role || '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]/g, '') === 'dealhunter'
  )
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

/** UAE Pass login (if needed), then Deal Hunter profile finance section. */
export function goToDealHunterFinance(user) {
  if (typeof window === 'undefined') return
  const path = DEAL_HUNTER_FINANCE_PATH
  if (user && isDealHunterRole(user)) {
    window.location.assign(path)
    return
  }
  setPostLoginRedirect(path)
  window.location.assign(
    `/login?redirect=${encodeURIComponent(path)}&uaepass=1`,
  )
}
