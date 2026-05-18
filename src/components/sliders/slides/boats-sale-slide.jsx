import propertyImg from "@/assets/images/rectangle-58@2x.png";
import star from "@/assets/star-6.svg";
import location from "@/assets/vector2.svg";
import fishing from "@/assets/images/rectangle-63@2x.png";
import bowrinderBoat from "@/assets/images/rectangle-58@2x.png";
import catamaran from "@/assets/images/rectangle-64@2x.png";
import house from "@/assets/images/Mask group.png";

export default function BoatsSaleSlide() {
  return (
    <div className="p-5 px-12">
      <div className="flex flex-row justify-between items-center gap-8">
        <div className=" shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-8xs bg-white md:w-1/3">
          <img
            className="rounded-8xs w-full object-cover"
            alt=""
            src={fishing.src}
          />
          <div className="flex flex-col p-2 px-3 ">
            <div className="flex flex-row">
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <div className="ms-3  opacity-[50%]">5.0</div>
              <div className=" opacity-[50%] ms-3">(20 Reviews)</div>
            </div>
            <div className=" text-[#002D4F] my-3 text-xl font-medium w-full">
              Fishing Boasts
            </div>
            <div className=" text-[#002D4F] flex flex-row gap-3 w-full h-5 text-base">
              <img
                className=" max-w-full overflow-hidden max-h-full"
                alt=""
                src={location.src}
              />
              <div className=" inline-block w-full">
                Burj khalifa district, Dubai, UAE
              </div>
            </div>
            <div className=" box-border my-4 w-full h-0.5 border-t-[2px] border-solid border-[#969696]" />
            <div className="flex flex-row items-center justify-between">
              <div className=" flex flex-row gap-4 items-center">
                <img
                  className=" w-[78px] h-[70px] object-cover"
                  alt=""
                  src={house.src}
                />
                <div className=" text-lg font-medium text-[#000000]">
                  Ref: 12390876
                </div>
              </div>
              <div className="text-lg font-medium text-[#000000]">$ 30,000</div>
            </div>
          </div>
        </div>
        <div className=" shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-8xs bg-white md:w-1/3">
          <img
            className="rounded-8xs w-full object-cover"
            alt=""
            src={bowrinderBoat.src}
          />
          <div className="flex flex-col p-2 px-3 ">
            <div className="flex flex-row">
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <div className="ms-3  opacity-[50%]">5.0</div>
              <div className=" opacity-[50%] ms-3">(20 Reviews)</div>
            </div>
            <div className=" text-[#002D4F] my-3 text-xl font-medium w-full">
              Bowrinder Boats
            </div>
            <div className=" text-[#002D4F] flex flex-row gap-3 w-full h-5 text-base">
              <img
                className=" max-w-full overflow-hidden max-h-full"
                alt=""
                src={location.src}
              />
              <div className=" inline-block w-full">
                Burj khalifa district, Dubai, UAE
              </div>
            </div>
            <div className=" box-border my-4 w-full h-0.5 border-t-[2px] border-solid border-[#969696]" />
            <div className="flex flex-row items-center justify-between">
              <div className=" flex flex-row gap-4 items-center">
                <img
                  className=" w-[78px] h-[70px] object-cover"
                  alt=""
                  src={house.src}
                />
                <div className=" text-lg font-medium text-[#000000]">
                  Ref: 12390876
                </div>
              </div>
              <div className="text-lg font-medium text-[#000000]">$ 30,000</div>
            </div>
          </div>
        </div>
        <div className=" shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-8xs bg-white md:w-1/3">
          <img
            className="rounded-8xs w-full object-cover"
            alt=""
            src={catamaran.src}
          />
          <div className="flex flex-col p-2 px-3 ">
            <div className="flex flex-row">
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <img className="w-[18px] h-[18px]" src={star.src} />
              <div className="ms-3  opacity-[50%]">5.0</div>
              <div className=" opacity-[50%] ms-3">(20 Reviews)</div>
            </div>
            <div className=" text-[#002D4F] my-3 text-xl font-medium w-full">
              Catamaran Boats
            </div>
            <div className=" text-[#002D4F] flex flex-row gap-3 w-full h-5 text-base">
              <img
                className=" max-w-full overflow-hidden max-h-full"
                alt=""
                src={location.src}
              />
              <div className=" inline-block w-full">
                Burj khalifa district, Dubai, UAE
              </div>
            </div>
            <div className=" box-border my-4 w-full h-0.5 border-t-[2px] border-solid border-[#969696]" />
            <div className="flex flex-row items-center justify-between">
              <div className=" flex flex-row gap-4 items-center">
                <img
                  className=" w-[78px] h-[70px] object-cover"
                  alt=""
                  src={house.src}
                />
                <div className=" text-lg font-medium text-[#000000]">
                  Ref: 12390876
                </div>
              </div>
              <div className="text-lg font-medium text-[#000000]">$ 30,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
