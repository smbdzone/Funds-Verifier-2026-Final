'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import { UserContext } from './UserContext'

const IDLE_TIMEOUT_MS = 10 * 60 * 1000
const RESET_DELAY_MS = 2500
const DEADLINE_KEY = 'fv.session.idleDeadline'
const EXPIRED_KEY = 'fv.session.expired'

export function formatSessionIdleTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const SessionIdleContext = createContext(null)

export function SessionIdleProvider({ children }) {
  const { isAuthenticated, logout, loading } = useContext(UserContext)
  const [remainingMs, setRemainingMs] = useState(IDLE_TIMEOUT_MS)
  const [isReturning, setIsReturning] = useState(false)
  const returningRef = useRef(false)
  const resetTimerRef = useRef(null)
  const expiredRef = useRef(false)

  const clearIdleStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(DEADLINE_KEY)
    localStorage.removeItem(EXPIRED_KEY)
  }, [])

  const getDeadline = useCallback(() => {
    if (typeof window === 'undefined') return 0
    return Number(localStorage.getItem(DEADLINE_KEY) || 0)
  }, [])

  const ensureDeadline = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(DEADLINE_KEY)) {
      localStorage.setItem(
        DEADLINE_KEY,
        String(Date.now() + IDLE_TIMEOUT_MS),
      )
    }
  }, [])

  const getRemainingFromStorage = useCallback(() => {
    const deadline = getDeadline()
    if (!deadline) return IDLE_TIMEOUT_MS
    return Math.max(0, deadline - Date.now())
  }, [getDeadline])

  const handleSessionExpired = useCallback(async () => {
    if (expiredRef.current || !isAuthenticated) return
    expiredRef.current = true
    clearIdleStorage()
    toast.info(
      'Your session ended after 10 minutes away. Please sign in again.',
      { autoClose: 5000 },
    )
    await logout()
  }, [clearIdleStorage, isAuthenticated, logout])

  const scheduleResetAfterReturn = useCallback(() => {
    returningRef.current = true
    setIsReturning(true)
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => {
      clearIdleStorage()
      setRemainingMs(IDLE_TIMEOUT_MS)
      setIsReturning(false)
      returningRef.current = false
    }, RESET_DELAY_MS)
  }, [clearIdleStorage])

  const handleVisible = useCallback(() => {
    if (typeof window === 'undefined') return

    if (localStorage.getItem(EXPIRED_KEY) === '1') {
      handleSessionExpired()
      return
    }

    const deadline = getDeadline()
    if (!deadline) {
      setRemainingMs(IDLE_TIMEOUT_MS)
      return
    }

    const remaining = deadline - Date.now()
    if (remaining <= 0) {
      localStorage.setItem(EXPIRED_KEY, '1')
      handleSessionExpired()
      return
    }

    setRemainingMs(remaining)
    scheduleResetAfterReturn()
  }, [getDeadline, handleSessionExpired, scheduleResetAfterReturn])

  const handleHidden = useCallback(() => {
    ensureDeadline()
    setRemainingMs(getRemainingFromStorage())
  }, [ensureDeadline, getRemainingFromStorage])

  useEffect(() => {
    if (!isAuthenticated || loading) {
      clearIdleStorage()
      setRemainingMs(IDLE_TIMEOUT_MS)
      setIsReturning(false)
      returningRef.current = false
      expiredRef.current = false
      return
    }

    expiredRef.current = false

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleHidden()
      } else {
        handleVisible()
      }
    }

    const onStorage = (event) => {
      if (event.key === EXPIRED_KEY && event.newValue === '1') {
        handleSessionExpired()
      }
    }

    const tick = () => {
      if (localStorage.getItem(EXPIRED_KEY) === '1') {
        handleSessionExpired()
        return
      }

      if (document.visibilityState === 'visible') {
        if (returningRef.current) {
          setRemainingMs(getRemainingFromStorage())
          return
        }
        clearIdleStorage()
        setRemainingMs(IDLE_TIMEOUT_MS)
        return
      }

      ensureDeadline()
      const remaining = getRemainingFromStorage()
      setRemainingMs(remaining)
      if (remaining <= 0) {
        localStorage.setItem(EXPIRED_KEY, '1')
        handleSessionExpired()
      }
    }

    if (document.visibilityState === 'visible') {
      setRemainingMs(IDLE_TIMEOUT_MS)
    } else {
      handleHidden()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('storage', onStorage)
    const intervalId = window.setInterval(tick, 1000)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('storage', onStorage)
      window.clearInterval(intervalId)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [
    clearIdleStorage,
    ensureDeadline,
    getRemainingFromStorage,
    handleHidden,
    handleSessionExpired,
    handleVisible,
    isAuthenticated,
    loading,
  ])

  return (
    <SessionIdleContext.Provider
      value={{
        remainingMs,
        isReturning,
        isActive: isAuthenticated && !loading,
        idleTimeoutMs: IDLE_TIMEOUT_MS,
      }}
    >
      {children}
    </SessionIdleContext.Provider>
  )
}

export function useSessionIdle() {
  const context = useContext(SessionIdleContext)
  if (!context) {
    throw new Error('useSessionIdle must be used within SessionIdleProvider')
  }
  return context
}
