import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { OpenDisclosure, CloseDisclosure } from "@/components/Icons";
import FormCheck from "@/components/CheckBoxComponent/FormCheck";
import customAxios from "@/utils/apis/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  dealTabProperties,
  dealTabCars,
  dealTabBoats,
  dealTabJewellary,
} from '@/constants/dealTabProp'
// import customAxios from '../../../utils/apis/apis'

export const DealTab = () => {
  const [dealPreferences, setDealPreferences] = useState({
    propertyTypes: [],
    regions: [],
    escrowAccount: [],
    escrowAccountFunds: [],
    carTypes: [],
    boatTypes: [],
    jewelryTypes: [],
  })

  const handleCheckboxChange = (category, value) => {
    setDealPreferences((prev) => {
      const newValues = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value]
      return { ...prev, [category]: newValues }
    })
  }

  const handleSave = async () => {
    try {
      await customAxios.post(`/dealPreferences/add`, dealPreferences);
      toast.success("Deal preferences saved successfully!");
    } catch (error) {
      toast.error('Failed to save deal preferences!')
    }
  }

  return (
    <>
      <span className='sm:text-lg text-base lg:text-xl text-prussianBlue/40 mb-4 block'>
        Deal Preference
      </span>
      <div className='custom-shadow rounded flex flex-col gap-2'>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
                }`}
              >
                <span className='whitespace-nowrap sm:text-lg text-base lg:text-xl font-medium text-white'>
                  Properties
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='sm:px-8 px-4 py-4'>
                {dealTabProperties.map((obj, i) => (
                  <Disclosure
                    key={obj.id + 1}
                    as='div'
                    className={`mb-4`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`w-full custom-shadow rounded py-3 px-7 gap-4 justify-between items-center flex ${
                            open && 'mb-3'
                          }`}
                        >
                          <span className='whitespace-nowrap'>{obj.title}</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure /> : <CloseDisclosure />}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as='div'
                          className='grid sm:grid-cols-2 gap-4 sm:px-8 px-4 py-4'
                        >
                          {obj.items.map((item, i) => (
                            <FormCheck
                              key={item.id + i}
                              label={item.label}
                              id={item.id}
                              onChange={() =>
                                handleCheckboxChange(item.type, item.label)
                              }
                            />
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure as='div' className={`disclosure`}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
                }`}
              >
                <span className='whitespace-nowrap sm:text-lg text-base lg:text-xl font-medium text-white'>
                  Cars
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='sm:px-8 px-4 py-4'>
                {dealTabCars.map((obj, i) => (
                  <Disclosure
                    key={obj.id + 1}
                    as='div'
                    className={`mb-4`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`w-full custom-shadow rounded py-3 px-7 gap-4 justify-between items-center flex ${
                            open && 'mb-3'
                          }`}
                        >
                          <span className='whitespace-nowrap'>{obj.title}</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure /> : <CloseDisclosure />}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as='div'
                          className='grid sm:grid-cols-2 gap-4 sm:px-8 px-4 py-4'
                        >
                          {obj.items.map((item, i) => (
                            <FormCheck
                              key={item.id + i}
                              label={item.label}
                              id={item.id}
                              onChange={() =>
                                handleCheckboxChange(item.type, item.label)
                              }
                            />
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure as='div' className={`disclosure`}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
                }`}
              >
                <span className='whitespace-nowrap sm:text-lg text-base lg:text-xl font-medium text-white'>
                  Boats
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='sm:px-8 px-4 py-4'>
                {dealTabBoats.map((obj, i) => (
                  <Disclosure
                    key={obj.id + 1}
                    as='div'
                    className={`mb-4`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`w-full custom-shadow rounded py-3 px-7 gap-4 justify-between items-center flex ${
                            open && 'mb-3'
                          }`}
                        >
                          <span className='whitespace-nowrap'>{obj.title}</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure /> : <CloseDisclosure />}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as='div'
                          className='grid sm:grid-cols-2 gap-4 sm:px-8 px-4 py-4'
                        >
                          {obj.items.map((item, i) => (
                            <FormCheck
                              key={item.id + i}
                              label={item.label}
                              id={item.id}
                              onChange={() =>
                                handleCheckboxChange(item.type, item.label)
                              }
                            />
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure as='div' className={`disclosure`}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
                }`}
              >
                <span className='whitespace-nowrap sm:text-lg text-base lg:text-xl font-medium text-white'>
                  Jewelries
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='sm:px-8 px-4 py-4'>
                {dealTabJewellary.map((obj, i) => (
                  <Disclosure
                    key={obj.id + 1}
                    as='div'
                    className={`mb-4`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`w-full custom-shadow rounded py-3 px-7 gap-4 justify-between items-center flex ${
                            open && 'mb-3'
                          }`}
                        >
                          <span className='whitespace-nowrap'>{obj.title}</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure /> : <CloseDisclosure />}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as='div'
                          className='grid sm:grid-cols-2 gap-4 sm:px-8 px-4 py-4'
                        >
                          {obj.items.map((item, i) => (
                            <FormCheck
                              key={item.id + i}
                              label={item.label}
                              id={item.id}
                              onChange={() =>
                                handleCheckboxChange(item.type, item.label)
                              }
                            />
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className='flex justify-end gap-3 md:me-10 me-5 my-3'>
          <button
            className='flex justify-center border border-reefGold md:py-2 py-1 md:px-8 px-2 focus:outline-none text-lg font-medium rounded'
            onClick={() => {
              Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                text: 'Your changes have been cancelled!',
              })
            }}
          >
            Cancel
          </button>
          <button
            className='flex text-white justify-center btn-gradient border-0 md:py-2 py-1 md:px-8 px-4 focus:outline-none text-lg font-medium rounded'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
