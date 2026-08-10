"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HashNavigation, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { swiperCanLoop } from "@/utils/swiperLoop";
import { HomeTestimonialsSkeleton } from "@/components/home/HomeSectionSkeletons";

import man from "@/assets/images/ellipse-113@2x.png";
import man_one from "@/assets/images/man_one.png";
import woman from "@/assets/images/woman.png";
import star from "@/assets/star-6.svg";
import upArrow from "@/assets/vector7.svg";
import downArrow from "@/assets/vector8.svg";

const dummyTestimonials = [
  {
    firstName: "Kell",
    lastName: "Robinson",
    designation: "Product Manager",
    rating: 5,
    description:
      "Purchasing our dream home was made incredibly simple thanks to the dedicated team at Fund Verify. From start to finish, their professionalism and commitment to finding us the perfect property were unmatched. We couldn't be happier with our new home!",
    file: man_one.src,
  },
  {
    firstName: "Jack",
    lastName: "Nitzsche",
    designation: "Product Manager",
    rating: 5,
    description:
      "The experience of buying a car at Fund Verify was nothing short of exceptional. The sales team was knowledgeable, patient, and helped us find a car that perfectly matched our needs and budget. We highly recommend them to anyone looking for a new vehicle!",
    file: man.src,
  },
  {
    firstName: "Karen",
    lastName: "Maria",
    designation: "Product Manager",
    rating: 5,
    description:
      "As first-time boat buyers, we were a bit overwhelmed, but Fund Verify made the entire process smooth and enjoyable. Their expertise and customer service were top-notch, and we're thrilled with our new boat. Thank you for making our dream a reality!",
    file: woman.src,
  },
];

export default function Testimonials() {
  const testimonialSwiperRef = useRef(null);
  const valuesSwiperRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState("vertical");
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateDirection = () => {
    if (window.innerWidth >= 801) {
      setDirection("vertical");
    } else {
      setDirection("horizontal");
    }
  };

  useEffect(() => {
    updateDirection();
    window.addEventListener("resize", updateDirection);
    return () => window.removeEventListener("resize", updateDirection);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/testimonials/all`,
        );
        if (response.data.success && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials);
        } else {
          setTestimonials(dummyTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(dummyTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handlePrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex =
      (selectedIndex - 1 + testimonials.length) % testimonials.length;
    setSelectedIndex(newIndex);
    testimonialSwiperRef.current?.swiper?.slidePrev();
    valuesSwiperRef.current?.swiper?.slidePrev();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = (selectedIndex + 1) % testimonials.length;
    setSelectedIndex(newIndex);
    testimonialSwiperRef.current?.swiper?.slideNext();
    valuesSwiperRef.current?.swiper?.slideNext();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleCustomerClick = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedIndex(index);
    const thumbSwiper = testimonialSwiperRef.current?.swiper;
    const valuesSwiper = valuesSwiperRef.current?.swiper;
    if (thumbSwiper?.params?.loop) {
      thumbSwiper.slideToLoop(index);
    } else {
      thumbSwiper?.slideTo(index);
    }
    if (valuesSwiper?.params?.loop) {
      valuesSwiper.slideToLoop(index);
    } else {
      valuesSwiper?.slideTo(index);
    }
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (loading) {
    return <HomeTestimonialsSkeleton />;
  }

  const thumbLoop = swiperCanLoop(testimonials.length, 3);
  const contentLoop = swiperCanLoop(testimonials.length, 1);

  return (
    <div className="w-full valuesBg py-3 min-[801px]:pt-12 xl:px-20 xl:pt-20">
      {/* PC layout — 801px+ */}
      <div className="container mx-auto hidden min-[801px]:flex min-[801px]:flex-row min-[801px]:items-center min-[801px]:gap-6 lg:gap-10">
        <div className="w-[34%] max-w-[320px] shrink-0 lg:w-[30%]">
          <div className="my-5 flex h-[420px] flex-col items-center justify-center gap-2 lg:h-[470px] xl:h-[500px]">
            <button
              onClick={handlePrevSlide}
              className="flex w-full cursor-pointer items-center justify-center rounded bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#d7c58f] py-2 transition-all duration-300 hover:bg-white"
            >
              <Image
                height={30}
                width={30}
                className="max-h-full max-w-full overflow-hidden"
                alt="Previous"
                src={upArrow.src}
              />
            </button>

            <Swiper
              ref={testimonialSwiperRef}
              spaceBetween={10}
              modules={[Pagination, Navigation, HashNavigation]}
              className="mySwiper testmonialSlider testimonials-thumb-swiper h-full w-full"
              direction={direction}
              slidesPerView={3}
              loop={thumbLoop}
              breakpoints={{
                801: { slidesPerView: 3, spaceBetween: 10 },
                1200: { slidesPerView: 3, spaceBetween: 12 },
              }}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide
                  key={index}
                  className="!items-stretch !justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`mainDiv box-border flex h-full min-h-0 max-h-full w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 lg:gap-3 lg:p-2.5 ${
                      selectedIndex === index ? "bg-white" : "bg-[#ffffffa1]"
                    }`}
                    onClick={() => handleCustomerClick(index)}
                  >
                    <div className="flex shrink-0 items-center justify-center">
                      <Image
                        width={72}
                        height={72}
                        className="h-12 w-12 shrink-0 rounded-full object-cover lg:h-[72px] lg:w-[72px]"
                        alt={`${testimonial.firstName} ${testimonial.lastName}`}
                        src={testimonial.file || man.src}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col items-start justify-center text-left text-black">
                      <div className="w-full text-sm font-medium leading-tight text-black line-clamp-2 lg:text-lg xl:text-xl">
                        {testimonial.firstName} {testimonial.lastName}
                      </div>
                      <p className="mt-0.5 w-full text-xs leading-snug text-black/80 line-clamp-2 lg:text-sm xl:text-base">
                        {testimonial.designation}
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={handleNextSlide}
              className="flex w-full cursor-pointer items-center justify-center rounded bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#d7c58f] py-2 transition-all duration-300 hover:bg-white"
            >
              <Image
                height={30}
                width={30}
                className="max-h-full max-w-full overflow-hidden"
                alt="Next"
                src={downArrow.src}
              />
            </button>
          </div>
        </div>

        <div className="my-5 flex h-[420px] w-[66%] flex-1 flex-col items-center justify-center gap-3 lg:h-[470px]">
          <Swiper
            ref={valuesSwiperRef}
            spaceBetween={10}
            modules={[Pagination, Navigation, HashNavigation]}
            className="mySwiper testmonialSlider h-full w-full"
            direction="vertical"
            slidesPerView={1}
            loop={contentLoop}
            initialSlide={selectedIndex}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide
                key={index}
                className="!flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-start p-4 text-white lg:p-8 xl:p-10"
                >
                  <b className="text-2xl tracking-wide lg:text-4xl xl:text-5xl">
                    Testimonials
                  </b>
                  <div className="my-4 flex flex-row gap-2 lg:my-5">
                    <div className="h-[5.6px] w-[31.8px] rounded-2xl bg-[#8D7C3B]" />
                    <div className="h-[5.6px] w-[84.9px] rounded-lg bg-white" />
                  </div>
                  <div className="inline-block text-lg font-medium leading-[30px] lg:text-xl xl:text-2xl">
                    {testimonial.firstName} {testimonial.lastName}
                  </div>
                  <div className="my-3 flex flex-row gap-2">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Image
                        key={i}
                        width={25}
                        height={25}
                        src={star.src}
                        alt="star"
                      />
                    ))}
                  </div>
                  <p className="text-left text-sm leading-7 lg:text-lg lg:leading-8 xl:text-xl xl:leading-[32px]">
                    {testimonial.description}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Mobile layout — up to 800px */}
      <div className="relative overflow-hidden min-[801px]:hidden">
        <div className="container mx-auto px-6">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold text-white">Testimonials</h1>
          </div>

          <div className="mb-5 flex flex-row justify-center gap-2">
            <div className="h-[5.6px] w-5 rounded-2xl bg-[#8D7C3B]" />
            <div className="h-[5.6px] w-12 rounded-lg bg-white" />
          </div>

          <div className="space-y-2">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <div
                  onClick={() => handleCustomerClick(index)}
                  className={`cursor-pointer p-2 transition-all duration-300 ${
                    selectedIndex === index
                      ? "bg-[#ccd5dc] shadow-lg"
                      : "bg-[#335772] hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonial.file || man.src}
                      alt={`${testimonial.firstName} ${testimonial.lastName}`}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          selectedIndex === index
                            ? "text-gray-800"
                            : "text-white"
                        }`}
                      >
                        {testimonial.firstName} {testimonial.lastName}
                      </h3>
                      <p
                        className={`text-sm ${
                          selectedIndex === index
                            ? "text-gray-600"
                            : "text-blue-200"
                        }`}
                      >
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: selectedIndex === index ? 1 : 0,
                    height: selectedIndex === index ? "auto" : 0,
                    marginTop: selectedIndex === index ? 16 : 0,
                  }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div>
                    <div className="mb-2 flex justify-center space-x-1">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Image
                          key={i}
                          width={25}
                          height={25}
                          src={star.src}
                          alt="star"
                          className="h-4 w-4"
                        />
                      ))}
                    </div>

                    <p className="text-center text-[12px] leading-relaxed text-white">
                      {testimonial.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex w-full justify-center">
            <button
              onClick={handleNextSlide}
              className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#d7c58f] p-2 transition-shadow hover:shadow-lg"
            >
              <Image
                height={20}
                width={20}
                className="max-h-full max-w-full overflow-hidden"
                alt="Next"
                src={downArrow.src}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
