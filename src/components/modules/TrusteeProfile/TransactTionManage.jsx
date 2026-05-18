'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import DeleteModal from '@/components/Modals/DeleteModal'
import { toast } from 'react-toastify'
import customAxios from '../../../utils/apis/apis'

export const TransactionMange = ({ propertyListings, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [show, setShow] = useState(-1)
  const router = useRouter()

  const handleTabClick = async (selectedProperty) => {
    router.replace(
      `/trustee/transaction/${selectedProperty.uuid}?assetType=${selectedProperty.assetType}`
    )
  }

  const handleSubmit = async (selectedProperty, action) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${selectedProperty.type}/${selectedProperty.uuid}`
      const requestData =
        action === 'markComplete'
          ? { transactionStatus: 'completed' }
          : { depositReceipt: 'received' }

      const response = await customAxios.put(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      })

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
    <>
      <section className='bg-white py-4'>
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
                  <div className='rounded overflow-x-auto flex flex-col mb-8'>
                    <table className='bg-white w-full'>
                      <thead>
                        <tr className='w-full'>
                          <th className='py-2 px-2 sm:px-4 text-left'>
                            Asset Details
                          </th>
                          <th className='py-2 px-2 sm:px-4 text-left'>
                            Seller
                          </th>
                          <th className='py-2 px-2 sm:px-4 text-left'>Buyer</th>
                          <th className='py-2 px-2 sm:px-4 text-left'>
                            Status
                          </th>
                          <th className='py-2 px-2 sm:px-4 text-left'>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyListings
                          .filter(
                            (property) =>
                              property.status === 0 ||
                              !property.hasOwnProperty('status')
                          )
                          .map((property, i) => (
                            <tr
                              key={property.uuid}
                              className='border-t border-[#2A3E75]'
                            >
                              <td className='py-4 px-2 sm:px-4'>
                                <span className='font-semibold truncate text-xs sm:text-base capitalize mr-1'>
                                  {property.type}:
                                </span>
                                {property.title} at
                                <span className='ml-1'>
                                  {property.neighbourhood}
                                </span>
                              </td>
                              <td className='py-4 px-2 sm:px-4'>
                                {property?.dealhunterId?.name
                                  ? property?.dealhunterId?.name
                                  : 'Not found'}
                              </td>
                              <td className='py-4 px-2 sm:px-4'>
                                {property?.userUUID?.name
                                  ? property?.userUUID?.name
                                  : 'Not found'}
                              </td>
                              <td className='py-4 capitalize px-2 sm:px-4'>
                                {property.transactionStatus}
                              </td>
                              <td className='py-4 px-2 sm:px-4 relative'>
                                <button
                                  onClick={() => setShow(i)}
                                  className='bg-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-gray-300'
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
                                    className='absolute bg-white border z-20 rounded shadow w-40 sm:w-44 mt-2'
                                  >
                                    <li
                                      className='px-2 sm:px-4 py-2 hover:text-prussianBlue/60 cursor-pointer'
                                      onClick={() =>
                                        handleSubmit(property, 'markComplete')
                                      }
                                    >
                                      Mark as Completed
                                    </li>
                                    <li
                                      className='px-2 sm:px-4 py-2 hover:text-prussianBlue/60 cursor-pointer'
                                      onClick={() =>
                                        handleSubmit(property, 'confirmDeposit')
                                      }
                                    >
                                      Confirm Deposit
                                    </li>
                                    <li
                                      className='px-2 sm:px-4 py-2 hover:text-prussianBlue/60 cursor-pointer'
                                      onClick={() => handleTabClick(property)}
                                    >
                                      View
                                    </li>
                                    <li
                                      className='px-2 sm:px-4 py-2 hover:text-red-400 cursor-pointer text-red-600'
                                      onClick={() => onDelete(property)}
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
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={onDelete}
          />
        )}
      </section>
    </>
  )
}
