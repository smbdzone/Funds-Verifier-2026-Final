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

export default function FundsTypeSlider() {
  const { propertyTypeData } = useAppContext();

  const villaThumbnail = getListingThumbSrc(
    propertyTypeData?.[0]?.products?.[0],
    "/villa.jpg"
  );
  const apartmentThumbnail = getListingThumbSrc(
    propertyTypeData?.[1]?.products?.[0],
    "/apartment.jpg"
  );
  const buildingThumbnail = getListingThumbSrc(
    propertyTypeData?.[2]?.products?.[0],
    "/villa.jpg"
  );

  const slides = [
    {
      slide_title: "Property Types",
      photos: [villaThumbnail, apartmentThumbnail, buildingThumbnail],
      context_types: ["Villa", "Apartment", "Building"],
      slide_description:
        "Lorem ipsum placeholder or dummy text used in typesetting and graphic design for previewing layouts.",
    },
    {
      slide_title: "Car Types",
      photos: [sports_car, limousine_car, pickup_car],
      context_types: ["Sport cars", "Limousine cars", "Pickup cars"],
      slide_description:
        "Lorem ipsum placeholder or dummy text used in typesetting and graphic design for previewing layouts.",
    },
    {
      slide_title: "Jewellery Types",
      photos: [jewellery_one, jewellery_two, jewellery_three],
      context_types: ["Earring Jewelry ", "Necklace Jewelry", "Ring Jewelry"],
      slide_description:
        "Lorem ipsum placeholder or dummy text used in typesetting and graphic design for previewing layouts.",
    },
  ];

  return (
    <div className="container mx-auto my-5">
      <Swiper modules={[Navigation]} loop={true} className="mySwiper">
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <FundTypeSlide data={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
