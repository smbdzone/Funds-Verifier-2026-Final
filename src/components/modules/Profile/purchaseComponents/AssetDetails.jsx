import React, { useEffect, useState } from "react";
import { EyeIcon } from "@/components/Icons";

const AssetDetails = ({ data }) => {
  const assets = data.filter(item => item.itemType); 

  return (
    <div className="mt-20">
      <h3 className="font-medium text-lg mb-3">Asset Details</h3>
      <div className="overflow-x-auto custom-shadow rounded">
        <table className="custom-shadow rounded w-[800px]">
          <thead>
            <tr className="shadow">
              <th className="p-3 text-sm font-normal text-start">Category</th>
              <th className="p-3 text-sm font-normal text-start">Asset Name</th>
              <th className="p-3 text-sm font-normal text-start">Value</th>
              <th className="p-3 text-sm font-normal text-start whitespace-nowrap">
                Evaluation certificate
              </th>
              <th className="p-3 text-sm font-normal text-start">Description</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr key={idx}>
                <td className="p-3 text-sm text-start">{asset.itemType}</td>
                <td className="p-3 text-sm text-start">{asset.title || asset.name || "N/A"}</td>
                <td className="p-3 text-sm text-start">{asset.price || "N/A"}</td>
                <td className="p-3 text-sm text-start">
                  <span className="flex items-center gap-5">
                    {asset.evaluationCertificate ? "Yes" : "No"}
                    {asset.evaluationCertificate && <EyeIcon />}
                  </span>
                </td>
                <td className="p-3 text-start text-xs">{asset.description || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetDetails;


