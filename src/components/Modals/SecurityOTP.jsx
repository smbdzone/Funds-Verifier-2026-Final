"use client";
import React, { useState, useEffect, useRef } from "react";

const SecurityOTP = ({ handleClose }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const modalRef = useRef(null);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    let newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to the next input field
    if (index < otp.length - 1 && value) {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (element, index) => {
    if (element.value === "") {
      if (index > 0) {
        let newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        element.previousSibling.focus();
      }
    }
  };

  const isOtpComplete = otp.every((val) => val !== "");

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white py-20 rounded-xl shadow-lg md:w-[600px] text-[#002D4F] flex flex-col gap-12 items-center justify-center"
      >
        <div className="flex flex-col items-center text-center gap-2">
          <img src="/icons/email2.png" alt="Email Icon" />
          <h2 className="text-2xl font-semibold text-prussianBlue w-[80%]">
            Verify your email address to enable two-step verification
          </h2>
          <p className="text-[#9C9C9C] text-sm w-[60%]">
            An email verification code has been sent to janedoe@domain.com
          </p>
        </div>
        <div className="w-full flex flex-col items-center justify-center text-center gap-6">
          <p className="text-[#9c9c9c] font-semibold">Please enter the code here</p>
          <div className="flex space-x-2">
            {otp.map((data, index) => (
              <input
                className="w-12 h-12 text-center text-lg border border-[#9c9c9c] rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyUp={(e) => {
                  if (e.key === "Backspace") handleBackspace(e.target, index);
                }}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <p className="text-[#51ABBF] font-semibold hover:text-[#002D4F] cursor-pointer text-sm w-[60%]">
            Did not receive a code? Resend
          </p>
        </div>
        <div className="w-[70%] mt-8 flex justify-between">
          <button
            className="w-[200px] bg-white border border-prussianBlue text-prussianBlue font-semibold py-2 px-8 rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`w-[200px] py-2 px-8 rounded font-semibold ${
              isOtpComplete
                ? "bg-prussianBlue text-white"
                : "bg-prussianBlue bg-opacity-50 text-white cursor-not-allowed"
            }`}
            disabled={!isOtpComplete}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityOTP;
