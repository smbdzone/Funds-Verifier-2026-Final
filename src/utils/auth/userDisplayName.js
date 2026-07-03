/**
 * Full display name for UI — combines name + lastname without duplicating parts.
 */
import {
  hasMalformedUaePassName,
  normalizePersonFullName,
  parseUaePassName,
} from './parseUaePassName'

export function getUserDisplayName(user) {
  if (!user || typeof user !== 'object') return ''

  const eidName = String(user.emiratesId?.fullName ?? '').trim()
  if (eidName) {
    return hasMalformedUaePassName(eidName)
      ? parseUaePassName(eidName, user.lastname).fullName
      : eidName
  }

  return normalizePersonFullName(user.name, user.lastname)
}
