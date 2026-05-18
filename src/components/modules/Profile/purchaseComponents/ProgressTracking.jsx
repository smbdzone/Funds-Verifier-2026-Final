import React, { useEffect, useState } from "react";

const ProgressTracking = ({ data }) => {
  return (
    <div className="mt-20">
      <h3 className="font-medium text-lg mb-3">Progress Tracking</h3>
      <div className="overflow-x-auto custom-shadow rounded">
        <table className="custom-shadow rounded w-[800px]">
          <thead>
            <tr className="shadow">
              <th className="p-3 text-sm font-normal text-start">Asset Type</th>
              <th className="p-3 text-sm font-normal text-start">Asset Name</th>
              <th className="p-3 text-sm font-normal text-start">Value</th>
              <th className="p-3 text-sm font-normal text-start">Applied date</th>
              <th className="p-3 text-sm font-normal text-start">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="p-3 text-sm text-start">{item.itemType}</td>
                <td className="p-3 text-sm text-start">{item.title || item.name || "N/A"}</td>
                <td className="p-3 text-sm text-start">{item.price || "N/A"}</td>
                <td className="p-3 text-sm text-start">
                  {item.appliedDate ? new Date(item.appliedDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3 text-sm text-start">{item.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTracking;

