'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { formatDateTime } from '@/utils/global-functions/global'
import { SlArrowRight } from 'react-icons/sl'
import Link from 'next/link'
import customAxios from '../../../utils/apis/apis'

const RequestedReports = () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        const response = await customAxios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report`
        )
        setRequests(response.data)
      } catch (error) {
        console.log('error ', error.message)
      }
    }
    fetchdetails()
  }, [])

  return (
    <div>
      <div className='bg-white w-full h-[90vh] relative'>
        {/* Content Area */}
        <div className='absolute top-16 w-full min-h-[80%] max-h-[80%] bg-white overflow-y-auto'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-bold text-black tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-black tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-black tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-black tracking-wider'>
                    Phone Number
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-black tracking-wider'>
                    Requested Date Time
                  </th>
                  {/* Action Column */}
                  <th className='px-6 py-3 text-left text-xs font-bold text-black tracking-wider'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {requests.map((request, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {request?.productTitle}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {request.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {request.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {request.phone}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDateTime(request.dateTime).formattedDate} &nbsp;
                      {formatDateTime(request.dateTime).formattedTime}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-xs flex items-center space-x-2'>
                      <Link
                        href={`/survey-dashboard/technical-report?id=${request.uuid}`}
                        className='cursor-pointer'
                      >
                        <SlArrowRight className='text-black/120' />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestedReports
