"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Mousewheel } from "swiper/modules";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { getListingImageSrc } from "@/libs/listingCardMedia";
import { swiperCanLoop } from "@/utils/swiperLoop";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

SwiperCore.use([Mousewheel, Pagination]);

export default function JewellerySlider({ setPreviewMedia, images }) {
  const handlePreviewMedia = (media) => {
    setPreviewMedia(media);
  };
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
      <button className="custom-swiper-prev rounded-sm" onClick={goToPrevSlide}>
        <IoIosArrowUp className="ArrowDown text-2xl" />
      </button>
      <Swiper
        direction={"vertical"}
        slidesPerView={3}
        spaceBetween={2}
        ref={swiperRef}
        loop={swiperCanLoop(images?.length || 0, 3)}
        className="w-full h-[505px]"
      >
        {images &&
          images.map((image, idx) => {
            const src = getListingImageSrc(image);
            return (
              <SwiperSlide key={image.public_id || image.originalName || idx}>
                <figure className="h-full w-full sm:h-[165px] sm:w-[160px] py-1 rounded">
                  <Image
                    onClick={() => handlePreviewMedia(src)}
                    src={src}
                    alt={image.originalName || "jewelry image"}
                    quality={90}
                    height={350}
                    width={350}
                    className="rounded object-fit"
                  />
                </figure>
              </SwiperSlide>
            );
          })}
      </Swiper>

      <button className="custom-swiper-next rounded-sm" onClick={goToNextSlide}>
        <IoIosArrowDown className="ArrowDown text-2xl" />
      </button>
    </div>
  );
}
