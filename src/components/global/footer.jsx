import logo from "@/assets/group.svg";
import facebook from "@/assets/vector15.svg";
import instagram from "@/assets/vector14.svg";
import linkedin from "@/assets/group-84.svg";
import tiktok from "@/assets/group-86.svg";
import twitter from "@/assets/vector13.svg";
import phone from "@/assets/Vector.png";
import mail from "@/assets/images/Vector (1).png";
import location from "@/assets/images/Group 80.png";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="w-full bg-[#002D4F] md:px-20 py-14 pt-20">
        <div className="container mx-auto flex flex-row justify-start">
          <div className=" w-[30%] flex flex-col p-3 justify-start text-21xl text-center text-white">
            <div className="flex flex-row gap-5 justify-start items-center">
              <Image
                width={60}
                height={60}
                className=" max-w-full overflow-hidden max-h-full"
                alt=""
                src={logo.src}
              />
              <p className="text-2xl font-semibold text-white tracking-wide">
                Funds Verifier
              </p>
            </div>
            <div className="leading-[26px] text-base text-start inline-block py-3">
              Lorem presents the sample font and orientation of writing on web
              pages other software applications where content.
            </div>
            <div className="flex flex-row gap-3 justify-start items-center">
              <a
                href="https://www.facebook.com/fundsverifier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Image
                  width={30}
                  height={30}
                  className="h-[30px] m-1 w-[30px] max-w-full overflow-hidden max-h-full"
                  alt="Facebook"
                  src={facebook.src}
                />
              </a>
              <a
                href="https://www.instagram.com/fundsverifier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image
                  width={30}
                  height={30}
                  className="h-[30px] m-1 w-[30px] max-w-full overflow-hidden max-h-full"
                  alt="Instagram"
                  src={instagram.src}
                />
              </a>
              <a
                href="https://www.linkedin.com/company/fundsverifier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Image
                  width={30}
                  height={30}
                  className="h-[30px] m-1 w-[30px] max-w-full overflow-hidden max-h-full"
                  alt="LinkedIn"
                  src={linkedin.src}
                />
              </a>
              <a
                href="https://twitter.com/fundsverifier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <Image
                  width={30}
                  height={30}
                  className="h-[30px] m-1 w-[30px] max-w-full overflow-hidden max-h-full"
                  alt="X"
                  src={twitter.src}
                />
              </a>
              <a
                href="https://www.tiktok.com/@fundsverifier"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <Image
                  width={30}
                  height={30}
                  className="h-[30px] m-1 w-[30px] max-w-full overflow-hidden max-h-full"
                  alt="TikTok"
                  src={tiktok.src}
                />
              </a>
            </div>
          </div>
          <div className=" md:w-[24%] items-start flex flex-col p-3 justify-start text-21xl text-center text-white">
            <p className="text-2xl font-semibold tracking-wide">Quick Links</p>
            <Link href="/aboutus">
              <p className="text-lg leading-8 mt-3 tracking-widest">About Us</p>
            </Link>
            <p className="text-lg leading-8 tracking-widest">How It Works</p>
            <p className="text-lg leading-8 tracking-widest">News & trends</p>
            <p className="text-lg leading-8 tracking-widest">
              Auctions <small className="text-xs">[coming soon]</small>
            </p>
            <p className="text-lg leading-8 tracking-widest">Testimonial</p>
            <p className="text-lg leading-8 tracking-widest">
              Terms & Conditions
            </p>
            <Link
              href="/advertise-with-us"
              className="text-lg leading-8 tracking-widest"
            >
              Advertise with us
            </Link>
          </div>
          <div className=" md:w-[24%] items-start flex flex-col p-3 justify-start text-21xl text-center text-white">
            <p className="text-2xl font-semibold  tracking-wide">
              Opportunities
            </p>
            <Link href="/property">
              <p className="text-lg leading-8 mt-3 tracking-widest">
                Properties For Sale
              </p>
            </Link>
            <Link href="/property">
              <p className="text-lg leading-8 tracking-widest">
                Properties For Lease
              </p>
            </Link>
            <p className="text-lg leading-8 tracking-widest">Cars For Sale</p>
            <p className="text-lg leading-8 tracking-widest">Boats For Sale</p>
            <p className="text-lg leading-8 tracking-widest">
              Jewelleries For Sale
            </p>
          </div>
          <div className=" md:w-[28%] items-start flex flex-col p-3 justify-start text-21xl text-center text-white">
            <p className="text-2xl font-semibold  tracking-wide title-font">
              Get In Touch
            </p>
            <p className="text-lg leading-8 mt-3 tracking-widest">
              <Image
                width={20}
                height={20}
                src={phone.src}
                className="me-3 inline"
              />
              +971 56 129 0003
            </p>
            <p className="text-lg flex flex-row my-2 items-center leading-8 tracking-widest">
              <Image
                width={24}
                height={24}
                src={mail.src}
                className="me-3  inline"
              />
              fvportal@outlook.com
            </p>
            <div className="flex flex-row items-start gap-2 justify-start mt-2">
              <Image
                width={30}
                height={30}
                src={location.src}
                className="me-3 inline mt-1.5"
              />
              <p className="text-lg text-start tracking-widest title-font">
                Dubai, United Arab Emirates
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
