/* eslint-disable react/no-unescaped-entities */
import { CloseIcon } from "@/components/Icons";
import React from "react";
const Modal = ({ show, onClose, onSubmit }) => {
  if (!show) {
    return null;
  }
  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 modal-bg  z-10"></div>
      {/* Modal dialog */}
      <div className="fixed inset-0 flex justify-center  items-center z-20  ">
        <div className="bg-white rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm  w-[391px] z-30  px-5 ">
          <div className="py-4 flex justify-end items-center  mb-3">
            <span className="cursor-pointer pr-5 mb" onClick={onClose}>
              <CloseIcon />
            </span>
          </div>
          <h2 className="text-black/50 text-center text-light-gold text-[25px] font-medium mb-4   font-montserrat ">
            Request Evaluation
          </h2>
          <p className="text-black mb-4 text-center w-full">
            Your asset will be reviewed by our evaluation partner. You will
            receive a notification on your profile and an email with the
            evaluation fee details. You can cancel if you don't agree with the
            price.
          </p>
          <div className="flex justify-center mb-10  ">
            <button
              type="button"
              onClick={onSubmit}
              className="bg-light-gold text-white text-[15px] rounded-tl-sm rounded-bl-sm   px-8 py-3"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              type="button"
              className="border-2 border-light-gold text-[15px]  rounded-sm  px-8   py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
