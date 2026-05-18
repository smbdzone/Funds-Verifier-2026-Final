'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateTime } from '@/utils/global-functions/global'
import { SlArrowRight } from 'react-icons/sl'
import Link from 'next/link'
import customAxios from '../../../utils/apis/apis'

export default function SMB() {
  const [walkthroughs, setWalkthroughs] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await customAxios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/request3d/walkthrough-requests`
        )

        setWalkthroughs(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchRequests()
  }, [])

  return (
    <div className='bg-white w-full h-[85vh] relative'>
      <div className='absolute top-16 w-full min-h-[80%] max-h-[80%] bg-white overflow-y-auto'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'>
                  Product
                </th>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'>
                  Name
                </th>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'>
                  Email
                </th>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'>
                  Phone Number
                </th>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'>
                  Appointment Date Time
                </th>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'>
                  Action
                </th>
                <th className='px-4 py-3 text-left text-sm font-bold text-black tracking-wider'></th>
              </tr>
            </thead>
            <tbody className='bg-transparent divide-y divide-gray-200'>
              {walkthroughs.length === 0 ? (
                <tr>
                  <td colSpan='6' className='h-40'>
                    <div className='flex h-full items-center justify-center'>
                      <h1 className='text-lg font-semibold'>
                        No Requests Found!
                      </h1>
                    </div>
                  </td>
                </tr>
              ) : (
                walkthroughs.map((walkthrough, index) => (
                  <tr key={index}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {walkthrough?.productTitle}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {walkthrough?.name}
                    </td>
                    <td className='px-4 py-3 truncate whitespace-nowrap text-sm text-gray-500'>
                      {walkthrough?.email}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {walkthrough?.phone}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                      {formatDateTime(walkthrough?.dateTime)?.formattedDate}{' '}
                      &nbsp;
                      {formatDateTime(walkthrough?.dateTime)?.formattedTime}
                    </td>

                    <td className='px-4 py-3 whitespace-nowrap text-xs flex items-center space-x-2'>
                      <Link
                        href={`/smb-details?id=${walkthrough?.uuid}`}
                        className='cursor-pointer'
                      >
                        <SlArrowRight className='text-black/120' />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
