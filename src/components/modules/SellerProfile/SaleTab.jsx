import { CloseDisclosure, EyeIcon, OpenDisclosure } from '@/components/Icons'
import { Disclosure } from '@headlessui/react'
import React, { useState, useEffect } from 'react'

export const SaleTab = ({ userUUID, authToken }) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Define tabs based on item types
  const tabs = [
    { name: 'All Items', type: 'all' },
    { name: 'Properties', type: 'property' },
    { name: 'Cars', type: 'car' },
    { name: 'Jewelry', type: 'jewelry' },
    { name: 'Boats', type: 'boat' },
  ]

  // Fetch sales tracker data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/sales/tracker?userUUID=${userUUID}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSalesData(data.payload || [])
      } catch (err) {
        console.error('Error fetching sales data:', err)
        setError(err.message || 'Failed to fetch sales data')
      } finally {
        setLoading(false)
      }
    }

    if (userUUID && authToken) {
      fetchSalesData()
    }
  }, [userUUID, authToken])

  // Filter data based on selected tab
  const getFilteredData = () => {
    if (selectedTabIdx === 0) return salesData // All items
    const selectedType = tabs[selectedTabIdx].type
    return salesData.filter((item) => item.itemType === selectedType)
  }

  // Format data for table display
  const formatTableData = (item) => {
    const baseData = {
      id: item.uuid,
      type: item.itemType,
      title: item.title || item.name || 'N/A',
      price: item.price || 'N/A',
      status: item.status || 'N/A',
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : 'N/A',
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString()
        : 'N/A',
      transactionId: item.transactionId?.transactionId || 'N/A',
      userUUID: item.userUUID?.name || 'N/A',
      dealhunterId: item.dealhunterId?.name || 'N/A',
    }

    // Add type-specific fields
    switch (item.itemType) {
      case 'property':
        return {
          ...baseData,
          location: item.location || 'N/A',
          propertyType: item.propertyType || 'N/A',
          size: item.size || 'N/A',
        }
      case 'car':
        return {
          ...baseData,
          make: item.make || 'N/A',
          model: item.model || 'N/A',
          year: item.year || 'N/A',
          mileage: item.mileage || 'N/A',
        }
      case 'jewelry':
        return {
          ...baseData,
          material: item.material || 'N/A',
          weight: item.weight || 'N/A',
          gemstone: item.gemstone || 'N/A',
        }
      case 'boat':
        return {
          ...baseData,
          boatType: item.boatType || 'N/A',
          length: item.length || 'N/A',
          year: item.year || 'N/A',
        }
      default:
        return baseData
    }
  }

  const filteredData = getFilteredData()
  const tableData = filteredData.map(formatTableData)

  // Get table headers based on selected tab
  const getTableHeaders = () => {
    const baseHeaders = [
      'Type',
      'Title',
      'Price',
      'Status',
      'Created',
      'Transaction ID',
    ]

    if (selectedTabIdx === 0) return baseHeaders // All items

    const selectedType = tabs[selectedTabIdx].type
    switch (selectedType) {
      case 'property':
        return [...baseHeaders, 'Location', 'Property Type', 'Size']
      case 'car':
        return [...baseHeaders, 'Make', 'Model', 'Year', 'Mileage']
      case 'jewelry':
        return [...baseHeaders, 'Material', 'Weight', 'Gemstone']
      case 'boat':
        return [...baseHeaders, 'Boat Type', 'Length', 'Year']
      default:
        return baseHeaders
    }
  }

  // Get table row data based on selected tab
  const getTableRowData = (item) => {
    const baseData = [
      item.type.charAt(0).toUpperCase() + item.type.slice(1),
      item.title,
      typeof item.price === 'number'
        ? `$${item.price.toLocaleString()}`
        : item.price,
      item.status,
      item.createdAt,
      item.transactionId,
    ]

    if (selectedTabIdx === 0) return baseData // All items

    const selectedType = tabs[selectedTabIdx].type
    switch (selectedType) {
      case 'property':
        return [...baseData, item.location, item.propertyType, item.size]
      case 'car':
        return [...baseData, item.make, item.model, item.year, item.mileage]
      case 'jewelry':
        return [...baseData, item.material, item.weight, item.gemstone]
      case 'boat':
        return [...baseData, item.boatType, item.length, item.year]
      default:
        return baseData
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
                className={`w-full primary-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
                }`}
              >
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                  Sale Tracker
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='p-8 xl:py-20'>
                <div className='xl:h-[10px] xl:bg-gray relative rounded-full'>
                  <div
                    className='flex xl:absolute flex-wrap xl:flex-nowrap gap-14 -top-4 xl:justify-center xl:px-7 w-full'
                    aria-label='Tabs'
                  >
                    {tabs.map((tab, i) => (
                      <div
                        onClick={() => setSelectedTabIdx(i)}
                        key={tab.name}
                        className={`
                        ${
                          i === selectedTabIdx
                            ? 'bg-prussianBlue text-white xl:bg-transparent xl:text-black'
                            : ''
                        }
                        text-sm flex flex-col items-center cursor-pointer custom-shadow xl:shadow-none px-4 py-2 rounded-full font-medium text-center`}
                      >
                        <button
                          onClick={() => setSelectedTabIdx(i)}
                          className={`
                          ${
                            i === selectedTabIdx ? '!border-prussianBlue' : ''
                          } h-[26px] w-[26px] rounded-full border-gray border-[6px] cursor-pointer xl:flex justify-center items-center hidden `}
                        >
                          <span className='bg-white h-[14px] w-[14px] rounded-full'></span>
                        </button>
                        {tab.name}
                        <span className='text-xs mt-1 opacity-75'>
                          (
                          {tab.type === 'all'
                            ? salesData.length
                            : salesData.filter(
                                (item) => item.itemType === tab.type
                              ).length}
                          )
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-20'>
                  <h3 className='text-lg mb-3 text-black/50'>
                    {tabs[selectedTabIdx].name} Progress Tracker
                  </h3>

                  {loading && (
                    <div className='flex justify-center items-center py-8'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-prussianBlue'></div>
                      <span className='ml-2 text-black/50'>
                        Loading sales data...
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
                      <p className='text-red-800'>Error: {error}</p>
                    </div>
                  )}

                  {!loading && !error && (
                    <div className='overflow-x-auto custom-shadow rounded'>
                      <table className='custom-shadow rounded w-full min-w-[700px]'>
                        <thead>
                          <tr className='shadow'>
                            {getTableHeaders().map((header, index) => (
                              <th
                                key={index}
                                className='px-4 py-3 font-normal text-start text-black/50 whitespace-nowrap'
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.length > 0 ? (
                            tableData.map((item, index) => (
                              <tr
                                key={item.id}
                                className={
                                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                }
                              >
                                {getTableRowData(item).map(
                                  (cellData, cellIndex) => (
                                    <td
                                      key={cellIndex}
                                      className='px-4 py-3 text-start whitespace-nowrap'
                                    >
                                      {cellData}
                                    </td>
                                  )
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={getTableHeaders().length}
                                className='px-4 py-8 text-center text-black/50'
                              >
                                No {tabs[selectedTabIdx].name.toLowerCase()}{' '}
                                found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}
