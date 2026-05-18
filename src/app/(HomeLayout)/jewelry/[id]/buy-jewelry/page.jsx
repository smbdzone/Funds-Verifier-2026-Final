import React, { Suspense } from "react";
import CheckoutLayout from "@/components/CheckoutLayoutComponent/CheckoutLayout";
import axios from "axios";
import { api } from "@/config";

const page = async ({ params }) => {
  const id = params.id;
  const propertyInfo = await api("/jewelry?_id=" + id);
  const propertyData = await api(`/jewelry`);

  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <CheckoutLayout
        propertyInfo={propertyInfo.products[0]}
        propertyData={propertyData}
      />
    </Suspense>
  );
};

export default page;
