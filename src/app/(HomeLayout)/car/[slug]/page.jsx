import { Suspense } from "react";
import ButtomSlider from "@/components/Product_page/Buttom_slider";
import CarView from "@/components/views/CarView";
import axios from "axios";
import Link from "next/link";
import GlobalLoader from "@/utils/GlobalLoader";
import { getPublicApiHeaders } from '@/libs/publicApiClient'
import { buildListingPageMetadata } from '@/libs/listingMetadata'
import { cache } from 'react'

const GetProductData = cache(async ({ slug }) => {
  try {
    const headers = await getPublicApiHeaders()
    const Response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/car/${slug}`,
      { headers },
    )
    const DataResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/car?statusFilter=1&limit=50`,
      { headers },
    )

    const carInfo = Response?.data
    const carData = DataResponse?.data
    const relatedProducts = (carData?.products || []).filter(
      (car) =>
        car?.status === 1 &&
        car?.uuid !== carInfo?.uuid &&
        car?.slug !== carInfo?.slug,
    )

    return {
      carInfo,
      carData: { ...carData, products: relatedProducts },
    }
  } catch (error) {
    return null
  }
})

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await GetProductData({ slug })

  if (!data?.carInfo) {
    return { title: 'Car not found | Funds Verifier' }
  }

  return buildListingPageMetadata(data.carInfo, {
    routeSegment: 'car',
    listingId: slug,
  })
}

export default async function Page({ params }) {
  const { slug } = await params;

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
    <div className="w-full pb-8">
      <Suspense fallback={<GlobalLoader />}>
        <div className="w-full valuesBg flex py-24 md:px-20 flex-col">
          <div className="container mx-auto">
            <h1 className="heading text-white fs-60 md:text-2xl text-xl font-semibold">
              {carInfo?.assetType}
            </h1>
            <p className="md:text-2xl text-base text-white mt-2">
              <span className="text-[#9b9b9b7c]">
                <Link href="/"> Home </Link> / <Link href="/car">Cars</Link> /
              </span>
              Listing details
            </p>
          </div>
        </div>
        <CarView data={carInfo} />
        {carData?.products?.length > 0 ? (
          <div className="theme-container">
            <h1 className="md:text-2xl text-lg mb-6 font-semibold text-left text-blue">
              Related Cars
            </h1>
            <ButtomSlider data={carData} />
          </div>
        ) : null}
      </Suspense>
    </div>
  );
}
