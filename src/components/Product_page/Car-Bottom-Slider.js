"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Rating } from "@mui/material";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

// import required modules
import { Pagination, Navigation, HashNavigation } from "swiper/modules";

export default function CarBottomSlider() {
  const swiperRef = useRef(null);

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
    <div className="lg:w-[96%] sliderMargin">
      <div className="flex flex-row sliderMargin">
        <button className="custom-prev-button" onClick={handlePrevSlide}>
          <IoIosArrowBack className="btn-gradient text-white text-2xl" />
        </button>
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          hashNavigation={{
            watchState: true,
          }}
         
          modules={[Pagination, Navigation, HashNavigation]}
          ref={swiperRef}
          className="ButtomSwiper"
        >
          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 119.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Honda Civic</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 120.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Supercars</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 121.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Luxury cars</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 122.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Jaguar</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 119.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Honda Civic</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 120.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Supercars</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 121.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Luxury cars</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide data-hash="slide1" className="">
            <div
              className="rounded-lg "
              style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col justify-center  items-center">
                <Image
                  src="/product/Rectangle 122.png"
                  alt="slide1"
                  height={350}
                  width={350}
                />

                <div className="boxPadding">
                  <h2 className="textSize text-blue">Jaguar</h2>
                  <div className="flex flex-row items-center space-x-3">
                    <Rating
                      className="text-base"
                      name="half-rating-read"
                      defaultValue={2.5}
                      precision={0.5}
                      readOnly
                    />
                    <span className="text-sm">20 Reviews</span>
                  </div>
                  <span className="priceText">$4,000</span>
                </div>
              </div>
            </div>
          </SwiperSlide>

         
        </Swiper>

        <button className="custom-next-button " onClick={handleNextSlide}>
          <IoIosArrowForward className="btn-gradient text-white text-2xl" />
        </button>
      </div>
    </div>
  );
}
