'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import customAxios, { login, refreshAccessToken } from '../utils/apis/apis'
import { toast } from 'react-toastify'
import {
  clearAccessToken,
  setAccessToken,
} from '../utils/auth/accessTokenStore'
import {
  clearClientAuthStorage,
  endSession,
  isLoginPath,
} from '../utils/auth/clearClientSession'
import { getRoleHomeRoute } from '../utils/auth/roleHome'
import {
  isUaePassCallback,
  POST_LOGIN_BOOTSTRAP_KEY,
} from '../utils/auth/uaePass'

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

    setUser({ ...userData, role: finalRole })
    setIsAuthenticated(true)
  }

  /** Called after UAE Pass / store-user so context matches before full page redirect. */
  const applyUserFromLogin = (userData) => {
    if (!userData) return
    applyUser(userData)
    if (userData.accessToken) {
      setAccessToken(userData.accessToken)
      setAccessTokenState(userData.accessToken)
    }
  }

  // Load user on app start: /me via HttpOnly accessToken cookie first, refresh only if needed.
  const loadUserFromToken = async () => {
    const bootstrapToken =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(POST_LOGIN_BOOTSTRAP_KEY)
        : null
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
      } catch (meError) {
        if (meError.response?.status !== 401) throw meError
        const newToken = await refreshAccessToken()
        setAccessToken(newToken)
        setAccessTokenState(newToken)
        response = await customAxios.get('/user/me', {
          withCredentials: true,
        })
      }

      applyUser(response.data)
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
      await loadUserFromToken() // Refresh user info after login
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
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
