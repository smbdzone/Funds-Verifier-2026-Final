'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import customAxios, { login, refreshAccessToken } from '../utils/apis/apis'
import { toast } from 'react-toastify'
import { getCookie, getCookies } from 'cookies-next'
import {
  clearAccessToken,
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

  // Load user info from access token on app load
  const loadUserFromToken = async () => {
    try {
      // Ensure we have an accessToken in memory (Option 2)
      // If it's missing (e.g. page reload), use refreshToken cookie to obtain a new one.
      if (!accessToken) {
        const newToken = await refreshAccessToken()
        setAccessTokenState(newToken)
      }

      // Always try /me; this works with HttpOnly cookies in production.
      const response = await customAxios.get('/user/me', {
        withCredentials: true,
      })

      applyUser(response.data)
    } catch (error) {
      console.error('Error loading user:', error)
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

      // Clear any non-HttpOnly cookies (best-effort)
      document.cookie = 'accessToken=; Max-Age=-99999999; path=/'
      document.cookie = 'role=; Max-Age=-99999999; path=/'
      document.cookie = 'refreshToken=; Max-Age=-99999999; path=/'

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
