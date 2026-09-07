import { clearAccessToken } from './accessTokenStore'

/** Clear HttpOnly auth cookies via backend and wipe client-side auth leftovers. */
export async function clearAuthSession(axiosInstance) {
  try {
    await axiosInstance.get('/user/logout', { withCredentials: true })
  } catch {
    /* ignore */
  }
  localStorage.removeItem('accessToken')
  localStorage.removeItem('role')
  clearAccessToken()
}
