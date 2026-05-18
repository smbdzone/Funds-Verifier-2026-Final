'use client'
import FormCheck from '@/components/CheckBoxComponent/FormCheck'
import { CloseDisclosure, OpenDisclosure } from '@/components/Icons'
import { useAppContext } from '@/context/AppContext'
import { Disclosure } from '@headlessui/react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const FilterSidebar = ({ initialData }) => {
  const { getCarPrice } = useAppContext()
  const searchParams = useSearchParams()
  const router = useRouter() // Get router object
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedFilters2, setSelectedFilters2] = useState([])
  const [selectedFilters3, setSelectedFilters3] = useState([])
  const [selectedFilters4, setSelectedFilters4] = useState([])

  const [show, setShow] = useState(false)
  const [interiorshow, setInteriorShow] = useState(false)
  const [technical, setTechnical] = useState(false)
  const [extras, setExtras] = useState(false)

  const [value, setValue] = React.useState([
    getCarPrice?.lowestPrice,
    getCarPrice?.highestPrice,
  ])

  useEffect(() => {}, [searchParams, initialData])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  function updateSortingForPrice(e) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('minPrice', value[0])
      window.history.pushState(null, '', `?${params.toString()}`)
    }
    if (value) {
      params.set('maxPrice', value[1])
      window.history.pushState(null, '', `?${params.toString()}`)
    }

    window.location.reload()
  }
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

  function updateSortingForCategories(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('categories', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForModel(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('model', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForNieghbourHood(e) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('neighbourhood', e.target.value)
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForExteriorColor() {
    const params = new URLSearchParams(searchParams.toString())
    params.set('exteriorColor', selectedFilters.join(','))
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForInteriorColor() {
    const params = new URLSearchParams(searchParams.toString())
    params.set('interiorColor', selectedFilters2.join(','))
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForTechnicalFeatures() {
    const params = new URLSearchParams(searchParams.toString())
    params.set('technicalFeatures', selectedFilters3.join(','))
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  function updateSortingForTechnicalFeatures() {
    const params = new URLSearchParams(searchParams.toString())
    params.set('extras', selectedFilters4.join(','))
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  const handleCheckboxChange = (event) => {
    event.preventDefault()
    const { value, checked } = event.target
    // Logic to update selectedFilters based on checked state and value
    if (checked) {
      setSelectedFilters([...selectedFilters, value]) // Add value to selectedFilters
    }
  }

  const handleCheckboxChange2 = (event) => {
    event.preventDefault()
    const { value, checked } = event.target
    // Logic to update selectedFilters based on checked state and value
    if (checked) {
      setSelectedFilters2([...selectedFilters2, value]) // Add value to selectedFilters
    }
  }

  const handleCheckboxChange3 = (event) => {
    event.preventDefault()
    const { value, checked } = event.target
    // Logic to update selectedFilters based on checked state and value
    if (checked) {
      setSelectedFilters2([...selectedFilters3, value]) // Add value to selectedFilters
    }
  }

  const handleCheckboxChange4 = (event) => {
    event.preventDefault()
    const { value, checked } = event.target
    // Logic to update selectedFilters based on checked state and value
    if (checked) {
      setSelectedFilters2([...selectedFilters4, value]) // Add value to selectedFilters
    }
  }

  const handleClick = (value) => {
    router.push(`/${value}`)
  }

  return (
    <div className='flex flex-wrap lg:flex-nowrap gap-5 py-5'>
      <aside className='custom-shadow w-full lg:w-auto lg:min-w-[385px]'>
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
                        <CloseDisclosure className='text-[#8D7C3B]' />
                      ) : (
                        <OpenDisclosure className='text-[#8D7C3B]' />
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
                            <span className='flex-shrink-0'></span>
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
                    <span className='text-[22px] text-reefGold '>
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
                    <span className='text-[22px]'>Jewellery For Sale</span>
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
                    <span className='text-[22px]'>Boats For Sale</span>
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
                            <span className='text-xl '>Sail Boats</span>
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

            <Box sx={{ width: 300 }}>
              <Slider
                getAriaLabel={() => 'Minimum distance'}
                value={value}
                step={500}
                max={getCarPrice?.highestPrice || 0}
                min={getCarPrice?.lowestPrice || 1000000}
                onChange={handleChange}
                valueLabelDisplay='auto'
                getAriaValueText={() => 'Price range'}
              />
            </Box>
            <p className='text-xs'>
              Price : ${getCarPrice?.lowestPrice} - ${getCarPrice?.highestPrice}
            </p>
            <div className='flex justify-center'>
              <button
                onClick={(e) => updateSortingForPrice(e)}
                className='bg-reefGold  py-2 px-6 rounded mt-3 text-white'
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <p className='text-xl mb-3'>Filter by Country..........</p>
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
                  <Disclosure.Panel
                    as='div'
                    className='text-blackRussian/50 px-8 text-sm'
                  >
                    <p onClick={() => updateSortingForCountry('USA')}>UAE</p>
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
                  <Disclosure.Panel
                    as='div'
                    className='text-blackRussian/50 px-8 text-sm'
                  >
                    <p
                      className='cursor-pointer'
                      onClick={() => updateSortingForCity('Dubai')}
                    >
                      Dubai
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
                  <Disclosure.Panel
                    as='div'
                    className='text-blackRussian/50 px-8 text-sm'
                  >
                    <p onClick={() => updateSortingForCategories('Land')}>
                      Land
                    </p>
                    <p onClick={() => updateSortingForCategories('Land')}>
                      Jewellary
                    </p>
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
                  <Disclosure.Panel
                    as='div'
                    className='text-blackRussian/50 px-8 text-sm'
                  >
                    <p onClick={() => updateSortingForNieghbourHood('Land')}>
                      Land
                    </p>
                    <p
                      onClick={() => updateSortingForNieghbourHood('Jewellary')}
                    >
                      Jewellary
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className='border-b'>
          <div className='px-10 py-3'>
            <p className='text-xl mb-3'>Model</p>
            <Disclosure as='div' className={`disclosure`}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full bg-whiteSmoke rounded py-3 px-6 gap-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span className='text-base'>Any</span>
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
                    className='text-black Russian/50 px-8 text-sm'
                  >
                    <p
                      className='cursor-pointer'
                      onClick={(e) => updateSortingForModel('BMW', e)}
                    >
                      BMW
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
                      <>
                        <div className='grid grid-cols-4 gap-3'>
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Black'
                            label='Black'
                            id='1'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Purple'
                            label='Purple'
                            id='2'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Brown'
                            label='Brown'
                            id='3'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Light'
                            label='Light'
                            id='4'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Blue'
                            label='Blue'
                            id='5'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Red'
                            label='Red'
                            id='6'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Silver'
                            label='Silver'
                            id='7'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Dark'
                            label='Dark'
                            id='8'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Pink'
                            label='Pink'
                            id='9'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Green'
                            label='Green'
                            id='10'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='Orange'
                            label='Orange'
                            id='11'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange(e)}
                            value='White'
                            label='White'
                            id='12'
                          />
                        </div>
                        {show && (
                          <div className='grid grid-cols-4 gap-3 mt-3'>
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Yellow'
                              label='Yellow'
                              id='13'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Aqua'
                              label='Aqua'
                              id='14'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Beige'
                              label='Beige'
                              id='15'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Grey'
                              label='Grey'
                              id='16'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Gold'
                              label='Gold'
                              id='17'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Teal'
                              label='Teal'
                              id='18'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Tan'
                              label='Tan'
                              id='19'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='DarkKhaki'
                              label='DarkKhaki'
                              id='20'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='Burgundy'
                              label='Burgundy'
                              id='21'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='DarkBlue'
                              label='DarkBlue'
                              id='22'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='DarkGreen'
                              label='DarkGreen'
                              id='23'
                            />
                            <FormCheck
                              onChange={(e) => handleCheckboxChange(e)}
                              value='DarkCyan'
                              label='DarkCyan'
                              id='24'
                            />
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
                        <div className='flex justify-center'>
                          <button
                            onClick={() => updateSortingForExteriorColor()}
                            className='bg-reefGold  py-2 px-6 rounded mt-3 text-white'
                          >
                            Filter
                          </button>
                        </div>
                      </>
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
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Black'
                          label='Black'
                          id='25'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='DarkCyan'
                          label='Purple'
                          id='26'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange(e)}
                          value='Brown'
                          label='Brown'
                          id='27'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Light'
                          label='Light'
                          id='28'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Blue'
                          label='Blue'
                          id='29'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Red'
                          label='Red'
                          id='30'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Silver'
                          label='Silver'
                          id='31'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Dark'
                          label='Dark'
                          id='32'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Pink'
                          label='Pink'
                          id='33'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Green'
                          label='Green'
                          id='34'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='Orange'
                          label='Orange'
                          id='35'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange2(e)}
                          value='White'
                          label='White'
                          id='36'
                        />
                      </div>
                      {interiorshow && (
                        <div className='grid grid-cols-4 gap-3 mt-3'>
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Yellow'
                            label='Yellow'
                            id='37'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Aqua'
                            label='Aqua'
                            id='38'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Beige'
                            label='Beige'
                            id='39'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Grey'
                            label='Grey'
                            id='40'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Gold'
                            label='Gold'
                            id='41'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Teal'
                            label='Teal'
                            id='42'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Tan'
                            label='Tan'
                            id='43'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='DarkKhaki'
                            label='DarkKhaki'
                            id='44'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='Burgundy'
                            label='Burgundy'
                            id='45'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='DarkBlue'
                            label='DarkBlue'
                            id='46'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='DarkGreen'
                            label='DarkGreen'
                            id='47'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange2(e)}
                            value='DarkCyan'
                            label='DarkCyan'
                            id='48'
                          />
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
                      <div className='flex justify-center'>
                        <button
                          onClick={() => updateSortingForInteriorColor()}
                          className='bg-reefGold  py-2 px-6 rounded mt-3 text-white'
                        >
                          Filter
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
                      <span className='text-xl'>Technical Features</span>
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
                        <FormCheck
                          onChange={(e) => handleCheckboxChange3(e)}
                          value='4 Wheel Drive'
                          label='4 Wheel Drive'
                          id='49'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange3(e)}
                          value='All Wheel Drive'
                          label='All Wheel Drive'
                          id='50'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange3(e)}
                          value='Dual Exhaust'
                          label='Dual Exhaust'
                          id='51'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange3(e)}
                          value='Front Airbags'
                          label='Front Airbags'
                          id='52'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange3(e)}
                          value='Power Steering'
                          label='Power Steering'
                          id='53'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange3(e)}
                          value='Side Airbags'
                          label='Side Airbags'
                          id='54'
                        />
                      </div>
                      {technical && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='DarkGreen'
                            label='All Wheel Steering'
                            id='55'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='Front Wheel Drive'
                            label='Front Wheel Drive'
                            id='56'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='Tiptronic Gears'
                            label='Tiptronic Gears'
                            id='57'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='Rear Wheel Drive'
                            label='Rear Wheel Drive'
                            id='58'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='N2O System'
                            label='N2O System'
                            id='59'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='Cruise Control'
                            label='Cruise Control'
                            id='60'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange3(e)}
                            value='Anti-Lock Brakers/ABS'
                            label='Anti-Lock Brakers/ABS'
                            id='61'
                          />
                        </div>
                      )}
                      <div className=' flex justify-center'>
                        <button
                          onClick={() => {
                            setTechnical(!technical)
                          }}
                          className='bg-white  py-2 px-6 rounded mt-3 underline text-reefGold'
                        >
                          {technical ? 'View Less' : 'View More'}
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
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Aux Audio In'
                          label='Aux Audio In'
                          id='62'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Body Kit'
                          label='Body Kit'
                          id='63'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Am/Fm Radio'
                          label='Am/Fm Radio'
                          id='64'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Brush Guard'
                          label='Brush Guard'
                          id='65'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='CD Player'
                          label='CD Player'
                          id='66'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='DVD Player'
                          label='DVD Player'
                          id='67'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Keyless Entry'
                          label='Keyless Entry'
                          id='68'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Keyless Start'
                          label='Keyless Start'
                          id='69'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Off-Road Kit'
                          label='Off-Road Kit'
                          id='70'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Off-Road Tyres'
                          label='Off-Road Tyres'
                          id='71'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Power Mirrors'
                          label='Power Mirrors'
                          id='72'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Power Seats'
                          label='Power Seats'
                          id='73'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Premium Lights'
                          label='Premium Lights'
                          id='74'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Premium Paint'
                          label='Premium Paint'
                          id='75'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Roof Rack'
                          label='Roof Rack'
                          id='76'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Spoiler'
                          label='Spoiler'
                          id='78'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Air Conditioning'
                          label='Air Conditioning'
                          id='79'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Bluetooth System'
                          label='Bluetooth System'
                          id='80'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Cassette Player'
                          label='Cassette Player'
                          id='81'
                        />
                        <FormCheck
                          onChange={(e) => handleCheckboxChange4(e)}
                          value='Climate Control'
                          label='Climate Control'
                          id='82'
                        />
                      </div>
                      {extras && (
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Fog Lights'
                            label='Fog Lights'
                            id='83'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Heated Seats'
                            label='Heated Seats'
                            id='84'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Leather Seats'
                            label='Leather Seats'
                            id='85'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Moonroof'
                            label='Moonroof'
                            id='86'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Parking Sensors'
                            label='Parking Sensors'
                            id='87'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Power Locks'
                            label='Power Locks'
                            id='88'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Power Sunroof'
                            label='Power Sunroof'
                            id='89'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Power Windows'
                            label='Power Windows'
                            id='91'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Racing Seats'
                            label='Racing Seats'
                            id='92'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Roof Rack'
                            label='Roof Rack'
                            id='93'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Sunroof'
                            label='Sunroof'
                            id='94'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='VHS Player'
                            label='VHS Player'
                            id='95'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Satellite Radios'
                            label='Satellite Radios'
                            id='96'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Rear View Camera'
                            label='Rear View Camera'
                            id='97'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Performace Tyres'
                            label='Performace Tyres'
                            id='98'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Cooled Seats'
                            label='Cooled Seats'
                            id='99'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Navigation System'
                            label='Navigation System'
                            id='100'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Premium Wheels/Rims'
                            label='Premium Wheels/Rims'
                            id='101'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Premium Sound System'
                            label='Premium Sound System'
                            id='102'
                          />
                          <FormCheck
                            onChange={(e) => handleCheckboxChange4(e)}
                            value='Alarm/Anti-Theft System'
                            label='Alarm/Anti-Theft System'
                            id='103'
                          />
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
