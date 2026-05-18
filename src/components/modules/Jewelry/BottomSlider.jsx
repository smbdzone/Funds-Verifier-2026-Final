"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Rating } from "@mui/material";
import Image from "next/image";
import arrow_right from "@/assets/vector1.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, HashNavigation } from "swiper/modules";

export default function BottomSlider() {
  const swiperRef = useRef(null);
  const slides = new Array(10).fill(null);
  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center relative">
        <div
          onClick={handlePrevSlide}
          className="btn-gradient px-2 py-1 rounded cursor-pointer absolute top-[50%] -left-3 sm:-left-12 z-40"
        >
          <Image
            src={arrow_right}
            alt="previous"
            className="transform rotate-180"
          />
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          hashNavigation={{
            watchState: true,
          }}
         
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          modules={[Pagination]}
          ref={swiperRef}
          className="h-[500px] w-full"
        >
          {slides.map((_, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-lg shadow mx-1">
                <div className="flex flex-col justify-center pb-3 items-center space-y-3">
                  <Image
                    src="/product/rectangle-105@2x.png"
                    alt="slide1"
                    height={305}
                    width={305}
                  />
                  <div className=" ">
                    <h2 className="text-xl font-medium text-blue">
                      Diamond Ring
                    </h2>
                    <div className="flex flex-row items-center space-x-3">
                      <Rating
                        className="text-xs"
                        name="half-rating-read"
                        defaultValue={2.5}
                        precision={0.5}
                        readOnly
                      />
                      <span className="text-xs underline">20 Reviews</span>
                    </div>
                    <div className="pt-2">
                      <span className="font-medium text-xl">$4,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          onClick={handleNextSlide}
          className="btn-gradient px-2 py-1 rounded cursor-pointer absolute top-[50%] -right-3 sm:-right-12 z-40"
        >
          <Image src={arrow_right} alt="next" />
        </div>
      </div>
    </div>
  );
}
