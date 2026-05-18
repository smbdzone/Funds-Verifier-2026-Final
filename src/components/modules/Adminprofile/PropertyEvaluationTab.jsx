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
  DowloadIcon2,
  MessageIcon,
} from '@/components/Icons/index';

export const PropertyEvaluationTab = () => {
  const [enabled, setEnabled] = useState(false)
  const [enabled1, setEnabled1] = useState(false);
  const [enabled2, setEnabled2] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const togglePropertyDropdown = () => setIsPropertyDropdownOpen(!isPropertyDropdownOpen);

  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4   block'>History</span>
      <section className='bg-white shadow-md  py-4 '>
        <div className='custom-shadow rounded flex flex-col mb-3 '>
          <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button className={`w-full primary-gradient rounded  px-7  py-4  justify-between items-center flex ${open && "mb-3"}`}>
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Property Evaluation</span>
                  <span className='flex-shrink-0'>
                    {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as='div' className='gap-4 px-8   '>
                  <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className={`w-full  mb-2.5  shadow-md text-sm rounded py-3 px-7  justify-between items-center flex ${open && ""}`}>
                          <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Asset Reference Number SN 12367845</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel as='div' className='gap-2 px-8  py-4  w-full '>
                          <div className='w-full flex gap-3 mb-4 '>
                            <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Customer Name</p>
                              <span className='  pr-5'  >< DropIcon /></span>
                            </div>
                            <div className='relative bg-whiteSmoke w-full flex justify-between py-3 pl-5 rounded-md items-center'>
                              <p className='text-sm'>Asset Type</p>
                              <span className='pr-5 cursor-pointer' onClick={toggleDropdown}>
                                <DropIcon />
                              </span>
                              {isDropdownOpen && (
                                <div className='absolute right-0 mt-2 top-[30px] bg-white w-[50%] rounded-md shadow-lg'>
                                  <ul>
                                    <li
                                      className='px-4 py-2 text-center hover:bg-gray cursor-pointer flex items-center relative    '
                                      onClick={togglePropertyDropdown}
                                    >
                                      <p className=' px-4 py-2  hover:bg-gray cursor-pointer text-center pl-10  text-light-gold' >Property</p>
                                      <span className='mr-[10px] text-light-gold'>
                                        <DropIcon />
                                      </span>
                                      {isPropertyDropdownOpen && (
                                        <div className='absolute   left-[190px] top-[10%] rounded-md    mt-1'>
                                          <ul className=' bg-white  w-full   text-center shadow-md '>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer text-light-gold'>Apartment</li>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Villa</li>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Townhouse</li>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Multiple</li>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Penthouse</li>
                                            <li className=' px-4 py-2 text-center hover:bg-gray cursor-pointer  whitespace-nowrap'>Residential Building</li>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer whitespace-nowrap'>Residential Floor</li>
                                            <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer whitespace-nowrap'>Villa Compound</li>
                                          </ul>
                                        </div>
                                      )}
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Car</li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Jewelry</li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>Boat</li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <textarea name="Message " id="" rows={4} className="outline-none w-full mb-3 pl-5 pt-4 rounded-md  bg-whiteSmoke  pb-1 text-lg  " placeholder="Asset type description" />
                          <div className='grid grid-cols-2 gap-4' >
                            <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Customer Reference Number</p>
                              <span className='  pr-5'  ><   DowloadIcon2 /></span>
                            </div>
                            <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Upload the certificate</p>
                              <span className='  pr-5'  ><   DowloadIcon2 /></span>
                            </div>
                            <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Send the certificate to Client</p>
                              <span className='  pr-5'  ><  DowloadIcon2 /></span>
                            </div>
                            <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Send the certificat FV Admin </p>
                              <span className='  pr-5'  ><  DowloadIcon2 /></span>
                            </div>
                            <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Send the certificat FV Website</p>
                              <span className='  pr-5'  ><   DowloadIcon2 /></span>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </Disclosure.Panel>
                <Disclosure.Panel as='div' className='gap-4 px-8 '>
                </Disclosure.Panel>
                <Disclosure.Panel as='div' className='gap-4 px-8 '>
                  <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className={`w-full shadow-md  bg-whitesmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                          <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Apartment</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                          </span>
                        </Disclosure.Button>
                        <div className='flex items-center justify-between w-full'>

                          <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-2.5    justify-between w-full'>
                            <div className="w-full text-center mb-2">
                              <h2 className="text-lg font-semibold">Document received</h2>
                            </div>

                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between  w-full'>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5 justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                            </div>
                            <div className='flex gap-3'>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5   justify-between w-full'>
                            <div className='flex items-center'>

                              <span>NOC from Developer and final as built drawings If extended/improved</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>

                              <span>NOC from Developer and final as built drawings If extended/improved</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Owners NOC if he is not client (for corporate and individual instructions)</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Completion Status Certificate from Engineering Co, if under construction</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Floor plans</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>

                              <span>MOU of Sale</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>

                              <span>SPA of Purchased Property</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Costs/Invoices Sheet of the Upgrades if any</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5   items-center justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Upgrade Development Consultancy Contract</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>

                              <span>Upgrade Development Contracting Contract</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center gap-2'>
                              <span>Ready</span>
                              <div className="flex items-center space-x-4">
                                <Switch
                                  checked={enabled1}
                                  onChange={() => setEnabled1(!enabled1)}
                                  className={`${enabled1 ? 'primary-gradient ' : 'bg-gray'
                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                                >
                                  <span
                                    className={`${enabled1 ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block w-5 h-5 transform gradient rounded-full transition-transform`}
                                  />
                                </Switch>
                                <label className="">Under construction </label>
                              </div>

                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-1  items-center justify-between w-full'>
                            <div className='flex items-center'>

                              <span>extended</span>
                              <div className="flex items-center space-x-4 pl-2">
                                <Switch
                                  checked={enabled2}
                                  onChange={() => setEnabled2(!enabled2)}
                                  className={`${enabled2 ? 'primary-gradient ' : 'bg-gray'
                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                                >
                                  <span
                                    className={`${enabled2 ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block w-5 h-5 transform gradient rounded-full transition-transform`}
                                  />
                                </Switch>

                              </div>
                            </div>
                            <div className='flex gap-3 '>
                              <span><DownloadIcon /></span>
                              <span><OrngEyeIcon /></span>
                              <span>< MessageIcon /></span>
                              <span><DustpinIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className=' '>
                          <Disclosure.Panel as='div' className='gap-2 px-8  mb-5 '>
                            <div className='flex items-center gap-4'>
                              <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                                <p className='  text-sm ' >   28/06/2024</p>

                              </div>
                              <div className='bg-whiteSmoke w-full flex justify-between py-3  pl-5 rounded-md items-center  '>
                                <p className='  text-sm ' >05:50 PM</p>

                              </div>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className=' '>
                          <Disclosure.Panel as='div' className='gap-2 px-8  mb-2.5 '>
                            <div className='flex items-center justify-between  gap-4'>
                              <p>Client evaluation date & time  confirmation</p>
                              <div className='flex gap-2 items-center'>
                                <p className='text-xs font-semibold'>yes</p>
                                <Switch
                                  checked={enabled}
                                  onChange={setEnabled}
                                  className={`${enabled ? 'primary-gradient ' : 'bg-gray'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                                >
                                  <span
                                    className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-5 h-5 transform gradient rounded-full transition-transform`}
                                  />
                                </Switch>
                                <p className='text-xs font-semibold'>NO</p>
                              </div>
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
                        <Disclosure.Button className={`w-full shadow-md    text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                          <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Asset Reference Number SN 12367846</span>
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
      </section>
    </>
  );
};
