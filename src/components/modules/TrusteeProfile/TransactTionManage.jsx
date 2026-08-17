'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import {
  formatAssetLabel,
  formatTransactionPhase,
  transactionPhaseBadgeClass,
} from '@/libs/transactionPhase'
import EvaluationActionDropdown, {
  evaluationMenuItemClass,
} from '@/components/modules/EvaluatorProfile/requestCompoenets/EvaluationActionDropdown'

const formatViewing = (row) => {
  if (!row?.viewingDate) return '—'
  try {
    const date = new Date(row.viewingDate).toLocaleDateString()
    return row.viewingTime ? `${date} · ${row.viewingTime}` : date
  } catch {
    return '—'
  }
}

export const TransactionMange = ({
  transactions = [],
  onView,
  onRefresh,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const menuAnchorRef = useRef(null)
  const router = useRouter()

  const closeActionMenu = () => {
    setOpenDropdown(null)
    menuAnchorRef.current = null
  }

  const toggleActionMenu = (event, bookingUuid) => {
    event.stopPropagation()
    if (openDropdown === bookingUuid) {
      closeActionMenu()
      return
    }
    menuAnchorRef.current = event.currentTarget
    setOpenDropdown(bookingUuid)
  }

  const handleDepositClick = (row) => {
    router.push(`/trustee/transaction/${row.bookingUuid}`)
  }

  return (
    <section className='bg-white py-4 w-full max-w-full min-w-0'>
      <div className='custom-shadow rounded flex flex-col mb-3'>
        <Disclosure as='div' className='disclosure' defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full primary-gradient rounded px-4 sm:px-7 py-4 justify-between items-center flex ${open && 'mb-3'
                  }`}
              >
                <span className='whitespace-nowrap text-base sm:text-xl font-medium text-white'>
                  Transaction Management
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
                <div className='custom-shadow rounded w-full max-w-full min-w-0 overflow-x-auto mb-8'>
                  <table className='w-full min-w-[900px] table-auto text-xs sm:text-sm bg-white'>
                    <thead>
                      <tr className='primary-gradient text-white'>
                        <th className='py-2 px-2 text-left font-medium'>
                          Asset
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Seller
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Buyer
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Viewing
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Success fee
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Deposit
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Status
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Documents
                        </th>
                        <th className='py-2 px-2 text-left font-medium'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className='py-8 px-2 text-center text-gray-500'
                          >
                            No active transactions yet. Mark a viewing as under
                            process or submit transfer documents from Viewing.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((row) => (
                          <tr
                            key={row.bookingUuid}
                            className='border-t border-gray-200 hover:bg-gray-50'
                          >
                            <td
                              className='py-2 px-2 text-prussianBlue'
                              title={formatAssetLabel(row)}
                            >
                              <span className='line-clamp-2'>
                                {formatAssetLabel(row)}
                              </span>
                            </td>
                            <td className='py-2 px-2 text-prussianBlue truncate'>
                              {row.sellerName}
                            </td>
                            <td className='py-2 px-2 text-prussianBlue truncate'>
                              {row.buyerName}
                            </td>
                            <td className='py-2 px-2 text-prussianBlue whitespace-nowrap'>
                              {formatViewing(row)}
                            </td>
                            <td className='py-2 px-2 text-prussianBlue whitespace-nowrap'>
                              {row.successFee
                                ? `AED ${Number(row.successFee).toLocaleString()}`
                                : row.hasTransferDoc
                                  ? 'Sent'
                                  : '—'}
                            </td>
                            <td className='py-2 px-2 text-prussianBlue'>
                              {row.hasDepositReceipt ? 'Received' : 'Pending'}
                            </td>
                            <td className='py-2 px-2'>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${transactionPhaseBadgeClass(row.phase)}`}
                              >
                                {formatTransactionPhase(row.phase)}
                              </span>
                            </td>
                            <td className='py-2 px-2 text-prussianBlue text-xs'>
                              <div className='flex flex-col gap-1'>
                                {row.transferDocumentUrl ? (
                                  <a
                                    href={row.transferDocumentUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[#002d4f] underline'
                                  >
                                    Transfer doc
                                  </a>
                                ) : null}
                                {row.paymentProofUrl ? (
                                  <a
                                    href={row.paymentProofUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[#002d4f] underline'
                                  >
                                    Fee invoice
                                  </a>
                                ) : null}
                                {!row.transferDocumentUrl && !row.paymentProofUrl
                                  ? '—'
                                  : null}
                              </div>
                            </td>
                            <td className='py-2 px-2'>
                              <button
                                type='button'
                                onClick={(e) =>
                                  toggleActionMenu(e, row.bookingUuid)
                                }
                                className='bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300'
                                aria-label='Transaction actions'
                                aria-expanded={openDropdown === row.bookingUuid}
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
                              <EvaluationActionDropdown
                                open={openDropdown === row.bookingUuid}
                                onClose={closeActionMenu}
                                anchorRef={menuAnchorRef}
                                className='w-56 min-w-[14rem]'
                              >
                                <button
                                  type='button'
                                  role='menuitem'
                                  className={evaluationMenuItemClass}
                                  onClick={() => {
                                    closeActionMenu()
                                    onView?.(row.bookingUuid)
                                  }}
                                >
                                  Manage transfer &amp; fee
                                </button>
                                <button
                                  type='button'
                                  role='menuitem'
                                  className={evaluationMenuItemClass}
                                  onClick={() => {
                                    closeActionMenu()
                                    handleDepositClick(row)
                                  }}
                                >
                                  Upload deposit receipt
                                </button>
                                {onRefresh ? (
                                  <button
                                    type='button'
                                    role='menuitem'
                                    className={evaluationMenuItemClass}
                                    onClick={() => {
                                      closeActionMenu()
                                      onRefresh()
                                    }}
                                  >
                                    Refresh
                                  </button>
                                ) : null}
                              </EvaluationActionDropdown>
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
