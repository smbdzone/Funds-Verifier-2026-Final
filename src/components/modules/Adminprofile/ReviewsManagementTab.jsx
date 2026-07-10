'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import customAxios from '@/utils/apis/apis'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' },
]

export const ReviewsManagementTab = () => {
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await customAxios.get('/reviews/admin/all', {
        params: {
          status,
          page: pagination.page,
          limit: pagination.limit,
        },
      })

      setReviews(Array.isArray(response.data?.reviews) ? response.data.reviews : [])
      setPagination((prev) => ({
        ...prev,
        ...(response.data?.pagination || {}),
      }))
    } catch {
      toast.error('Could not load reviews.')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, status])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleStatusChange = async (reviewId, nextStatus) => {
    setUpdatingId(reviewId)
    try {
      await customAxios.patch(`/reviews/admin/${reviewId}/status`, {
        status: nextStatus,
      })
      toast.success(`Review ${nextStatus}.`)
      await fetchReviews()
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Failed to update review status.'
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return

    setUpdatingId(reviewId)
    try {
      await customAxios.delete(`/reviews/admin/${reviewId}`)
      toast.success('Review deleted.')
      await fetchReviews()
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Failed to delete review.'
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      <span className='mb-4 block text-lg text-prussianBlue/40'>
        Product Reviews
      </span>

      <section className='custom-shadow rounded bg-white p-4 sm:p-6'>
        <div className='mb-5 flex flex-wrap items-center gap-3'>
          <label className='text-sm text-black/70' htmlFor='review-status-filter'>
            Filter:
          </label>
          <select
            id='review-status-filter'
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
            className='rounded-md border border-black/10 bg-whiteSmoke px-3 py-2 text-sm outline-none'
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className='py-8 text-center text-sm text-black/50'>
            Loading reviews…
          </p>
        ) : reviews.length === 0 ? (
          <p className='py-8 text-center text-sm text-black/50'>
            No reviews found for this filter.
          </p>
        ) : (
          <div className='space-y-4'>
            {reviews.map((item) => (
              <article
                key={item.uuid}
                className='rounded-md border border-black/10 bg-whiteSmoke p-4'
              >
                <div className='mb-2 flex flex-wrap items-start justify-between gap-2'>
                  <div>
                    <p className='font-medium text-prussianBlue'>{item.name}</p>
                    <p className='text-xs text-black/50'>{item.email}</p>
                  </div>
                  <span className='rounded-sm bg-white px-2 py-1 text-xs capitalize text-black/70'>
                    {item.status || 'pending'}
                  </span>
                </div>

                <p className='mb-1 text-sm font-medium text-black/80'>
                  {item.productTitle || 'Listing'}
                </p>
                <p className='mb-2 text-xs text-black/50'>
                  Product ID: {item.productUUID}
                </p>

                <div className='mb-2 flex items-center gap-1'>
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      size={14}
                      color={
                        starIndex < Number(item.ratingNumber)
                          ? '#E7AD01'
                          : '#D3D3D3'
                      }
                    />
                  ))}
                </div>

                <p className='mb-3 text-sm text-black/80'>{item.review}</p>
                <p className='mb-4 text-xs text-black/50'>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ''}
                </p>

                <div className='flex flex-wrap gap-2'>
                  {item.status !== 'approved' ? (
                    <button
                      type='button'
                      disabled={updatingId === item.uuid}
                      onClick={() => handleStatusChange(item.uuid, 'approved')}
                      className='rounded-sm bg-green-600 px-3 py-1.5 text-xs text-white disabled:opacity-60'
                    >
                      Approve
                    </button>
                  ) : null}
                  {item.status !== 'rejected' ? (
                    <button
                      type='button'
                      disabled={updatingId === item.uuid}
                      onClick={() => handleStatusChange(item.uuid, 'rejected')}
                      className='rounded-sm bg-amber-600 px-3 py-1.5 text-xs text-white disabled:opacity-60'
                    >
                      Reject
                    </button>
                  ) : null}
                  <button
                    type='button'
                    disabled={updatingId === item.uuid}
                    onClick={() => handleDelete(item.uuid)}
                    className='rounded-sm bg-red-600 px-3 py-1.5 text-xs text-white disabled:opacity-60'
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 ? (
          <div className='mt-6 flex items-center justify-center gap-3'>
            <button
              type='button'
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className='rounded-sm border border-black/10 px-3 py-1 text-sm disabled:opacity-50'
            >
              Previous
            </button>
            <span className='text-sm text-black/60'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type='button'
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className='rounded-sm border border-black/10 px-3 py-1 text-sm disabled:opacity-50'
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </>
  )
}
