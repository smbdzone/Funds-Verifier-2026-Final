'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import customAxios from '../../../../utils/apis/apis'
import { toast } from 'react-toastify'
import { useProfile } from '../../../../context/UserContext'

const generateStrongPassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const special = '!@#$%^&*()'

  const pick = (pool) =>
    pool.charAt(Math.floor(Math.random() * pool.length))

  // Backend requires upper, lower, digit, special, and length ≥ 12
  const parts = [pick(upper), pick(lower), pick(digits), pick(special)]
  const all = upper + lower + digits + special
  while (parts.length < 12) {
    parts.push(pick(all))
  }
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[parts[i], parts[j]] = [parts[j], parts[i]]
  }
  return parts.join('')
}

const customPasswordSchema = Yup.string()
  .required('Password is required')
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must not exceed 128 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    'Password must contain at least one special character',
  )

const getFormSchema = (passwordMode) =>
  Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().oneOf(['Sub-Evaluator']).required('Role is required'),
    password:
      passwordMode === 'custom'
        ? customPasswordSchema
        : Yup.string().required('Password is required'),
  })

const getErrorMessage = (error) => {
  const data = error?.response?.data

  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0]?.message || data.errors[0]
  }

  return error?.message || 'Something went wrong'
}

const AddEvaluator = () => {
  const router = useRouter()
  const { user } = useProfile()
  const [passwordMode, setPasswordMode] = useState('auto')
  const [showPassword, setShowPassword] = useState(false)

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: generateStrongPassword(),
    role: '',
    parentEvaluator: '',
  })

  // ✅ Load cookie ONCE and update form values
  useEffect(() => {
    const userUUID = user?.uuid
    if (userUUID) {
      setInitialValues((prev) => ({
        ...prev,
        parentEvaluator: userUUID,
      }))
    }
  }, [user?.uuid])

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={getFormSchema(passwordMode)}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await customAxios.post('/user/signup', values)

          toast.success('User Created successfully!')
          router.replace('/evaluator-profile/manage-evaluators')
        } catch (error) {
          toast.error(getErrorMessage(error))
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className='space-y-4 w-full mx-auto p-4 border rounded-lg shadow-md'>
          {/* Header */}
          <div className='bg-gray-100 px-5 py-3 rounded-lg primary-gradient shadow-md'>
            <h1 className='text-white font-semibold'>Fill Form</h1>
          </div>

          {/* Name */}
          <div>
            <label className='block font-medium mb-1'>Name</label>
            <Field className='w-full px-3 py-2 border rounded' name='name' />
            <ErrorMessage
              name='name'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block font-medium mb-1'>Email</label>
            <Field className='w-full px-3 py-2 border rounded' name='email' />
            <ErrorMessage
              name='email'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          {/* Role */}
          <div>
            <label className='block font-medium mb-1'>Role</label>
            <Field
              as='select'
              name='role'
              className='w-full px-3 py-2 border rounded'
            >
              <option value=''>Select Role</option>
              <option value='Sub-Evaluator'>Sub-Evaluator</option>
              {/* <option value='Trustee'>Trustee</option> */}
            </Field>
            <ErrorMessage
              name='role'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block font-medium mb-2'>Password</label>
            <div className='flex flex-wrap gap-4 mb-3'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='passwordMode'
                  checked={passwordMode === 'auto'}
                  onChange={() => {
                    setPasswordMode('auto')
                    setShowPassword(false)
                    setFieldValue('password', generateStrongPassword())
                  }}
                  className='accent-prussianBlue'
                />
                <span>Auto-generate</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='passwordMode'
                  checked={passwordMode === 'custom'}
                  onChange={() => {
                    setPasswordMode('custom')
                    setShowPassword(false)
                    setFieldValue('password', '')
                  }}
                  className='accent-prussianBlue'
                />
                <span>Custom</span>
              </label>
            </div>

            <div className='relative'>
              <Field
                type={showPassword ? 'text' : 'password'}
                name='password'
                readOnly={passwordMode === 'auto'}
                value={values.password}
                placeholder={
                  passwordMode === 'custom' ? 'Enter a strong password' : ''
                }
                className={`w-full px-3 py-2 pr-10 border rounded ${passwordMode === 'auto'
                  ? 'bg-gray-100 cursor-not-allowed'
                  : ''
                  }`}
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-prussianBlue'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <FaEyeSlash className='h-4 w-4' />
                ) : (
                  <FaEye className='h-4 w-4' />
                )}
              </button>
            </div>

            {passwordMode === 'auto' ? (
              <button
                type='button'
                className='mt-2 text-blue-500 underline'
                onClick={() =>
                  setFieldValue('password', generateStrongPassword())
                }
              >
                Regenerate Password
              </button>
            ) : (
              <p className='mt-2 text-xs text-gray-500'>
                At least 12 characters with uppercase, lowercase, number, and
                special character.
              </p>
            )}
            <ErrorMessage
              name='password'
              component='div'
              className='text-red-500 text-sm mt-1'
            />
          </div>

          {/* Submit */}
          <div className='flex justify-end pt-5'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-blue-500 text-white py-2 px-4 primary-gradient rounded hover:bg-blue-600'
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddEvaluator
