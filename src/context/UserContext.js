'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import customAxios, { login, refreshAccessToken } from '../utils/apis/apis'
import { toast } from 'react-toastify'
import { getCookie, getCookies } from 'cookies-next'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../utils/auth/accessTokenStore'
// ADD AT TOP
export let globalLogout = () => {}

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

    // ⚠️ TEMPORARY: Update role cookie if transformed (Evaluator -> SubEvaluator)
    // TODO: Backend /me endpoint should set role cookie, then remove this
    if (finalRole !== userData.role) {
      document.cookie = `role=${finalRole}; path=/`
    }

    setUser({ ...userData, role: finalRole })
    setIsAuthenticated(true)
  }

  // Load user on app start: /me via HttpOnly accessToken cookie first, refresh only if needed.
  const loadUserFromToken = async () => {
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
        setAccessTokenState(newToken)
        response = await customAxios.get('/user/me', {
          withCredentials: true,
        })
      }

      applyUser(response.data)
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error loading user:', error)
      }
      setUser(null)
      setIsAuthenticated(false)
      setAccessTokenState(null)
      clearAccessToken()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserFromToken()
    // fetchProfile()
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
      await loadUserFromToken() // Refresh user info after login
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      // Ask backend to clear HttpOnly cookies (refreshToken/accessToken/role)
      // Do this first so the response Set-Cookie can land before redirect.
      await customAxios.get('/user/logout', { withCredentials: true })

      // Clear localStorage (legacy cleanup - token now in cookies)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('role')

      // Auth cookies are HttpOnly — only the backend logout Set-Cookie can remove them.
      // Do not set accessToken=; path=/ here; that leaves empty duplicate cookies in DevTools.

      // Clear any app state (e.g., Context or useState)
      setUser(null)
      setIsAuthenticated(false)
      setAccessTokenState(null)
      clearAccessToken()

      // Hard redirect (ensures full cleanup)
      // window.location.replace('/login')
      const isPublicLoginPath = ['/login', '/user-login'].includes(
        window.location.pathname,
      )
      if (!isPublicLoginPath) {
        window.location.replace('/login')
      }

      // This can be done asynchronously without blocking the redirect
      // fetch('/api/auth/logout', { method: 'GET' }).catch(console.error)
    } catch (err) {
      console.error('Logout failed:', err)
      // Fallback: redirect to home even if there's an error
      router.replace('/')
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

    try {
      setIsSwitchingRole(true)

      // 1️⃣ Call backend to switch role
      const response = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/switch-user/${user.uuid}`,
        { role: newRole },
        { withCredentials: true }, // Important for refreshToken cookie
      )

      if (response.status === 200) {
        const { user: updatedUser, accessToken } = response.data

        // 2️⃣ Update client state (role comes from /me response via applyUser)
        setUser({ ...updatedUser, role: updatedUser.role })

        // 🍪 Cookies are set by backend via Set-Cookie headers
        // Frontend should NOT set cookies - backend handles it for security

        toast.success(`Switched role to ${updatedUser.role}`)

        // 4️⃣ Redirect using full page reload
        const targetRoute =
          normalizeRole(updatedUser.role) === 'DealHunter'
            ? '/profile'
            : '/seller-profile'

        // Use full reload so middleware sees new cookies
        window.location.href = targetRoute
      } else {
        console.error('Failed to switch role:', response)
        toast.error('Could not switch role')
      }
    } catch (error) {
      console.error('Error switching role:', error)
      toast.error('Something went wrong while switching role')
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
        switchUserRole,
        isSwitchingRole,
        loading,
        setIsLoading,
      }}
    >
      {children}
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
