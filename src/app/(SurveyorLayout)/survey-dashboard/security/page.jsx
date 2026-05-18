"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SecurityOTP from "@/components/Modals/SecurityOTP";
import { FaLock } from "react-icons/fa";
const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [enterOTP, setEnterOTP] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isOpen]);

  return (
    <div className="py-8 pl-8 flex flex-col gap-10 w-full h-full">
      <div className="w-[80%] flex flex-col gap-12">
        <div className="flex gap-3">
          <img src="/icons/securityLarge.png" alt="Security Icon" />
          <h1 className="font-semibold text-prussianBlue text-4xl">
            Keep Your Account Secure
          </h1>
        </div>
        <div className="w-full flex flex-col gap-7">
          <h3 className="text-[30px] text-prussianBlue">
            Two-Step Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-10">
            <div className="flex flex-col gap-3">
              <label className="text-lg text-prussianBlue">
                Email Verification
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="p-3 border border-[#BDBDBD] rounded-md w-full focus:outline focus:outline-prussianBlue"
              />
              <button
                onClick={() => {
                  setEnterOTP(true);
                }}
                className="bg-prussianBlue text-white w-fit font-semibold py-1 px-8 rounded"
              >
                Verify
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg text-prussianBlue">
                Recovery Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Recovery Email"
                className="p-3 border border-[#BDBDBD] rounded-md w-full focus:outline focus:outline-prussianBlue"
              />
              <button className="bg-prussianBlue text-white font-semibold w-fit py-1 px-8 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-7">
          <div
            className="flex justify-between items-center rounded w-full bg-prussianBlue py-3 px-5 text-white cursor-pointer"
            onClick={toggleSection}
          >
            <p>Your account is protected with 2-Step Verification</p>
            {isOpen ? (
              <IoIosArrowUp fontSize={25} />
            ) : (
              <IoIosArrowDown fontSize={25} />
            )}
          </div>
          {isOpen && (
            <>
              <div className="border border-[#BDBDBD] py-3 px-5 rounded text-[#a9a9a9] flex justify-between w-full">
                <p>2-Step Verification</p>
                <p>On since 22 April 2024</p>
              </div>
              <p className="text-[#a9a9a9]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <button className="bg-prussianBlue text-white w-fit font-semibold py-1 px-8 rounded">
                Turn Off
              </button>
            </>
          )}
        </div>
      </div>
      {enterOTP && <SecurityOTP handleClose={() => setEnterOTP(false)} />}
      {/* Change password */}
      <div className="w-[80%] flex flex-col gap-12">
        <div className="flex gap-3 items-center">
          <img src="/icons/passwordLarge.png" alt="Security Icon" />
          <h1 className="items-center flex font-semibold text-prussianBlue text-4xl">
            Change Password
          </h1>
        </div>
        <div className="flex flex-col gap-7 md:w-1/2">
          {/* Old Password */}
          <div>
            <label className="text-lg text-prussianBlue">Old Password</label>
            <div className="relative w-full">
              <FaLock
                className="absolute top-4 left-3"
                color="#BDBDBD"
                fontSize={20}
              />
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="••••••••"
                className="p-3 border border-[#BDBDBD] rounded-md w-full pl-10 focus:outline focus:outline-prussianBlue"
              />
              <p
                className="absolute top-4 right-3 text-[#3EA7A7] cursor-pointer"
                onClick={toggleOldPasswordVisibility}
              >
                {showOldPassword ? "Hide" : "Show"}
              </p>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-lg text-prussianBlue">New Password</label>
            <div className="relative w-full">
              <FaLock
                className="absolute top-4 left-3"
                color="#BDBDBD"
                fontSize={20}
              />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className="p-3 border border-[#BDBDBD] rounded-md w-full pl-10 focus:outline focus:outline-prussianBlue"
              />
              <p
                className="absolute top-4 right-3 text-[#3EA7A7] cursor-pointer"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? "Hide" : "Show"}
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-lg text-prussianBlue">
              Confirm Password
            </label>
            <div className="relative w-full">
              <FaLock
                className="absolute top-4 left-3"
                color="#BDBDBD"
                fontSize={20}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="p-3 border border-[#BDBDBD] rounded-md w-full pl-10 focus:outline focus:outline-prussianBlue"
              />
              <p
                className="absolute top-4 right-3 text-[#3EA7A7] cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-4">
            <button className="bg-white border border-[#BDBDBD] text-prussianBlue font-semibold w-full py-2 px-8 rounded">
              Cancel
            </button>
            <button className="bg-prussianBlue text-white font-semibold w-full py-2 px-8 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
