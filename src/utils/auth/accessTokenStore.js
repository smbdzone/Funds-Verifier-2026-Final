let inMemoryAccessToken = null

export function setAccessToken(token) {
  inMemoryAccessToken = token || null
}

export function getAccessToken() {
  return inMemoryAccessToken
}

export function clearAccessToken() {
  inMemoryAccessToken = null
}

