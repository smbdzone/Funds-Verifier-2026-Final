"use client";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";

const Page = () => {
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

  return (
    <div className="pl-8 pt-8 flex flex-col gap-10 w-full">
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
              Close
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
