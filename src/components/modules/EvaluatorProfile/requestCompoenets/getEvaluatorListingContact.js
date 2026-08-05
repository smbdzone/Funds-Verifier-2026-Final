import { getUserDisplayName } from '@/utils/auth/userDisplayName'
import { cleanNameSeparators } from '@/utils/auth/parseUaePassName'

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
    listing.sellerName ||
    holder?.name ||
    ''

  const fullName = cleanNameSeparators(rawName)
  const email = String(holder?.email || listing.sellerEmail || '').trim()
  const phoneNumber = String(
    listing.phoneNumber ||
    holder?.phoneNumber ||
    holder?.phone ||
    holder?.mobile ||
    '',
  ).trim()

  return { fullName, email, phoneNumber }
}
