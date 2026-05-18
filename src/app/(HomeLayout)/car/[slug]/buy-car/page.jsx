import React, { Suspense } from "react";
import CheckoutLayout from "@/components/CheckoutLayoutComponent/CheckoutLayout";
import axios from "axios";
import { api } from "@/config";

const page = async ({ params }) => {
  const { slug } = params;
  const propertyResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/car/${slug}`
  );
  const propertyInfo = propertyResponse.data;

  // Fetch related property data
  const propertyDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/car`
  );
  const propertyData = propertyDataResponse.data;

  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <CheckoutLayout propertyInfo={propertyInfo} propertyData={propertyData} />
    </Suspense>
  );
};

export default page;
