'use client'

import React, { useEffect, useState } from 'react'
import { Banner } from '@/components/modules/Banner'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Mail, Phone, Pin } from 'lucide-react'
import { getCsrfHeaders } from '@/utils/csrf'
import ContactPageSkeleton from '@/components/contact/ContactPageSkeleton'

const inputClass = 'border border-[#A2913E] p-2 rounded outline-none w-full'

export default function Page() {
  const [isPageReady, setIsPageReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPageReady(true), 650)
    return () => window.clearTimeout(timer)
  }, [])

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const csrfHeaders = await getCsrfHeaders()
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/contact-us`,
        values,
        { headers: csrfHeaders, withCredentials: true },
      )
      toast.success(res.data.message || 'Message sent successfully!')
      resetForm()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Failed to send your message. Try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      subject: '',
      phone: '',
      message: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid Email').required('Email is required'),
      subject: Yup.string().required('Subject is required'),
      phone: Yup.string().required('Phone number is required'),
      message: Yup.string().required('Message is required'),
    }),
    onSubmit: handleSubmit,
  })

  if (!isPageReady) {
    return <ContactPageSkeleton />
  }

  return (
    <div>
      <Banner title='Contact Us' />
      <div className='bg-white'>
        <div className='theme-container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6 sm:px-6 sm:py-8 md:p-10'>
          <div className='bg-[#e9f1fd] p-5 sm:p-6 md:p-8 rounded-md w-full min-w-0'>
            <h3 className='text-sm text-gray-700'>Send us Email</h3>
            <h2 className='text-xl sm:text-2xl font-bold text-blue mb-4 sm:mb-6'>
              Feel free to write
            </h2>

            <form onSubmit={formik.handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <input
                    type='text'
                    name='fullName'
                    placeholder='Full name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fullName}
                    className={inputClass}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className='text-red-500 text-sm'>
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={inputClass}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className='text-red-500 text-sm'>
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type='text'
                    name='subject'
                    placeholder='Subject'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subject}
                    className={inputClass}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <p className='text-red-500 text-sm'>
                      {formik.errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type='text'
                    name='phone'
                    placeholder='Phone No'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    className={inputClass}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className='text-red-500 text-sm'>
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  name='message'
                  placeholder='Message'
                  rows={5}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                  className={`${inputClass} block`}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className='text-red-500 text-sm'>
                    {formik.errors.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={formik.isSubmitting}
                className='flex justify-center items-center font-medium text-white rounded-l-sm [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-full h-11 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed'
              >
                {formik.isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>

          <div className='flex flex-col justify-center space-y-3 sm:space-y-6 w-full min-w-0'>
            <div>
              <p className='text-xs sm:text-sm text-blue font-medium'>
                Need Any Help?
              </p>
              <h3 className='text-lg sm:text-2xl text-blue font-bold leading-tight'>
                Get in touch with us
              </h3>
              <p className='text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base leading-snug'>
                We&apos;re here to help! Reach out to us with any questions or
                concerns.
              </p>
            </div>

            <div className='flex items-start gap-3 sm:gap-4'>
              <div className='shrink-0 justify-center flex items-center rounded-l-sm font-medium text-darkslategray-100 [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-10 h-9 sm:w-[50px] sm:h-11'>
                <Phone color='#fff' size={18} className='sm:w-5 sm:h-5' />
              </div>
              <div className='min-w-0'>
                <p className='text-gray-600 text-xs sm:text-sm'>
                  Have any question?
                </p>
                <a
                  href='tel:+971561290003'
                  className='text-blue text-sm sm:text-base font-semibold hover:underline break-words'
                >
                  +971 56 129 0003
                </a>
              </div>
            </div>

            <div className='flex items-start gap-3 sm:gap-4'>
              <div className='shrink-0 justify-center flex items-center rounded-l-sm font-medium text-darkslategray-100 [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-10 h-9 sm:w-[50px] sm:h-11'>
                <Mail color='#fff' size={18} className='sm:w-5 sm:h-5' />
              </div>
              <div className='min-w-0'>
                <p className='text-gray-600 text-xs sm:text-sm'>Write Email</p>
                <a
                  href='mailto:fvportal@outlook.com'
                  className='text-sm sm:text-base font-semibold text-blue hover:underline break-all'
                >
                  fvportal@outlook.com
                </a>
              </div>
            </div>

            <div className='flex items-start gap-3 sm:gap-4'>
              <div className='shrink-0 justify-center flex items-center rounded-l-sm font-medium text-darkslategray-100 [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-10 h-9 sm:w-[50px] sm:h-11'>
                <Pin color='#fff' size={18} className='sm:w-5 sm:h-5' />
              </div>
              <div className='min-w-0'>
                <p className='text-gray-600 text-xs sm:text-sm'>Visit Anytime</p>
                <a
                  href='https://maps.google.com/?q=Dubai,United+Arab+Emirates'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm sm:text-base font-semibold text-blue hover:underline'
                >
                  Dubai, United Arab Emirates
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='theme-container mx-auto px-4 pb-6 sm:px-6 sm:pb-8 md:px-10 md:pb-10'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d144359.1629399847!2d55.17127965!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f434d4c797be5%3A0xb4b1bfa1f81a9a94!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1650460432439!5m2!1sen!2sae'
            width='100%'
            height='350'
            className='w-full min-h-[220px] sm:min-h-[280px] md:min-h-[350px]'
            style={{ border: 0 }}
            loading='lazy'
            allowFullScreen
            title='Dubai map'
          />
        </div>
      </div>
    </div>
  )
}
