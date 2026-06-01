import React, { Suspense } from "react";
import CheckoutLayout from "@/components/CheckoutLayoutComponent/CheckoutLayout";
import axios from "axios";
import { getPublicApiHeaders } from "@/libs/publicApiClient";

const page = async ({ params }) => {
  const { slug } = params;
  const headers = await getPublicApiHeaders()
  const propertyResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/car/${slug}`,
    { headers },
  );
  const propertyInfo = propertyResponse.data;

  const propertyDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/car`,
    { headers },
  );
  const propertyData = propertyDataResponse.data;

  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <CheckoutLayout propertyInfo={propertyInfo} propertyData={propertyData} />
    </Suspense>
  );
};

export default page;
