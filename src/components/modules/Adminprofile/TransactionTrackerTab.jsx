
import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import Modal from '@/components/Modal';
import { Disclosure } from '@headlessui/react';
import { OpenDisclosure, CloseDisclosure, DropIcon, Download3Icon, MessageIcon, GreenTickIcon, OrangecrossIcon, RedcrossIcon,  Orng2EyeIcon, RightArrowIcon, LeftArrowIcon } from '@/components/Icons';
export const TransactionTrackerTab = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const togglePropertyDropdown = () => {
    setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
  };

  const tabs = [
    { name: "Evaluation document pending", current: true },
    { name: "Evaluation Complete", current: false },
    { name: "Pending bank approval", current: false },
    { name: "Bank Approval complete", current: false },
    { name: "Asset transferred", current: false },
    { name: "Case closed", current: false },
  ];

  return (
    <>
      <Modal show={showModal} onClose={handleCloseModal} />
      <span className='text-lg text-prussianBlue/40 mb-4 block'>Profile</span>
      <section className=' ' >
        <div className='custom-shadow rounded flex flex-col mb-8  '>
          <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button className={`w-full primary-gradient rounded  px-7  py-4   justify-between items-center flex ${open && "mb-3"}`}>
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Asset Reference Number</span>
                  <span className='flex-shrink-0'>
                    {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as='div' className='gap-4 px-8   '>
                  <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
                    {({ open }) => (
                      <>
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
                          <div className='' >
                            <div className='bg-whiteSmoke w-full flex justify-between py-4  pl-5 rounded-md items-center  '>
                              <p className='  text-sm ' >Customer Reference Number</p>
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
                        <Disclosure.Button className={`w-full   bg-whiteSmoke  text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                          <span className='whitespace-nowrap sm:text-xl font-medium text-black/80'>Apartment</span>
                          <span className='flex-shrink-0'>
                            {open ? <OpenDisclosure className='text-black/80' /> : <CloseDisclosure className='text-black/30' />}
                          </span>
                        </Disclosure.Button>
                        <div className='flex items-center justify-between w-full mb-10 '>

                          <Disclosure.Panel as='div' className='gap-2 px-8  flex items-center mb-2.5    justify-between w-full'>
                            <div className="w-full text-center mb-2">
                              <h2 className="text-lg font-semibold">Document received</h2>
                            </div>

                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between  w-full'>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5 justify-between w-full'>
                            <div className='flex items-center'>
                              <span><GreenTickIcon /></span>
                              <span className='text-black pl-4 '>Title Deed/Pre Title Deed/Lease Deed/Oqood/Initial Contract of Sale</span>
                            </div>
                            <div className='flex gap-3'>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5   justify-between w-full'>
                            <div className='flex items-center'>
                              <span><RedcrossIcon /></span>
                              <span className='text-black pl-4 ' >NOC from Developer and final as built drawings If extended/improved</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>

                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>
                              <span><OrangecrossIcon /></span>
                              <span className='text-black pl-4 '   >NOC from Developer and final as built drawings If extended/improved</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>
                              <span><GreenTickIcon /></span>
                              <span className='text-black pl-4 '   >Owners NOC if he is not client (for corporate and individual instructions)</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>
                              <span><RedcrossIcon /></span>
                              <span className='text-black pl-4 '  >Completion Status Certificate from Engineering Co, if under construction</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex items-center  mb-2.5  justify-between w-full'>
                            <div className='flex items-center'>
                              <span><OrangecrossIcon /></span>
                              <span className='text-black pl-4 ' >Floor plans</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>
                              <span><GreenTickIcon /></span>
                              <span className='text-black pl-4 '>MOU of Sale</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>
                              <span><RedcrossIcon /></span>
                              <span className='text-black pl-4 ' >SPA of Purchased Property</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>
                              <span><OrangecrossIcon /></span>
                              <span className='text-black pl-4 '> Costs/Invoices Sheet of the Upgrades if any</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span >< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5   items-center justify-between w-full'>
                            <div className='flex items-center'>
                              <span><GreenTickIcon /></span>
                              <span className='text-black pl-4 '>Upgrade Development Consultancy Contract</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>
                        <div className='flex items-center justify-between '>
                          <Disclosure.Panel as='div' className='gap-2 px-8 flex mb-2.5  items-center justify-between w-full'>
                            <div className='flex items-center'>
                              <span><RedcrossIcon /></span>
                              <span className='text-black pl-4 '>Upgrade Development Contracting Contract</span>
                            </div>
                            <div className='flex gap-3 '>
                              <span>< Orng2EyeIcon /></span>
                              <span><  Download3Icon /></span>
                              <span>< MessageIcon /></span>
                            </div>
                          </Disclosure.Panel>
                        </div>


                        <div className=' px-3 '>
                          <Disclosure.Panel className='gap-2 pt-8   pb-20 mb-5'>
                            <div className='xl:h-[10px] xl:bg-gray relative rounded-full'>
                              <div className="flex xl:absolute flex-wrap xl:flex-nowrap pl-6  -top-4 xl:justify-center xl:px-7 w-full" aria-label="Tabs">
                                {tabs.map((tab, i) => (
                                  <div
                                    key={tab.name}
                                    onClick={() => setSelectedTabIdx(i)}
                                    className={`
                ${i === selectedTabIdx ? "bg-prussianBlue text-white" : "bg-white text-black"} xl:bg-transparent xl:text-black  
                text-sm flex flex-col items-center cursor-pointer custom-shadow xl:shadow-none px-4 py-2 rounded-full font-medium text-center
              `}
                                  >
                                    <button
                                      onClick={() => setSelectedTabIdx(i)}
                                      className={`
                  ${i === selectedTabIdx ? "border-4 border-prussianBlue" : "border-4 border-light-blue bg-darkGray"}
                  h-[26px] w-[27px] rounded-full cursor-pointer xl:flex justify-center items-center hidden
                `}
                                    >
                                      {i === selectedTabIdx && <span className='bg-light-gold h-5 w-5 rounded-full'></span>}
                                    </button>
                                    <span className='text-center text-black  '>{tab.name}</span>
                                  </div>
                                ))}
                              </div>
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
        <div className='custom-shadow rounded flex flex-col mb-8 '>
          <Disclosure as='div' className={`disclosure`} defaultOpen={false}>
            {({ open }) => (
              <>
                <Disclosure.Button className={`w-full primary-gradient rounded   px-7  py-4  justify-between items-center flex ${open && "mb-3"}`}>
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Asset Reference Number</span>
                  <span className='flex-shrink-0'>
                    {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                  </span>
                </Disclosure.Button>
                {/* this is div of assset reference number  div */}

              </>
            )}
          </Disclosure>
        </div>
        <div className='flex gap-2  justify-end '>
          <button className='  bg-whiteSmoke px-5 py-2 rounded-md'>
       <span><LeftArrowIcon/></span>
          </button>
          <button className='bg-dark-blue px-5 py-2 rounded-md'>
            <span><RightArrowIcon/></span>
            </button>
        </div>
      </section>
    </>
  );
};
