'use client'
import axios from 'axios'
import { usePublicTokenContext } from './PublicTokenProvider.'
import { getAccessToken } from './auth/accessTokenStore'

export function useSecureAxios() {
  const publicToken = usePublicTokenContext()

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  })

  api.interceptors.request.use((config) => {
    const accessToken = typeof window !== 'undefined' ? getAccessToken() : null

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      delete config.headers['x-public-token']
    } else if (publicToken) {
      config.headers['x-public-token'] = publicToken
    }

    return config
  })

  return api
}
