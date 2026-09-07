'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { getCsrfHeaders } from '@/utils/csrf'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/

export default function ResetPassword() {
  const { token } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(passwordRegex, 'Strong password required')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const csrfHeaders = await getCsrfHeaders()
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/reset-password/${token}`,
          { password: values.password },
          { headers: csrfHeaders, withCredentials: true },
        )

        toast.success(res.data?.message || 'Password reset successful')
        router.replace('/user-login')
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Could not reset your password. Please request a new link.',
        )
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
          <h2 className='font-semibold text-2xl'>Reset Password</h2>
          <p className='text-sm text-slate-200 text-center -mt-2'>
            Choose a new password with at least 8 characters, including an
            uppercase letter, a number and a symbol.
          </p>

          <input
            type='password'
            name='password'
            placeholder='New Password'
            className={`w-full bg-transparent rounded-full border ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500'
                : 'border-white'
            } py-2 px-4`}
            {...formik.getFieldProps('password')}
          />

          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            className={`w-full bg-transparent rounded-full border ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500'
                : 'border-white'
            } py-2 px-4`}
            {...formik.getFieldProps('confirmPassword')}
          />

          {(formik.errors.password || formik.errors.confirmPassword) && (
            <div className='text-red-500 text-sm self-start'>
              {formik.errors.password || formik.errors.confirmPassword}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-white text-prussianBlue rounded-full py-2 font-semibold flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className='h-5 w-5 border-2 border-prussianBlue border-t-transparent rounded-full animate-spin' />
            ) : (
              'Reset Password'
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
          alt='Reset Password Illustration'
        />
      </div>
    </div>
  )
}
