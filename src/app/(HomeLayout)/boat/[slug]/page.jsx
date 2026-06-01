import { Suspense } from "react";
import ButtomSlider from "@/components/Product_page/Buttom_slider";
import BoatView from "@/components/modules/Boat/BoatView";
import axios from "axios";
import Link from "next/link";
import GlobalLoader from "@/utils/GlobalLoader";
import { getPublicApiHeaders } from "@/libs/publicApiClient";

const GetProductData = async ({ slug }) => {
  try {
    const headers = await getPublicApiHeaders()
    const propertyResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/boat/${slug}`,
      { headers },
    )
    // Only evaluator-approved boats (status = 1) appear in Related Boats
    const propertyDataResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/boat?statusFilter=1&limit=50`,
      { headers },
    )

    const boatInfo = propertyResponse?.data
    const boatData = propertyDataResponse?.data
    const relatedProducts = (boatData?.products || []).filter(
      (boat) =>
        boat?.status === 1 &&
        boat?.uuid !== boatInfo?.uuid &&
        boat?.slug !== boatInfo?.slug,
    )

    return {
      boatInfo,
      boatData: { ...boatData, products: relatedProducts },
    }
  } catch (error) {
    return null
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  const data = await GetProductData({ slug });
  if (!data || !data.boatInfo) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Boat not found</h1>
      </div>
    );
  }

  const { boatInfo, boatData } = data;

  return (
    <div className="w-full pb-8">
      <Suspense fallback={<GlobalLoader />}>
        <div className="w-full valuesBg flex py-24 md:px-20 flex-col">
          <div className="container mx-auto">
            <h1 className="heading text-white fs-60 md:text-2xl text-xl font-semibold">
              {boatInfo?.assetType}
            </h1>
            <p className="md:text-2xl text-base text-white mt-2">
              <span className="text-[#9b9b9b7c]">
                <Link href="/"> Home </Link> / <Link href="/boat">Boats</Link> /
              </span>
              {boatInfo?.title}
            </p>
          </div>
        </div>
        <BoatView data={boatInfo} />
        {boatData?.products?.length > 0 ? (
          <div className="theme-container">
            <h1 className="md:text-2xl text-lg mb-6 font-semibold text-left text-blue">
              Related Boats
            </h1>
            <ButtomSlider data={boatData} />
          </div>
        ) : null}
      </Suspense>
    </div>
  );
}
