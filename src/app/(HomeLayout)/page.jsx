"use client";
import { Suspense } from "react";
import Login from "../../components/home/Login";
import GlobalLoader from "@/utils/GlobalLoader";

const page = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Login />
    </Suspense>
  );
};

export default page;
