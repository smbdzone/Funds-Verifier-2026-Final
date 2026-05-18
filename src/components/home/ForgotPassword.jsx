'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/forgot-password`,
          values
        )

        toast.success(res.data?.message || 'Reset link sent')
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to send your message. Try again.'

        toast.error(message)
      }
    },
  })

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='p-5 flex flex-col gap-8 justify-center items-center bg-prussianBlue text-white w-full max-w-md rounded-xl shadow-xl'>
        {/* Logo */}
        <div className='flex gap-2 items-center'>
          <img src='/icons/Logo2.png' alt='Funds Verifier' />
          <h2 className='font-bold text-2xl'>Funds Verifier</h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex flex-col gap-5 justify-center items-center'
        >
          <h2 className='font-semibold text-2xl'>Forgot Password</h2>

          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            className={`w-full bg-transparent rounded-full border ${
              formik.touched.email && formik.errors.email
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
            className='w-full bg-white text-prussianBlue rounded-full py-2 font-semibold'
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  )
}
