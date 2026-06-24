/**
 * Full display name for UI — combines name + lastname without duplicating parts.
 */
export function getUserDisplayName(user) {
  if (!user || typeof user !== 'object') return ''

  const name = String(user.name ?? '').trim()
  const lastname = String(user.lastname ?? '').trim()

  if (!name && !lastname) return ''
  if (!name) return lastname
  if (!lastname) return name

  const nameLower = name.toLowerCase()
  const lastLower = lastname.toLowerCase()

  if (nameLower === lastLower) return name
  if (nameLower.endsWith(lastLower) || nameLower.includes(` ${lastLower}`)) {
    return name
  }

  return `${name} ${lastname}`
}
