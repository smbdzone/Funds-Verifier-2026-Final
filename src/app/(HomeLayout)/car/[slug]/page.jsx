import { Suspense } from "react";
import ButtomSlider from "@/components/Product_page/Buttom_slider";
import CarView from "@/components/views/CarView";
import axios from "axios";
import Link from "next/link";
import GlobalLoader from "@/utils/GlobalLoader";

const GetProductData = async ({ slug }) => {
  try {
    const Response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/car/${slug}`);
    // Fetch related property data
    const DataResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/car`);

    const carInfo = Response?.data;
    const carData = DataResponse?.data;

    return { carInfo, carData }
  } catch (error) {
    return null
  }
}
export default async function Page({ params }) {
  const { slug } =await params;
  const data = await GetProductData({ slug });
  if (!data || !data.carInfo) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Car not found</h1>
      </div>
    );
  }

  const { carInfo, carData } = data;

  return (
    <div className="w-full pb-2 sm:pb-8">
      <Suspense fallback={<GlobalLoader />}>
        <div className="w-full valuesBg flex py-10 sm:py-24 md:px-20 flex-col">
          <div className="container mx-auto">
            <h1 className="heading text-white fs-60 md:text-2xl text-lg lg:text-3xl font-semibold">
              {carInfo?.assetType}
            </h1>
            <p className="md:text-2xl text-base text-white mt-2">
              <span className="text-[#9b9b9b7c]">
                <Link href="/"> Home </Link> / <Link href="/car">Cars</Link> /
              </span>
              {carInfo?.title}
            </p>
          </div>
        </div>
        <CarView data={carInfo || {}} />
        <div className="theme-container">
          <h1 className="md:text-2xl text-lg mb-2 sm:mb-6 font-semibold text-left text-blue">
            Related Cars
          </h1>
          <ButtomSlider data={carData || []} />
        </div>
      </Suspense>
    </div>
  );
}
