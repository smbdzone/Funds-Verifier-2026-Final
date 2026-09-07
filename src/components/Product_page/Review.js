'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { StarIcon, WhitStarIcon } from '@/components/Icons'
import customAxios from '@/utils/apis/apis'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Review({ productdata }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [review, setReview] = useState('')
  const [ratingNumber, setRatingNumber] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const productId = productdata?.uuid

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await customAxios.get('/reviews/get', {
        params: { productId },
      })
      setReviews(Array.isArray(response.data) ? response.data : [])
    } catch {
      toast.error('Could not load reviews.')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const resetForm = () => {
    setName('')
    setEmail('')
    setReview('')
    setRatingNumber(0)
    setErrors({})
  }

  const validate = () => {
    const next = {}
    if (!productId) next.form = 'This listing is not available for reviews.'
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email'
    }
    if (!review.trim()) next.review = 'Review is required'
    if (!ratingNumber || ratingNumber < 1) next.rating = 'Rating is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors({})

    try {
      await customAxios.post('/reviews/add', {
        name: name.trim(),
        email: email.trim(),
        review: review.trim(),
        ratingNumber,
        productTitle: productdata?.title,
        productId,
      })

      resetForm()
      toast.success(
        'Review submitted successfully. It will appear after admin approval.',
      )
      await fetchReviews()
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Failed to submit review.'
      setErrors({ form: message })
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='md:px-5 py-3 w-full'>
      <ToastContainer
        position='top-right'
        autoClose={4000}
        theme='colored'
        style={{ zIndex: 99999 }}
      />

      <div className='flex flex-wrap gap-2 sm:gap-10 md:px-5 lg:flex-nowrap'>
        <div className='w-full md:pt-14'>
          {loading ? (
            <p className='py-8 text-center text-sm text-slate-500'>
              Loading reviews…
            </p>
          ) : reviews.length === 0 ? (
            <div className='flex h-full w-full flex-col items-center justify-center py-5 text-xl text-prussianBlue'>
              <Image
                src='/NoReviews.jpeg'
                width={400}
                height={400}
                alt='no reviews'
              />
              <span className='text-sm sm:text-base'>No Reviews yet!</span>
            </div>
          ) : (
            reviews.map((item) => (
              <div
                key={item.uuid}
                className='mb-7 flex gap-4 border-b-2 border-black/40 pb-5'
              >
                <figure className='shrink-0'>
                  <Image
                    src='/avatar/Avatars 2.png'
                    height={76}
                    width={76}
                    alt='Reviewer'
                  />
                </figure>
                <div className='mb-2 w-full'>
                  <div className='flex items-center justify-between'>
                    <p>{item.name}</p>
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ul className='mb-2.5 flex gap-1'>
                    {[...Array(item.ratingNumber)].map((_, i) => (
                      <li key={`filled-${i}`}>
                        <StarIcon />
                      </li>
                    ))}
                    {[...Array(5 - item.ratingNumber)].map((_, i) => (
                      <li key={`empty-${i}`}>
                        <WhitStarIcon />
                      </li>
                    ))}
                  </ul>
                  <p className='text-xs md:text-sm'>{item.review}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className='flex w-full shrink-0 flex-col bg-white p-5 shadow-xl lg:w-[45%] xl:w-[35%]'>
          <p className='mb-5 text-center text-base'>Add Review</p>

          <form onSubmit={handleSubmit} className='flex flex-col' noValidate>
            <label className='mb-2 text-xs text-black/60 md:text-base'>
              Enter Your Name<span className='text-black/70'>*</span>
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='mb-1 rounded-md bg-whiteSmoke py-3 pl-2 outline-none placeholder:text-xs placeholder:md:text-base'
              placeholder='John Doe'
              maxLength={50}
            />
            {errors.name ? (
              <span className='mb-2 text-xs text-red-500'>{errors.name}</span>
            ) : (
              <span className='mb-3' />
            )}

            <label className='mb-2 text-xs text-black/60 md:text-base'>
              Enter Your Email<span className='text-black/70'>*</span>
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mb-1 rounded-md bg-whiteSmoke py-3 pl-2 outline-none placeholder:text-xs placeholder:md:text-base'
              placeholder='johndoe@gmail.com'
            />
            {errors.email ? (
              <span className='mb-2 text-xs text-red-500'>{errors.email}</span>
            ) : (
              <span className='mb-3' />
            )}

            <label className='mb-2 text-xs text-black/60 md:text-base'>
              Your Review<span className='text-black/70'>*</span>
            </label>
            <textarea
              rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className='mb-1 bg-whiteSmoke p-3 outline-none placeholder:text-xs placeholder:md:text-base'
              placeholder='Enter your review here!'
              maxLength={500}
            />
            {errors.review ? (
              <span className='mb-2 text-xs text-red-500'>{errors.review}</span>
            ) : (
              <span className='mb-4' />
            )}

            <span className='mb-2.5 text-xs text-black/60 md:text-base'>
              Your Rating<span className='text-black/70'>*</span>
            </span>
            <ul className='mb-1 flex gap-2'>
              {[1, 2, 3, 4, 5].map((num) => (
                <li key={num}>
                  <button
                    type='button'
                    onClick={() => setRatingNumber(num)}
                    aria-label={`Rate ${num} stars`}
                  >
                    {num <= ratingNumber ? (
                      <StarIcon className='text-xl' />
                    ) : (
                      <WhitStarIcon />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {errors.rating ? (
              <span className='mb-3 text-xs text-red-500'>{errors.rating}</span>
            ) : (
              <span className='mb-5' />
            )}

            {errors.form ? (
              <p className='mb-3 text-center text-sm text-red-500'>
                {errors.form}
              </p>
            ) : null}

            <div className='flex justify-center pb-5'>
              <button
                type='submit'
                disabled={submitting || !productId}
                className='rounded-sm gradient px-3 py-2 text-center text-xs text-white disabled:opacity-60 md:px-5 md:text-base lg:px-10 lg:py-3'
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Review
