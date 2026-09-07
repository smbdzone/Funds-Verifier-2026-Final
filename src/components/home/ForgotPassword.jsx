'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getCsrfHeaders } from '@/utils/csrf'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const csrfHeaders = await getCsrfHeaders()
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/forgot-password`,
          values,
          { headers: csrfHeaders, withCredentials: true },
        )

        toast.success(res.data?.message || 'Reset link sent')
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to send your message. Try again.'

        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className='h-screen w-full grid md:grid-cols-2 relative z-[40]'>
      <div className='p-5 flex flex-col gap-20 justify-center items-center bg-prussianBlue h-full text-white'>
        {/* Logo */}
        <div className='flex gap-2 items-center'>
          <img src='/icons/Logo2.png' alt='Funds Verifier' />
          <h2 className='font-bold text-2xl'>Funds Verifier</h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='w-[80%] xl:w-[50%] flex flex-col gap-5 justify-center items-center'
        >
          <h2 className='font-semibold text-2xl'>Forgot Password</h2>
          <p className='text-sm text-slate-200 text-center -mt-2'>
            Enter your email and we will send you a link to reset your password.
          </p>

          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            className={`w-full bg-transparent rounded-full border ${formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-white'
              } py-2 px-4`}
            {...formik.getFieldProps('email')}
          />

          {formik.touched.email && formik.errors.email && (
            <div className='text-red-500 text-sm self-start'>
              {formik.errors.email}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-white text-prussianBlue rounded-full py-2 font-semibold flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {loading ? (
              <div className='h-5 w-5 border-2 border-prussianBlue border-t-transparent rounded-full animate-spin' />
            ) : (
              'Send Reset Link'
            )}
          </button>

          <Link
            href='/user-login'
            className='text-sm text-slate-300 hover:text-white hover:underline'
          >
            Back to Sign In
          </Link>
        </form>
      </div>

      {/* Right Image */}
      <div className='hidden md:flex relative z-50 items-center justify-center bg-white'>
        <img
          src='/icons/SMBSignIn.png'
          className='w-[80%]'
          alt='Forgot Password Illustration'
        />
      </div>
    </div>
  )
}
