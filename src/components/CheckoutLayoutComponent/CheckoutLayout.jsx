import CheckoutView from "@/components/views/CheckoutView";
import {
  convertUsdToAed,
  convertUsdToUsdt,
} from "@/utils/global-functions/global";
import React from "react";

export default async function CheckoutLayout({ propertyInfo, propertyData }) {
  const feeUsd =
    propertyInfo.assetType === "Car For Sale"
      ? 1500.14
      : propertyInfo.assetType === "Boats For Sale"
      ? 2000
      : propertyInfo.assetType === "Jewellery For Sale"
      ? 999.18
      : 3000.27;
  const priceInAed = await convertUsdToAed(propertyInfo?.price);
  const priceInUsdt = await convertUsdToUsdt(propertyInfo?.price);
  const feeInUsdt = await convertUsdToUsdt(feeUsd);

  return (
    <div className="w-full pb-8">
      <CheckoutView
        data={propertyInfo}
        priceInAed={priceInAed}
        priceInUsdt={priceInUsdt}
        feeInUsdt={feeInUsdt}
      />
    </div>
  );
}
