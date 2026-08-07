'use client'
import axios from 'axios'
import { usePublicTokenContext } from './PublicTokenProvider.'
import { getAccessToken } from './auth/accessTokenStore'
import { getCsrfHeaders } from './csrf'
import { getPublicToken } from '@/libs/publicApiClient'

const SAFE_HTTP_METHODS = new Set(['get', 'head', 'options'])

export function useSecureAxios() {
  const publicToken = usePublicTokenContext()

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    withCredentials: true,
  })

  api.interceptors.request.use(async (config) => {
    const method = String(config?.method || 'get').toLowerCase()
    if (!SAFE_HTTP_METHODS.has(method)) {
      const csrfHeaders = await getCsrfHeaders()
      Object.assign(config.headers, csrfHeaders)
    }

    const accessToken = typeof window !== 'undefined' ? getAccessToken() : null

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      delete config.headers['x-public-token']
    } else if (publicToken) {
      config.headers['x-public-token'] = publicToken
    } else {
      try {
        config.headers['x-public-token'] = await getPublicToken()
      } catch {
        delete config.headers['x-public-token']
      }
    }

    return config
  })

  return api
}
