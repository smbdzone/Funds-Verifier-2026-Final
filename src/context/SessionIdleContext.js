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
import {
  getSessionIdleRemainingMs,
  isSessionIdleExpired,
  SESSION_IDLE_TIMEOUT_MS,
  touchSessionIdle,
} from '@/utils/auth/sessionIdle'
import { UserContext } from './UserContext'

export function formatSessionIdleTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const ACTIVITY_THROTTLE_MS = 30 * 1000

const SessionIdleContext = createContext(null)

export function SessionIdleProvider({ children }) {
  const { isAuthenticated, logout, loading, user } = useContext(UserContext)
  const [remainingMs, setRemainingMs] = useState(SESSION_IDLE_TIMEOUT_MS)
  const expiredRef = useRef(false)
  const lastActivityRef = useRef(0)
  const userUuid = user?.uuid

  const handleSessionExpired = useCallback(async () => {
    if (expiredRef.current || !isAuthenticated) return
    expiredRef.current = true
    toast.info(
      'Your session ended after 10 minutes of inactivity. Please sign in again.',
      { autoClose: 5000 },
    )
    await logout()
  }, [isAuthenticated, logout])

  const syncRemaining = useCallback(() => {
    const remaining = getSessionIdleRemainingMs(userUuid)
    setRemainingMs(remaining)
    return remaining
  }, [userUuid])

  const checkExpiry = useCallback(() => {
    if (!userUuid) return false
    const remaining = syncRemaining()
    if (isSessionIdleExpired(userUuid) || remaining <= 0) {
      handleSessionExpired()
      return true
    }
    return false
  }, [handleSessionExpired, syncRemaining, userUuid])

  const recordActivity = useCallback(() => {
    if (!isAuthenticated || loading || expiredRef.current || !userUuid) return
    const now = Date.now()
    if (now - lastActivityRef.current < ACTIVITY_THROTTLE_MS) return
    lastActivityRef.current = now
    touchSessionIdle(userUuid)
    setRemainingMs(SESSION_IDLE_TIMEOUT_MS)
  }, [isAuthenticated, loading, userUuid])

  useEffect(() => {
    if (!isAuthenticated || loading || !userUuid) {
      if (!isAuthenticated) {
        expiredRef.current = false
        lastActivityRef.current = 0
      }
      return
    }

    expiredRef.current = false
    lastActivityRef.current = Date.now()

    if (checkExpiry()) return

    const activityEvents = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    const onActivity = () => recordActivity()

    const onWake = () => {
      checkExpiry()
    }

    const onPageHide = () => {
      touchSessionIdle(userUuid)
    }

    activityEvents.forEach((event) =>
      window.addEventListener(event, onActivity, { passive: true }),
    )
    document.addEventListener('visibilitychange', onWake)
    window.addEventListener('pageshow', onWake)
    window.addEventListener('focus', onWake)
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('beforeunload', onPageHide)

    syncRemaining()

    const intervalId = window.setInterval(() => {
      checkExpiry()
    }, 1000)

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, onActivity),
      )
      document.removeEventListener('visibilitychange', onWake)
      window.removeEventListener('pageshow', onWake)
      window.removeEventListener('focus', onWake)
      window.removeEventListener('pagehide', onPageHide)
      window.removeEventListener('beforeunload', onPageHide)
      window.clearInterval(intervalId)
    }
  }, [
    checkExpiry,
    isAuthenticated,
    loading,
    recordActivity,
    syncRemaining,
    userUuid,
  ])

  return (
    <SessionIdleContext.Provider
      value={{
        remainingMs,
        isReturning: false,
        isActive: isAuthenticated && !loading,
        idleTimeoutMs: SESSION_IDLE_TIMEOUT_MS,
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
