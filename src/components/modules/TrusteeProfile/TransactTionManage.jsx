'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import { toast } from 'react-toastify'
import customAxios from '../../../utils/apis/apis'

function formatAssetDetails(property) {
  const title = property?.title || 'Untitled'
  const area = property?.neighbourhood ? ` at ${property.neighbourhood}` : ''
  return `${title}${area}`
}

export const TransactionMange = ({ propertyListings, totalCount = 0, onDelete }) => {
  const [show, setShow] = useState(-1)
  const router = useRouter()

  const handleTabClick = async (selectedProperty) => {
    router.replace(
      `/trustee/transaction/${selectedProperty.uuid}?assetType=${selectedProperty.assetType}`,
    )
  }

  const handleSubmit = async (selectedProperty, action) => {
    try {
      const apiUrl = `/${selectedProperty.type}/${selectedProperty.uuid}`
      const requestData =
        action === 'markComplete'
          ? { transactionStatus: 'completed' }
          : { depositReceipt: 'received' }

      const response = await customAxios.put(apiUrl, requestData)

      if (response.status === 200) {
        toast.success('Submitted')
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      toast.error('An error occurred while updating')
    }
  }

  return (
    <section className='bg-white py-4 w-full max-w-full min-w-0'>
      <div className='custom-shadow rounded flex flex-col mb-3'>
        <Disclosure as='div' className='disclosure' defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full primary-gradient rounded px-4 sm:px-7 py-4 justify-between items-center flex ${
                  open && 'mb-3'
                }`}
              >
                <span className='whitespace-nowrap text-base sm:text-xl font-medium text-white'>
                  Transactions Management
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
                <div className='custom-shadow rounded w-full max-w-full min-w-0 overflow-hidden mb-8'>
                  <table className='w-full table-fixed text-xs sm:text-sm bg-white'>
                    <thead>
                      <tr className='primary-gradient text-white'>
                        <th className='py-2 px-2 text-left font-medium w-[28%]'>
                          Asset Details
                        </th>
                        <th className='py-2 px-2 text-left font-medium w-[18%]'>
                          Seller
                        </th>
                        <th className='py-2 px-2 text-left font-medium w-[18%]'>
                          Buyer
                        </th>
                        <th className='py-2 px-2 text-left font-medium w-[16%]'>
                          Status
                        </th>
                        <th className='py-2 px-2 text-left font-medium w-[20%]'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertyListings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className='py-8 px-2 text-center text-gray-500'
                          >
                            {totalCount === 0
                              ? 'No transactions found.'
                              : 'No transactions on this page.'}
                          </td>
                        </tr>
                      ) : (
                        propertyListings.map((property, i) => (
                          <tr
                            key={property.uuid}
                            className='border-t border-gray-200 hover:bg-gray-50'
                          >
                            <td
                              className='py-2 px-2 text-prussianBlue truncate capitalize'
                              title={formatAssetDetails(property)}
                            >
                              <span className='font-medium'>
                                {property.type}:
                              </span>{' '}
                              {formatAssetDetails(property)}
                            </td>
                            <td
                              className='py-2 px-2 text-prussianBlue truncate'
                              title={property?.userUUID?.name || 'Not found'}
                            >
                              {property?.userUUID?.name || 'Not found'}
                            </td>
                            <td
                              className='py-2 px-2 text-prussianBlue truncate'
                              title={
                                property?.dealhunterId?.name || 'Not found'
                              }
                            >
                              {property?.dealhunterId?.name || 'Not found'}
                            </td>
                            <td className='py-2 px-2 capitalize text-prussianBlue truncate'>
                              {property.transactionStatus || '—'}
                            </td>
                            <td className='py-2 px-2 relative'>
                              <button
                                type='button'
                                onClick={() =>
                                  setShow((current) =>
                                    current === i ? -1 : i,
                                  )
                                }
                                className='bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300'
                                aria-label='Transaction actions'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='currentColor'
                                  viewBox='0 0 24 24'
                                  width='20'
                                  height='20'
                                >
                                  <path d='M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z' />
                                </svg>
                              </button>
                              {show === i && (
                                <ul
                                  onMouseLeave={() => setShow(-1)}
                                  className='absolute right-0 bg-white border z-20 rounded shadow w-44 mt-1 text-sm'
                                >
                                  <li>
                                    <button
                                      type='button'
                                      className='w-full px-4 py-2 text-left hover:bg-gray-50'
                                      onClick={() =>
                                        handleSubmit(property, 'markComplete')
                                      }
                                    >
                                      Mark as Completed
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type='button'
                                      className='w-full px-4 py-2 text-left hover:bg-gray-50'
                                      onClick={() =>
                                        handleSubmit(
                                          property,
                                          'confirmDeposit',
                                        )
                                      }
                                    >
                                      Confirm Deposit
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type='button'
                                      className='w-full px-4 py-2 text-left hover:bg-gray-50'
                                      onClick={() => handleTabClick(property)}
                                    >
                                      View
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      type='button'
                                      className='w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50'
                                      onClick={() => onDelete(property)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </section>
  )
}
