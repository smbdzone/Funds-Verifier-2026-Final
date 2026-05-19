'use client'

import { useEffect, useRef } from 'react'
import { endSession } from '@/utils/auth/clearClientSession'

/**
 * On sign-in pages, clear stale cookies/storage once so a new login
 * does not conflict with an expired session (no manual DevTools clear).
 */
export function useLoginPageSessionReset() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    endSession({ callBackend: true })
  }, [])
}
