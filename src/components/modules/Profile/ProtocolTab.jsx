/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Disclosure } from "@headlessui/react";
import { OpenDisclosure, CloseDisclosure } from "@/components/Icons";

export const ProtocolTab = () => {
  return (
    <>
      <span className="sm:text-base text-sm lg:text-lg text-prussianBlue/40 mb-4 block">
        Privacy & Sharing
      </span>
      <div className="custom-shadow rounded flex flex-col gap-2">
        <Disclosure as="div" className={`disclosure`} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && "mb-3"
                }`}
              >
                <span className="whitespace-nowrap sm:text-base text-sm lg:text-lg font-medium text-white">
                  Confidentiality and Protocol
                </span>
                <span className="flex-shrink-0">
                  {open ? (
                    <OpenDisclosure className="text-white" />
                  ) : (
                    <CloseDisclosure className="text-white" />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel as="div" className=" gap-4 sm:px-8 px-6 py-6">
                <p className="sm:text-base text-sm mb-10">
                  In our platform, we prioritize confidentiality and follow a
                  strict protocol to ensure the security and privacy of our
                  users. As part of our commitment to maintaining anonymity
                  until both parties are ready to proceed, we implement a unique
                  approach. The Deal Hunter and Asset Holder will not have
                  access to each other's identities until specific conditions
                  are met. Initially, both parties will be identified solely by
                  their reference numbers. The Asset Holder will verify and
                  evaluate their asset, while the Deal Hunter completes the
                  necessary procedures and locks their escrow account for the
                  asset. Only after these steps are completed will the
                  identities of both parties be revealed to each other. This
                  protocol is designed to safeguard the interests of all users
                  and facilitate transparent and secure transactions within our
                  platform. We prioritize the confidentiality and trust of our
                  users above all else.
                </p>
                <div className="custom-shadow sm:text-base text-sm px-5 py-3 font-medium">
                  <p>
                    Once you make an investment with an Asset Holder and adhere
                    to our Confidentiality and Protocol, their name will appear
                    here along with the asset details
                  </p>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};
