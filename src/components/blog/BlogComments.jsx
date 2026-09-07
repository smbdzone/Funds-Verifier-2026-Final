'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatDate } from '@/utils/global-functions/global'
import customAxios from '@/utils/apis/apis'
import { toast } from 'react-toastify'

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-reefGold focus:ring-2 focus:ring-reefGold/20'

function getInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
}

export default function BlogComments({ blogUuid }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchComments = useCallback(async () => {
    if (!blogUuid) {
      setComments([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await customAxios.get(`/blog/comments/${blogUuid}`)
      setComments(Array.isArray(response.data?.data) ? response.data.data : [])
    } catch {
      toast.error('Could not load comments.')
    } finally {
      setLoading(false)
    }
  }, [blogUuid])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const resetForm = () => {
    setName('')
    setEmail('')
    setComment('')
    setErrors({})
  }

  const validate = () => {
    const next = {}
    if (!blogUuid) next.form = 'Comments are unavailable for this article.'
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email'
    }
    if (!comment.trim()) next.comment = 'Comment is required'
    else if (comment.trim().length > 1000) {
      next.comment = 'Comment must be 1000 characters or less'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors({})

    try {
      await customAxios.post('/blog/comments', {
        name: name.trim(),
        email: email.trim(),
        comment: comment.trim(),
        blogUuid,
      })

      resetForm()
      toast.success(
        'Comment submitted successfully. It will appear after admin approval.',
      )
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Failed to post comment.'
      setErrors({ form: message })
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className='mt-10 border-t border-gray-200 pt-8 sm:mt-12 sm:pt-10'>
      <h2 className='mb-2 text-xl font-semibold text-gray-900 sm:text-2xl'>
        Comments
      </h2>
      <p className='mb-6 text-sm text-gray-500'>
        Share your thoughts on this article.
      </p>

      <form
        onSubmit={handleSubmit}
        className='mb-8 rounded-xl border border-reefGold/20 bg-gray-50 p-4 sm:p-6'
      >
        {errors.form ? (
          <p className='mb-4 text-sm text-red-600'>{errors.form}</p>
        ) : null}

        <div className='mb-4 grid gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='blog-comment-name' className='mb-1.5 block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              id='blog-comment-name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
              placeholder='Your name'
              maxLength={80}
            />
            {errors.name ? (
              <p className='mt-1 text-xs text-red-600'>{errors.name}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor='blog-comment-email' className='mb-1.5 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              id='blog-comment-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              placeholder='you@example.com'
              maxLength={120}
            />
            {errors.email ? (
              <p className='mt-1 text-xs text-red-600'>{errors.email}</p>
            ) : null}
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='blog-comment-text' className='mb-1.5 block text-sm font-medium text-gray-700'>
            Comment
          </label>
          <textarea
            id='blog-comment-text'
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`${INPUT_CLASS} resize-y min-h-[120px]`}
            placeholder='Write your comment...'
            maxLength={1000}
          />
          {errors.comment ? (
            <p className='mt-1 text-xs text-red-600'>{errors.comment}</p>
          ) : null}
        </div>

        <button
          type='submit'
          disabled={submitting}
          className='rounded-lg bg-prussianBlue px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {submitting ? 'Posting...' : 'Post comment'}
        </button>
      </form>

      {loading ? (
        <p className='py-6 text-center text-sm text-gray-500'>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className='rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-500'>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className='space-y-4'>
          {comments.map((item) => (
            <li
              key={item.uuid}
              className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5'
            >
              <div className='mb-3 flex items-start gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-reefGold text-sm font-semibold text-white'>
                  {getInitials(item.name)}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='font-medium text-gray-900'>{item.name}</p>
                  <time
                    dateTime={item.createdAt}
                    className='text-xs text-gray-500'
                  >
                    {formatDate(item.createdAt)}
                  </time>
                </div>
              </div>
              <p className='whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700'>
                {item.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
