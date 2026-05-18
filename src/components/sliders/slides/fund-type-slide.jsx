import arrow_right from "@/assets/vector1.svg";
import { useSwiper } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FundTypeSlide({ data }) {
  const swiper = useSwiper();
  const [itemsToShow, setItemsToShow] = useState(3); // Default to 3 items
  const items = new Array(3).fill(null);

  // Adjust items based on window width
  const adjustItems = () => {
    if (window.innerWidth >= 1280) {
      setItemsToShow(3); // Desktop
    } else if (window.innerWidth >= 800) {
      setItemsToShow(2); // Tablet
    } else {
      setItemsToShow(1); // Mobile
    }
  };

  useEffect(() => {
    // Set initial value based on screen size
    adjustItems();

    // Add resize event listener
    window.addEventListener("resize", adjustItems);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", adjustItems);
    };
  }, []);

  // Function to generate the dynamic URL based on the slide title and context type
  const generateUrl = (slideTitle, contextType) => {
    switch (slideTitle.toLowerCase()) {
      case "property types":
        return `/property?propertyType=${encodeURIComponent(contextType)}`;
      case "car types":
        return `/car?propertyType=${encodeURIComponent(contextType)}`;
      case "jewellery types":
        return `/jewelry?propertyType=${encodeURIComponent(contextType)}`;
      default:
        return "/";
    }
  };

  return (
    <div className="flex md:flex-row flex-col gap-4 my-2 sm:my-10 py-3 px-1">
      <div className="flex flex-col sm:pt-5 items-start">
        <div className="flex font-medium text-[#010101] text-xs md:text-xl">
          Explore by
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex md:text-4xl text-xl font-semibold text-[#002D4F] mt-2">
            {data.slide_title}
          </div>
          <div className="flex md:hidden flex-row mt-3 space-x-5">
            <div onClick={() => swiper.slidePrev()} className="cursor-pointer">
              <div className="btn-gradient box-border rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  className="rotate-180"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
            <div onClick={() => swiper.slideNext()} className="cursor-pointer">
              <div className="btn-gradient rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 my-5">
          <div className="rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
          <div className="rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
        </div>
        <div className="md:text-lg text-sm text-left leading-[30px] text-black inline-block md:w-[350px]">
          {data.slide_description}
        </div>
        <div className="hidden md:flex flex-row mt-5 space-x-8">
          <div onClick={() => swiper.slidePrev()} className="cursor-pointer">
            <div className="btn-gradient px-2 py-1 rounded">
              <Image
                src={arrow_right}
                alt="previous"
                className="transform rotate-180"
              />
            </div>
          </div>
          <div onClick={() => swiper.slideNext()} className="cursor-pointer">
            <div className="btn-gradient px-2 py-1 rounded">
              <Image src={arrow_right} alt="next" />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid ${
          itemsToShow === 3
            ? "xl:grid-cols-3"
            : itemsToShow === 2
            ? "md:grid-cols-2"
            : "grid-cols-1"
        } gap-x-8`}
      >
        {data.context_types.slice(0, itemsToShow).map((type, index) => (
          <div
            key={index}
            className="shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-md bg-white col-span-1"
          >
            <div className="flex w-full h-[170px]">
              <Image
                width={350}
                height={350}
                className="rounded-md object-cover"
                alt="photo"
                src={data.photos[index]}
              />
            </div>
            <div className="px-2">
              <div className="text-[#002D4F] mt-4 mb-2 text-center text-xl font-medium w-full inline-block">
                {data.context_types[index]}
              </div>
              <div className="text-xs leading-[22px] w-full text-center text-black inline-block px-3">
                Lorem ipsum placeholder or dummy text used in typesetting and
                graphic design for previewing layouts.
              </div>
              <Link
                href={generateUrl(data.slide_title, data.context_types[index])}
              >
                <span className="text-sm my-3 cursor-pointer text-[#002D4F] [text-decoration:underline] font-medium inline-block w-full text-center">
                  View All
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
