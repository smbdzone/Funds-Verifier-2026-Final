/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h-screen w-full grid md:grid-cols-2 relative z-50">
      <div className="p-5 flex flex-col gap-20 justify-center items-center bg-prussianBlue h-full text-white">
        <div className="flex gap-2 items-center">
          <img src="icons/Logo2.png" alt="Funds Verifier" />
          <h2 className="font-bold text-2xl">Funds Verifier</h2>
        </div>
        <div className="w-[80%] xl:w-[50%] flex flex-col gap-5 justify-center items-center">
          <h2 className="font-semibold text-2xl">Sign In</h2>
          <input
            type="text"
            placeholder="Email or phone"
            className="w-full bg-transparent rounded-full border border-white py-2 px-4 "
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent rounded-full border border-white py-2 px-4 "
          />
          <button className="-mt-3 self-end text-sm text-slate-200 hover:text-white">
            Forgot Password?
          </button>
        </div>
        <div className="w-[80%] xl:w-[50%] flex flex-col gap-5 justify-center items-center">
          <button className="w-full bg-white text-prussianBlue rounded-full py-2 font-semibold">
            Sign In
          </button>
          <div className="flex text-sm">
            <p>Don't have an account?</p>
            <Link href="/smb-signup">
              <button className="underline">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex relative z-50 items-center justify-center bg-white">
        <img src="icons/SMBSignIn.png" className="w-[80%]" />
      </div>
    </div>
  );
};

export default page;
