import { CloseDisclosure, EyeIcon, OpenDisclosure } from '@/components/Icons'
import { Disclosure } from '@headlessui/react'
import React, { useState } from 'react'

export const SaleTab = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const tabs = [
    { name: "Progress Tracker", current: true },
    { name: "Progress Tracker", current: false },
    { name: "Progress Tracker", current: false },
    { name: "Progress Tracker", current: false }, 
  ];
  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4 block'>Tracking</span>
      <div className='custom-shadow rounded flex flex-col gap-2'>
        <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className={`w-full primary-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${open && "mb-3"}`}>
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>Sale Tracker</span>
                <span className='flex-shrink-0'>
                  {open ? <OpenDisclosure className='text-white' /> : <CloseDisclosure className='text-white' />}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as='div' className='p-8 xl:py-20'>
                <div className='xl:h-[10px] xl:bg-gray relative rounded-full'>
                  <div
                    className="flex xl:absolute flex-wrap xl:flex-nowrap gap-14 -top-4  xl:justify-center xl:px-7 w-full"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab, i) => (
                      <div onClick={() => setSelectedTabIdx(i)}
                        key={tab.name} className={`
                        ${i === selectedTabIdx
                            ? "bg-prussianBlue text-white xl:bg-transparent xl:text-black"
                            : i < selectedTabIdx
                              ? "bg-prussianBlue text-white xl:bg-transparent xl:text-black"
                              : ""
                          }
                        text-sm flex flex-col items-center cursor-pointer custom-shadow xl:shadow-none px-4 py-2 rounded-full font-medium text-center`}>
                        <button
                          onClick={() => setSelectedTabIdx(i)}
                          className={`
                          ${i === selectedTabIdx
                              ? "!border-prussianBlue"
                              : i < selectedTabIdx
                                ? "!border-prussianBlue "
                                : ""
                            } h-[26px] w-[26px] rounded-full border-gray border-[6px] cursor-pointer xl:flex justify-center items-center hidden `}>
                          <span className='bg-white h-[14px] w-[14px] rounded-full'></span>
                        </button>
                        {tab.name}
                      </div>
                    ))}
                  </div>
                </div>

                {(selectedTabIdx === 0|| selectedTabIdx === 1 || selectedTabIdx === 2 || selectedTabIdx === 3) && (
                  <div className="mt-20">
                    <h3 className='text-lg mb-3 text-black/50'>Progress Tracker</h3>
                    <div className="overflow-x-auto custom-shadow rounded">
                      <table className='custom-shadow rounded w-full min-w-[700px]'>
                        <thead>
                          <tr className='shadow'>
                            <th className='px-10 py-3 font-normal text-start text-black/50'>Category</th>
                            <th className='px-10 py-3 font-normal text-start'>Dummy text</th>
                            <th className='px-10 py-3 font-normal text-start'>Dummy text</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className='px-10 py-3 text-start'>Property</td>
                            <td className='px-10 py-3 text-start'>Dummy text</td>
                            <td className='px-10 py-3 text-start'>Dummy text</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )} 
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}
