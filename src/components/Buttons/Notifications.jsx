'use client'
import { Fragment, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { NotificationIcon } from '../Icons'
import { useProfile } from '@/context/UserContext'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'react-toastify'
import { usePathname, useRouter } from 'next/navigation'
import customAxios from '../../utils/apis/apis'
import { useNotificationSocket } from '@/hooks/useNotificationSocket'
import { formatNotificationTimestamp } from '@/utils/formatNotificationTimestamp'
import { getAccessToken } from '@/utils/auth/accessTokenStore'

function resolveUserNotificationRole(user) {
  if (user?.parentEvaluator) return 'SubEvaluator'
  return user?.role
}

const NotificationDropdown = ({ className }) => {
  const { user } = useProfile()
  const router = useRouter()
  const pathname = usePathname()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const lastFetchTimeRef = useRef(Date.now())

  const role = resolveUserNotificationRole(user)

  const unreadCount = useMemo(
    () => notifications.filter((n) => n && !n.isRead).length,
    [notifications],
  )

  const handleReconnect = useCallback(() => {
    setTimeout(() => {
      fetchNotifications()
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid])

  const { socket, isConnected, isConnecting } = useNotificationSocket(
    user,
    handleReconnect,
  )

  const fetchNotifications = async () => {
    if (!user?.uuid) return
    const fetchRole = resolveUserNotificationRole(user)

    try {
      const { data } = await customAxios.get(
        `/notifications/role/${fetchRole}?limit=50`,
      )

      if (data?.success && Array.isArray(data?.notifications)) {
        setNotifications((prev) => {
          const notificationMap = new Map()

          prev.forEach((n) => {
            if (n?.uuid) notificationMap.set(n.uuid, n)
          })

          data.notifications.forEach((n) => {
            if (n?.uuid) {
              const existing = notificationMap.get(n.uuid)
              if (
                !existing ||
                (n.updatedAt &&
                  existing.updatedAt &&
                  new Date(n.updatedAt) > new Date(existing.updatedAt))
              ) {
                notificationMap.set(n.uuid, n)
              }
            }
          })

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
    const previousState = [...notifications]
    setNotifications((prev) =>
      prev.map((n) => (n.uuid === id ? { ...n, isRead: true } : n)),
    )

    if (socket && isConnected) {
      try {
        socket.emit('notification:markRead', { uuid: id }, (response) => {
          if (!response?.success) {
            setNotifications(previousState)
            toast.error(response?.message || 'Failed to mark as read')
          }
        })
        return
      } catch (err) {
        console.error('Socket error marking as read:', err)
      }
    }

    try {
      const response = await customAxios.patch(`/notifications/${id}/read`)
      if (response?.data?.link) {
        router.push(response?.data?.link || pathname)
      }
    } catch (err) {
      setNotifications(previousState)
      toast.error('Failed to mark notification as read')
    }
  }

  const deleteNotification = async (id) => {
    const previousState = [...notifications]
    setNotifications((prev) => prev.filter((n) => n?.uuid !== id))

    if (socket && isConnected) {
      try {
        socket.emit('notification:delete', { uuid: id }, (response) => {
          if (!response?.success) {
            setNotifications(previousState)
            toast.error(response?.message || 'Failed to delete notification')
          }
        })
        return
      } catch (err) {
        console.error('Socket error deleting notification:', err)
      }
    }

    try {
      await customAxios.delete(`/notifications/${id}`)
    } catch (err) {
      setNotifications(previousState)
      toast.error(
        err?.response?.data?.message ||
          'Failed to delete or notification not found.',
      )
    }
  }

  const clearAllNotifications = async (event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    if (!notifications.length || clearing) return

    const previousState = [...notifications]
    setClearing(true)
    setNotifications([])

    try {
      const params = role ? { role } : undefined
      await customAxios.delete('/notifications/clear', { params })
      toast.success('All notifications cleared')
    } catch (err) {
      setNotifications(previousState)
      toast.error(
        err?.response?.data?.message || 'Failed to clear notifications',
      )
    } finally {
      setClearing(false)
    }
  }

  useEffect(() => {
    if (!user?.uuid) return
    if (!getAccessToken()) {
      setLoading(false)
      return
    }
    fetchNotifications()
  }, [user?.uuid])

  useEffect(() => {
    if (!user?.uuid) return

    const syncInterval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current
      if (timeSinceLastFetch > 4.5 * 60 * 1000) {
        fetchNotifications()
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(syncInterval)
  }, [user?.uuid])

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleNewNotification = (eventData) => {
      const newNotification = eventData?.data
      if (!newNotification || !newNotification.uuid) return

      setNotifications((prev) => {
        const exists = prev.some((n) => n.uuid === newNotification.uuid)
        if (exists) {
          return prev.map((n) =>
            n.uuid === newNotification.uuid ? newNotification : n,
          )
        }
        return [newNotification, ...prev].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return timeB - timeA
        })
      })
    }

    const handleReadNotification = (eventData) => {
      const { uuid, isRead } = eventData?.data || {}
      if (!uuid) return
      setNotifications((prev) =>
        prev.map((n) => (n.uuid === uuid ? { ...n, isRead: isRead ?? true } : n)),
      )
    }

    const handleDeletedNotification = (eventData) => {
      const { uuid } = eventData?.data || {}
      if (!uuid) return
      setNotifications((prev) => prev.filter((n) => n.uuid !== uuid))
    }

    const handleCleared = () => {
      setNotifications([])
    }

    const handleReadAll = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }

    const handleError = (error) => {
      console.error('Socket error in notifications:', error)
      toast.error('Connection error. Please refresh the page.')
    }

    socket.on('notification:new', handleNewNotification)
    socket.on('notification:read', handleReadNotification)
    socket.on('notification:deleted', handleDeletedNotification)
    socket.on('notification:cleared', handleCleared)
    socket.on('notification:read-all', handleReadAll)
    socket.on('error', handleError)

    return () => {
      socket.off('notification:new', handleNewNotification)
      socket.off('notification:read', handleReadNotification)
      socket.off('notification:deleted', handleDeletedNotification)
      socket.off('notification:cleared', handleCleared)
      socket.off('notification:read-all', handleReadAll)
      socket.off('error', handleError)
    }
  }, [socket, isConnected])

  return (
    <Menu as='div' className='relative z-100 text-left'>
      <Menu.Button
        className='btn relative !min-w-max flex items-center gap-2'
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
      >
        <NotificationIcon className={`${className || 'text-dark-blue'}`} />
        {unreadCount > 0 ? (
          <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E82026] px-1 text-[10px] font-semibold leading-none text-white'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
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
        <Menu.Items className='absolute right-0 z-50 w-[300px] rounded-lg bg-white custom-shadow'>
          <div className='sticky top-0 left-0 flex items-center justify-between gap-2 rounded-t border-b border-gray-300 bg-white px-4 pb-2 pt-4'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-semibold'>Notifications</p>
              {unreadCount > 0 ? (
                <span className='rounded-full bg-[#E82026] px-1.5 py-0.5 text-[10px] font-semibold text-white'>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              ) : null}
            </div>
            <div className='flex items-center gap-2'>
              {isConnecting ? (
                <span className='flex items-center gap-1 text-xs text-blue-500'>
                  <Loader2Icon className='h-3 w-3 animate-spin' />
                </span>
              ) : null}
              {isConnected ? (
                <span className='text-xs text-green-500'>●</span>
              ) : null}
              {notifications.length > 0 ? (
                <button
                  type='button'
                  onClick={clearAllNotifications}
                  disabled={clearing}
                  className='text-xs font-medium text-[#E82026] hover:underline disabled:opacity-50'
                >
                  {clearing ? 'Clearing…' : 'Clear all'}
                </button>
              ) : null}
            </div>
          </div>
          <div className='max-h-[300px] overflow-y-auto p-4 pb-2'>
            {loading ? (
              <p className='flex h-32 items-center justify-center text-xs text-gray-400'>
                <Loader2Icon className='animate-spin' />
              </p>
            ) : notifications?.length === 0 ? (
              <p className='flex h-32 items-center justify-center text-xs text-gray-400'>
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification?.uuid}
                  className={`mb-2 rounded p-2 ${
                    notification?.isRead ? '' : 'bg-gray-3'
                  }`}
                >
                  <p
                    className='cursor-pointer text-sm font-medium'
                    onClick={() => markAsRead(notification?.uuid)}
                  >
                    {notification?.title}
                  </p>
                  {notification?.message ? (
                    <p className='text-xs text-gray-600'>
                      {notification?.message}
                    </p>
                  ) : null}
                  <p className='mt-1 text-[11px] text-gray-400'>
                    {formatNotificationTimestamp(
                      notification?.createdAt || notification?.updatedAt,
                    )}
                  </p>
                  <button
                    type='button'
                    onClick={() => deleteNotification(notification?.uuid)}
                    className='mt-1 text-xs text-red-500'
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
