import React, { useState, useEffect } from "react";
import Image from "next/image";
// import { PaymentWithMetaMask } from "./PaymentWithMetaMask";
import { CloseDisclosure } from "../Icons";

const PaymentMethodsModal = ({
  price,
  isOpen,
  onClose,
  onSave,
  setPaymentComplete,
  handleCloseModal,
  data,
}) => {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]">
          <button
            className="px-4 float-right py-2 bg-blue-500 text-prussianBlue rounded"
            onClick={handleCloseModal}
            type="button"
          >
            X
          </button>
          <div className="border-b border-blue mb-7">
            <h2 className="text-3xl font-semibold mb-4">Select Method</h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Image width={45} height={45} src={"/icons/metamask-icon.svg"} />
              <p className="m-0 text-black">Metamask</p>
            </div>
            {/* <div className="flex flex-col justify-end items-end">
              <PaymentWithMetaMask price={price} />
            </div> */}
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentMethodsModal;
