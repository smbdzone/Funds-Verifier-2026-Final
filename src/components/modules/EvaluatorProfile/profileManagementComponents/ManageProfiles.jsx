import { CloseDisclosure, OpenDisclosure } from '@/components/Icons'
import React, { useEffect, useRef, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import customAxios from '../../../../utils/apis/apis'
import { formatDateTime } from '@/utils/global-functions/global'
import DeleteModal from '../../../Modals/DeleteModal'
import EvaluationActionDropdown, {
  evaluationMenuItemClass,
} from '../requestCompoenets/EvaluationActionDropdown'

const formatAddedDateTime = (value) => {
  const { formattedDate, formattedTime } = formatDateTime(value)
  if (formattedDate === '--') return '—'
  return `${formattedDate}, ${formattedTime}`
}

const statusColors = {
  active: 'text-green-600 font-medium',
  inactive: 'text-gray-500 font-medium',
}

const getEvaluatorId = (item) => {
  const id = item?.uuid
  return id ? String(id) : null
}

const getStatusKey = (userState) => String(userState || '').toLowerCase()

const ManageEvaluators = () => {
  const [data, setData] = useState()
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [activeMenuItem, setActiveMenuItem] = useState(null)
  const menuAnchorRef = useRef(null)

  const closeActionMenu = () => {
    setOpenDropdown(null)
    setActiveMenuItem(null)
    menuAnchorRef.current = null
  }

  const toggleActionMenu = (event, item) => {
    event.stopPropagation()
    const itemId = getEvaluatorId(item)
    if (!itemId) {
      toast.error('Unable to identify sub-evaluator')
      return
    }
    if (openDropdown === itemId) {
      closeActionMenu()
      return
    }
    menuAnchorRef.current = event.currentTarget
    setOpenDropdown(itemId)
    setActiveMenuItem(item)
  }

  const runMenuAction = (action) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    const item = activeMenuItem
    closeActionMenu()
    if (item) action(item)
  }

  const getEvaluators = async () => {
    try {
      const meRes = await customAxios.get('/user/me')
      const me = meRes.data || {}
      const parentId = me?.uuid || me?._id

      if (!parentId) {
        toast.error('Unable to identify user. Please log in again.')
        return
      }

      const res = await customAxios.get(`/evaluator/parent/${parentId}`)
      const evaluators = Array.isArray(res?.data) ? res.data : []

      evaluators.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )

      setData(evaluators)
    } catch (error) {
      console.error(error)
      toast.error(
        error?.response?.data?.message || 'Failed to fetch evaluators',
      )
    }
  }


  useEffect(() => {
    getEvaluators()
  }, [])

  const deleteEvaluator = async (item) => {
    const id = getEvaluatorId(item)
    if (!id) {
      toast.error('Unable to identify sub-evaluator')
      return
    }

    try {
      const res = await customAxios.delete(`/evaluator/sub-evaluator/${id}`)
      if (res?.status === 200) {
        toast.success(res?.data?.message || 'Sub-evaluator deleted')
        getEvaluators()
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.message || 'Error deleting sub-evaluator',
      )
    } finally {
      setDeleteTarget(null)
    }
  }

  const updateStatus = async (item) => {
    const id = getEvaluatorId(item)
    if (!id) {
      toast.error('Unable to identify sub-evaluator')
      return
    }

    const nextState =
      getStatusKey(item?.userState) === 'active' ? 'inactive' : 'active'
    setActionLoadingId(id)
    try {
      const res = await customAxios.put(`/evaluator/sub-evaluator/${id}/status`, {
        userState: nextState,
      })

      if (res?.status === 200) {
        getEvaluators()
        toast.success(res?.data?.message || 'Status updated')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Error changing status',
      )
      console.log(error)
    } finally {
      setActionLoadingId(null)
    }
  }

  const renderActionButton = (item) => {
    const itemId = getEvaluatorId(item)
    const isLoading = actionLoadingId === itemId

    return (
      <button
        type='button'
        aria-haspopup='menu'
        aria-expanded={openDropdown === itemId}
        disabled={isLoading || !itemId}
        onClick={(e) => toggleActionMenu(e, item)}
        className='inline-flex h-9 w-9 items-center justify-center rounded-md text-xl leading-none text-gray-600 hover:bg-slate-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        ⋯
      </button>
    )
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
                  className={`w-full primary-gradient rounded px-7 py-4 justify-between items-center flex ${open && 'mb-3'
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
                    <div className='hidden md:block overflow-x-auto custom-shadow rounded'>
                      <table className='bg-white w-full table-auto min-w-[700px] text-sm sm:text-base'>
                        <thead>
                          <tr className='primary-gradient text-white'>
                            <th className='py-3 px-4 text-left font-medium'>
                              Name
                            </th>
                            <th className='py-3 px-4 text-left font-medium'>
                              Email
                            </th>
                            <th className='py-3 px-4 text-left font-medium'>
                              Date &amp; Time
                            </th>
                            <th className='py-3 px-4 text-left font-medium'>
                              Status
                            </th>
                            <th className='py-3 px-4 text-left font-medium'>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.length > 0 &&
                            data.map((item, i) => {
                              const itemId = getEvaluatorId(item)
                              const statusKey = getStatusKey(item.userState)
                              return (
                                <tr
                                  key={itemId + i}
                                  className='border-t border-gray-200 hover:bg-gray-50'
                                >
                                  <td className='py-3 px-4 capitalize text-prussianBlue font-medium'>
                                    {item.name}
                                  </td>
                                  <td className='py-3 px-4 text-prussianBlue'>
                                    {item.email}
                                  </td>
                                  <td className='py-3 px-4 whitespace-nowrap text-prussianBlue'>
                                    {formatAddedDateTime(item.createdAt)}
                                  </td>
                                  <td
                                    className={`py-3 px-4 capitalize ${statusColors[statusKey] || 'text-prussianBlue'}`}
                                  >
                                    {item.userState}
                                  </td>
                                  <td className='py-3 px-4'>
                                    {renderActionButton(item)}
                                  </td>
                                </tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>

                    {/* Cards for smaller screens */}
                    <div className='block md:hidden space-y-4'>
                      {data?.length > 0 &&
                        data.map((item, i) => {
                          const itemId = getEvaluatorId(item)
                          return (
                            <div
                              key={itemId + i}
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
                                  Date &amp; Time:
                                </strong>
                                <span className='text-gray-700'>
                                  {formatAddedDateTime(item.createdAt)}
                                </span>
                              </div>
                              <div className='mb-2'>
                                <strong className='block text-sm font-medium text-prussianBlue'>
                                  Status:
                                </strong>
                                <span
                                  className={`capitalize ${statusColors[getStatusKey(item.userState)] || 'text-gray-700'}`}
                                >
                                  {item.userState}
                                </span>
                              </div>
                              <div className='mt-3'>
                                {renderActionButton(item)}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </section>

      {deleteTarget && (
        <DeleteModal
          onClose={() => setDeleteTarget(null)}
          onDelete={() => deleteEvaluator(deleteTarget)}
          title='Delete Sub-Evaluator'
          message={`Are you sure you want to delete ${deleteTarget?.name || 'this sub-evaluator'}?`}
        />
      )}

      <EvaluationActionDropdown
        open={Boolean(activeMenuItem)}
        onClose={closeActionMenu}
        anchorRef={menuAnchorRef}
      >
        <button
          type='button'
          disabled={actionLoadingId === getEvaluatorId(activeMenuItem)}
          onMouseDown={runMenuAction(updateStatus)}
          className={evaluationMenuItemClass}
        >
          {getStatusKey(activeMenuItem?.userState) === 'active'
            ? 'Set Inactive'
            : 'Set Active'}
        </button>
        <button
          type='button'
          disabled={actionLoadingId === getEvaluatorId(activeMenuItem)}
          onMouseDown={runMenuAction((item) => setDeleteTarget(item))}
          className={`${evaluationMenuItemClass} text-[#8D7C3B]`}
        >
          Delete
        </button>
      </EvaluationActionDropdown>
    </>
  )
}

export default ManageEvaluators
