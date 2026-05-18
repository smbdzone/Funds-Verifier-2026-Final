import ButtomSlider from "@/components/Product_page/Buttom_slider";
import CarView from "@/components/views/CarView";
import { api } from "@/config";
import React from "react";
import Link from "next/link";

export default async function page({ params }) {
  const id = params.id;
  const propertyInfo = await api("/jewelry?_id=" + id);

  return (
    <div className="w-full pb-8">
      <div className="w-full valuesBg flex py-24 md:px-20 flex-col">
        <div className="container mx-auto">
          <h1 className="heading text-white fs-60 font-semibold">
            {propertyInfo[0]?.assetType}
          </h1>
          <p className="text-2xl text-white mt-2">
            <span className="text-[#9b9b9b7c]">
              <Link href="/"> Home </Link> /{" "}
              <Link href="/jewelry">Jewellery</Link> /
            </span>
            {propertyInfo[0]?.title}
          </p>
        </div>
      </div>
      <CarView data={propertyInfo[0]} />
      <div className="theme-container">
        <h1 className="text-2xl mb-6  font-semibold text-left text-blue ">
          Related Properties
        </h1>
        <ButtomSlider />
      </div>
      <div></div>
    </div>
  );
}
