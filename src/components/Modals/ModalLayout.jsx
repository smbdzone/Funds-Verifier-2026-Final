"use client";
import React from "react";

const ModalLayout = ({ children, className }) => {
  return (
    <div className={`${className || ""} fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white p-6 rounded-[12px] shadow-lg w-96">
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
