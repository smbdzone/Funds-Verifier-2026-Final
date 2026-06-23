"use client";
import { Suspense } from "react";
import Login from "../../components/home/Login";
import { HomePageSkeleton } from "@/components/home/HomeSectionSkeletons";

const page = () => {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <Login />
    </Suspense>
  );
};

export default page;
