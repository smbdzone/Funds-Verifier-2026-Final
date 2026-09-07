import { getUserDisplayName } from '@/utils/auth/userDisplayName'
import { cleanNameSeparators } from '@/utils/auth/parseUaePassName'

function asText(value) {
  if (value == null) return ''
  if (typeof value === 'object') {
    return String(
      value.fullName || value.name || value.email || value.phone || '',
    ).trim()
  }
  return String(value).trim()
}

/**
 * Asset-holder contact shown on evaluator evaluation forms.
 * Name is cleaned of commas / dashes (UAE Pass style separators).
 * Phone prefers the number saved on the listing.
 */
export function getEvaluatorListingContact(listing) {
  if (!listing || typeof listing !== 'object') {
    return { fullName: '', email: '', phoneNumber: '' }
  }

  const holder =
    listing.userId && typeof listing.userId === 'object'
      ? listing.userId
      : null

  const rawName =
    getUserDisplayName(holder) ||
    asText(listing.sellerName) ||
    asText(holder?.name) ||
    asText(holder?.displayName) ||
    ''

  const fullName = cleanNameSeparators(rawName)
  const email = asText(
    holder?.email || listing.sellerEmail || listing.email || '',
  )
  const phoneNumber = asText(
    listing.phoneNumber ||
    holder?.phoneNumber ||
    holder?.phone ||
    holder?.mobile ||
    listing.phone ||
    '',
  )

  return { fullName, email, phoneNumber }
}
