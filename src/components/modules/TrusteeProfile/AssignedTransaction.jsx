'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import DeleteModal from '@/components/Modals/DeleteModal'
import { toast } from 'react-toastify'
import customAxios from '../../../utils/apis/apis'
import EvaluationActionDropdown, {
  evaluationMenuItemClass,
} from '../EvaluatorProfile/requestCompoenets/EvaluationActionDropdown'

export const AssignedTransaction = ({ propertyListings, onDelete }) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const menuAnchorRef = useRef(null)

  const router = useRouter()

  const closeActionMenu = () => {
    setOpenDropdown(null)
    menuAnchorRef.current = null
  }

  const toggleActionMenu = (event, propertyUuid) => {
    event.stopPropagation()
    if (openDropdown === propertyUuid) {
      closeActionMenu()
      return
    }
    menuAnchorRef.current = event.currentTarget
    setOpenDropdown(propertyUuid)
  }

  const handleTabClick = async (selectedProperty) => {
    if (selectedProperty?.type === 'property') {
      router.replace(
        `/trustee/assigned/${selectedProperty.uuid}?assetType=${selectedProperty.assetType}`
      )
    } else if (selectedProperty?.type === 'car') {
      router.replace(
        `/trustee/assigned/${selectedProperty.uuid}?assetType=${selectedProperty.assetType}`
      )
    } else if (selectedProperty?.type === 'boat') {
      router.replace(
        `/trustee/assigned/${selectedProperty.uuid}?assetType=${selectedProperty.assetType}`
      )
    } else if (selectedProperty?.type === 'jewelry') {
      router.replace(
        `/trustee/assigned/${selectedProperty.uuid}?assetType=${selectedProperty.assetType}`
      )
    }
  }

  const handleSubmit = async (selectedProperty) => {
    try {
      let apiUrl

      if (selectedProperty?.type === 'property') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/property/${selectedProperty.uuid}`
      } else if (selectedProperty?.type === 'car') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/car/${selectedProperty.uuid}`
      } else if (selectedProperty?.type === 'boat') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/boat/${selectedProperty.uuid}`
      } else if (selectedProperty?.type === 'jewelry') {
        apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${selectedProperty.uuid}`
      }

      const response = await customAxios.put(
        apiUrl,
        { transactionStatus: 'completed ' },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200) {
        // Handle success
        alert('Updated Successfully')
      } else {
        toast.error('Something wents wrong')
        console.error('Failed to upated transaction status:', response.data)
      }
    } catch (error) {
      console.error(
        'An error occurred while updating the transaction status:',
        error
      )
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
                  className={`w-full primary-gradient rounded px-7 py-4 justify-between items-center flex ${open && 'mb-3'
                    }`}
                >
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                    Transactions
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
                  <Disclosure
                    as='div'
                    className='disclosure'
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <div className='rounded overflow-x-auto flex flex-col mb-8'>
                          <table className='bg-white w-full'>
                            <thead>
                              <tr className='w-full'>
                                <th className='py-2 text-xs sm:text-base px-4 text-left'>
                                  Transactions
                                </th>
                                <th className='py-2 text-xs sm:text-base px-4 text-left'>
                                  Title
                                </th>
                                <th className='py-2 text-xs sm:text-base px-4 text-left'>
                                  Address
                                </th>
                                <th className='py-2 text-xs sm:text-base px-4 text-left'>
                                  Viewing slot
                                </th>
                                <th className='py-2 text-xs sm:text-base px-4 text-left'>
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {propertyListings
                                .filter(
                                  (property) =>
                                    property.status === 0 ||
                                    property.status === 1 ||
                                    !property.hasOwnProperty('status')
                                )
                                .map((property, i) => {
                                  const date = new Date(
                                    property.evaluationDateTime
                                  )

                                  return (
                                    <tr
                                      key={property.uuid}
                                      className='border-t border-[#2A3E75]'
                                    >
                                      <td className='py-4 text-xs sm:text-base px-4 capitalize'>
                                        Transaction
                                        {String(i + 1).padStart(3, '0')}
                                      </td>
                                      <td className='py-4 px-4 text-xs sm:text-base capitalize'>
                                        {property.title}
                                      </td>
                                      <td className='py-4 text-xs sm:text-base px-4'>
                                        {property.brokerName ? (
                                          <>
                                            <span className='block font-medium text-slate-800'>
                                              {property.brokerName}
                                            </span>
                                            <span className='text-slate-500'>
                                              Sale of {property.type} at{' '}
                                              {property.neighbourhood}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            Sale of {property.type} at
                                            <span className='ml-1'>
                                              {property.neighbourhood}
                                            </span>
                                          </>
                                        )}
                                      </td>
                                      <td className='py-4 text-xs sm:text-base capitalize px-4'>
                                        {property.viewingTime
                                          ? `${property.viewingTime}${property.viewingDate ? ` · ${new Date(property.viewingDate).toLocaleDateString()}` : ''}`
                                          : property.transactionStatus || '—'}
                                      </td>

                                      <td className='py-4 px-4'>
                                        <button
                                          type='button'
                                          aria-haspopup='menu'
                                          aria-expanded={
                                            openDropdown === property.uuid
                                          }
                                          onClick={(e) =>
                                            toggleActionMenu(e, property.uuid)
                                          }
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
                                        <EvaluationActionDropdown
                                          open={openDropdown === property.uuid}
                                          onClose={closeActionMenu}
                                          anchorRef={menuAnchorRef}
                                          className='w-44 min-w-[11rem]'
                                        >
                                          <button
                                            type='button'
                                            className={evaluationMenuItemClass}
                                            onClick={() => {
                                              handleSubmit(property)
                                              closeActionMenu()
                                            }}
                                          >
                                            Marked as Complete
                                          </button>
                                          <button
                                            type='button'
                                            className={evaluationMenuItemClass}
                                            onClick={() => {
                                              handleTabClick(property)
                                              closeActionMenu()
                                            }}
                                          >
                                            View
                                          </button>
                                          <button
                                            type='button'
                                            className={`${evaluationMenuItemClass} text-red-600`}
                                            onClick={() => {
                                              onDelete(property)
                                              closeActionMenu()
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </EvaluationActionDropdown>
                                      </td>
                                    </tr>
                                  )
                                })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </Disclosure>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={handleDeleteConfirm}
          />
        )}
      </section>
    </>
  )
}
