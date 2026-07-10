import arrow_right from "@/assets/vector1.svg";
import { useSwiper } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

export default function FundTypeSlide({ data }) {
  const swiper = useSwiper();

  const generateUrl = (slideTitle, contextType) => {
    switch (slideTitle.toLowerCase()) {
      case "property types":
        return `/property?propertyType=${encodeURIComponent(contextType)}`;
      case "off plan properties":
        return "/offplan";
      case "boat types": {
        const boatLinks = {
          Yacht: "/boat?category=Motorboats&model=Yacht",
          "Fishing Boat": "/boat?category=Motorboats&model=Fishing%20Boat",
          Sailboats: "/boat?category=Sailboats",
        };
        return boatLinks[contextType] || "/boat";
      }
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

      <div className="w-full min-w-0 overflow-x-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 min-w-0">
          {data.context_types.map((type, index) => (
            <div
              key={type}
              className="shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-md bg-white h-full"
            >
              <div className="flex w-full h-[170px]">
                <Image
                  width={350}
                  height={350}
                  className="rounded-md object-cover w-full h-[170px]"
                  alt={type}
                  src={data.photos[index]}
                />
              </div>
              <div className="px-2 pb-4">
                <div className="text-[#002D4F] mt-4 mb-2 text-center text-xl font-medium w-full inline-block">
                  {type}
                </div>
                <div className="text-xs leading-[22px] w-full text-center text-black inline-block px-3 min-h-[44px]">
                  {data.context_descriptions?.[index] || data.slide_description}
                </div>
                <Link href={generateUrl(data.slide_title, type)}>
                  <span className="text-sm my-3 cursor-pointer text-[#002D4F] [text-decoration:underline] font-medium inline-block w-full text-center">
                    View All
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
