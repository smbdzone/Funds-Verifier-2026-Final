"use client";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { OpenDisclosure, CloseDisclosure } from "@/components/Icons";

export const ClosedCaseTab = () => {
  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const onChange = (newDate) => {
    setDate(newDate);
    setIsCalendarOpen(false); // Close calendar when date is selected
  };

  const handleDateInputClick = () => {
    setIsCalendarOpen(!isCalendarOpen); // Toggle calendar visibility on input click
  };

  return (
    <>
      <span className="text-lg text-prussianBlue/40 mb-4 block">
        Closed Cases
      </span>
      <section className=" ">
        <div className="custom-shadow rounded flex flex-col mb-3 ">
          <Disclosure as="div" className={`disclosure`} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full primary-gradient rounded px-2 lg:px-7 py-4 justify-between items-center flex ${
                    open && "mb-12"
                  }`}
                >
                  <span className="whitespace-nowrap sm:text-xl font-medium text-white">
                    Reference Number: DU 12326876
                  </span>
                  <span className="flex-shrink-0">
                    {open ? (
                      <OpenDisclosure className="text-white" />
                    ) : (
                      <CloseDisclosure className="text-white" />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="gap-4 lg:px-8">
                  <Disclosure
                    as="div"
                    className={`disclosure`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Panel
                          as="div"
                          className="gap-2 px-2 lg:px-8 w-full"
                        >
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 ">
                            {/* Evaluator Assign */}
                            <input
                              type="text"
                              className="relative bg-whiteSmoke outline-none text-black/50 shadow-sm border mb-2.5 border-black/5 w-full py-3 pl-5 rounded-md "
                              placeholder="Customer Name"
                            />
                            <input
                              type="text"
                              className="relative bg-whiteSmoke outline-none text-black/50 shadow-sm border mb-2.5 border-black/5 w-full py-3 pl-5 rounded-md "
                              placeholder="Asset Type"
                            />
                            <textarea
                              type="text"
                              rows={4}
                              className="relative bg-whiteSmoke col-span-2 outline-none text-black/50 shadow-sm border mb-2.5 border-black/5 w-full py-3 pl-5 rounded-md "
                              placeholder="Asset description"
                            />
                            <input
                              type="text"
                              className="relative bg-whiteSmoke col-span-2 outline-none text-black/50 shadow-sm border mb-2.5 border-black/5 w-full py-3 pl-5 rounded-md "
                              placeholder="Customer Reference Number"
                            />
                            <input
                              type="date"
                              onFocus={handleDateInputClick}
                              className="relative bg-whiteSmoke outline-none text-black/50 shadow-sm border mb-2.5 border-black/5 w-full py-3 pl-5 rounded-md "
                              placeholder="Start Date"
                            />
                            <input
                              type="date"
                              onFocus={handleDateInputClick}
                              className="relative bg-whiteSmoke outline-none text-black/50 shadow-sm border mb-2.5 border-black/5 w-full py-3 pl-5 rounded-md "
                              placeholder="End Date"
                            />
                          </div>
                          {isCalendarOpen && (
                            <div className="schedule-calendar">
                              <Calendar
                                onChange={onChange}
                                value={date}
                                className="w-full !rounded-md !shadow-md !border-none !bg-transparent calendar__smb"
                              />
                            </div>
                          )}
                        </Disclosure.Panel>
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
