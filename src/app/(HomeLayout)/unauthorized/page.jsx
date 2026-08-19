'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import { getRoleHomeRoute } from '@/utils/auth/roleHome'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useProfile()

  useEffect(() => {
    if (loading) return
    if (!user && !isAuthenticated) return

    const role =
      user?.parentEvaluator && user?.role === 'Evaluator'
        ? 'SubEvaluator'
        : user?.role
    const home = getRoleHomeRoute(role)
    if (home && home.startsWith('/')) {
      router.replace(home)
    }
  }, [loading, user, isAuthenticated, router])

  return (
    <div className='flex h-screen items-center justify-center bg-white'>
      <div className='p-5 text-center'>
        <h1 className='text-lg font-semibold text-red-600 sm:text-xl lg:text-3xl'>
          Unauthorized
        </h1>
        <p className='mt-4 text-base text-gray-700 sm:text-lg lg:text-xl'>
          You do not have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </p>
        <div className='flex w-full items-center justify-center gap-5'>
          <a
            href='/'
            className='mt-6 inline-block rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 md:px-6 md:py-3'
          >
            Go Home
          </a>
          <a
            href='/login'
            className='mt-6 inline-block rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 md:px-6 md:py-3'
          >
            Login
          </a>
        </div>
      </div>
    </div>
  )
}
