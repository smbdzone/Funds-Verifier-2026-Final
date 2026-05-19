'use client'

import { useEffect, useRef } from 'react'
import { useProfile } from '@/context/UserContext'
import { endSession } from '@/utils/auth/clearClientSession'

/**
 * Clear stale cookies/storage on sign-in pages only when the user is not logged in.
 */
export function useLoginPageSessionReset() {
  const { user, loading, isAuthenticated } = useProfile()
  const ran = useRef(false)

  useEffect(() => {
    if (loading) return
    if (user || isAuthenticated) return
    if (ran.current) return
    ran.current = true
    endSession({ callBackend: true })
  }, [loading, user, isAuthenticated])
}
