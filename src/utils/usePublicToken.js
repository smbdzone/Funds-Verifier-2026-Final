'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

export function usePublicToken() {
  const [token, setToken] = useState('')
  const timer = useRef(null)

  const fetchToken = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/public/get-public-token`
    )

    const t = res?.data.token
    setToken(t)

    const { exp } = JSON.parse(atob(t.split('.')[1]))
    const delay = exp * 1000 - Date.now() - 30000
    timer.current = setTimeout(fetchToken, delay)
  }

  useEffect(() => {
    fetchToken()
    return () => clearTimeout(timer.current)
  }, [])

  return token
}
