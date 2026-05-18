import sliderLeftArrow from "../../../assets/vector.svg";
import sliderRightArrow from "../../../assets/vector1.svg";
import carImage from "../../../assets/images/rectangle-90@2x.png";
import houseImg from "../../../assets/images/mask-group@2x.png";
import { useSwiper } from "swiper/react";
import { useState } from "react";
import Image from "next/image";

export default function PropertyTypesSlide() {
  const swiper = useSwiper();
  const [isBeginning, setIsBeggining] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="flex flex-row gap-14 md:px-20 mt-20  ">
      <div className="flex flex-col px-4 md:w-1/4 pt-5">
        <div className=" font-medium text-[#010101] text-2xl ">Explore by</div>
        <div className="text-4xl font-semibold inline-block text-[#002D4F] ">
          Car Types
        </div>
        <div className="flex flex-row my-5 gap-2">
          <div className=" rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
          <div className=" rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
        </div>
        <div className=" text-lg tracking-wide leading-[30px] text-black inline-block w-[358px] h-[89px]">
          Lorem ipsum placeholder or dummy text used in typesetting and graphic
          design for previewing layouts.
        </div>
        <div className=" flex flex-row my-5 gap-6">
          <div
            onClick={() => swiper.slidePrev()}
            className={`rounded-sm ${
              isBeginning ? " cursor-not-allowed" : " cursor-pointer"
            }  flex items-center justify-center [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-[34.2px] h-[34.2px]`}
          >
            <Image
              fill
              className=" h-[64.91%] w-[37.72%]  max-w-full overflow-hidden max-h-full"
              alt=""
              src={sliderLeftArrow.src}
            />
          </div>
          <div
            onClick={() => swiper.slideNext()}
            className={`rounded-sm ${
              isEnd ? " cursor-not-allowed" : " cursor-pointer"
            } cursor-pointer flex items-center justify-center [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-[34.2px] h-[34.2px]`}
          >
            <Image
              fill
              className=" h-[64.91%] w-[37.72%]  max-w-full overflow-hidden max-h-full"
              alt=""
              src={sliderRightArrow.src}
            />
          </div>
        </div>
      </div>
      <div className="shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-8xs bg-white w-[282px] ">
        <Image
          width={282}
          height={269}
          className="rounded-8xs w-[282px] h-[169px] object-cover"
          alt=""
          src={carImage.src}
        />
        <div className=" text-[#002D4F] my-4 text-center text-2xl font-medium w-full inline-block">
          Sport cars
        </div>
        <div className=" text-md leading-[22px] w-full text-center text-black inline-block ">
          Lorem ipsum placeholder or dummy text used in typesetting and graphic
          design for previewing layouts.
        </div>
        <div className=" text-lg my-3 text-[#002D4F] [text-decoration:underline] font-medium inline-block w-full text-center">
          View All
        </div>
      </div>
      <div className="shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-8xs bg-white w-[282px] ">
        <Image
          width={282}
          height={269}
          className="rounded-8xs w-[282px] h-[169px] object-cover"
          alt=""
          src={houseImg.src}
        />
        <div className=" text-[#002D4F] my-4 text-center text-2xl font-medium w-full inline-block">
          Houses
        </div>
        <div className=" text-md leading-[22px] w-full text-center text-black inline-block ">
          Lorem ipsum placeholder or dummy text used in typesetting and graphic
          design for previewing layouts.
        </div>
        <div className=" text-lg my-3 text-[#002D4F] [text-decoration:underline] font-medium inline-block w-full text-center">
          View All
        </div>
      </div>
      <div className="shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-8xs bg-white w-[282px] ">
        <Image
          width={282}
          height={269}
          className="rounded-8xs w-[282px] h-[169px] object-cover"
          alt=""
          src={houseImg.src}
        />
        <div className=" text-[#002D4F] my-4 text-center text-2xl font-medium w-full inline-block">
          Sport cars
        </div>
        <div className=" text-md leading-[22px] w-full text-center text-black inline-block ">
          Lorem ipsum placeholder or dummy text used in typesetting and graphic
          design for previewing layouts.
        </div>
        <div className=" text-lg my-3 text-[#002D4F] [text-decoration:underline] font-medium inline-block w-full text-center">
          View All
        </div>
      </div>
    </div>
  );
}
