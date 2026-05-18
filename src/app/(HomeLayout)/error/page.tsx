"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [error, setError] = useState(
    "Looks like something went wrong at our end. Please try again later."
  );

  useEffect(() => {
    const ifError = localStorage.getItem("error");
    if (ifError) {
      setError(ifError);
    }

    const handleUnload = () => {
      localStorage.removeItem("error");
    };

    // Remove on tab/window close or refresh
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup when component unmounts
    return () => {
      handleUnload(); // in case it navigates to another page
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="space-y-5 flex flex-col justify-center items-center my-16">
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-semibold text-center sm:text-lg text-base lg:text-xl text-[#8D7C3B]">
          Sorry!
        </h1>
        <p className="lg:text-base sm:text-sm text-xs text-center xl:w-[70%] lg:w-[50%] sm:w-1/2 w-[80%] font-medium">
          {error}
        </p>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <Image
          src="/assets/images/error.png"
          height={500}
          width={500}
          alt="error"
          className="w-[261px] h-[195px]"
        />
      </div>
      <Link href="/">
        <button className="lg:text-base sm:text-sm text-xs text-center bg-[#8D7C3B] rounded font-medium text-white sm:px-8 px-4 lg:px-10 py-2 sm:py-3">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default Page;
