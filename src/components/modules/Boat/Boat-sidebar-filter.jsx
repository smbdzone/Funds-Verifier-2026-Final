'use client'
import { Disclosure } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { CloseDisclosure, OpenDisclosure } from '@/components/Icons'
import FormCheck from '@/components/CheckBoxComponent/FormCheck'
import { useRouter, useSearchParams } from 'next/navigation'

export const FilterSidebar = () => {
  const [value, setValue] = useState(50)
  const [extras, setExtras] = useState(false)
  const [show, setShow] = useState(false)
  const [interiorshow, setInteriorShow] = useState(false)
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const router = useRouter()

  const searchParams = useSearchParams()

  useEffect(() => {}, [searchParams])

  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('propertyType', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForProperty(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('assetType', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForCountry(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('country', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForCity(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('city', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  const handleCheckboxChange = (event) => {
    event.preventDefault()
    const { value, checked } = event.target
    if (checked) {
      setSelectedFilters([...selectedFilters, value])
    }
  }

  const handleClick = (value) => {
    router.push(`/${value}`)
  }
  return (
    <div className='flex flex-wrap lg:flex-nowrap gap-5 py-5'>
      <aside className='custom-shadow w-full xl:w-auto lg:min-w-[385px]'>
        <span className='border-b block px-10 py-4 text-xl text-darkGray '>
          Side Menu
        </span>
        <div className='border-b '>
          <div className='px-10 py-3'>
            <Disclosure as='div' className={`mb-3`} defaultOpen={true}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span
                      className='text-[22px] text-reefGold'
                      onClick={() => {
                        handleClick('property')
                        updateSortingForProperty('Property For Sale')
                      }}
                    >
                      Property For Sale
                    </span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel as='div' className='px-8 text-lg'>
                    <Disclosure as='div' className={`disclosure`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-xl text-reefGold'>
                              Residential
                            </span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Apartment')}
                            >
                              Apartment
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Villa')}
                            >
                              Villa
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Townhouse')}
                            >
                              Townhouse
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Multiple')}
                            >
                              Multiple
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Penthouse')}
                            >
                              Penthouse
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() =>
                                updateSorting('Residential Building')
                              }
                            >
                              Residential Building
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Residential Floor')}
                            >
                              Residential Floor
                            </button>
                            <button
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Villa Compound')}
                            >
                              Villa Compound
                            </button>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`disclosure`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-xl'>Commercial</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Office')}
                            >
                              Office
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Industrials')}
                            >
                              Industrials
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Retail')}
                            >
                              Retail
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() =>
                                updateSorting('Staff Accommodation')
                              }
                            >
                              Staff Accommodation
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Shop')}
                            >
                              Shop
                            </p>
                            <p onClick={() => updateSorting('Warehouse')}>
                              Warehouse
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Commercial Floor')}
                            >
                              Commercial Floor
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Commercial Villa')}
                            >
                              Commercial Villa
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Bulk Unit')}
                            >
                              Bulk Unit
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Commercial Plot')}
                            >
                              Commercial Plot
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting(' Factory')}
                            >
                              Factory
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Industrial Land')}
                            >
                              Industrial Land
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Mixed Use Land')}
                            >
                              Mixed Use Land
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() => updateSorting('Showroom')}
                            >
                              Showroom
                            </p>
                            <p
                              className='cursor-pointer text-left'
                              onClick={() =>
                                updateSorting('Commercial Building')
                              }
                            >
                              Commercial Building
                            </p>
                            <p className='cursor-pointer text-left'>Other</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`disclosure`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-xl'>Land</span>
                          
                          </Disclosure.Button>
                         
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`disclosure`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-xl'>Multiple</span>
                            <span className='flex-shrink-0'>
                            
                            </span>
                          </Disclosure.Button>
                         
                        </>
                      )}
                    </Disclosure>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as='div' className={`mb-3`} defaultOpen={true}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span
                      onClick={() => handleClick('car')}
                      className='text-[22px] text-reefGold '
                    >
                      Car For Sale
                    </span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel
                    as='div'
                    className='text-blackRussian/50 px-8 text-lg'
                  >
                    <Disclosure as='div' className={`mb-3`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-[20px]'>Toyota</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='text-blackRussian/50 px-8 text-lg'
                          >
                            <p className='text-reefGold mb-2'>Fortuner</p>
                            <p className='mb-2'>Prado</p>
                            <p className='mb-2'>Hiace</p>
                            <p className='mb-2'>4Runner</p>
                            <p className='mb-2'>FJ Cruiser</p>
                            <p className='mb-2'>Land Cruiser</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`mb-3`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-[20px]'>Mercedes-Benz</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='text-blackRussian/50 px-8 text-lg'
                          >
                            <p className='mb-2'>FJ Cruiser</p>
                            <p className='mb-2'>Land Cruiser</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`mb-3`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-[20px]'>BMW</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='text-blackRussian/50 px-8 text-lg'
                          >
                            <p className='mb-2'>FJ Cruiser</p>
                            <p className='mb-2'>Land Cruiser</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`mb-3`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-[20px]'>Land-Rover</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='text-blackRussian/50 px-8 text-lg'
                          >
                            <p className='mb-2'>FJ Cruiser</p>
                            <p className='mb-2'>Land Cruiser</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`mb-3`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-[20px]'>Lexus</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='text-blackRussian/50 px-8 text-lg'
                          >
                            <p className='mb-2'>FJ Cruiser</p>
                            <p className='mb-2'>Land Cruiser</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div' className={`mb-3`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='text-[20px]'>Honda</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='text-blackRussian/50 px-8 text-lg'
                          >
                            <p className='mb-2'>FJ Cruiser</p>
                            <p className='mb-2'>Land Cruiser</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as='div' className={`mb-3`} defaultOpen={true}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span
                      onClick={() => handleClick('jewelry')}
                      className='text-[22px]'
                    >
                      Jewelery For Sale
                    </span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel
                    as='div'
                    className='flex flex-col gap-1 px-8 text-lg'
                  >
                    <Disclosure as='div' defaultOpen={true}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl text-reefGold'>
                              Necklace
                            </span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Collar Necklace</p>
                            <p>Locket</p>
                            <p>Box Chain</p>
                            <p>Rope Chain</p>
                            <p>Long Necklace</p>
                            <p>Princess Necklace</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl '>Rings</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Cocktail rings</p>
                            <p>Signet rings</p>
                            <p>Ceramic rings</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl  '>Earring</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Stud Earrings</p>
                            <p>Solitaire Earrings</p>
                            <p>Hoop Earrings</p>
                            <p>Huggie Earrings</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl  '>Bracelet</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Charm Bracelets</p>
                            <p>Beaded Bracelets</p>
                            <p>Bangle Bracelets</p>
                            <p>Cuff Bracelets</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl  '>Diamond</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Natural diamonds</p>
                            <p>Colored diamonds</p>
                            <p>Treated diamonds</p>
                            <p>Pink diamonds</p>
                            <p>Emerald diamonds</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl '>Gold</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>White Gold</p>
                            <p>Rose Gold</p>
                            <p>Yellow Gold</p>
                            <p>Gold plated</p>
                            <p>Gold vermeil</p>
                            <p>Gold filled</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as='div' className={`mb-3`}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span
                      onClick={() => handleClick('boat')}
                      className='text-[22px]'
                    >
                      Boats For Sale
                    </span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel as='div' className='px-8 text-lg'>
                    <Disclosure as='div' defaultOpen={true}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl text-reefGold'>
                              Power Boats
                            </span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Motor Boat</p>
                            <p>Bayliner</p>
                            <p>Everglades Boats</p>
                            <p>Viking</p>
                            <p>Cruise Boats</p>
                            <p>Bass Boats</p>
                            <p>Pontoon Boats</p>
                            <p>Bay Boats</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl '>Sail Boats</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Motor Boat</p>
                            <p>Speed Boats</p>
                            <p>Cruise Boats</p>
                            <p>Bass Boats</p>
                            <p>Pontoon Boats</p>
                            <p>Bay Boats</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl '>Row Boats</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Motor Boat</p>
                            <p>Speed Boats</p>
                            <p>Cruise Boats</p>
                            <p>Bass Boats</p>
                            <p>Pontoon Boats</p>
                            <p>Bay Boats</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl '>Paddle Boats</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Motor Boat</p>
                            <p>Speed Boats</p>
                            <p>Cruise Boats</p>
                            <p>Bass Boats</p>
                            <p>Pontoon Boats</p>
                            <p>Bay Boats</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl'>Jet Boats</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Motor Boat</p>
                            <p>Speed Boats</p>
                            <p>Cruise Boats</p>
                            <p>Bass Boats</p>
                            <p>Pontoon Boats</p>
                            <p>Bay Boats</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-6 gap-4 justify-between items-center flex`}
                          >
                            <span className='text-xl'>Deck Boats</span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-[#8D7C3B]' />
                              ) : (
                                <CloseDisclosure className='text-[#8D7C3B]' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel
                            as='div'
                            className='flex flex-col gap-1 px-8 text-lg'
                          >
                            <p>Motor Boat</p>
                            <p>Speed Boats</p>
                            <p>Cruise Boats</p>
                            <p>Bass Boats</p>
                            <p>Pontoon Boats</p>
                            <p>Bay Boats</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <span className='mb-3 block text-xl'>Filter by price</span>
            <input
              type='range'
              min='0' // Minimum value
              max='100' // Maximum value
              value={value}
              onChange={handleChange}
              className='mb-3 appearance-none w-64 bg-whiteSmoke h-1 rounded-full outline-none transition-colors duration-200 ease-in-out focus:ring-2 focus:bg-reefGold'
            />
            <p className='text-xs'>Price : 1,000$ - 4,000$</p>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <p className='text-xl mb-3'>Filter by Country</p>
            <Disclosure as='div' className={`disclosure`}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span className='text-base'>United Arab Emirate</span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel as='div' className='px-8 text-sm'>
                    <p onClick={() => updateSortingForCountry('USA')}>USA</p>
                    <p onClick={() => updateSortingForCountry('UK')}>UK</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <p className='text-xl mb-3'>Filter by City</p>
            <Disclosure as='div' className={`disclosure`}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span className='text-base'>Dubai</span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel as='div' className='px-8 text-sm'>
                    <p onClick={() => updateSortingForCity('Dubai')}>Dubai</p>
                    <p onClick={() => updateSortingForCountry('Sharja')}>
                      Sharja
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <p className='text-xl mb-3'>Filter by Categories</p>
            <Disclosure as='div' className={`disclosure`}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span className='text-base'>Cars</span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel as='div' className='px-8 text-sm'>
                    <p>Land</p>
                    <p>Jewellary</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <p className='text-xl mb-3'>Neighborhood</p>
            <Disclosure as='div' className={`disclosure`}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span className='text-base'>Business Bay</span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
                      )}
                    </span>
                  </Disclosure.Button>
                  <Disclosure.Panel as='div' className='px-8 text-sm'>
                    <p onClick={() => updateSortingForCountry('Sharja')}>
                      Sharja
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        <div className='border-b '>
          <div className='px-10 py-3'>
            <div className='mb-3'>
              <Disclosure as='div' className={`mb-3`} defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={` w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                        open && 'mb-3'
                      }`}
                    >
                      <span className='text-xl'>Exterior Color</span>
                      <span className='flex-shrink-0'>
                        {open ? (
                          <OpenDisclosure className='text-[#8D7C3B]' />
                        ) : (
                          <CloseDisclosure className='text-[#8D7C3B]' />
                        )}
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel
                      as='div'
                      className=' bg-whiteSmoke px-4 py-3 text-xs'
                    >
                      <div className='grid grid-cols-4 gap-3'>
                        <FormCheck
                          value='Black'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Black'
                          id='1'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Purple'
                          id='2'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Brown'
                          id='3'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Light'
                          id='4'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Blue'
                          id='5'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Red'
                          id='6'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Silver'
                          id='7'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Dark'
                          id='8'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Pink'
                          id='9'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Green'
                          id='10'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='Orange'
                          id='11'
                        />
                        <FormCheck
                          value='Purple'
                          onChange={(e) => handleCheckboxChange(e)}
                          label='White'
                          id='12'
                        />
                      </div>
                      {show && (
                        <div className='grid grid-cols-4 gap-3 mt-3'>
                          <FormCheck label='Yellow' id='13' />
                          <FormCheck label='Aqua' id='14' />
                          <FormCheck label='Beige' id='15' />
                          <FormCheck label='Grey' id='16' />
                          <FormCheck label='Gold' id='17' />
                          <FormCheck label='Teal' id='18' />
                          <FormCheck label='Tan' id='19' />
                          <FormCheck label='DarkKhaki' id='20' />
                          <FormCheck label='Burgundy' id='21' />
                          <FormCheck label='DarkBlue' id='22' />
                          <FormCheck label='DarkGreen' id='23' />
                          <FormCheck label='DarkCyan' id='24' />
                        </div>
                      )}
                      <div className=' flex justify-center'>
                        <button
                          onClick={() => {
                            setShow(!show)
                          }}
                          className='bg-white  py-2 px-6 rounded mt-3 underline text-reefGold'
                        >
                          {show ? 'View Less' : 'View More'}
                        </button>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as='div' className={`mb-3`} defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={` w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                        open && 'mb-3'
                      }`}
                    >
                      <span className='text-xl'>Interior Color</span>
                      <span className='flex-shrink-0'>
                        {open ? (
                          <OpenDisclosure className='text-[#8D7C3B]' />
                        ) : (
                          <CloseDisclosure className='text-[#8D7C3B]' />
                        )}
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel
                      as='div'
                      className=' bg-whiteSmoke px-4 py-3 text-xs'
                    >
                      <div className='grid grid-cols-4 gap-3'>
                        <FormCheck label='Black' id='25' />
                        <FormCheck label='Purple' id='26' />
                        <FormCheck label='Brown' id='27' />
                        <FormCheck label='Light' id='28' />
                        <FormCheck label='Blue' id='29' />
                        <FormCheck label='Red' id='30' />
                        <FormCheck label='Silver' id='31' />
                        <FormCheck label='Dark' id='32' />
                        <FormCheck label='Pink' id='33' />
                        <FormCheck label='Green' id='34' />
                        <FormCheck label='Orange' id='35' />
                        <FormCheck label='White' id='36' />
                      </div>
                      {interiorshow && (
                        <div className='grid grid-cols-4 gap-3 mt-3'>
                          <FormCheck label='Yellow' id='37' />
                          <FormCheck label='Aqua' id='38' />
                          <FormCheck label='Beige' id='39' />
                          <FormCheck label='Grey' id='40' />
                          <FormCheck label='Gold' id='41' />
                          <FormCheck label='Teal' id='42' />
                          <FormCheck label='Tan' id='43' />
                          <FormCheck label='DarkKhaki' id='44' />
                          <FormCheck label='Burgundy' id='45' />
                          <FormCheck label='DarkBlue' id='46' />
                          <FormCheck label='DarkGreen' id='47' />
                          <FormCheck label='DarkCyan' id='48' />
                        </div>
                      )}
                      <div className=' flex justify-center'>
                        <button
                          onClick={() => {
                            setInteriorShow(!interiorshow)
                          }}
                          className='bg-white  py-2 px-6 rounded mt-3 underline text-reefGold'
                        >
                          {interiorshow ? 'View Less' : 'View More'}
                        </button>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as='div' className={`mb-3`} defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={` w-full rounded py-3 px-6 gap-4 justify-between items-center flex ${
                        open && 'mb-3'
                      }`}
                    >
                      <span className='text-xl'>Extras</span>
                      <span className='flex-shrink-0'>
                        {open ? (
                          <OpenDisclosure className='text-[#8D7C3B]' />
                        ) : (
                          <CloseDisclosure className='text-[#8D7C3B]' />
                        )}
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel
                      as='div'
                      className=' bg-whiteSmoke px-4 py-3 text-xs'
                    >
                      <div className='grid grid-cols-2 gap-3'>
                        <FormCheck label='Steel' id='1111' />
                        <FormCheck label='Aluminum' id='1112' />
                        <FormCheck label='Fibre-Reinforced' id='1113' />
                        <FormCheck label='Plastic' id='1114' />
                        <FormCheck label='Plywood' id='1115' />
                        <FormCheck label='Fibre' id='1116' />
                        <FormCheck label='Resin' id='1117' />
                        <FormCheck label='Ferrocement' id='1118' />
                        <FormCheck label='Gelcoat' id='1119' />
                        <FormCheck label='Gelcoat' id='110' />
                        <FormCheck label='Polyvinyl Chloride' id='111' />
                        <FormCheck label='Aux Audio In' id='112' />
                        <FormCheck label='CD Player' id='113' />
                        <FormCheck label='Premium Light' id='114' />
                        <FormCheck label='DVD Player' id='115' />
                        <FormCheck label='Power Seat' id='116' />
                        <FormCheck label='Private Pool' id='117' />
                        <FormCheck label='Business Center' id='118' />
                        <FormCheck label='Racing Seats' id='119' />
                        <FormCheck label='Prayer Room' id='120' />
                      </div>
                      {extras && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <FormCheck label='Private Pool' id='119' />
                          <FormCheck label='Satellite / Cable TV' id='210' />
                          <FormCheck label='Business Center' id='1219' />
                          <FormCheck label='Kids Play Area' id='2210' />
                          <FormCheck label='Racing Seats' id='1219' />
                          <FormCheck label='Prayer Room' id='2210' />
                          <FormCheck label='Bluetooth System' id='1219' />
                          <FormCheck
                            label='Fibre-reinforced plastic'
                            id='7210'
                          />
                          <FormCheck label='Premium Sound System' id='8210' />
                        </div>
                      )}
                      <div className=' flex justify-center'>
                        <button
                          onClick={() => {
                            setExtras(!extras)
                          }}
                          className='bg-white  py-2 px-6 rounded mt-3 underline text-reefGold'
                        >
                          {extras ? 'View Less' : 'View More'}
                        </button>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
