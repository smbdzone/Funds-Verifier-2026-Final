'use client'
import { Disclosure } from '@headlessui/react'
import React, { useState } from 'react'
import { CloseDisclosure, OpenDisclosure } from '@/components/Icons'

export const FilterSidebar = () => {
  const [value, setValue] = useState(50)
  const [extras, setExtras] = useState(false)
  const handleChange = (event) => {
    setValue(event.target.value)
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
                    <p>USA</p>
                    <p>UK</p>
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
                    <p>Dubai</p>
                    <p>Dubai</p>
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
                    <p>Land</p>
                    <p>Jewellary</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </aside>
    </div>
  )
}
