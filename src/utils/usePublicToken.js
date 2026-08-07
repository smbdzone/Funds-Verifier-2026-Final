'use client'
import { useEffect, useRef, useState } from 'react'
import { getPublicToken } from '@/libs/publicApiClient'

export function usePublicToken() {
  const [token, setToken] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    let cancelled = false

    const scheduleRefresh = async () => {
      try {
        const nextToken = await getPublicToken()
        if (cancelled) return
        setToken(nextToken)

        try {
          const { exp } = JSON.parse(atob(nextToken.split('.')[1]))
          const delay = Math.max(exp * 1000 - Date.now() - 30_000, 15_000)
          timer.current = setTimeout(scheduleRefresh, delay)
        } catch {
          timer.current = setTimeout(scheduleRefresh, 4 * 60 * 1000)
        }
      } catch (error) {
        console.error('Failed to load public token', error)
        if (!cancelled) {
          timer.current = setTimeout(scheduleRefresh, 30_000)
        }
      }
    }

    scheduleRefresh()

    return () => {
      cancelled = true
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return token
}
