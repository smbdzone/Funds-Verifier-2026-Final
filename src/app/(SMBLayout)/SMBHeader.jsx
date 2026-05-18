import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useProfile } from '../../context/UserContext'
import NotificationDropdown from '../../components/Buttons/Notifications'
const NotificationItem = ({ alert, onClick }) => {
  return (
    <div
      className={`w-full flex gap-3 p-3 ${
        alert.isUnread ? 'bg-[#EBF3FF]' : 'bg-white'
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className='rounded-full border border-prussianBlue w-[35px] h-[31px] overflow-hidden flex items-center justify-center'>
        <img src={alert.image} alt='icon' className='w-full h-full' />
      </div>
      <div className='w-full text-sm space-y-1'>
        <p className='text-wrap'>
          {alert.notification}{' '}
          <span className='font-semibold'>{alert.boldContent}</span>
        </p>
        <img src={alert.media} alt='media' />
        <p className='text-xs text-[#9c9c9c]'>{alert.time}</p>
      </div>
    </div>
  )
}

const SMBHeader = ({ setIsSidebarOpen, isSidebarOpen }) => {
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [alertActive, setAlertActive] = useState(false)
  const { user, fetchProfile } = useProfile()
  useEffect(() => {
    fetchProfile()
  }, [])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      image: '/avatar/Avatars 2.png',
      notification: 'John smith invited you to',
      boldContent: 'Resources Product Growth Org Design.paper',
      media: '/icons/notification.png',
      time: '3 months ago',
      isUnread: true,
    },
    {
      id: 2,
      image: '/avatar/Avatars 2.png',
      notification: 'John smith invited you to',
      boldContent: 'Resources Product Growth Org Design.paper',
      media: '/icons/notification.png',
      time: '3 months ago',
      isUnread: false,
    },
    {
      id: 3,
      image: '/avatar/Avatars 2.png',
      notification: 'John smith invited you to',
      boldContent: 'Resources Product Growth Org Design.paper',
      media: '/icons/notification.png',
      time: '3 months ago',
      isUnread: true,
    },
  ])

  const toggleAlert = () => {
    setAlertActive(!alertActive)
  }

  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isUnread: false }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isUnread: false,
      }))
    )
  }

  const unreadAlerts = notifications.filter(
    (notification) => notification.isUnread
  )
  const recentAlerts = notifications.filter(
    (notification) => !notification.isUnread
  )
  // console.log({ user })

  return (
    <div className='w-full bg-[#d9d9d9] p-5 flex justify-between lg:justify-end'>
      <button
        className='lg:hidden text-xl'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
      <div className='flex items-center gap-4 pr-5 relative'>
        <div className='bg-white rounded-md border border-[#9c9c9c] w-10 h-10 flex items-center justify-center'>
          <NotificationDropdown />
        </div>
        {user ? (
          <div className='relative'>
            {/* User Info Dropdown Button for md screens */}
            <button
              className='cursor-pointer hover:scale-105 flex items-center gap-2 md:block lg:hidden'
              onClick={() => setOpenProfileModal(!openProfileModal)}
            >
              <div className='bg-white rounded-md border px-1 border-[#9c9c9c] w-10 h-10 flex items-center justify-center'>
                <img src='/avatar/Avatars 2.png' alt='Profile Icon' />
              </div>
            </button>

            {/* Dropdown Modal for md screens */}
            {openProfileModal && (
              <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-md z-50 md:block lg:hidden'>
                <div className='flex flex-col justify-center items-center p-4'>
                  <p className='font-medium text-prussianBlue'>{user?.name}</p>
                  <p className='font-light text-sm text-gray-500'>
                    {user?.email}
                  </p>
                  <button
                    className='mt-3 text-sm text-red-600 hover:underline'
                    onClick={() => setOpenProfileModal(false)}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Inline User Info for lg screens */}
            <div className='hidden lg:flex items-center gap-2'>
              <div className='bg-white rounded-md border px-1 border-[#9c9c9c] w-10 h-10 flex items-center justify-center'>
                <img src='/avatar/Avatars 2.png' alt='Profile Icon' />
              </div>
              <div className='flex flex-col items-start justify-center text-start text-sm'>
                <p className='font-medium'>{user?.name}</p>
                <p className='font-light text-prussianBlue'>{user?.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <Link href='/user-login'>
            <p className=' font-light text-prussianBlue'>login</p>
          </Link>
        )}

        {/* Notification Modal */}
        {alertActive && (
          <div className='absolute z-99 top-full mt-8 right-[80%] bg-white shadow-lg rounded-md w-[320px] flex flex-col gap-2'>
            <div className='flex items-center justify-between bg-prussianBlue w-full p-3 rounded-t-md'>
              <h3 className='font-semibold text-white text-lg'>
                Notifications
              </h3>
              <IoMdClose
                size={25}
                color='white'
                onClick={toggleAlert}
                className='cursor-pointer'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <div className='w-full flex justify-between'>
                <h2 className='ml-2 text-prussianBlue font-bold text-lg'>
                  Unread
                </h2>
                <button
                  className='rounded-lg p-1 text-xs text-prussianBlue bg-white outline outline-prussianBlue outline-1 hover:text-white hover:bg-prussianBlue w-fit self-end mr-2'
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
              {unreadAlerts.map((alert) => (
                <NotificationItem
                  key={alert.id}
                  alert={alert}
                  onClick={() => handleNotificationClick(alert.id)}
                />
              ))}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='ml-2 text-prussianBlue font-bold text-lg'>
                Recent
              </h2>
              {recentAlerts.map((alert) => (
                <NotificationItem
                  key={alert.id}
                  alert={alert}
                  onClick={() => handleNotificationClick(alert.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SMBHeader
