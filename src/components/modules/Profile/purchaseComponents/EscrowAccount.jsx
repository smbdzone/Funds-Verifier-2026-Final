import React, { useEffect, useState } from "react";

const EscrowAccount = ({ data }) => {
  return (
    <div className="mt-20">
      <h3 className="font-medium text-lg mb-3">Escrow Account Information</h3>
      <div className="overflow-x-auto custom-shadow rounded">
        <table className="custom-shadow rounded w-[800px]">
          <thead>
            <tr className="shadow">
              <th className="p-3 text-sm font-normal text-start">Asset</th>
              <th className="p-3 text-sm font-normal text-start">Asset Description</th>
              <th className="p-3 text-sm font-normal text-start">Bank Name</th>
              <th className="p-3 text-sm font-normal text-start">Applied date</th>
              <th className="p-3 text-sm font-normal text-start">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, idx) => (
              <tr key={idx}>
                <td className="p-3 text-sm text-start">{record.itemType}</td>
                <td className="p-3 text-sm text-start">{record.description || "N/A"}</td>
                <td className="p-3 text-sm text-start">{record.bank || "N/A"}</td>
                <td className="p-3 text-sm text-start">
                  {record.appliedDate ? new Date(record.appliedDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3 text-sm text-start">{record.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EscrowAccount;

