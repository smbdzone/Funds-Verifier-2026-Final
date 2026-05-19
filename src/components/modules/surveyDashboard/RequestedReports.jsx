'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDateTime } from '@/utils/global-functions/global'
import { SlArrowRight } from 'react-icons/sl'
import Link from 'next/link'
import { toast } from 'react-toastify'
import customAxios from '../../../utils/apis/apis'

const RequestedReports = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const fetchReports = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report`,
      )
      const data = response.data
      setRequests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log('error ', error.message)
      setRequests([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  useEffect(() => {
    if (searchParams.get('uploaded') !== 'success') return
    toast.success('Technical report uploaded successfully!', { autoClose: 5000 })
    router.replace('/survey-dashboard/requested-reports')
    fetchReports()
  }, [searchParams, router, fetchReports])

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <h1 className='text-xl font-semibold text-[#002D4F]'>
          Requested Reports
        </h1>
        <p className='text-sm text-gray-600 mt-1'>
          Technical report requests submitted for survey review.
        </p>
      </div>

      <div className='bg-white w-full rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[900px] border-collapse text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-left align-middle text-xs font-bold text-black uppercase tracking-wider w-[18%]'>
                  Product
                </th>
                <th className='px-4 py-3 text-left align-middle text-xs font-bold text-black uppercase tracking-wider w-[14%]'>
                  Name
                </th>
                <th className='px-4 py-3 text-left align-middle text-xs font-bold text-black uppercase tracking-wider w-[22%]'>
                  Email
                </th>
                <th className='px-4 py-3 text-left align-middle text-xs font-bold text-black uppercase tracking-wider w-[14%]'>
                  Phone Number
                </th>
                <th className='px-4 py-3 text-left align-middle text-xs font-bold text-black uppercase tracking-wider w-[22%]'>
                  Requested Date &amp; Time
                </th>
                <th className='px-4 py-3 text-center align-middle text-xs font-bold text-black uppercase tracking-wider w-[10%]'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className='px-4 py-12 text-center text-gray-500'>
                    Loading requests…
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-4 py-12 text-center text-gray-500'>
                    No requested reports found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const dateTime = formatDateTime(request.dateTime)
                  return (
                    <tr key={request.uuid || request._id} className='hover:bg-gray-50'>
                      <td className='px-4 py-3 align-middle text-left text-sm font-medium text-gray-900'>
                        {request?.productTitle || '—'}
                      </td>
                      <td className='px-4 py-3 align-middle text-left text-sm text-gray-900'>
                        {request?.name || '—'}
                      </td>
                      <td className='px-4 py-3 align-middle text-left text-sm text-gray-600 break-all'>
                        {request?.email || '—'}
                      </td>
                      <td className='px-4 py-3 align-middle text-left text-sm text-gray-600 whitespace-nowrap'>
                        {request?.phone || '—'}
                      </td>
                      <td className='px-4 py-3 align-middle text-left text-sm text-gray-600 whitespace-nowrap'>
                        {dateTime?.formattedDate || '—'}
                        {dateTime?.formattedTime ? (
                          <span className='block text-xs text-gray-500'>
                            {dateTime.formattedTime}
                          </span>
                        ) : null}
                      </td>
                      <td className='px-4 py-3 align-middle text-center'>
                        <Link
                          href={`/survey-dashboard/technical-report?id=${request.uuid}`}
                          className='inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100'
                          aria-label='View report'
                        >
                          <SlArrowRight className='text-black' size={14} />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RequestedReports
