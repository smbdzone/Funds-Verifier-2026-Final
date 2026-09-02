import axios from 'axios'
import { toast } from 'react-toastify'
import { globalLogout } from '../../context/UserContext'
import { getAccessToken, setAccessToken } from '../auth/accessTokenStore'
import { getPublicApiHeaders } from '@/libs/publicApiClient'
import { getCsrfHeaders } from '@/utils/csrf'

let isRefreshing = false
let failedQueue = []

const SAFE_HTTP_METHODS = new Set(['get', 'head', 'options'])

/** Auth endpoints authenticate via cookies/Bearer — do not fetch a public token for them. */
const SKIP_PUBLIC_TOKEN_PATHS = [
  '/user/me',
  '/user/refresh',
  '/user/logout',
  '/user/login',
  '/csrf-token',
  '/public/get-public-token',
]

const normalizeRole = (role) => {
  if (!role) return role
  const cleaned = String(role)
    .replace(/[\s-_]/g, '')
    .toLowerCase()
  if (cleaned === 'assetholder') return 'AssetHolder'
  if (cleaned === 'dealhunter') return 'DealHunter'
  if (cleaned === 'subevaluator') return 'SubEvaluator'
  if (cleaned === '3dwalkthrough') return '3dWalkthrough'
  if (cleaned === 'technicalreport') return 'TechnicalReport'
  if (cleaned === 'evaluator') return 'Evaluator'
  if (cleaned === 'trustee') return 'Trustee'
  if (cleaned === 'advertiser') return 'Advertiser'
  if (cleaned === 'developer') return 'Developer'
  return role
}

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

function requestNeedsCsrf(config) {
  const method = String(config?.method || 'get').toLowerCase()
  return !SAFE_HTTP_METHODS.has(method)
}

function requestNeedsPublicToken(config) {
  const url = String(config?.url || '')
  return !SKIP_PUBLIC_TOKEN_PATHS.some((path) => url.includes(path))
}

const customAxios = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_BASE_URL || '').trim(),
  withCredentials: true, // refresh token cookie
})

/* ================= REQUEST ================= */
customAxios.interceptors.request.use(async (config) => {
  if (requestNeedsCsrf(config)) {
    const csrfHeaders = await getCsrfHeaders()
    Object.assign(config.headers, csrfHeaders)
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('Content-Type', false)
    } else if (config.headers) {
      delete config.headers['Content-Type']
      delete config.headers['content-type']
    }
  }

  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    delete config.headers['x-public-token']
  } else {
    delete config.headers.Authorization
    if (requestNeedsPublicToken(config)) {
      try {
        const publicHeaders = await getPublicApiHeaders()
        config.headers['x-public-token'] = publicHeaders['x-public-token']
      } catch {
        delete config.headers['x-public-token']
      }
    } else {
      delete config.headers['x-public-token']
    }
  }
  return config
})

/* ================= RESPONSE ================= */
customAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

    const requestUrl = originalRequest.url || ''

    // Session probe: UserContext handles refresh — never logout here (wipes fresh UAE Pass cookies).
    if (error.response.status === 401 && requestUrl.includes('/user/me')) {
      return Promise.reject(error)
    }

    // Optional listing helpers must never force a full session logout.
    if (
      error.response.status === 401 &&
      (requestUrl.includes('/user/service-providers/') ||
        requestUrl.includes('/notifications/') ||
        requestUrl.includes('/arrange-view/bookings'))
    ) {
      return Promise.reject(error)
    }

    // 🔁 ACCESS TOKEN EXPIRED
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !requestUrl.includes('/user/refresh')
    ) {
      originalRequest._retry = true

      // 🧵 If refresh already running → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(customAxios(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return customAxios(originalRequest)
      } catch (err) {
        processQueue(err, null)
        if (requestUrl.includes('/user/switch-user')) {
          /* keep session; switchUserRole shows the API error */
        } else if (
          // Optional listing helpers — never wipe the session if these fail.
          requestUrl.includes('/user/service-providers/') ||
          requestUrl.includes('/notifications/') ||
          requestUrl.includes('/arrange-view/bookings')
        ) {
          /* keep session */
        } else {
          globalLogout()
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    // 🔒 REFRESH failed (401). Do not globalLogout here — the caller's catch (e.g. after /user/me)
    // decides; globalLogout runs from the access-token refresh path when the original request was not /user/me.
    if (
      originalRequest.url.includes('/user/refresh') &&
      error.response.status === 401
    ) {
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export const login = async (values, router) => {
  try {
    const csrfHeaders = await getCsrfHeaders()
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
      {
        email: values.email,
        password: values.password,
      },
      {
        withCredentials: true,
        headers: csrfHeaders,
      },
    )

    const data = res.data

    // OTP-gated roles (Evaluator, Sub-Evaluator, ...): password was correct but
    // no session is issued yet. The caller shows the OTP screen.
    if (data?.otpRequired) {
      toast.info(data?.message ?? 'Check your email for the verification code.')
      return data
    }

    return finalizeLoginSession(data, router)
  } catch (error) {
    toast.error(error.response?.data?.message ?? 'Login failed')
    console.error(error)
    throw error
  }
}

// ------------------ LOGIN OTP (step 2) ------------------
export const verifyLoginOtp = async ({ email, otp }, router) => {
  try {
    const csrfHeaders = await getCsrfHeaders()
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/login/verify-otp`,
      { email, otp },
      { withCredentials: true, headers: csrfHeaders },
    )

    return finalizeLoginSession(res.data, router)
  } catch (error) {
    toast.error(error.response?.data?.message ?? 'Verification failed')
    throw error
  }
}

export const resendLoginOtp = async (email) => {
  try {
    const csrfHeaders = await getCsrfHeaders()
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/login/resend-otp`,
      { email },
      { withCredentials: true, headers: csrfHeaders },
    )

    toast.success(res.data?.message ?? 'A new code is on its way.')
    return res.data
  } catch (error) {
    toast.error(error.response?.data?.message ?? 'Could not resend the code')
    throw error
  }
}

/**
 * Store the session and route the user to their dashboard (or the deep link
 * captured before sign-in). Shared by password login and OTP verification.
 */
const finalizeLoginSession = async (data, router) => {
  try {
    // Removed userUUID from localStorage - using /me endpoint instead for security

    let assignedRole = normalizeRole(data?.role)
    if (data?.role === 'Evaluator' && data?.parentEvaluator) {
      assignedRole = 'SubEvaluator'
    }

    // Backend /login may return "Evaluator" for sub-evaluators.
    // Resolve the final role from /me (cookie-authenticated) before redirect.
    try {
      const meRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/me`,
        {
          withCredentials: true,
        },
      )
      const meUser = meRes?.data
      let meRole = normalizeRole(meUser?.role)
      if (
        meUser?.role === 'Evaluator' &&
        (meUser?.parentEvaluator || meUser?.parentID)
      ) {
        meRole = 'SubEvaluator'
      }
      if (meRole) assignedRole = meRole
    } catch (meError) {
      // Keep login non-blocking if /me probe fails; fallback to /login response role.
      console.warn('Could not resolve role from /user/me after login', meError)
    }

    // Check if user is inactive
    if (data.userState === 'inactive' && assignedRole === 'SubEvaluator') {
      toast.info('Your account is inactive. Please contact the admin.')
      return // stop login flow
    }

    // 🍪 Auth cookies (accessToken, refreshToken, role) are set by backend via Set-Cookie.
    if (data?.accessToken) {
      setAccessToken(data.accessToken)
    }
    toast.success(data?.message)

    // Deep link only if this role may open it; otherwise go to role dashboard.
    // Stale redirects (e.g. /seller-profile after Arrange Viewing) used to send
    // Evaluator/Trustee users to /unauthorized right after "Login successful!".
    const { consumePostLoginRedirect } = await import(
      '@/utils/auth/postLoginRedirect'
    )
    const { resolveRoleSafeRedirect } = await import('@/utils/auth/roleAccess')
    const { getRoleHomeRoute, getDeveloperAppUrl } = await import(
      '@/utils/auth/roleHome'
    )
    const intended = consumePostLoginRedirect()

    if (assignedRole === 'Developer') {
      window.location.href = getDeveloperAppUrl()
      return data
    }

    const destination = resolveRoleSafeRedirect(intended, assignedRole)
    router.replace(destination || getRoleHomeRoute(assignedRole) || '/')
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

// ------------------ GENERATE REFRESH TOKEN ------------------
export async function refreshAccessToken() {
  const res = await customAxios.get('/user/refresh')

  const newToken = res.data.accessToken

  setAccessToken(newToken)

  customAxios.defaults.headers.common.Authorization = `Bearer ${newToken}`

  return newToken // 🔑 IMPORTANT
}

export default customAxios
