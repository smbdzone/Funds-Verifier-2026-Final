'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SlArrowRight } from 'react-icons/sl'
import { useProfile } from '../../../context/UserContext'
import customAxios from '../../../utils/apis/apis'

export default function EvaluationPage() {
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const path = usePathname()
  const { user } = useProfile()

  // Determine asset type from the path (e.g., 'property-evaluation')
  const assetType = path?.split('/')?.pop()?.replace('-evaluation', '') || ''

  const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const handleNavigation = (id) => {
    router.push(`/sub-evaluator-profile/${assetType}-evaluation/${id}`)
  }

  const fetchEvaluations = async () => {
    try {
      setLoading(true)
      if (!user?.uuid) return
      const response = await customAxios.get(`/${assetType}?status=0`)
      setEvaluations(response.data.products || [])
    } catch (error) {
      console.error('Error fetching evaluations:', error)
      setEvaluations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (assetType && user?.uuid) fetchEvaluations()
  }, [assetType, user?.uuid])

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4 capitalize'>
        {titleCase(assetType)} Evaluations
      </h2>

      <div className='bg-white rounded-md shadow border overflow-hidden'>
        <div className='bg-blue-900 text-white px-6 py-3 font-semibold text-lg capitalize'>
          Pending {assetType} Evaluations
        </div>
        <table className='w-full text-left'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-6 py-3 font-semibold'>Title</th>
              <th className='px-6 py-3 font-semibold'>
                Evaluation Date & Time
              </th>
              <th className='px-6 py-3 font-semibold'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='3' className='px-6 py-4 text-center'>
                  Loading...
                </td>
              </tr>
            ) : evaluations.length === 0 ? (
              <tr>
                <td colSpan='3' className='px-6 py-4 text-center'>
                  No pending evaluations.
                </td>
              </tr>
            ) : (
              evaluations.map((item, index) => {
                const date = item?.evaluationDateTime
                  ? new Date(item.evaluationDateTime)
                  : null
                const isValidDate =
                  date instanceof Date && !Number.isNaN(date.getTime())
                const formattedDate = isValidDate
                  ? date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '--'
                const formattedTime = isValidDate
                  ? date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : '--'

                return (
                  <tr key={item.uuid || index} className='border-t'>
                    <td className='px-6 py-4 capitalize'>{item.title}</td>
                    <td className='px-6 py-4'>{`${formattedDate} ${formattedTime}`}</td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => handleNavigation(item.uuid)}
                        className='text-blue-600 text-xl hover:scale-105 transition'
                        title='Go to evaluation'
                      >
                        <SlArrowRight />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
