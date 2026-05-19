import axios from 'axios'
import { getCookie } from 'cookies-next'
import { toast } from 'react-toastify'
import { globalLogout } from '../../context/UserContext'
import { getAccessToken, setAccessToken } from '../auth/accessTokenStore'
import { clearClientAuthStorage } from '../auth/clearClientSession'
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
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // refresh token cookie
})

/* ================= REQUEST ================= */
customAxios.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    // Get role from cookie first, then localStorage fallback
    const role = getCookie('role') || localStorage.getItem('role')
    if (role) {
      config.headers.role = role
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

    // 🔁 ACCESS TOKEN EXPIRED
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/user/refresh')
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
        const url = originalRequest.url || ''
        // /user/me is a session probe — do not logout/redirect from here
        if (!url.includes('/user/me')) {
          globalLogout()
        } else {
          clearClientAuthStorage()
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
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
      {
        email: values.email,
        password: values.password,
      },
      {
        withCredentials: true, // refreshToken in cookie
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

    // Keep role in client-visible storage so middleware and client agree
    // immediately after login (especially for Evaluator -> SubEvaluator mapping).
    if (assignedRole) {
      localStorage.setItem('role', assignedRole)
      document.cookie = `role=${assignedRole}; path=/`
    }

    // 🍪 Auth cookies are set by backend via Set-Cookie headers.
    if (data?.accessToken) {
      setAccessToken(data.accessToken)
    }
    toast.success(data?.message)

    switch (assignedRole) {
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
