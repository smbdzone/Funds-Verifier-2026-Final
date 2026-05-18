import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { StarIcon, WhitStarIcon } from '@/components/Icons'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Review({ productdata }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [review, setReview] = useState('')
  const [ratingNumber, setRatingNumber] = useState(0)
  const [productTitle, setProductTitle] = useState('')
  const [productId, setProductId] = useState('')
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/get`,
          {
            params: { productId: productdata.uuid },
          }
        )
        setReviews(response.data)
      } catch (error) {
        setMessage('Failed to fetch reviews')
      }
    }

    fetchReviews()
  }, [productdata.uuid])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/add`,
        {
          name,
          email,
          review,
          ratingNumber,
          productTitle: productdata.title,
          productId: productdata.uuid,
        }
      )
      toast.success('Review Added successfully!')
      setMessage(response.data.message)
      setName('')
      setEmail('')
      setReview('')
      setRatingNumber('')
      setProductTitle('') // Assuming you also want to reset productTitle
      setProductId('')
    } catch (error) {
      setMessage('Failed to submit review')
    }
  }

  return (
    <div className='md:px-5 py-3 w-full'>
      <ToastContainer />
      <div className='flex md:px-5 gap-2 sm:gap-10 flex-wrap lg:flex-nowrap '>
        <div className='md:pt-14 w-full'>
          {reviews.length === 0 ? (
            <div className='w-full h-full flex flex-col items-center justify-center text-prussianBlue text-xl py-5'>
              <Image
                src={'/NoReviews.jpeg'}
                width={400}
                height={400}
                alt='no reviews'
              />
              <span className='sm:text-base text-sm'>No Reviews yet!</span>
            </div>
          ) : (
            <>
              {reviews.map((review) => (
                <div
                  key={review.uuid}
                  className='flex gap-4 border-b-2 border-black/40 pb-5 mb-7 '
                >
                  <figure className='flex-shrink-0'>
                    <Image
                      src='/avatar/Avatars 2.png'
                      height={76}
                      width={76}
                      alt='Review'
                    />
                  </figure>
                  <div className='mb-2 w-full'>
                    <div className='flex justify-between items-center'>
                      <p>{review.name}</p>
                      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ul className='flex gap-1 mb-2.5'>
                      {[...Array(review.ratingNumber)].map((_, i) => (
                        <li key={i}>
                          <StarIcon />
                        </li>
                      ))}
                      {[...Array(5 - review.ratingNumber)].map((_, i) => (
                        <li key={i}>
                          <WhitStarIcon />
                        </li>
                      ))}
                    </ul>

                    <p className='md:text-sm text-xs'>{review.review}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className='flex-shrink-0 flex flex-col bg-white shadow-xl p-5 w-full lg:w-[45%] xl:w-[35%]'>
          <p className='mb-2 text-base text-center'>Add Review</p>
          <span className='text-sm text-center text-black/40 mb-5'>
            Required fields are marked <span className='text-dark-grey'>*</span>
          </span>

          <label className='mb-2 md:text-base text-xs text-black/60'>
            Enter Your Name<span className='text-black/70'>*</span>
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className=' bg-whiteSmoke py-3 placeholder:md:text-base placeholder:text-xs pl-2 outline-none mb-3 rounded-md'
            placeholder='John Doe'
          />
          <label className='mb-2 md:text-base text-xs text-black/60'>
            Enter Your Email
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=' bg-whiteSmoke py-3 pl-2 placeholder:md:text-base placeholder:text-xs outline-none rounded-md mb-3'
            placeholder='johndoe@gmail.com'
          />
          <label className='mb-2 md:text-base text-xs text-black/60'>
            Your Review<span className='text-black/70'>*</span>
          </label>
          <textarea
            rows={6}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className='bg-whiteSmoke placeholder:md:text-base placeholder:text-xs outline-none mb-4 p-3'
            placeholder='Enter your review here!'
          />
          <span className='text-black/60 md:text-base text-xs mb-2.5'>
            Your Rating<span className='text-black/70'>*</span>
          </span>

          <ul className='flex gap-2 mb-5'>
            {[1, 2, 3, 4, 5].map((num) => (
              <li key={num} onClick={() => setRatingNumber(num)}>
                {num <= ratingNumber ? (
                  <StarIcon className='text-xl' />
                ) : (
                  <WhitStarIcon />
                )}
              </li>
            ))}
          </ul>

          <div className=' flex justify-center pb-5 '>
            <button
              onClick={handleSubmit}
              className='lg:py-3 py-2 px-3 md:text-base text-xs lg:px-10 md:px-5  rounded-sm gradient text-white text-center'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review
