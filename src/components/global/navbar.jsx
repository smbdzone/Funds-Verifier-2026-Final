import Image from "next/image";
import logo from "../../assets/images/group-1@2x.png";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="container mx-auto">
      <div className="flex bg-white items-center flex-row justify-between w-full h-[100px] text-lg text-black">
        <div className="bg-white">
          <Image
            width={150}
            height={150}
            className=" w-[78.8px] h-[75.4px] object-cover"
            alt=""
            src={logo.src}
          />
        </div>
        <div className="flex flex-row gap-7 items-center">
          <div className="[text-decoration:underline] font-medium text-darkslategray-200">
            <Link href="/"> Home</Link>
          </div>
          <div className="">How it works</div>
          <div className="">Categories</div>
          <div className="">News And Trends</div>
          <div className="">
            <p className="m-0 relative">
              Auctions
              <small className="absolute -bottom-3 -left-0.5 w-[90px] text-xs text-[#8c7c3d]">
                [coming soon]
              </small>
            </p>
          </div>
          <Link href="/blog">
            <p className="text-lg cursor-pointer text-white">News & trends</p>
          </Link>
        </div>

        <div className="flex flex-row justify-start h-11 text-white">
          <div className="justify-center flex items-center rounded-l-sm font-medium text-darkslategray-100 [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] w-[120px] h-11">
            <Link href="/login">Sign Up</Link>
          </div>
          <div className=" justify-center flex items-center rounded-r-sm border-r-[1px] border-t-[1px] border-b-[1px] border-solid  border-[#8D7C3B] font-medium text-[#0F3453]  w-[120px] h-11">
            Sign In
          </div>
        </div>
      </div>
    </div>
  );
}
