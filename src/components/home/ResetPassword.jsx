'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/

export default function ResetPassword() {
  const { token } = useParams()

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
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/reset-password/${token}`,
          {
            password: values.password,
          }
        )

        toast.success(res.data?.message || 'Password reset successful')
      } catch (error) {
        toast.error(error.response?.data?.message)
      }
    },
  })

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='p-5 flex flex-col gap-16 justify-center items-center bg-prussianBlue text-white w-full max-w-md rounded-xl shadow-xl'>
        {/* Logo */}
        <div className='flex gap-2 items-center'>
          <img src='/icons/Logo2.png' alt='Funds Verifier' />
          <h2 className='font-bold text-2xl'>Funds Verifier</h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex flex-col gap-5 justify-center items-center'
        >
          <h2 className='font-semibold text-2xl'>Reset Password</h2>

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
            className='w-full bg-white text-prussianBlue rounded-full py-2 font-semibold'
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}
