/**
 * Custom Hook: useNotificationSocket
 * Manages Socket.IO connection for real-time notifications
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { createSocket } from '../utils/socket'
import { getAccessToken } from '../utils/auth/accessTokenStore'

/**
 * Hook to manage notification socket connection
 * @param {Object} user - User object with uuid, role, etc.
 * @param {Function} onReconnect - Callback function called when socket reconnects
 * @returns {Object} - { socket, isConnected, isConnecting, connect, disconnect }
 */
export const useNotificationSocket = (user, onReconnect = null) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0)
  const socketRef = useRef(null)
  const wasConnectedRef = useRef(false)
  const isConnectingRef = useRef(false) // Track connection state with ref to avoid dependency issues
  const onReconnectRef = useRef(onReconnect) // Store onReconnect in ref to avoid dependency issues

  // Update ref when onReconnect changes
  useEffect(() => {
    onReconnectRef.current = onReconnect
  }, [onReconnect])

  /**
   * Connect to socket server
   */
  const connect = useCallback(() => {
    // Don't connect if already connected or connecting
    if (socketRef.current?.connected || isConnectingRef.current) {
      console.log('Socket already connected or connecting, skipping...')
      return
    }

    // Don't connect if user is not authenticated
    if (!user?.uuid) {
      console.log('Cannot connect socket: User not authenticated')
      return
    }

    // Don't connect if token is missing
    const token = typeof window !== 'undefined' ? getAccessToken() : null
    if (!token) {
      console.log('Cannot connect socket: No token found')
      return
    }

    // If socket exists but not connected, disconnect it first
    if (socketRef.current) {
      if (socketRef.current.connected) {
        console.log('Socket already connected, skipping new connection')
        return
      }
      console.log('Cleaning up existing disconnected socket...')
      socketRef.current.removeAllListeners()
      socketRef.current.disconnect()
      socketRef.current = null
    }

    isConnectingRef.current = true
    setIsConnecting(true)

    try {
      // Create new socket instance
      const socket = createSocket()

      if (!socket) {
        isConnectingRef.current = false
        setIsConnecting(false)
        return
      }

      // Connection event handlers
      socket.on('connect', () => {
        console.log('Socket connected')
        const wasDisconnected = wasConnectedRef.current && !isConnected
        isConnectingRef.current = false
        setIsConnected(true)
        setIsConnecting(false)
        setReconnectionAttempts(0)

        // If this is a reconnection (was connected before), trigger callback
        if (wasDisconnected && onReconnectRef.current && typeof onReconnectRef.current === 'function') {
          console.log('Socket reconnected, triggering refresh callback')
          onReconnectRef.current()
        }

        wasConnectedRef.current = true
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason)
        isConnectingRef.current = false
        setIsConnected(false)
        setIsConnecting(false)
        
        // Track reconnection attempts for server-initiated disconnects
        if (reason === 'io server disconnect') {
          // Server disconnected, might need to reconnect manually
          console.log('Server disconnected socket')
        }
      })

      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}`)
        setReconnectionAttempts(attemptNumber)
      })

      socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after all attempts')
        isConnectingRef.current = false
        setIsConnecting(false)
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message)
        isConnectingRef.current = false
        setIsConnecting(false)
        setIsConnected(false)
      })

      socket.on('connection:success', (data) => {
        console.log('Socket connection confirmed:', data)
        isConnectingRef.current = false
        setIsConnected(true)
        setIsConnecting(false)
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      // Connect the socket
      socket.connect()

      socketRef.current = socket
    } catch (error) {
      console.error('Error creating socket:', error)
      isConnectingRef.current = false
      setIsConnecting(false)
      setIsConnected(false)
    }
  }, [user?.uuid]) // Removed onReconnect from dependencies, using ref instead

  /**
   * Disconnect from socket server
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('Disconnecting socket...')
      isConnectingRef.current = false
      socketRef.current.removeAllListeners() // Remove all event listeners
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
      setIsConnecting(false)
      wasConnectedRef.current = false
    }
  }, [])

  /**
   * Connect when user is authenticated
   */
  useEffect(() => {
    const currentUserUUID = user?.uuid
    
    // Only connect/disconnect when user UUID actually changes
    if (currentUserUUID) {
      // Only connect if not already connected or connecting
      if (!socketRef.current?.connected && !isConnectingRef.current) {
        console.log('Connecting socket for user:', currentUserUUID)
        connect()
      }
    } else {
      // User logged out, disconnect
      disconnect()
    }

    // Cleanup on unmount or when user changes
    return () => {
      // Disconnect when user UUID changes or component unmounts
      const cleanupUserUUID = user?.uuid
      if (!cleanupUserUUID || cleanupUserUUID !== currentUserUUID) {
        console.log('Cleaning up socket connection')
        disconnect()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid]) // Only depend on user?.uuid, connect/disconnect are stable

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  }
}

export default useNotificationSocket

