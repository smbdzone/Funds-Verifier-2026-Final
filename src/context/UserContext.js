'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import customAxios, { login, refreshAccessToken } from '../utils/apis/apis'
import { toast } from 'react-toastify'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../utils/auth/accessTokenStore'
import {
  clearClientAuthStorage,
  endSession,
  isLoginPath,
} from '../utils/auth/clearClientSession'
import {
  clearSessionIdle,
  isSessionIdleExpired,
  touchSessionIdle,
} from '../utils/auth/sessionIdle'
import { getRoleHomeRoute } from '../utils/auth/roleHome'
import { getUserDisplayName } from '../utils/auth/userDisplayName'
import {
  isUaePassCallback,
  POST_LOGIN_BOOTSTRAP_KEY,
} from '../utils/auth/uaePass'
import { ensureCsrfToken } from '../utils/csrf'
import { loadFullPayDiscountPercent } from '../libs/paymentDiscount'
import { SessionIdleProvider } from './SessionIdleContext'

export let globalLogout = () => { }

export const UserContext = createContext()

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

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Store user details
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Auth state
  const [isSwitchingRole, setIsSwitchingRole] = useState(false)
  const [loading, setIsLoading] = useState(true)
  const [accessToken, setAccessTokenState] = useState(null)
  const router = useRouter()

  const applyUser = (userData) => {
    let finalRole = normalizeRole(userData.role)

    if (
      userData.role === 'Evaluator' &&
      (userData.parentEvaluator || userData.parentID)
    ) {
      finalRole = 'SubEvaluator'
    }

    setUser({
      ...userData,
      role: finalRole,
      displayName: getUserDisplayName(userData),
    })
    setIsAuthenticated(true)
  }

  /** Called after UAE Pass / store-user so context matches before full page redirect. */
  const applyUserFromLogin = (userData) => {
    if (!userData) return
    applyUser(userData)
    touchSessionIdle(userData.uuid)
    if (userData.accessToken) {
      setAccessToken(userData.accessToken)
      setAccessTokenState(userData.accessToken)
    }
  }

  // Load user on app start: /me via HttpOnly accessToken cookie first, refresh only if needed.
  const loadUserFromToken = async ({ freshLogin = false } = {}) => {
    const bootstrapToken =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(POST_LOGIN_BOOTSTRAP_KEY)
        : null
    const hadBootstrap = Boolean(bootstrapToken)
    if (bootstrapToken) {
      sessionStorage.removeItem(POST_LOGIN_BOOTSTRAP_KEY)
      setAccessToken(bootstrapToken)
      setAccessTokenState(bootstrapToken)
    }

    try {
      let response
      try {
        response = await customAxios.get('/user/me', {
          withCredentials: true,
        })
        // /me authenticates via the HttpOnly cookie and returns no JS token.
        // Warm the in-memory access token so client flows that must send a
        // Bearer (ad create → /api/stripe-advertisement, ad tracking) have one
        // after a fresh page load. Non-fatal if it fails.
        if (!getAccessToken()) {
          try {
            const warmToken = await refreshAccessToken()
            setAccessTokenState(warmToken)
          } catch (warmErr) {
            console.warn('Could not warm access token after /me', warmErr)
          }
        }
      } catch (meError) {
        if (meError.response?.status !== 401) throw meError
        const newToken = await refreshAccessToken()
        setAccessToken(newToken)
        setAccessTokenState(newToken)
        response = await customAxios.get('/user/me', {
          withCredentials: true,
        })
      }

      const userData = response.data

      if (isSessionIdleExpired(userData.uuid)) {
        await endSession({ callBackend: true })
        setUser(null)
        setIsAuthenticated(false)
        setAccessTokenState(null)
        clearAccessToken()
        clearSessionIdle()
        toast.info(
          'Your session ended after 10 minutes of inactivity. Please sign in again.',
          { autoClose: 5000 },
        )
        if (
          typeof window !== 'undefined' &&
          !isLoginPath(window.location.pathname)
        ) {
          window.location.replace('/login')
        }
        return
      }

      applyUser(userData)
      if (freshLogin || hadBootstrap) {
        touchSessionIdle(userData.uuid)
      }
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken)
        setAccessTokenState(response.data.accessToken)
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error loading user:', error)
      }
      setUser(null)
      setIsAuthenticated(false)
      setAccessTokenState(null)
      clearAccessToken()
      // Do not call /user/logout on failed /me — that deletes cookies (see UAE Pass login).
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    ensureCsrfToken().catch(() => { })
    loadFullPayDiscountPercent().catch(() => { })
  }, [])

  useEffect(() => {
    if (isUaePassCallback()) {
      setIsLoading(false)
      return
    }
    loadUserFromToken()
  }, [])
  useEffect(() => {
    router.prefetch('/profile')
    router.prefetch('/seller-profile')
  }, [])

  // Login function
  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials, router)
      const token = result?.accessToken
      console.log(token, 'token tokennn')

      if (token) {
        setAccessToken(token)
        setAccessTokenState(token)
      }
      await loadUserFromToken({ freshLogin: true })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      clearSessionIdle()
      await endSession({ callBackend: true })

      setUser(null)
      setIsAuthenticated(false)
      setAccessTokenState(null)

      if (
        typeof window !== 'undefined' &&
        !isLoginPath(window.location.pathname)
      ) {
        window.location.replace('/login')
      }
    } catch (err) {
      console.error('Logout failed:', err)
      clearSessionIdle()
      clearClientAuthStorage()
      setUser(null)
      setIsAuthenticated(false)
      setAccessTokenState(null)
      if (
        typeof window !== 'undefined' &&
        !isLoginPath(window.location.pathname)
      ) {
        window.location.replace('/login')
      }
    }
  }
  globalLogout = logout

  // Refresh token
  const fetchProfile = async () => {
    try {
      await loadUserFromToken()
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
  }
  //   const switchUserRole = async (role) => {
  //     try {
  //       setIsSwitchingRole(true)
  // if (user) {
  //   const response = await customAxios.put(
  //     `${process.env.NEXT_PUBLIC_BASE_URL}/user/switch-user/${user?.uuid}`,
  //     { role }
  //   )
  // console.log(response);

  //   if (response.status === 200) {
  //     const { accessToken, user: updatedUser } = response.data

  //     // 🔥 Clear old user immediately (fixes multi-click bug)
  //     setUser(null)

  //     // Set cookies instantly
  //     setCookie('role', role, { maxAge: 3 * 24 * 60 * 60 })
  //     setCookie('accessToken', accessToken, { maxAge: 3 * 24 * 60 * 60 })
  //     localStorage.setItem('accessToken', updatedUser.accessToken)
  //     localStorage.setItem('role', updatedUser.role)
  //     localStorage.setItem('userUUID', updatedUser.uuid)
  //     // Update axios header (optional)
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

  //     // 🔥 Redirect instantly — do NOT wait for profile reload
  //     const targetRoute =
  //       role === 'DealHunter' ? '/profile' : '/seller-profile'

  //     router.replace(targetRoute)

  //     // ⚡ Load profile in the background (no await)
  //     fetchProfile()
  //   } else {
  //     console.error('Failed to switch role:', response)
  //   }
  // }

  //     } catch (error) {
  //       console.error('Error switching role:', error)
  //     } finally {
  //       setIsSwitchingRole(false)
  //     }
  //   }
  const switchUserRole = async (newRole) => {
    if (!user) return

    const userUuid = user.uuid
    if (!userUuid) {
      toast.error('Unable to switch role. Please sign out and sign in again.')
      return
    }

    try {
      setIsSwitchingRole(true)

      const response = await customAxios.put(
        `/user/switch-user/${userUuid}`,
        { role: newRole },
        { withCredentials: true },
      )

      const { user: updatedUser, accessToken } = response.data || {}

      if (accessToken) {
        setAccessToken(accessToken)
        setAccessTokenState(accessToken)
      }

      if (updatedUser) {
        applyUser(updatedUser)
      }

      const finalRole = normalizeRole(updatedUser?.role || newRole)
      toast.success(`Switched role to ${finalRole}`)

      window.location.href = getRoleHomeRoute(finalRole)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong while switching role'
      console.error('Error switching role:', error.response?.data || error)
      toast.error(message)
    } finally {
      setIsSwitchingRole(false)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        accessToken,
        login: handleLogin,
        logout,
        fetchProfile,
        applyUserFromLogin,
        switchUserRole,
        isSwitchingRole,
        loading,
        setIsLoading,
      }}
    >
      <SessionIdleProvider>{children}</SessionIdleProvider>
    </UserContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useProfile must be used within a user Provider')
  }
  return context
}
