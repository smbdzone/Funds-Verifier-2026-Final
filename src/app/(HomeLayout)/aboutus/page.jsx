/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import InTouch from "../../../components/home/inTouch";
import AboutPageSkeleton from "@/components/about/AboutPageSkeleton";

function page() {
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPageReady(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Comprehensive Asset Listings",
      description:
        "We allow asset holders to list their assets effortlessly. Each listing requires an evaluation certificate, ensuring market transparency and trust among potential buyers.",
    },
    {
      title: "Automatic Visibility Thresholds",
      description:
        "Our platform features automatic visibility thresholds for different asset categories. This means that assets priced below specific amounts—such as properties under 5 million AED, cars under 200,000 AED, boats under 1 million AED, and jewelry under 100,000 AED are readily visible to deal hunters.",
    },
    {
      title: "Real-Time Transaction Monitoring",
      description:
        "Our dedicated dashboards allow asset holders, deal hunters, and banks to monitor real-time transactions. This transparency keeps everyone informed and reassured throughout the process, with notifications for important updates and document requests.",
    },
    {
      title: "Expert Evaluations and 3D Walkthroughs",
      description:
        "Once certified evaluator companies have thoroughly evaluated the asset, it will be listed on our platform. This process includes an ROI percentage, providing buyers with critical insights. Our 3D walkthrough feature allows potential buyers to explore assets remotely, enhancing their decision-making experience.",
    },
    {
      title: "Privacy and Security",
      description:
        "We prioritize your privacy. During the initial stages of a transaction, both parties' identities remain anonymous, identified only by reference numbers and avatars. All communications on our platform are encrypted, ensuring your information stays secure.",
    },
  ];

  if (!isPageReady) {
    return <AboutPageSkeleton />;
  }

  return (
    <div>
      <div className="w-full valuesBg flex py-24 md:px-20 flex-col">
        <div className="container mx-auto text-[#ffffff]">
          <h1 className="heading text-white md:text-[70px] text-xl fs-60 font-semibold">
            About Us
          </h1>
          <p className=" mt-6">
            Welcome to Funds Verifier, your trusted partner in the asset
            marketplace in the United Arab Emirates. We are dedicated to
            revolutionizing how assets are bought and sold, ensuring a seamless,
            transparent, and secure transaction experience for all parties
            involved.
          </p>
        </div>
      </div>{" "}
      <div className="bg-white text-[#1a1a1a]">
        {/* Our Mission */}
        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Image
              src="/images/our-mission.jpg"
              alt="Our Mission"
              width={500}
              height={300}
              className="rounded-lg"
            />
            <div>
              <div className=" flex  flex-col">
                <div className="flex w-full">
                  <div className="flex md:text-4xl w-full text-xl font-semibold text-[#002D4F] mt-2">
                    Our Mission
                  </div>
                </div>
                <div className="flex flex-row gap-2 my-5">
                  <div className="rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
                  <div className="rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
                </div>
              </div>
              <p className="text-gray-700">
                Funds Verifier aims to provide a platform where asset holders
                and deal hunters can connect confidently. We understand the
                complexities of buying and selling assets in the UAE and aim to
                simplify this process through innovative features and
                comprehensive support
              </p>
            </div>
          </div>
        </section>

        {/* Our Features */}
        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className=" max-w-2xl mx-auto flex items-center flex-col">
            <div className="flex w-full  items-center">
              <div className="flex md:text-4xl justify-center w-full text-xl font-semibold text-[#002D4F] mt-2">
                Our Features
              </div>
            </div>
            <div className="flex flex-row gap-2 my-5">
              <div className="rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
              <div className="rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className=" border p-2 border-gray">
              <Image
                src="/images/feature1.jpg"
                alt="Trust"
                width={400}
                height={300}
                className="rounded-lg"
              />
              <h1 className=" text-blue font-bold mt-4">Transparency</h1>
              <p className="mt-4 text-gray-700">
                We believe in open communication and clarity at every
                transaction process step. Our platform provides detailed
                information on all asset listings, ensuring buyers and sellers
                are fully informed.
              </p>
            </div>
            <div className=" border p-2 border-gray">
              <Image
                src="/images/feature2.jpg"
                alt="Biometric"
                width={400}
                height={300}
                className="rounded-lg"
              />
              <h1 className=" text-blue font-bold mt-4">Trust</h1>
              <p className="mt-4 text-gray-700">
                We foster trust among users with mandatory evaluation
                certificates for each listing. Our partnerships with certified
                evaluator companies ensure that all assets are thoroughly
                vetted, giving buyers peace of mind.
              </p>
            </div>
            <div className=" border p-2 border-gray">
              <Image
                src="/images/feature3.jpg"
                alt="AI"
                width={400}
                height={300}
                className="rounded-lg"
              />
              <h1 className=" text-blue font-bold mt-4">Speed</h1>
              <p className="mt-4 text-gray-700">
                We understand that time is of the essence in the asset
                marketplace. Our automatic visibility thresholds and real-time
                transaction monitoring are designed to facilitate quick and
                efficient transactions.
              </p>
            </div>
          </div>
        </section>

        {/* User Verification */}
        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Image
              src="/images/user-verification.jpg"
              alt="User Verification"
              width={500}
              height={300}
              className="rounded-lg"
            />
            <div>
              <div className=" flex  flex-col">
                <div className="flex w-full">
                  <div className="flex md:text-4xl w-full text-xl font-semibold text-[#002D4F] mt-2">
                    User Verification
                  </div>
                </div>
                <div className="flex flex-row gap-2 my-5">
                  <div className="rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
                  <div className="rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
                </div>
              </div>
              <p className="text-gray-700">
                At Concept Funds Verifier, we prioritize safety and reliability.
                Our users sign up through UAE PASS, the government KYC portal,
                ensuring that all participants on our platform are verified.
                During the initial stages of a transaction, buyers and sellers
                do not know each other's identities. Instead, they use avatars
                as profile pictures, which can be chosen during sign-up. This
                anonymity fosters a secure environment for both parties
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* Real Estate */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <Image
              src="/images/real-estate.jpg"
              alt="Real Estate"
              width={300}
              height={200}
              className="mx-auto rounded"
            />
            <h3 className="mt-4 text-lg font-semibold text-blues">
              Real Estate
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Our platform facilitates property buying, selling, and leasing.
              Whether you want to sell a residential home or lease commercial
              space, we provide comprehensive listings supported by evaluation
              certificates.
            </p>
          </div>

          {/* Cars */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <Image
              src="/images/car.jpg"
              alt="Cars"
              width={300}
              height={200}
              className="mx-auto rounded"
            />
            <h3 className="mt-4 text-lg font-semibold text-blue">Cars</h3>
            <p className="mt-2 text-sm text-gray-600">
              From luxury vehicles to affordable options, we enable asset
              holders to list their cars confidently. Buyers can explore a range
              of vehicles, all verified for quality and value.
            </p>
          </div>

          {/* Boats */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <Image
              src="/images/watch.jpg"
              alt="Boats"
              width={300}
              height={200}
              className="mx-auto rounded"
            />
            <h3 className="mt-4 text-lg font-semibold text-blue">Boats</h3>
            <p className="mt-2 text-sm text-gray-600">
              Our platform allows users to buy and lease boats, providing
              detailed listings that include essential evaluations. Whether for
              leisure or business, you can trust our thorough vetting process.
            </p>
          </div>

          {/* Jewelry */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <Image
              src="/images/jewelry.jpg"
              alt="Jewelry"
              width={300}
              height={200}
              className="mx-auto rounded"
            />
            <h3 className="mt-4 text-lg font-semibold text-blue">Jewelry</h3>
            <p className="mt-2 text-sm text-gray-600">
              We offer a marketplace for exquisite jewelry and watches, ensuring
              each piece is authenticated and evaluated for a fair price.
            </p>
          </div>
        </section>

        {/* Additional Features */}
        <section className="max-w-6xl mx-auto py-16 px-4">
          {/* Header */}
          <div className="max-w-2xl mx-auto flex items-center flex-col">
            <h2 className="text-xl md:text-4xl font-semibold text-[#002D4F] mt-2 text-center">
              Additional Features
            </h2>
            <div className="flex flex-row gap-2 my-5">
              <div className="rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
              <div className="rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
            </div>
            <p className="text-center text-gray-500 max-w-xl">
              Lorem ipsum placeholder or dummy text used in typesetting and
              graphic design for previewing layouts.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white shadow-sm rounded-lg p-6 text-center border border-gray `}
              >
                <Image
                  src={`/images/features${index + 1}.png`}
                  alt="Feature Icon"
                  width={40}
                  height={40}
                  className="mx-auto mb-4"
                />
                <h3 className="text-md font-semibold text-[#002D4F] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Why Choose Us */}

        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Image
              src="/images/why-choose-us.jpg"
              alt="Why Choose Us"
              width={400}
              height={200}
              className="mx-auto rounded-full"
            />
            <div>
              <div className=" flex  flex-col">
                <div className="flex w-full">
                  <div className="flex md:text-4xl w-full text-xl font-semibold text-[#002D4F] mt-2">
                    Why Choose Us?
                  </div>
                </div>
                <div className="flex flex-row gap-2 my-5">
                  <div className="rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]" />
                  <div className="rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]" />
                </div>
              </div>
              <p className="text-gray-700">
                Concept Funds Verifier stands out in the crowded UAE asset
                marketplace by emphasizing transparency, trust, and speed. We
                collaborate with banks to facilitate mortgages and verify cash
                through escrow accounts, and we partner with insurance companies
                to offer coverage for newly purchased properties, cars, boats,
                and jewelry. Our technical surveyors provide in-depth reports,
                ensuring buyers know precisely what they are getting into
              </p>
            </div>
          </div>
        </section>
        <InTouch />
      </div>
    </div>
  );
}

export default page;
