import React from "react";
import { Disclosure } from "@headlessui/react";
import { OpenDisclosure, CloseDisclosure } from "@/components/Icons";
import FormCheck from "@/components/CheckBoxComponent/FormCheck";

export const PasswordTab = () => {
  return (
    <>
      <span className="text-lg text-prussianBlue/40 mb-4 block">Password</span>
      <div className="custom-shadow rounded flex flex-col gap-2">
        <Disclosure as="div" className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && "mb-3"
                }`}
              >
                <span className="whitespace-nowrap sm:text-xl font-medium text-white">
                  Change Password
                </span>
                <span className="flex-shrink-0">
                  {open ? (
                    <OpenDisclosure className="text-white" />
                  ) : (
                    <CloseDisclosure className="text-white" />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as="div" className="px-8 py-4">
                <Disclosure as="div" className={`mb-4`} defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`w-full custom-shadow rounded py-3 px-7 gap-4 flex-wrap justify-between items-center flex ${
                          open && "mb-3"
                        }`}
                      >
                        <span className="whitespace-nowrap">Password</span>
                        <span className="whitespace-nowrap">
                          Last changed 22 April 2024
                        </span>
                        <span className="flex-shrink-0">
                          {open ? (
                            <OpenDisclosure className="text-reefGold" />
                          ) : (
                            <CloseDisclosure className="text-reefGold" />
                          )}
                        </span>
                      </Disclosure.Button>
                      <Disclosure.Panel
                        as="div"
                        className="grid gap-4 sm:gap-12 sm:grid-cols-2 px-7 py-4"
                      >
                        <div>
                          <p className="mb-5">Choose a strong password</p>
                          <input
                            type="password"
                            className={`mb-4 shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input `}
                            placeholder="Old Password*"
                            name="Old Password*"
                          />
                          <input
                            type="password"
                            className={`mb-4 shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input `}
                            placeholder="New Password*"
                            name="New Password*"
                          />
                          <input
                            type="password"
                            className={`mb-4 shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input `}
                            placeholder="Re-Type New Password*"
                            name="Re-Type New Password*"
                          />
                          <div className="flex gap-4">
                            <button className="py-2 px-4 btn-gradient rounded ">
                              Changed Password
                            </button>
                            <button className="  text-reefGold rounded">
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="mb-7">Password Requirements</p>
                          <FormCheck label="Minimum 8 Characters" id="1" />
                          <FormCheck label="UPPERCASE letter" id="2" />
                          <FormCheck label="lowercase letter" id="3" />
                          <FormCheck label="Numbers" id="4" />
                          <FormCheck label="Special Symbols" id="5" />
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};
