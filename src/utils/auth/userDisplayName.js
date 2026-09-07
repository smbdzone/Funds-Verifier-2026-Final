/**
 * Full display name for UI — combines name + lastname without duplicating parts.
 */
import { normalizePersonFullName } from './parseUaePassName'

export function getUserDisplayName(user) {
  if (!user || typeof user !== 'object') return ''

  const eidName = String(user.emiratesId?.fullName ?? '').trim()
  if (eidName) {
    return normalizePersonFullName(eidName, user.lastname)
  }

  return normalizePersonFullName(user.name, user.lastname)
}
