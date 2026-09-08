/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { BoatListingCard } from "@/components/modules/Boat/Boat-listing-card";
import { Banner } from "@/components/modules/Banner";
import CarWrapper from "../../../components/Wrappers/CarWrapper";
import { Suspense } from "react";
import { ListingCardSkeleton } from "@/components/global/ListingCardSkeleton";

export default function page({ searchParams }) {
  return (
    <Suspense fallback={<div className="py-6 px-4"><ListingCardSkeleton count={3} /></div>}>
      <div className="w-full bg-[#f0f8ff78]">
        <Banner
          title="Boats For Sale"
          catagory={searchParams?.category || "Boats"}
          subcatagory={searchParams?.model}
        />
        <CarWrapper>
          <BoatListingCard />
        </CarWrapper>
      </div>
    </Suspense>
  );
}
