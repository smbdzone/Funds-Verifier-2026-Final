import React from "react";
import { Disclosure } from "@headlessui/react";
import { OpenDisclosure, CloseDisclosure } from "@/components/Icons";
import FormCheck from "@/components/CheckBoxComponent/FormCheck";

export const SecurityTab = () => {
  return (
    <>
      <span className="text-lg text-prussianBlue/40 mb-4 block">Security</span>
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
                  Keep Your Account Secure
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
                        <span className="whitespace-nowrap">
                          2-Step Verification
                        </span>
                        <span className="whitespace-nowrap">
                          On since 22 April 2024
                        </span>
                        <span className="flex-shrink-0">
                          {open ? (
                            <OpenDisclosure className="text-reefGold" />
                          ) : (
                            <CloseDisclosure className="text-reefGold" />
                          )}
                        </span>
                      </Disclosure.Button>
                      <Disclosure.Panel as="div" className="px-7 py-4">
                        <p className="mb-2">
                          {"Your account is protected with 2-Step Verification"}
                        </p>
                        <p className="mb-4 text-black/60">
                          {
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                          }
                        </p>
                        <button className="py-2 px-8 btn-gradient rounded">
                          Turn Off 2-Step Verification{" "}
                        </button>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className={`mb-4`} defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`w-full custom-shadow rounded py-3 px-7 gap-4 justify-between items-center flex ${
                          open && "mb-3"
                        }`}
                      >
                        <span className="whitespace-nowrap">
                          Email Verification
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
                        className="px-7 py-4 flex  flex-col items-start gap-4"
                      >
                        <p>Verify Your Email </p>
                        <input
                          type="email"
                          className={`shadow-neons rounded w-full sm:w-[50%] h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input `}
                          placeholder="smbdigitalzone@gmail.com"
                          name="smbdigitalzone@gmail.com"
                        />
                        <button className="py-2 px-4 btn-gradient rounded">
                          Verify
                        </button>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className={`mb-4`} defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={`w-full custom-shadow rounded flex-wrap py-3 px-7 gap-4 justify-between items-center flex ${
                          open && "mb-3"
                        }`}
                      >
                        <span className="whitespace-nowrap">
                          Recovery email
                        </span>
                        <span className="whitespace-nowrap">
                          Add Email Address
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
                        className="px-7 py-4 flex  flex-col items-start gap-4"
                      >
                        <p>Add Your Recovery email</p>
                        <input
                          type="email"
                          className={`shadow-neons rounded w-full sm:w-[50%] h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input `}
                          placeholder="smbdigitalzone@gmail.com"
                          name="smbdigitalzone@gmail.com"
                        />
                        <div className="flex gap-8">
                          <button className="py-2 px-4 btn-gradient rounded">
                            Next
                          </button>
                          <button className="text-reefGold">Cancel</button>
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
