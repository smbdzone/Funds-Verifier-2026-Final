"use client"
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { Disclosure } from '@headlessui/react';
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons';
import {
  DustpinIcon,
  DownloadIcon,
  OrngEyeIcon,
  DropIcon,
} from '@/components/Icons/index';

export const AdminprofileTab = () => {
  const [enabled, setEnabled] = useState(false)
  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4   block'>Asset Holder</span>
      <section className='bg-white shadow-md  py-4 '>
      <div className='custom-shadow rounded flex flex-col mb-3 '>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className={`w-full primary-gradient rounded  px-7  py-4  justify-between items-center flex ${open && "mb-3"}`}>
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Property Mandatory Evaluation Documents</span>
                <span className='flex-shrink-0'>
                  {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='gap-4 px-8  '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5  text-sm rounded py-3 px-7  justify-between items-center flex ${open && ""}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>

                      <div className='flex items-center justify-between w-full  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between   w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready<span>
                              <Switch
                                checked={enabled}
                                onChange={setEnabled}
                                className="group inline-flex h-6 w-11 items-center rounded-full  transition data-[checked]:bg-blue-600"
                              >
                                <span className="size-4 translate-x-1 rounded-full bg- transition group-data-[checked]:translate-x-6" />
                              </Switch>
                            </span>Under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5  text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (Under construction)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B]  mb-1 appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5 text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Apartment</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full   '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready
                              switch check b

                              Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 
              '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5 py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Shop</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none  mb-1 checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1   items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-2.5  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa & TH</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] mb-1  appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5  py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1    justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8'>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (u/cons)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building resi, mixed use (commercia)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Labour camp</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Hotel</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <div className='custom-shadow rounded flex flex-col mb-3 '>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className={`w-full primary-gradient rounded  px-7  py-4  justify-between items-center flex ${open && "mb-3"}`}>
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Cars Evaluation</span>
                <span className='flex-shrink-0'>
                  {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='gap-4 px-8  '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5  text-sm rounded py-3 px-7  justify-between items-center flex ${open && ""}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>

                      <div className='flex items-center justify-between w-full  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between   w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready<span>
                              <Switch
                                checked={enabled}
                                onChange={setEnabled}
                                className="group inline-flex h-6 w-11 items-center rounded-full  transition data-[checked]:bg-blue-600"
                              >
                                <span className="size-4 translate-x-1 rounded-full bg- transition group-data-[checked]:translate-x-6" />
                              </Switch>
                            </span>Under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5  text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (Under construction)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B]  mb-1 appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5 text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Apartment</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full   '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready
                              switch check b

                              Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 
              '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5 py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Shop</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none  mb-1 checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1    items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-2.5  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa & TH</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] mb-1  appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5  py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1    justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8'>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (u/cons)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building resi, mixed use (commercia)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Labour camp</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Hotel</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
             

            </>
          )}
        </Disclosure>

      </div>
      <div className='custom-shadow rounded flex flex-col mb-3 '>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className={`w-full primary-gradient rounded  px-7  py-4  justify-between items-center flex ${open && "mb-3"}`}>
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Boat Evaluation</span>
                <span className='flex-shrink-0'>
                  {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='gap-4 px-8  '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5  text-sm rounded py-3 px-7  justify-between items-center flex ${open && ""}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>

                      <div className='flex items-center justify-between w-full  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between   w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready<span>
                              <Switch
                                checked={enabled}
                                onChange={setEnabled}
                                className="group inline-flex h-6 w-11 items-center rounded-full  transition data-[checked]:bg-blue-600"
                              >
                                <span className="size-4 translate-x-1 rounded-full bg- transition group-data-[checked]:translate-x-6" />
                              </Switch>
                            </span>Under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5  text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (Under construction)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B]  mb-1 appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5 text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Apartment</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full   '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready
                              switch check b

                              Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 
              '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5 py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Shop</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none  mb-1 checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1    items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-2.5  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa & TH</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] mb-1  appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5  py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1    justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8'>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (u/cons)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building resi, mixed use (commercia)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Labour camp</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Hotel</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
             

            </>
          )}
        </Disclosure>

      </div>
      <div className='custom-shadow rounded flex flex-col mb-10'>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className={`w-full primary-gradient rounded  px-7  py-4  justify-between items-center flex ${open && "mb-3"}`}>
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Jewellery Evaluation</span>
                <span className='flex-shrink-0'>
                  {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='gap-4 px-8  '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5  text-sm rounded py-3 px-7  justify-between items-center flex ${open && ""}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>

                      <div className='flex items-center justify-between w-full  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between   w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready<span>
                              <Switch
                                checked={enabled}
                                onChange={setEnabled}
                                className="group inline-flex h-6 w-11 items-center rounded-full  transition data-[checked]:bg-blue-600"
                              >
                                <span className="size-4 translate-x-1 rounded-full bg- transition group-data-[checked]:translate-x-6" />
                              </Switch>
                            </span>Under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5  text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Land (Under construction)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B]  mb-1 appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  mb-2.5 text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Apartment</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full   '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ready
                              switch check b

                              Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 
              '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5 py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Shop</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none mb-1  checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none  mb-1 checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1   items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 mb-2.5  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa & TH</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] mb-1  appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex  mb-1 items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from DDA and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded mb-2.5  py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Warehouse Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Villa Compound</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke mb-2.5   text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (vacant)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1    justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8'>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building Land (u/cons)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  mb-1  flex items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Completion Status Certificate from Engineering Co, if under construction</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Building Permission Certificate and Approved Drawings, if BCC not available</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Building resi, mixed use (commercia)</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Labour camp</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
              <Disclosure.Panel as='div' className='gap-4 px-8 '>
                <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`w-full bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                        <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Hotel</span>
                        <span className='flex-shrink-0'>
                          {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                        </span>
                      </Disclosure.Button>
                      <div className='flex items-center justify-between w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between  w-full'>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Affection/Site Plan</span>
                          </div>
                          <div className='flex gap-3'>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>NOC from Developer and final as built drawings If extended/improved</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Ejari Contracts (dubai based properties) </span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-1  justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Floor plans</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-1 justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>MOU of Sale</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>SPA of Purchased Property</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Development Costs if owned constructed</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purchase Document of Land with price</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Costs/Invoices Sheet of the Upgrades if any</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Upgrade Development Contracting Contract</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Rental Contracts if units are 1</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Service Charges invoice</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Operating and Maintenance Contracts</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Break down of all O&M expenses in excel</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Purcahse Inovices of Power, Gas, Water, Fire etc</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                      <div className='flex items-center justify-between '>
                        <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                          <div className='flex items-center'>
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 border-2 border-[#8D7C3B] appearance-none checked:bg-transparent checked:border-[#8D7C3B] custom-checkbox"
                              style={{ width: '17px', height: '17px' }}
                            />
                            <span>Utility Bills</span>
                          </div>
                          <div className='flex gap-3 '>
                            <span><DownloadIcon /></span>
                            <span><OrngEyeIcon /></span>
                            <span><DustpinIcon /></span>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    </>

                  )}
                </Disclosure>
              </Disclosure.Panel>
             

            </>
          )}
        </Disclosure>

      </div>
      <div className='flex justify-center mb-8 '>
      <button className='gradient py-2 px-6 text-lg  text-white font-medium rounded-md text-center'> Submit</button>
      </div>
      </section>
     
    </>
  );
};
