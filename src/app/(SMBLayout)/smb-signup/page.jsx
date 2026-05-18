import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h-screen w-full grid md:grid-cols-2 fixed z-50">
      <div className="p-5 flex flex-col gap-20 justify-center items-center bg-prussianBlue h-full text-white">
        <div className="flex gap-2 items-center">
          <img src="icons/Logo2.png" alt="Funds Verifier" />
          <h2 className="font-bold text-2xl">Funds Verifier</h2>
        </div>
        <div className="w-[80%] xl:w-[50%] flex flex-col gap-5 justify-center items-center">
          <h2 className="font-semibold text-2xl">Sign Up</h2>
          <input
            type="text"
            placeholder="Email or phone"
            className="w-full bg-transparent rounded-full border border-white py-2 px-4 "
          />
          <input
            type="password"
            placeholder="Create Password"
            className="w-full bg-transparent rounded-full border border-white py-2 px-4 "
          />
          <p className="-mt-3 ml-3 self-start text-xs text-slate-200">
            Password must consist of atleast 8 characters
          </p>
          <input
            type="confirmPassword"
            placeholder="Confirm Password"
            className="w-full bg-transparent rounded-full border border-white py-2 px-4 "
          />
        </div>
        <div className="w-[80%] xl:w-[50%] flex flex-col gap-5 justify-center items-center">
          <button className="w-full bg-white text-prussianBlue rounded-full py-2 font-semibold">
            Sign Up
          </button>
          <div className="flex text-sm">
            <p>Already have an account?</p>
            <Link href={"/smb-signin"}>
              <button className="underline">Sign In</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center bg-white">
        <img src="/icons/SMBSignup.png" className="w-[80%]" />
      </div>
    </div>
  );
};

export default page;
