/**
 * Socket.IO Client Utility
 * Creates and manages Socket.IO client instance
 */

import { io } from 'socket.io-client'
import { getAccessToken } from './auth/accessTokenStore'

/**
 * Get the socket server URL from environment variable
 * Removes /api suffix if present since socket connects to root
 */
const getSocketURL = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseURL) {
    console.error('NEXT_PUBLIC_BASE_URL is not defined')
    return null
  }

  // Remove /api suffix if present (socket connects to root, not /api)
  return baseURL.replace(/\/api\/?$/, '')
}

/**
 * Get JWT token from cookies (with localStorage fallback)
 */
const getToken = () => {
  if (typeof window === 'undefined') return null
  return getAccessToken()
}

/**
 * Create a new Socket.IO client instance
 * @param {Object} options - Socket connection options
 * @returns {Socket|null} - Socket instance or null if URL is invalid
 */
export const createSocket = (options = {}) => {
  const socketURL = getSocketURL()
  if (!socketURL) {
    console.error('Cannot create socket: Base URL not configured')
    return null
  }

  const token = getToken()
  if (!token) {
    console.warn('Cannot create socket: No token found')
    return null
  }

  const socket = io(socketURL, {
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    autoConnect: false, // Manual connection control
    ...options,
  })

  return socket
}

export default { createSocket, getSocketURL, getToken }

