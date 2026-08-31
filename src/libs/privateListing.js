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
