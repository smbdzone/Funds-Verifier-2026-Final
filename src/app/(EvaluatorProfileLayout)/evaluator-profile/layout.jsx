/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { UserProvider } from '../../../context/UserContext'

import EvaluatorHeader from '@/components/Layout/EvaluatorHeader'
import Sidebar from '@/components/Sidebar/Sidebar'
import RequireAuth from '@/components/auth/RequireAuth'
import { Suspense, useState } from 'react'

const layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }
  return (
    <UserProvider>
      <RequireAuth roles={['Evaluator']} loginPath='/login'>
        <div className=''>
          {/* Header */}
          <EvaluatorHeader toggleSidebar={toggleSidebar} />

          {/* Sidebar */}
          <div className='flex w-full theme-container'>
            <div className={`xl:block hidden`}>
              <Sidebar />
            </div>

            {/* Main Content */}
            <Suspense fallback={<p className='text-center'>Loading...</p>}>
              <main className='flex-1 w-full p-3 sm:p-5'>{children}</main>
            </Suspense>
          </div>

          {/* Overlay for small screens */}
          {isSidebarOpen && (
            <div
              className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
              onClick={toggleSidebar}
            ></div>
          )}
        </div>
      </RequireAuth>
    </UserProvider>
  )
}

export default layout
