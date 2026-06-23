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

// Fallback images and icons
import man from "@/assets/images/ellipse-113@2x.png";
import man_one from "@/assets/images/man_one.png";
import woman from "@/assets/images/woman.png";
import star from "@/assets/star-6.svg";
import upArrow from "@/assets/vector7.svg";
import downArrow from "@/assets/vector8.svg";

// Dummy fallback data
const dummyTestimonials = [
  {
    firstName: "Kell",
    lastName: "Robinson",
    designation: "Product Manager",
    rating: 5,
    description: "Purchasing our dream home was made incredibly simple thanks to the dedicated team at Fund Verify. From start to finish, their professionalism and commitment to finding us the perfect property were unmatched. We couldn't be happier with our new home!",
    file: man_one.src,
  },
  {
    firstName: "Jack",
    lastName: "Nitzsche",
    designation: "Product Manager",
    rating: 5,
    description: "The experience of buying a car at Fund Verify was nothing short of exceptional. The sales team was knowledgeable, patient, and helped us find a car that perfectly matched our needs and budget. We highly recommend them to anyone looking for a new vehicle!",
    file: man.src,
  },
  {
    firstName: "Karen",
    lastName: "Maria",
    designation: "Product Manager",
    rating: 5,
    description: "As first-time boat buyers, we were a bit overwhelmed, but Fund Verify made the entire process smooth and enjoyable. Their expertise and customer service were top-notch, and we're thrilled with our new boat. Thank you for making our dream a reality!",
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

  // Update swiper direction based on screen size
  const updateDirection = () => {
    if (window.innerWidth >= 768) {
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

  // Fetch testimonials data
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/testimonials/all`);
        if (response.data.success && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials);
        } else {
          setTestimonials(dummyTestimonials); // fallback if empty
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(dummyTestimonials); // fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handlePrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = (selectedIndex - 1 + testimonials.length) % testimonials.length;
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
    return <div className="text-center text-white py-20">Loading testimonials...</div>;
  }

  const thumbLoop = swiperCanLoop(testimonials.length, 3);
  const contentLoop = swiperCanLoop(testimonials.length, 1);

  return (
    <div className="w-full valuesBg xl:px-20 py-3 sm:pt-20">
      {/* Desktop Layout */}
      <div className="container hidden sm:flex mx-auto md:flex-row flex-col md:gap-10 items-center">
        {/* Customer Thumbnails */}
        <div className="md:w-[30%] w-[90%]">
          <div className="my-5 xl:h-[470px] md:h-[600px] h-[250px] flex flex-col gap-3 items-center justify-center">
            <button
              onClick={handlePrevSlide}
              className="rounded cursor-pointer flex items-center justify-center bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#d7c58f] w-full py-2 hover:bg-white transition-all duration-300"
            >
              <Image
                height={30}
                width={30}
                className="max-w-full overflow-hidden max-h-full"
                alt="Previous"
                src={upArrow.src}
              />
            </button>

            <Swiper
              ref={testimonialSwiperRef}
              spaceBetween={10}
              modules={[Pagination, Navigation, HashNavigation]}
              className="mySwiper testmonialSlider testimonials-thumb-swiper w-full h-full"
              direction={direction}
              slidesPerView={3}
              loop={thumbLoop}
              breakpoints={{
                375: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 12 },
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
                    className={`mainDiv box-border w-full h-full min-h-0 max-h-full flex md:flex-row flex-col md:items-center items-center gap-2 md:gap-3 rounded-md p-2 md:p-2.5 cursor-pointer overflow-hidden ${selectedIndex === index ? "bg-white" : "bg-[#ffffffa1]"
                      }`}
                    onClick={() => handleCustomerClick(index)}
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <Image
                        width={72}
                        height={72}
                        className="rounded-full h-[72px] w-[72px] shrink-0 object-cover"
                        alt={`${testimonial.firstName} ${testimonial.lastName}`}
                        src={testimonial.file || man.src}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 text-black flex-col items-center md:items-start justify-center text-center md:text-left">
                      <div className="w-full md:text-lg lg:text-xl text-base text-black font-medium leading-tight line-clamp-2">
                        {testimonial.firstName} {testimonial.lastName}
                      </div>
                      <p className="w-full mt-0.5 text-sm md:text-sm lg:text-base text-black/80 line-clamp-2 leading-snug">
                        {testimonial.designation}
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={handleNextSlide}
              className="rounded cursor-pointer flex items-center justify-center bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#d7c58f] w-full py-2 hover:bg-white transition-all duration-300"
            >
              <Image
                height={30}
                width={30}
                className="max-w-full overflow-hidden max-h-full"
                alt="Next"
                src={downArrow.src}
              />
            </button>
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="md:w-[70%] w-[90%] my-5 md:h-[470px] h-[450px] flex flex-col gap-3 items-center justify-center">
          <Swiper
            ref={valuesSwiperRef}
            spaceBetween={10}
            modules={[Pagination, Navigation, HashNavigation]}
            className="mySwiper testmonialSlider w-full h-full"
            direction="vertical"
            slidesPerView={1}
            loop={contentLoop}
            initialSlide={selectedIndex}
            breakpoints={{
              1024: { direction: "horizontal" },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="!flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-start text-white md:p-10"
                >
                  <b className="lg:text-5xl md:text-4xl text-lg tracking-wide">
                    Testimonials
                  </b>
                  <div className="flex flex-row my-5 gap-2">
                    <div className="rounded-2xl bg-[#8D7C3B] md:w-[31.8px] w-5 h-[5.6px]" />
                    <div className="rounded-lg bg-white md:w-[84.9px] w-12 h-[5.6px]" />
                  </div>
                  <div className="lg:text-2xl md:text-xl text-lg leading-[30px] font-medium inline-block h-[29px]">
                    {testimonial.firstName} {testimonial.lastName}
                  </div>
                  <div className="flex flex-row gap-2 my-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Image key={i} width={25} height={25} src={star.src} alt="star" />
                    ))}
                  </div>
                  <p className="lg:text-xl md:text-lg text-base leading-[32px] text-left">
                    {testimonial.description}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-white">Testimonials</h1>
          </div>

          <div className="flex flex-row justify-center mb-5 gap-2">
            <div className="rounded-2xl bg-[#8D7C3B] w-5 h-[5.6px]" />
            <div className="rounded-lg bg-white w-12 h-[5.6px]" />
          </div>

          {/* Customer Cards and Testimonial */}
          <div className="space-y-2">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                {/* Customer Card */}
                <div
                  onClick={() => handleCustomerClick(index)}
                  className={`p-2 cursor-pointer transition-all duration-300 ${selectedIndex === index
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
                        className={`font-semibold text-sm ${selectedIndex === index ? "text-gray-800" : "text-white"
                          }`}
                      >
                        {testimonial.firstName} {testimonial.lastName}
                      </h3>
                      <p
                        className={`text-sm ${selectedIndex === index ? "text-gray-600" : "text-blue-200"
                          }`}
                      >
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Testimonial Content */}
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
                    <div className="flex justify-center space-x-1 mb-2">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Image
                          key={i}
                          width={25}
                          height={25}
                          src={star.src}
                          alt="star"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                      ))}
                    </div>

                    <p className="text-white text-[12px] text-center leading-relaxed">
                      {testimonial.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Bottom Arrow */}
          <div className="flex justify-center w-full mt-3">
            <button
              onClick={handleNextSlide}
              className="flex justify-center items-center bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#d7c58f] rounded-lg p-2 w-full cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Image
                height={20}
                width={20}
                className="max-w-full overflow-hidden max-h-full"
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