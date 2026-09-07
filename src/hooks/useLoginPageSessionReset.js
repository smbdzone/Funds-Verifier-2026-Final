'use client'

import { useEffect, useRef } from 'react'
import { useProfile } from '@/context/UserContext'
import { clearClientAuthStorage } from '@/utils/auth/clearClientSession'
import { isUaePassCallback } from '@/utils/auth/uaePass'

/**
 * Clear legacy client storage on sign-in pages. Does NOT call /user/logout
 * (that would wipe HttpOnly cookies set by a concurrent UAE Pass login).
 */
export function useLoginPageSessionReset() {
  const { user, loading, isAuthenticated } = useProfile()
  const ran = useRef(false)

  useEffect(() => {
    if (loading) return
    if (user || isAuthenticated) return
    if (isUaePassCallback()) return
    if (ran.current) return
    ran.current = true
    clearClientAuthStorage()
  }, [loading, user, isAuthenticated])
}
