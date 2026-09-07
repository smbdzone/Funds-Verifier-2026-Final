import React, { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { CloseDisclosure, OpenDisclosure } from '@/components/Icons'
import TransactionStatus from './purchaseComponents/TransactionStatus'
import AssetDetails from './purchaseComponents/AssetDetails'
import TimelineActivity from './purchaseComponents/TimelineActivity'
import ProgressTracking from './purchaseComponents/ProgressTracking'
import EscrowAccount from './purchaseComponents/EscrowAccount'
import customAxios from '@/utils/apis/apis'

export const PurchaseTab = ({ userUUID }) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const [purchaseData, setPurchaseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { name: 'Transaction Status' },
    { name: 'Asset Details' },
    { name: 'Timeline of Activities' },
    { name: 'Escrow Account Information' },
    { name: 'Progress Tracking' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await customAxios.get('/purchases/tracker', {
          params: { userUUID },
        })

        setPurchaseData(response.data.payload || [])
      } catch (err) {
        setError(
          err?.response?.data?.message || 'Failed to fetch purchase data.',
        )
      } finally {
        setLoading(false)
      }
    }

    if (userUUID) fetchData()
  }, [userUUID])

  const renderComponent = () => {
    const props = { data: purchaseData }

    switch (selectedTabIdx) {
      case 0:
        return <TransactionStatus {...props} />
      case 1:
        return <AssetDetails {...props} />
      case 2:
        return <TimelineActivity {...props} />
      case 3:
        return <EscrowAccount {...props} />
      case 4:
        return <ProgressTracking {...props} />
      default:
        return null
    }
  }

  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4 block'>Tracking</span>
      <div className='custom-shadow rounded flex flex-col gap-2'>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${open && 'mb-3'
                  }`}
              >
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                  Purchase Tracker
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel className='p-8 xl:py-20'>
                {/* Tab Bar */}
                <div className='xl:h-[10px] xl:bg-gray relative rounded-full'>
                  <div className='flex xl:absolute flex-wrap xl:flex-nowrap gap-4 -top-4 xl:justify-center xl:px-7 w-full'>
                    {tabs.map((tab, i) => (
                      <div
                        key={tab.name}
                        onClick={() => setSelectedTabIdx(i)}
                        className={`text-sm flex flex-col items-center cursor-pointer custom-shadow xl:shadow-none px-4 py-2 rounded-full font-medium text-center
                          ${i === selectedTabIdx
                            ? 'bg-reefGold text-white xl:bg-transparent xl:text-black'
                            : ''
                          }
                        `}
                      >
                        <button
                          onClick={() => setSelectedTabIdx(i)}
                          className={`h-[26px] border-gray w-[26px] rounded-full border-[6px] cursor-pointer xl:flex justify-center items-center hidden ${i === selectedTabIdx ? '!border-reefGold' : ''
                            }`}
                        >
                          <span className='bg-white h-[14px] w-[14px] rounded-full'></span>
                        </button>
                        {tab.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loading / Error / Content */}
                <div className='mt-10'>
                  {loading && <p>Loading purchase data...</p>}
                  {error && <p className='text-red-600'>{error}</p>}
                  {!loading && !error && purchaseData.length === 0 && (
                    <p className='text-center text-black/50 py-8'>
                      No purchase records found.
                    </p>
                  )}
                  {!loading && !error && purchaseData.length > 0 && renderComponent()}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}
