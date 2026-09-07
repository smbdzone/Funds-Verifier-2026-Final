'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import customAxios from '@/utils/apis/apis'
import { normalizePersonFullName } from '@/utils/auth/parseUaePassName'

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name (as per Emirates ID) is required'),
  number: Yup.string()
    .required('Emirates ID number is required')
    .matches(/^784-\d{4}-\d{7}-\d$/, 'Use format 784-XXXX-XXXXXXX-X'),
  expiryDate: Yup.date()
    .required('Emirates ID expiry date is required')
    .min(new Date(), 'Emirates ID must not be expired'),
})

const EmiratesIdSection = ({ user, fetchData, variant = 'dark' }) => {
  const labelClass =
    variant === 'light'
      ? 'w-[30%] text-prussianBlue'
      : 'block text-sm font-medium mb-1 text-white'
  const inputClass =
    variant === 'light'
      ? 'shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
      : 'shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input bg-white text-gray-900'

  const expiryValue = user?.emiratesId?.expiryDate
    ? new Date(user.emiratesId.expiryDate).toISOString().split('T')[0]
    : ''

  const cleanedFullName = normalizePersonFullName(
    user?.emiratesId?.fullName || user?.displayName || user?.name || '',
    user?.lastname || '',
  )

  return (
    <div className={variant === 'dark' ? 'sm:px-8 px-4 pb-3 sm:py-6' : ''}>
      {variant === 'dark' && (
        <>
          <h2 className='sm:text-lg text-base lg:text-xl font-medium text-white mb-2'>
            Emirates ID (required for Clozer installments)
          </h2>
          <p className='text-white/70 text-sm mb-4'>
            Clozer uses these details to prefill your installment application.
          </p>
        </>
      )}

      <Formik
        initialValues={{
          fullName: cleanedFullName,
          number: user?.emiratesId?.number || '',
          expiryDate: expiryValue,
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const fullName = normalizePersonFullName(values.fullName)
            const res = await customAxios.put(`/user/update/${user?.uuid}`, {
              emiratesId: {
                fullName,
                number: values.number.trim(),
                expiryDate: values.expiryDate,
              },
            })
            if (res?.status === 200) {
              toast.success('Emirates ID saved successfully')
              fetchData?.()
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message ||
              error?.message ||
              'Could not save Emirates ID',
            )
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className='space-y-4'>
            <div className={variant === 'light' ? 'flex' : ''}>
              {variant === 'light' && (
                <label className={labelClass}>Full Name (EID)</label>
              )}
              <div className={variant === 'light' ? 'w-full' : ''}>
                {variant === 'dark' && (
                  <label className={labelClass}>
                    Full Name (as per Emirates ID)
                  </label>
                )}
                <Field
                  name='fullName'
                  type='text'
                  placeholder='Ahmed Mohammed'
                  className={inputClass}
                  onBlur={(e) => {
                    const cleaned = normalizePersonFullName(e.target.value)
                    if (cleaned !== values.fullName) {
                      setFieldValue('fullName', cleaned)
                    }
                  }}
                />
                <ErrorMessage
                  name='fullName'
                  component='p'
                  className='text-red-400 text-sm mt-1'
                />
              </div>
            </div>

            <div className={variant === 'light' ? 'flex' : ''}>
              {variant === 'light' && (
                <label className={labelClass}>Emirates ID Number</label>
              )}
              <div className={variant === 'light' ? 'w-full' : ''}>
                {variant === 'dark' && (
                  <label className={labelClass}>Emirates ID Number</label>
                )}
                <Field
                  name='number'
                  type='text'
                  placeholder='784-XXXX-XXXXXXX-X'
                  className={inputClass}
                />
                <ErrorMessage
                  name='number'
                  component='p'
                  className='text-red-400 text-sm mt-1'
                />
              </div>
            </div>

            <div className={variant === 'light' ? 'flex' : ''}>
              {variant === 'light' && (
                <label className={labelClass}>Expiry Date</label>
              )}
              <div className={variant === 'light' ? 'w-full' : ''}>
                {variant === 'dark' && (
                  <label className={labelClass}>Expiry Date</label>
                )}
                <Field name='expiryDate' type='date' className={inputClass} />
                <ErrorMessage
                  name='expiryDate'
                  component='p'
                  className='text-red-400 text-sm mt-1'
                />
              </div>
            </div>

            <div
              className={
                variant === 'light' ? 'flex justify-end' : 'flex justify-end mt-2'
              }
            >
              <button
                type='submit'
                disabled={isSubmitting}
                className={`${variant === 'light' ? 'primary-gradient' : 'btn-gradient'
                  } text-white px-6 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Save Emirates ID
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EmiratesIdSection
