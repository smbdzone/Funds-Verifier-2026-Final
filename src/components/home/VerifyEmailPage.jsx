'use client'

// import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Suspense, useEffect, useRef, useState } from 'react'

function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const uuid = searchParams.get('uuid')

  const [status, setStatus] = useState('Verifying...')
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const verify = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/verify-email`,
          { params: { token, uuid } }
        )
        setStatus('Email verified successfully! You can now log in.')
      } catch (error) {
        setStatus('Invalid or expired verification link.')
      }
    }

    if (token && uuid) verify()
  }, [token, uuid])

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="p-5 h-screen flex flex-col gap-4 justify-center items-center">
      <h1>{status}</h1>

      {status.includes('successfully') && (
        <a href="/user-login" className="text-blue-600 underline">
          Go to Login
        </a>
      )}
    </div>
    </Suspense>
  )
}

/**
 * ✅ Disable SSR to avoid useSearchParams build error
 */
// export default dynamic(() => Promise.resolve(VerifyEmailPage), {
//   ssr: false,
// })
export default VerifyEmailPage