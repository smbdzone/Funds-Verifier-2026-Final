"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Mousewheel } from "swiper/modules";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";

SwiperCore.use([Mousewheel, Pagination]); // Initialize Swiper core modules

export default function CarProductSlider() {
  const swiperRef = useRef(null);

  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="custom-swiper flex flex-col items-center">
      <button className="custom-swiper-prev" onClick={goToPrevSlide}>
        <IoIosArrowUp className="ArrowDown text-2xl" />
      </button>
      <Swiper
        direction={"vertical"}
        slidesPerView={3}
        spaceBetween={30}
       
        ref={swiperRef}
        className="liftSwiper" // Example of using Tailwind CSS classes
      >
        <SwiperSlide>
          <Image
            src="/product/Car 1.png"
            alt="slide1"
            height={350}
            width={350}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/product/Rectangle 105.png"
            alt="slide1"
            quality={90}
            height={3000}
            width={2000}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/product/image 1.png"
            alt="slide1"
            height={3000}
            width={2000}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/product/Car 1.png"
            alt="slide1"
            height={350}
            width={350}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/product/Rectangle 105.png"
            alt="slide1"
            quality={90}
            height={3000}
            width={2000}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/product/image 1.png"
            alt="slide1"
            height={3000}
            width={2000}
          />
        </SwiperSlide>
        
      </Swiper>
      <button className="custom-swiper-next" onClick={goToNextSlide}>
        <IoIosArrowDown className="ArrowDown text-2xl" />
      </button>
    </div>
  );
}
