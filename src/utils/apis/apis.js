import axios from 'axios'
import { toast } from 'react-toastify'
import { globalLogout } from '../../context/UserContext'
import { getAccessToken, setAccessToken } from '../auth/accessTokenStore'
import { getPublicApiHeaders } from '@/libs/publicApiClient'
import { getCsrfHeaders } from '@/utils/csrf'
let isRefreshing = false
let failedQueue = []

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
  return role
}

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

const customAxios = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_BASE_URL || '').trim(),
  withCredentials: true, // refresh token cookie
})

/* ================= REQUEST ================= */
customAxios.interceptors.request.use(async (config) => {
  const csrfHeaders = await getCsrfHeaders()
  Object.assign(config.headers, csrfHeaders)

  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    delete config.headers['x-public-token']
  } else {
    delete config.headers.Authorization
    try {
      const publicHeaders = await getPublicApiHeaders()
      config.headers['x-public-token'] = publicHeaders['x-public-token']
    } catch {
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
    // console.log(data, "login");

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

    // Honor an intended destination (e.g. "Get Started" from Advertise with Us)
    // captured before sign-in. Takes precedence over the role-based default below.
    const redirectTo =
      typeof window !== 'undefined'
        ? localStorage.getItem('postLoginRedirect')
        : null
    if (redirectTo) {
      localStorage.removeItem('postLoginRedirect')
      router.replace(redirectTo)
      return data
    }

    switch (assignedRole) {
      case 'Advertiser':
        router.replace('/advertiser-dashboard')
        break
      case 'AssetHolder':
        router.replace('/seller-profile')
        break
      case 'Evaluator':
        router.replace('/evaluator-profile')
        break
      case 'SubEvaluator':
        router.replace('/sub-evaluator-profile')
        break
      case 'DealHunter':
        router.replace('/profile')
        break
      case 'Trustee':
        router.replace('/trustee')
        break
      case '3dWalkthrough':
        router.replace('/3d-walkthrough')
        break
      case 'TechnicalReport':
        router.replace('/survey-dashboard/')
        break
      default:
        router.replace('/')
    }

    return data
  } catch (error) {
    toast.error(error.response?.data?.message ?? 'Login failed')
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
