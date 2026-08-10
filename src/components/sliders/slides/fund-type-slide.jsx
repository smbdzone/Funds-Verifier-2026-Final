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
    <div className="my-2 flex flex-col gap-4 px-1 py-3 sm:my-10 md:flex-row md:items-start">
      <div className="flex w-full shrink-0 flex-col items-start md:w-[220px] lg:w-[280px] xl:w-[350px]">
        <div className="flex text-xs font-medium text-[#010101] md:text-base xl:text-xl">
          Explore by
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="mt-2 flex text-xl font-semibold text-[#002D4F] md:text-2xl lg:text-3xl xl:text-4xl">
            {data.slide_title}
          </div>
          <div className="mt-3 flex flex-row space-x-5 md:hidden">
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
        <div className="my-4 flex flex-row gap-2 md:my-5">
          <div className="h-[5.6px] w-[31.8px] rounded-2xl bg-[#002D4F]" />
          <div className="h-[5.6px] w-[84.9px] rounded-lg bg-[#8D7C3B]" />
        </div>
        <div className="inline-block text-left text-sm leading-6 text-black md:text-sm md:leading-6 lg:text-base xl:text-lg xl:leading-[30px]">
          {data.slide_description}
        </div>
        <div className="mt-5 hidden flex-row space-x-8 md:flex">
          <div onClick={() => swiper.slidePrev()} className="cursor-pointer">
            <div className="btn-gradient rounded px-2 py-1">
              <Image
                src={arrow_right}
                alt="previous"
                className="rotate-180 transform"
              />
            </div>
          </div>
          <div onClick={() => swiper.slideNext()} className="cursor-pointer">
            <div className="btn-gradient rounded px-2 py-1">
              <Image src={arrow_right} alt="next" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: 1 col. Tablet+: all 3 on one row with compact text. */}
      <div className="min-w-0 w-full flex-1">
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-3 min-[480px]:gap-2 md:gap-3 xl:gap-6">
          {data.context_types.map((type, index) => (
            <div
              key={type}
              className="h-full rounded-md bg-white shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)]"
            >
              <div className="flex h-[150px] w-full min-[480px]:h-[110px] md:h-[130px] xl:h-[170px]">
                <Image
                  width={350}
                  height={350}
                  className="h-full w-full rounded-md object-cover"
                  alt={type}
                  src={data.photos[index]}
                />
              </div>
              <div className="px-1.5 pb-3 min-[480px]:px-1 md:px-2 xl:pb-4">
                <div className="mb-1 mt-2 w-full text-center text-base font-medium text-[#002D4F] min-[480px]:text-sm md:text-base xl:mb-2 xl:mt-4 xl:text-xl">
                  {type}
                </div>
                <div className="min-h-[40px] w-full px-1 text-center text-[11px] leading-4 text-black min-[480px]:min-h-[48px] min-[480px]:px-0.5 min-[480px]:text-[10px] min-[480px]:leading-[14px] md:text-[11px] md:leading-4 xl:min-h-[44px] xl:px-3 xl:text-xs xl:leading-[22px]">
                  {data.context_descriptions?.[index] || data.slide_description}
                </div>
                <Link href={generateUrl(data.slide_title, type)}>
                  <span className="my-2 inline-block w-full cursor-pointer text-center text-xs font-medium text-[#002D4F] underline min-[480px]:text-[11px] md:text-xs xl:my-3 xl:text-sm">
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
