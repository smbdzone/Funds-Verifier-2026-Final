'use client'
import { Fragment, useEffect, useState, useRef, useCallback } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { NotificationIcon } from '../Icons'
import axios from 'axios'
import { useProfile } from '@/context/UserContext'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'react-toastify'
import { usePathname, useRouter } from 'next/navigation'
import customAxios from '../../utils/apis/apis'
import { useNotificationSocket } from '@/hooks/useNotificationSocket'

const NotificationDropdown = ({ className }) => {
  const { user } = useProfile()
  const router = useRouter()
  const pathname = usePathname()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const lastFetchTimeRef = useRef(Date.now())

  // Socket connection for real-time notifications with reconnection callback
  const handleReconnect = useCallback(() => {
    console.log('Socket reconnected, refreshing notifications...')
    // Use a small delay to ensure socket is fully ready
    setTimeout(() => {
      fetchNotifications()
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid]) // fetchNotifications is stable, no need to include it

  const { socket, isConnected, isConnecting } = useNotificationSocket(user, handleReconnect)

  let role

  const fetchNotifications = async () => {
    if (!user?.uuid) return
    if (user?.parentEvaluator) {
      role = 'SubEvaluator'
    } else {
      role = user?.role
    }

    try {
      const { data } = await customAxios.get(
        `/notifications/role/${role}?limit=50`
      )

      if (data?.success && Array.isArray(data?.notifications)) {
        // Merge with existing notifications (deduplicate by UUID)
        setNotifications((prev) => {
          const notificationMap = new Map()

          // Add existing notifications to map
          prev.forEach((n) => {
            if (n?.uuid) {
              notificationMap.set(n.uuid, n)
            }
          })

          // Add/update with new notifications (newer ones take precedence)
          data.notifications.forEach((n) => {
            if (n?.uuid) {
              const existing = notificationMap.get(n.uuid)
              // Keep the newer version (compare timestamps if available)
              if (!existing || (n.updatedAt && existing.updatedAt && new Date(n.updatedAt) > new Date(existing.updatedAt))) {
                notificationMap.set(n.uuid, n)
              }
            }
          })

          // Convert map back to array and sort by creation time (newest first)
          return Array.from(notificationMap.values()).sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return timeB - timeA
          })
        })

        lastFetchTimeRef.current = Date.now()
      } else {
        setNotifications([])
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    // Optimistic update
    const previousState = [...notifications]
    setNotifications((prev) =>
      prev.map((n) => (n.uuid === id ? { ...n, isRead: true } : n))
    )

    // Try socket first if connected
    if (socket && isConnected) {
      try {
        socket.emit('notification:markRead', { uuid: id }, (response) => {
          if (response?.success) {
            // Success - state already updated optimistically
            // The socket event will trigger handleReadNotification to sync
            console.log('Notification marked as read via socket')
          } else {
            // Revert optimistic update on error
            setNotifications(previousState)
            toast.error(response?.message || 'Failed to mark as read')
          }
        })
        return
      } catch (err) {
        console.error('Socket error marking as read:', err)
        // Fall through to REST API fallback
      }
    }

    // Fallback to REST API if socket not available
    try {
      const response = await customAxios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${id}/read`
      )
      if (response?.data?.link) {
        router.push(response?.data?.link || pathname)
      }
    } catch (err) {
      // Revert optimistic update on error
      setNotifications(previousState)
      console.warn('Failed to mark as read')
      toast.error('Failed to mark notification as read')
    }
  }

  const deleteNotification = async (id) => {
    // Optimistic update
    const previousState = [...notifications]
    setNotifications((prev) => prev.filter((n) => n?.uuid !== id))

    // Try socket first if connected
    if (socket && isConnected) {
      try {
        socket.emit('notification:delete', { uuid: id }, (response) => {
          if (response?.success) {
            // Success - state already updated optimistically
            // The socket event will trigger handleDeletedNotification to sync
            console.log('Notification deleted via socket')
          } else {
            // Revert optimistic update on error
            setNotifications(previousState)
            toast.error(response?.message || 'Failed to delete notification')
          }
        })
        return
      } catch (err) {
        console.error('Socket error deleting notification:', err)
        // Fall through to REST API fallback
      }
    }

    // Fallback to REST API if socket not available
    try {
      await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${id}`
      )
    } catch (err) {
      // Revert optimistic update on error
      setNotifications(previousState)
      toast.error(
        err?.response?.data?.message ||
        'Failed to delete or notification not found.'
      )
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications()
  }, [user?.uuid])

  // Periodic sync every 5 minutes to prevent stale state
  useEffect(() => {
    if (!user?.uuid) return

    const syncInterval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current
      // Only sync if it's been more than 4.5 minutes (to avoid race conditions)
      if (timeSinceLastFetch > 4.5 * 60 * 1000) {
        console.log('Periodic sync: Fetching latest notifications...')
        fetchNotifications()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(syncInterval)
  }, [user?.uuid])

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) {
      return
    }

    // Handle new notification
    const handleNewNotification = (eventData) => {
      const newNotification = eventData?.data
      if (!newNotification || !newNotification.uuid) {
        return
      }

      // Check if notification already exists (deduplication)
      setNotifications((prev) => {
        const exists = prev.some((n) => n.uuid === newNotification.uuid)
        if (exists) {
          // Update existing notification instead of adding duplicate
          return prev.map((n) =>
            n.uuid === newNotification.uuid ? newNotification : n
          )
        }
        // Prepend new notification to the list
        return [newNotification, ...prev]
      })

      // Optional: Show toast or play sound for new notification
      // toast.info(newNotification.title)
    }

    // Handle notification marked as read
    const handleReadNotification = (eventData) => {
      const { uuid, isRead } = eventData?.data || {}
      if (!uuid) {
        return
      }

      setNotifications((prev) =>
        prev.map((n) => (n.uuid === uuid ? { ...n, isRead: isRead ?? true } : n))
      )
    }

    // Handle deleted notification
    const handleDeletedNotification = (eventData) => {
      const { uuid } = eventData?.data || {}
      if (!uuid) {
        return
      }

      setNotifications((prev) => prev.filter((n) => n.uuid !== uuid))
    }

    // Handle socket errors
    const handleError = (error) => {
      console.error('Socket error in notifications:', error)
      toast.error('Connection error. Please refresh the page.')
    }

    // Register event listeners
    socket.on('notification:new', handleNewNotification)
    socket.on('notification:read', handleReadNotification)
    socket.on('notification:deleted', handleDeletedNotification)
    socket.on('error', handleError)

    // Cleanup: Remove all event listeners on unmount or when socket changes
    return () => {
      socket.off('notification:new', handleNewNotification)
      socket.off('notification:read', handleReadNotification)
      socket.off('notification:deleted', handleDeletedNotification)
      socket.off('error', handleError)
    }
  }, [socket, isConnected])

  return (
    <Menu as='div' className='relative text-left z-100'>
      <Menu.Button className='btn !min-w-max flex items-center gap-2'>
        <NotificationIcon className={`${className || 'text-dark-blue'}`} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute z-50 right-0 w-[300px] bg-white custom-shadow rounded-lg'>
          <div className='pt-4 px-6 rounded-t sticky top-0 bg-white left-0 border-b border-gray-300 pb-2 flex items-center justify-between'>
            <p className='text-sm font-semibold'>Notifications</p>
            {isConnecting && (
              <span className='text-xs text-blue-500 flex items-center gap-1'>
                <Loader2Icon className='w-3 h-3 animate-spin' />
                Connecting...
              </span>
            )}
            {!isConnected && !isConnecting && (
              <span className='text-xs text-gray-400'>Offline</span>
            )}
            {isConnected && (
              <span className='text-xs text-green-500'>●</span>
            )}
          </div>
          <div className='p-4 pb-2 max-h-[300px] overflow-y-auto'>
            {loading ? (
              <p className='text-xs flex justify-center items-center text-gray-400 h-32'>
                <Loader2Icon className='animate-spin' />
              </p>
            ) : notifications?.length === 0 ? (
              <p className='text-xs flex justify-center items-center text-gray-400 h-32'>
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification?.uuid}
                  className={`mb-2 p-2 rounded ${notification?.isRead ? '' : 'bg-gray-3'
                    }`}
                >
                  <p
                    className='text-sm font-medium cursor-pointer'
                    onClick={() => markAsRead(notification?.uuid)}
                  >
                    {notification?.title}
                  </p>
                  {notification?.message && (
                    <p className='text-xs text-gray-600'>
                      {notification?.message}
                    </p>
                  )}
                  <button
                    onClick={() => deleteNotification(notification?.uuid)}
                    className='text-xs text-red-500 mt-1'
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default NotificationDropdown

