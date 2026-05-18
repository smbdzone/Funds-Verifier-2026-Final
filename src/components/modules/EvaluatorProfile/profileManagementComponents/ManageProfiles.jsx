import { CloseDisclosure, OpenDisclosure } from '@/components/Icons'
import React, { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import customAxios from '../../../../utils/apis/apis'
import { getCookie } from 'cookies-next'

const ManageEvaluators = () => {
  const [data, setData] = useState()
  const [show, setShow] = useState(-1)

  const getEvaluators = async () => {
    try {
      const meRes = await customAxios.get('/user/me') // token-based
      const me = meRes.data || {}
      const parentIds = Array.from(
        new Set([me?._id, me?.uuid].filter(Boolean))
      )

      if (parentIds.length === 0) {
        toast.error('Unable to identify user. Please log in again.')
        return
      }

      // Some users were linked by Mongo _id while others use uuid.
      // Query both forms to avoid missing evaluators.
      const responses = await Promise.allSettled(
        parentIds.map((parentId) => customAxios.get(`/evaluator/parent/${parentId}`))
      )

      const merged = []
      const seen = new Set()

      responses.forEach((result) => {
        if (result.status !== 'fulfilled' || result.value?.status !== 200) return

        const evaluators = Array.isArray(result.value?.data) ? result.value.data : []
        evaluators.forEach((item) => {
          const key = item?.uuid || item?._id
          if (!key || seen.has(key)) return
          seen.add(key)
          merged.push(item)
        })
      })

      setData(merged)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch evaluators')
    }
  }
  

  useEffect(() => {
    getEvaluators()
  }, [])

  const deleteEvaluator = async (id) => {
    try {
      const res = await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`
      )
      if (res?.status === 200) {
        toast.success(`${res?.data?.message}`)
        getEvaluators()
      }
    } catch (error) {
      console.log(error)
      toast.error(`Error deleting user`)
    }
  }

  const updateStatus = async (item) => {
    if (item?.userState === 'active') {
      try {
        const res = await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/${item.uuid}`,
          { userState: 'inactive' }
        )

        if (res?.status === 200) {
          getEvaluators()
          toast.success(`${res?.data?.message}`)
        }
      } catch (error) {
        toast.error(`Error Changing Status`)
        console.log(error)
      }
    } else {
      try {
        const res = await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/${item.uuid}`,
          { userState: 'active' }
        )

        if (res?.status === 200) {
          toast.success(`${res?.data?.message}`)
          getEvaluators()
        }
      } catch (error) {
        console.log(error)
        toast.error(`Error Changing Status`)
      }
    }
  }
  return (
    <>
      <section className='bg-white py-4'>
        <div className='w-full flex justify-end mb-5'>
          <Link href='/evaluator-profile/add-evaluator'>
            <button className='sm:px-6 px-4 py-2 sm:py-3 rounded primary-gradient text-white'>
              Add Evaluator
            </button>
          </Link>
        </div>
        <div className='custom-shadow rounded flex flex-col mb-3'>
          <Disclosure as='div' className='disclosure' defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full primary-gradient rounded px-7 py-4 justify-between items-center flex ${
                    open && 'mb-3'
                  }`}
                >
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                    Evaluator List
                  </span>
                  <span className='flex-shrink-0'>
                    {open ? (
                      <OpenDisclosure className='text-white' />
                    ) : (
                      <CloseDisclosure className='text-white' />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as='div' className='gap-4 px-3'>
                  <div className='rounded flex flex-col mb-8'>
                    {/* Table for larger screens */}
                    <div className='hidden md:block overflow-x-auto'>
                      <table className='bg-white w-full table-auto min-w-[600px]'>
                        <thead>
                          <tr>
                            <th className='py-2 px-4 text-left text-sm sm:text-base'>
                              Name
                            </th>
                            <th className='py-2 px-4 text-left text-sm sm:text-base'>
                              Email
                            </th>
                            <th className='py-2 px-4 text-left text-sm sm:text-base'>
                              Status
                            </th>
                            <th className='py-2 px-4  text-left text-sm sm:text-base'>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.length > 0 &&
                            data.map((item, i) => (
                              <tr
                                key={item.uuid + i}
                                className='border-t border-gray-300'
                              >
                                <td className='py-4 px-4 capitalize text-sm sm:text-base'>
                                  {item.name}
                                </td>
                                <td className='py-4 px-4 text-sm sm:text-base'>
                                  {item.email}
                                </td>
                                <td className='py-4 px-4 capitalize text-sm sm:text-base'>
                                  {item.userState}
                                </td>
                                <td className='py-4 px-4 relative text-sm sm:text-base'>
                                  <button
                                    onClick={() => setShow(i)}
                                    className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
                                  >
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='currentColor'
                                      viewBox='0 0 24 24'
                                      width='24'
                                      height='24'
                                    >
                                      <path d='M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z' />
                                    </svg>
                                  </button>
                                  {show === i && (
                                    <ul
                                      onMouseLeave={() => setShow(-1)}
                                      className='absolute bg-white border z-20 rounded shadow w-32 mt-2'
                                    >
                                      <li
                                        className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-blue-600'
                                        onClick={() => updateStatus(item)}
                                      >
                                        Change Status
                                      </li>
                                      <li
                                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600'
                                        onClick={() =>
                                          deleteEvaluator(item.uuid)
                                        }
                                      >
                                        Delete
                                      </li>
                                    </ul>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Cards for smaller screens */}
                    <div className='block md:hidden space-y-4'>
                      {data?.length > 0 &&
                        data.map((item, i) => (
                          <div
                            key={item.uuid + i}
                            className='border rounded-lg p-4 bg-white shadow-sm'
                          >
                            <div className='mb-2'>
                              <strong className='block text-sm font-medium'>
                                Name:
                              </strong>
                              <span className='text-gray-700'>{item.name}</span>
                            </div>
                            <div className='mb-2'>
                              <strong className='block text-sm font-medium'>
                                Email:
                              </strong>
                              <span className='text-gray-700'>
                                {item.email}
                              </span>
                            </div>
                            <div className='mb-2'>
                              <strong className='block text-sm font-medium'>
                                Status:
                              </strong>
                              <span className='text-gray-700 capitalize'>
                                {item.userState}
                              </span>
                            </div>
                            <div className='mt-3'>
                              <button
                                onClick={() => setShow(i)}
                                className='bg-gray-200 px-4 border sm:border-none hover:border-prussianBlue py-2 rounded hover:bg-gray-300 w-full'
                              >
                                Actions
                              </button>
                              {show === i && (
                                <ul
                                  onMouseLeave={() => setShow(-1)}
                                  className='bg-white border rounded shadow mt-2 z-10'
                                >
                                  <li
                                    className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-blue-600'
                                    onClick={() => updateStatus(item)}
                                  >
                                    Change Status
                                  </li>
                                  <li
                                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600'
                                    onClick={() => deleteEvaluator(item.uuid)}
                                  >
                                    Delete
                                  </li>
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </section>
    </>
  )
}

export default ManageEvaluators
