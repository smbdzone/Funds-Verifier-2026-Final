/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../../../utils/apis/apis'
import Link from 'next/link'
import { useLoginPageSessionReset } from '@/hooks/useLoginPageSessionReset'

const page = () => {
  useLoginPageSessionReset()
  const router = useRouter()
  const [loading, setLoading] = useState(false) // ⬅️ Loader state

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email or phone is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true) // start loader
        await login(values, router)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false) // stop loader
      }
    },
  })

  return (
    <div className='h-screen w-full grid md:grid-cols-2 relative z-[40]'>
      <div className='p-5 flex flex-col gap-20 justify-center items-center bg-prussianBlue h-full text-white'>
        {/* Logo */}
        <div className='flex gap-2 items-center'>
          <img src='icons/Logo2.png' alt='Funds Verifier' />
          <h2 className='font-bold text-2xl'>Funds Verifier</h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='w-[80%] xl:w-[50%] flex flex-col gap-5 justify-center items-center'
        >
          <h2 className='font-semibold text-2xl'>Sign In</h2>

          {/* Email Input */}
          <input
            type='text'
            name='email'
            placeholder='Email or phone'
            className={`w-full bg-transparent rounded-full border ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-white'
            } py-2 px-4`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='text-red-500 text-sm self-start'>
              {formik.errors.email}
            </div>
          )}

          {/* Password Input */}
          <input
            type='password'
            name='password'
            placeholder='Password'
            className={`w-full bg-transparent rounded-full border ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500'
                : 'border-white'
            } py-2 px-4`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='text-red-500 text-sm self-start'>
              {formik.errors.password}
            </div>
          )}

          <div className='w-full flex justify-end items-end'>
            {/* Forgot Password */}
            <Link href='/forgot-password'>
              <button
                type='button'
                className='-mt-3 self-end hover:underline text-sm text-slate-200 hover:text-white'
              >
                Forgot Password?
              </button>
            </Link>
          </div>

          {/* Submit Button with Loader */}
          <button
            type='submit'
            disabled={loading} // disable when loading
            className={`w-full bg-white text-prussianBlue rounded-full py-2 font-semibold flex items-center justify-center gap-2 ${
              loading && 'opacity-70 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className='h-5 w-5 border-2 border-prussianBlue border-t-transparent rounded-full animate-spin'></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      {/* Right Image */}
      <div className='hidden md:flex relative z-50 items-center justify-center bg-white'>
        <img
          src='icons/SMBSignIn.png'
          className='w-[80%]'
          alt='Sign In Illustration'
        />
      </div>
    </div>
  )
}

export default page
