const IDLE_TIMEOUT_MS = 10 * 60 * 1000
const LAST_ACTIVE_KEY = 'fv.session.lastActiveAt'
const USER_KEY = 'fv.session.idleUserUuid'

export const SESSION_IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MS

export function touchSessionIdle(userUuid) {
  if (typeof window === 'undefined' || !userUuid) return
  localStorage.setItem(USER_KEY, String(userUuid))
  localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()))
}

export function clearSessionIdle() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LAST_ACTIVE_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('fv.session.idleDeadline')
  localStorage.removeItem('fv.session.expired')
}

function matchesUser(userUuid) {
  if (!userUuid) return true
  const storedUser = localStorage.getItem(USER_KEY)
  if (!storedUser) return true
  return storedUser === String(userUuid)
}

export function getSessionIdleRemainingMs(userUuid) {
  if (typeof window === 'undefined') return IDLE_TIMEOUT_MS
  if (!matchesUser(userUuid)) return IDLE_TIMEOUT_MS

  const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY) || 0)
  if (!lastActive) return IDLE_TIMEOUT_MS

  return Math.max(0, IDLE_TIMEOUT_MS - (Date.now() - lastActive))
}

export function isSessionIdleExpired(userUuid) {
  if (typeof window === 'undefined') return false
  if (!matchesUser(userUuid)) return false

  const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY) || 0)
  if (!lastActive) return false

  return Date.now() - lastActive >= IDLE_TIMEOUT_MS
}
