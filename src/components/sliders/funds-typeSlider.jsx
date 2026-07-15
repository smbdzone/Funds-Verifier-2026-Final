"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { getListingThumbSrc } from "@/libs/listingCardMedia";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";

// Import your slide component
import FundTypeSlide from "./slides/fund-type-slide";

//Cars Tyes Slider Images
import sports_car from "@/assets/images/rectangle-86@2x.png";
import pickup_car from "@/assets/images/Mask group (2).png";
import limousine_car from "@/assets/images/Mask group (3).png";

//Jewellery Tyes Slider Images
import jewellery_one from "@/assets/images/jewellery_one.png";
import jewellery_two from "@/assets/images/jewellery_two.png";
import jewellery_three from "@/assets/images/jewellery_three.png";

// Boat type slider images
import boat_yacht from "@/assets/images/rectangle-58@2x.png";
import boat_fishing from "@/assets/images/rectangle-63@2x.png";
import boat_sail from "@/assets/images/rectangle-64@2x.png";

export default function FundsTypeSlider() {
  const { propertyTypeData, boatsForSale } = useAppContext();

  const villaThumbnail = getListingThumbSrc(
    propertyTypeData?.[0]?.products?.[0],
    "/villa.jpg"
  );
  const apartmentThumbnail = getListingThumbSrc(
    propertyTypeData?.[1]?.products?.[0],
    "/apartment.jpg"
  );
  const townhouseThumbnail = getListingThumbSrc(
    propertyTypeData?.[2]?.products?.[0],
    "/villa.jpg"
  );
  const offPlanVillaThumbnail = "/offplan/image1.svg";
  const offPlanApartmentThumbnail = "/offplan/image1.svg";
  const offPlanPenthouseThumbnail = "/offplan/image1.svg";
  const boatYachtThumbnail = getListingThumbSrc(
    boatsForSale?.products?.[0],
    boat_yacht
  );
  const boatFishingThumbnail = getListingThumbSrc(
    boatsForSale?.products?.[1],
    boat_fishing
  );
  const boatSailThumbnail = getListingThumbSrc(
    boatsForSale?.products?.[2],
    boat_sail
  );

  const slides = [
    {
      slide_title: "Property Types",
      photos: [villaThumbnail, apartmentThumbnail, townhouseThumbnail],
      context_types: ["Villa", "Apartment", "Townhouse"],
      slide_description:
        "Browse evaluator-approved properties and find the right home or investment with confidence.",
      context_descriptions: [
        "Explore verified villas for sale and lease.",
        "Browse approved apartments across the UAE.",
        "View verified townhouses with evaluator approval.",
      ],
    },
    {
      slide_title: "Off Plan Properties",
      photos: [
        offPlanVillaThumbnail,
        offPlanApartmentThumbnail,
        offPlanPenthouseThumbnail,
      ],
      context_types: ["Villa", "Apartment", "Penthouse"],
      slide_description:
        "Discover verified off-plan projects with flexible payment plans and trusted developers across the UAE.",
      context_descriptions: [
        "Premium off-plan villas with spacious layouts and private amenities.",
        "Waterfront and city apartments with flexible handover timelines.",
        "Exclusive penthouse residences with luxury finishes and views.",
      ],
    },
    {
      slide_title: "Boat Types",
      photos: [boatYachtThumbnail, boatFishingThumbnail, boatSailThumbnail],
      context_types: ["Yacht", "Fishing Boat", "Sailboats"],
      slide_description:
        "Browse evaluator-approved boats for sale, from luxury yachts to fishing and leisure vessels.",
      context_descriptions: [
        "Luxury yachts listed with evaluator approval and clear pricing.",
        "Fishing boats ready for secure, verified purchase.",
        "Sailboats and cruisers available across the UAE.",
      ],
    },
    {
      slide_title: "Car Types",
      photos: [sports_car, limousine_car, pickup_car],
      context_types: ["Sport cars", "Limousine cars", "Pickup cars"],
      slide_description:
        "Discover evaluator-approved cars listed for sale, from sports models to everyday vehicles.",
      context_descriptions: [
        "High-performance sports cars, verified for sale.",
        "Luxury limousines listed with evaluator approval.",
        "Pickup trucks ready for secure, verified purchase.",
      ],
    },
    {
      slide_title: "Jewellery Types",
      photos: [jewellery_one, jewellery_two, jewellery_three],
      context_types: ["Earring Jewelry", "Necklace Jewelry", "Ring Jewelry"],
      slide_description:
        "Shop evaluator-approved jewellery with clear pricing and trusted verification.",
      context_descriptions: [
        "Verified earrings listed for sale on Funds Verifier.",
        "Approved necklaces you can browse with confidence.",
        "Rings evaluated and listed for secure transactions.",
      ],
    },
  ];

  return (
    <div className="container mx-auto my-5">
      <Swiper modules={[Navigation]} loop={false} className="mySwiper">
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <FundTypeSlide data={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
